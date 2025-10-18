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
    // ACTION: TENTER UNE RÉSERVATION DE CAPACITÉ MULTI-SAUTS
    // ===================================================================
    elseif ($action === 'reserve_capacity' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $depart_id = intval($data['source']);
        $arrivee_id = intval($data['destination']);
        $debit_gbps = floatval($data['throughput']) / 1000;

        // Démarrer une transaction pour garantir que toutes les mises à jour réussissent ou échouent ensemble.
        $pdo->beginTransaction();

        // Étape 1: Vérifier la capacité de la carte de la station de départ. C'est le premier point de contrôle.
        $stmt_station_depart = $pdo->prepare("SELECT nom, (capacite_totale_cartes - capacite_utilisee_cartes) as dispo_cartes FROM stations WHERE id = ?");
        $stmt_station_depart->execute([$depart_id]);
        $station_depart = $stmt_station_depart->fetch(PDO::FETCH_ASSOC);

        if (!$station_depart || $station_depart['dispo_cartes'] < $debit_gbps) {
            throw new Exception("Échec : Capacité insuffisante sur les cartes d'accès de la station '" . ($station_depart['nom'] ?? 'Inconnue') . "'.");
        }

        // Étape 2: Construire un graphe du réseau et trouver le chemin optimal (le moins congestionné) avec Dijkstra.
        $liens_stmt = $pdo->query("SELECT id, station_depart_id, station_arrivee_id, capacite_totale, capacite_utilisee FROM liens_wdm");
        $all_liens = $liens_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $graph = [];
        foreach ($all_liens as $lien) {
            // Le "coût" est le taux d'utilisation. Un lien vide a un coût proche de 0, un lien plein a un coût de 1.
            // On ajoute le débit demandé pour pénaliser les liens qui seraient proches de la saturation.
            $predicted_usage = $lien['capacite_utilisee'] + $debit_gbps;
            if ($lien['capacite_totale'] == 0 || $predicted_usage > $lien['capacite_totale']) {
                continue; // Ignorer les liens qui n'ont pas de capacité ou qui seraient surchargés.
            }
            $cost = $predicted_usage / $lien['capacite_totale'];
            
            $graph[$lien['station_depart_id']][] = [
                'to' => $lien['station_arrivee_id'],
                'weight' => $cost
            ];
        }

        $path_nodes = find_shortest_path($graph, $depart_id, $arrivee_id);

        if (empty($path_nodes)) {
            throw new Exception("Échec : Aucun chemin avec la capacité requise n'a été trouvé entre les stations sélectionnées.");
        }

        // Étape 3: Le chemin est trouvé. Maintenant, vérifier la capacité sur CHAQUE segment du chemin.
        $path_liens_to_update = [];
        $path_names = [$station_depart['nom']];

        for ($i = 0; $i < count($path_nodes) - 1; $i++) {
            $from_id = $path_nodes[$i];
            $to_id = $path_nodes[$i + 1];

            // S'il y a des liens parallèles, choisir celui avec le plus de capacité disponible.
            $lien_stmt = $pdo->prepare(
                "SELECT id, (capacite_totale - capacite_utilisee) as dispo 
                 FROM liens_wdm WHERE station_depart_id = ? AND station_arrivee_id = ? 
                 ORDER BY dispo DESC LIMIT 1"
            );
            $lien_stmt->execute([$from_id, $to_id]);
            $best_link = $lien_stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$best_link || $best_link['dispo'] < $debit_gbps) {
                // Obtenir les noms pour un message d'erreur clair
                $from_name_stmt = $pdo->prepare("SELECT nom FROM stations WHERE id=?");
                $from_name_stmt->execute([$from_id]);
                $from_name = $from_name_stmt->fetchColumn();
                
                $to_name_stmt = $pdo->prepare("SELECT nom FROM stations WHERE id=?");
                $to_name_stmt->execute([$to_id]);
                $to_name = $to_name_stmt->fetchColumn();

                throw new Exception("Échec : Capacité insuffisante sur le segment '" . $from_name . " -> " . $to_name . "' du chemin optimal.");
            }
            $path_liens_to_update[] = $best_link['id'];
            $path_names[] = $pdo->query("SELECT nom FROM stations WHERE id=$to_id")->fetchColumn();
        }

        // Étape 4: Toutes les vérifications ont réussi. Procéder à la réservation.
        // Mettre à jour la capacité sur tous les liens du chemin.
        $update_lien_stmt = $pdo->prepare("UPDATE liens_wdm SET capacite_utilisee = capacite_utilisee + ? WHERE id = ?");
        foreach ($path_liens_to_update as $lien_id) {
            $update_lien_stmt->execute([$debit_gbps, $lien_id]);
        }

        // Mettre à jour la capacité de la carte de la station de départ.
        $update_station_stmt = $pdo->prepare("UPDATE stations SET capacite_utilisee_cartes = capacite_utilisee_cartes + ? WHERE id = ?");
        $update_station_stmt->execute([$debit_gbps, $depart_id]);

        // Valider la transaction pour rendre toutes les modifications permanentes.
        $pdo->commit();

        $response = [
            'status' => 'success',
            'message' => number_format($debit_gbps * 1000, 2) . " Mbps réservés sur le chemin : " . implode(" -> ", $path_names),
            'path_ids' => $path_nodes // Renvoyer les IDs des nœuds pour la mise en évidence sur le frontend
        ];
    }

} catch (Exception $e) {
    // En cas d'erreur à n'importe quelle étape, annuler la transaction.
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response['message'] = $e->getMessage();
}

// Envoyer la réponse finale au frontend.
echo json_encode($response);


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