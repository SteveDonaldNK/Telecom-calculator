<?php
/**
 * api.php
 * 
 * Point d'accès central pour la logique métier de l'application de réservation WDM.
 * Gère la récupération de l'état du réseau et la logique complexe de réservation de capacité multi-sauts.
 */

require_once 'config.php'; 

// Assurer que la réponse est toujours au format JSON
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$response = ['status' => 'error', 'message' => 'Action non valide ou non spécifiée.'];

try {
    $pdo = $db->getPDO(); 

    // ===================================================================
    // ACTION: RÉCUPÉRER L'ÉTAT ACTUEL COMPLET DU RÉSEAU
    // ===================================================================
    if ($action === 'get_network_state') {
        // Récupérer les stations
        $stations_stmt = $pdo->query("
            SELECT id, nom, capacite_totale_cartes, capacite_utilisee_cartes,
                   (capacite_totale_cartes - capacite_utilisee_cartes) as capacite_disponible_cartes
            FROM stations ORDER BY nom
        ");
        $stations = $stations_stmt->fetchAll(PDO::FETCH_ASSOC);

        // Récupérer les liens
        $liens_stmt = $pdo->query("
            SELECT 
                l.id,
                l.station_depart_id,
                l.station_arrivee_id,
                s1.nom as nom_depart,
                s2.nom as nom_arrivee,
                l.capacite_totale,
                l.capacite_utilisee,
                (l.capacite_totale - l.capacite_utilisee) as capacite_disponible
            FROM liens_wdm l
            JOIN stations s1 ON l.station_depart_id = s1.id
            JOIN stations s2 ON l.station_arrivee_id = s2.id
            ORDER BY s1.nom, s2.nom
        ");
        $liens = $liens_stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            'status' => 'success',
            'stations' => $stations,
            'liens' => $liens
        ];
    } 
    
    // ===================================================================
    // ACTION: TENTER UNE RÉSERVATION DE CAPACITÉ AVEC CHEMINS DE SECOURS
    // ===================================================================
    elseif ($action === 'reserve_capacity' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $depart_id = intval($data['source']);
        $arrivee_id = intval($data['destination']);
        $debit_gbps = floatval($data['throughput']) / 1000;

        // Étape 1: Vérification de la carte de départ (inchangée)
        $stmt_station_depart = $pdo->prepare("SELECT nom, (capacite_totale_cartes - capacite_utilisee_cartes) as dispo_cartes FROM stations WHERE id = ?");
        $stmt_station_depart->execute([$depart_id]);
        $station_depart = $stmt_station_depart->fetch(PDO::FETCH_ASSOC);

        if (!$station_depart || $station_depart['dispo_cartes'] < $debit_gbps) {
            throw new Exception("Échec : Capacité insuffisante sur les cartes d'accès de la station '" . ($station_depart['nom'] ?? 'Inconnue') . "'.");
        }

        // Étape 2: Trouver jusqu'à 3 chemins valides (principal + 2 secours)
        $all_valid_paths = [];
        $temp_graph_liens = $pdo->query("SELECT id, station_depart_id, station_arrivee_id, capacite_totale, capacite_utilisee FROM liens_wdm")->fetchAll(PDO::FETCH_ASSOC);

        for ($k = 0; $k < 3; $k++) { // Chercher jusqu'à 3 chemins
            $graph = build_graph_from_liens($temp_graph_liens, $debit_gbps);
            $path_nodes = find_shortest_path($graph, $depart_id, $arrivee_id);

            if (empty($path_nodes)) {
                break; // Aucun autre chemin trouvé, on arrête la recherche
            }

            // Vérifier si ce chemin est réellement viable
            $path_verification_result = verify_path_capacity($path_nodes, $debit_gbps, $pdo);
            if ($path_verification_result['is_valid']) {
                $all_valid_paths[] = [
                    'nodes' => $path_nodes,
                    'names' => $path_verification_result['names'],
                    'liens_to_update' => $path_verification_result['liens']
                ];

                // "Supprimer" les liens du chemin trouvé pour la prochaine itération
                $liens_ids_to_remove = $path_verification_result['liens'];
                $temp_graph_liens = array_filter($temp_graph_liens, function($lien) use ($liens_ids_to_remove) {
                    return !in_array($lien['id'], $liens_ids_to_remove);
                });
            } else {
                // Si le chemin trouvé par Dijkstra n'est pas viable (ex: à cause des liens parallèles), on arrête.
                break;
            }
        }

        if (empty($all_valid_paths)) {
            throw new Exception("Échec : Aucun chemin avec la capacité requise n'a été trouvé.");
        }

        // Le premier chemin trouvé est le chemin principal
        $main_path = $all_valid_paths[0];
        
        // Étape 3: Procéder à la réservation sur le chemin principal
        $pdo->beginTransaction();
        
        $update_lien_stmt = $pdo->prepare("UPDATE liens_wdm SET capacite_utilisee = capacite_utilisee + ? WHERE id = ?");
        foreach ($main_path['liens_to_update'] as $lien_id) {
            $update_lien_stmt->execute([$debit_gbps, $lien_id]);
        }
        
        $update_station_stmt = $pdo->prepare("UPDATE stations SET capacite_utilisee_cartes = capacite_utilisee_cartes + ? WHERE id = ?");
        $update_station_stmt->execute([$debit_gbps, $depart_id]);
        
        $pdo->commit();

        // Préparer les chemins de secours pour la réponse
        $backup_paths_names = [];
        if(count($all_valid_paths) > 1) {
            for($i = 1; $i < count($all_valid_paths); $i++){
                $backup_paths_names[] = implode(" -> ", $all_valid_paths[$i]['names']);
            }
        }

        $response = [
            'status' => 'success',
            'message' => number_format($debit_gbps * 1000, 2) . " Mbps réservés.",
            'path_names' => $main_path['names'],
            'path_ids' => $main_path['nodes'],
            'backup_paths' => $backup_paths_names // Ajouter les chemins de secours
        ];
    }

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response['message'] = $e->getMessage();
}

// Envoyer la réponse finale au frontend.
echo json_encode($response);

// ===================================================================
// FONCTIONS UTILITAIRES
// ===================================================================

/**
 * Construit un graphe pondéré à partir d'une liste de liens.
 */
function build_graph_from_liens($liens, $debit_gbps) {
    $graph = [];
    foreach ($liens as $lien) {
        $predicted_usage = $lien['capacite_utilisee'] + $debit_gbps;
        if ($lien['capacite_totale'] == 0 || $predicted_usage > $lien['capacite_totale']) {
            continue; // Ignorer les liens qui n'ont pas la capacité
        }
        $cost = $predicted_usage / $lien['capacite_totale'];
        $graph[$lien['station_depart_id']][] = ['to' => $lien['station_arrivee_id'], 'weight' => $cost];
    }
    return $graph;
}

/**
 * Vérifie si un chemin donné a la capacité suffisante sur chaque segment.
 */
function verify_path_capacity($path_nodes, $debit_gbps, $pdo) {
    $path_liens = [];
    $path_names = [];
    $start_node_name = $pdo->query("SELECT nom FROM stations WHERE id=" . $path_nodes[0])->fetchColumn();
    $path_names[] = $start_node_name;

    for ($i = 0; $i < count($path_nodes) - 1; $i++) {
        $from_id = $path_nodes[$i];
        $to_id = $path_nodes[$i + 1];

        $lien_stmt = $pdo->prepare("SELECT id FROM liens_wdm WHERE station_depart_id = ? AND station_arrivee_id = ? AND (capacite_totale - capacite_utilisee) >= ? ORDER BY (capacite_totale - capacite_utilisee) DESC LIMIT 1");
        $lien_stmt->execute([$from_id, $to_id, $debit_gbps]);
        $best_link = $lien_stmt->fetch(PDO::FETCH_ASSOC);

        if (!$best_link) {
            return ['is_valid' => false]; // Segment invalide
        }
        $path_liens[] = $best_link['id'];
        $path_names[] = $pdo->query("SELECT nom FROM stations WHERE id=$to_id")->fetchColumn();
    }
    return ['is_valid' => true, 'liens' => $path_liens, 'names' => $path_names];
}

/**
 * Implémentation de l'algorithme de Dijkstra pour trouver le chemin le moins coûteux.
 *
 * @param array $graph Graphe du réseau sous forme de liste d'adjacence.
 * @param int $start ID du nœud de départ.
 * @param int $end ID du nœud d'arrivée.
 * @return array Le chemin sous forme de liste d'IDs de nœuds, ou un tableau vide si aucun chemin n'est trouvé.
 */
function find_shortest_path($graph, $start, $end) {
    $distances = [];
    $previous = [];
    $queue = new SplPriorityQueue();

    // Initialisation
    $vertices = array_keys($graph);
    foreach ($graph as $vertex => $adj) {
        if(!in_array($vertex, $vertices)) $vertices[] = $vertex;
        foreach ($adj as $edge) {
            if(!in_array($edge['to'], $vertices)) $vertices[] = $edge['to'];
        }
    }
    
    foreach ($vertices as $vertex) {
        $distances[$vertex] = INF;
        $previous[$vertex] = null;
    }

    if (!isset($distances[$start])) return []; // Le nœud de départ n'est pas dans le graphe

    $distances[$start] = 0;
    $queue->insert($start, 0);

    while (!$queue->isEmpty()) {
        $current = $queue->extract();
        if (empty($graph[$current])) continue;

        foreach ($graph[$current] as $edge) {
            $neighbor = $edge['to'];
            $weight = $edge['weight'];
            $alt = $distances[$current] + $weight;

            if ($alt < $distances[$neighbor]) {
                $distances[$neighbor] = $alt;
                $previous[$neighbor] = $current;
                // La file de priorité de SPL est une max-heap, donc on utilise des poids négatifs pour simuler une min-heap.
                $queue->insert($neighbor, -$alt);
            }
        }
    }

    // Si le nœud d'arrivée est inaccessible, retourner un chemin vide.
    if (!isset($previous[$end]) || is_null($previous[$end])) {
        return [];
    }

    // Reconstruire le chemin à partir des nœuds précédents.
    $path = [];
    $current = $end;
    while ($current !== null) {
        array_unshift($path, $current);
        $current = $previous[$current];
    }
    
    return ($path[0] == $start) ? $path : [];
}