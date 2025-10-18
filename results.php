<?php
require_once 'config.php';
requireLogin();

$calculation = null;
$all_calculations = [];
$error = '';

// Récupérer le dernier calcul ou tous les calculs
try {
    $pdo = $db->getPDO();
    
    // Si un calcul récent est en session, l'utiliser. C'est la priorité.
    if (isset($_SESSION['last_calculation'])) {
        $calculation = $_SESSION['last_calculation'];
        // Nettoyer la session pour que la prochaine actualisation charge depuis la BDD
        unset($_SESSION['last_calculation']); 
    }
    
    // Récupérer tous les calculs de l'utilisateur pour l'historique
    $stmt = $pdo->prepare("
        SELECT * FROM calculations_4g 
        WHERE user_id = ? 
        ORDER BY calculation_date DESC
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $all_calculations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // S'il n'y avait pas de calcul en session (ex: visite directe, actualisation),
    // prendre le plus récent de la base de données.
    if (!$calculation && !empty($all_calculations)) {
        // Prendre le dernier calcul de la BDD
        $latest_from_db = $all_calculations[0];
        
        // **CORRECTION : Créer un tableau $calculation cohérent avec la structure de la session**
        $calculation = [
            'type' => '4g', // Assumed type
            'bandwidth_frequency' => $latest_from_db['bandwidth_frequency'],
            'bandwidth_mhz' => $latest_from_db['bandwidth_mhz'],
            
            // Clé manquante: 'extension_ratio' est 'transport_efficiency' dans la BDD
            'extension_ratio' => $latest_from_db['transport_efficiency'], 
            
            'radio_mac_throughput' => $latest_from_db['radio_mac_throughput'],
            
            // Clé manquante: 'radio_payload_throughput' n'est pas dans la BDD, on le recrée
            'radio_payload_throughput' => $latest_from_db['radio_mac_throughput'], // Car Radio Payload = Radio MAC
            
            'transport_throughput' => $latest_from_db['transport_throughput'],
            'control_plane' => $latest_from_db['control_plane'],
            
            // Clé manquante: 's1_throughput' est 'ss_throughput' dans la BDD
            's1_throughput' => $latest_from_db['ss_throughput']
        ];
    }
    
} catch (PDOException $e) {
    $error = 'Erreur lors de la récupération des données: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Résultats - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <i class="fas fa-broadcast-tower"></i>
                <span><?php echo APP_NAME; ?></span>
            </div>
            <div class="nav-user">
                <a href="dashboard.php" class="btn btn-outline">
                    <i class="fas fa-home"></i>
                    Dashboard
                </a>
                <a href="logout.php" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i>
                    Déconnexion
                </a>
            </div>
        </div>
    </nav>

    <div class="results-container">
        <div class="results-header">
            <h1>
                <i class="fas fa-chart-line"></i>
                Résultats des calculs
            </h1>
        </div>

        <?php if ($error): ?>
             <div class="alert alert-error"><?php echo $error; ?></div>
        <?php endif; ?>

        <?php if ($calculation): ?>
            <!-- Résultat du dernier calcul -->
            <div class="results-section">
                <h2>
                    <i class="fas fa-signal"></i>
                    Dernier dimensionnement S1
                    <!-- Note: This date will always be the current time. To show the actual calculation date, you'd need to add it to the session/DB array -->
                    <span class="calculation-date"><?php echo date('d/m/Y à H:i'); ?></span>
                </h2>
                
                <div class="calculation-summary">
                    <div class="summary-item">
                        <span class="label">Bande de fréquence:</span>
                        <span class="value"><?php echo htmlspecialchars($calculation['bandwidth_frequency']); ?> MHz</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Largeur de spectre:</span>
                        <span class="value"><?php echo htmlspecialchars($calculation['bandwidth_mhz']); ?> MHz</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Extension Ratio:</span>
                        <span class="value"><?php echo htmlspecialchars($calculation['extension_ratio']); ?></span>
                    </div>
                </div>

                <div class="results-grid">
                    <div class="result-card">
                        <div class="result-icon"><i class="fas fa-layer-group"></i></div>
                        <div class="result-content">
                            <h3>Radio Payload Throughput</h3>
                            <div class="result-value"><?php echo number_format($calculation['radio_payload_throughput'], 2); ?> <span>Mbps</span></div>
                            <div class="result-description">Débit payload radio</div>
                        </div>
                    </div>

                    <div class="result-card highlight">
                        <div class="result-icon"><i class="fas fa-shipping-fast"></i></div>
                        <div class="result-content">
                            <h3>Transport Throughput</h3>
                            <div class="result-value"><?php echo number_format($calculation['transport_throughput'], 2); ?> <span>Mbps</span></div>
                            <div class="result-description">Radio Payload × ER (<?php echo htmlspecialchars($calculation['extension_ratio']); ?>)</div>
                        </div>
                    </div>

                    <div class="result-card">
                        <div class="result-icon"><i class="fas fa-cogs"></i></div>
                        <div class="result-content">
                            <h3>Control Plane</h3>
                            <div class="result-value"><?php echo number_format($calculation['control_plane'], 2); ?> <span>Mbps</span></div>
                            <div class="result-description">Transport × 0.02 (2%)</div>
                        </div>
                    </div>

                    <div class="result-card highlight">
                        <div class="result-icon"><i class="fas fa-tachometer-alt"></i></div>
                        <div class="result-content">
                            <h3>S1 Throughput</h3>
                            <div class="result-value"><?php echo number_format($calculation['s1_throughput'], 2); ?> <span>Mbps</span></div>
                            <div class="result-description">Transport × 1.02 (102%)</div>
                        </div>
                    </div>
                </div>

                <div class="result-actions">
                    <button onclick="window.print()" class="btn btn-outline"><i class="fas fa-print"></i> Imprimer</button>
                    <a href="reservation.php?throughput=<?php echo $calculation['s1_throughput']; ?>" class="btn btn-primary">
                        <i class="fas fa-arrow-right"></i>
                        Réserver capacité WDM
                    </a>
                    <a href="parameters.php?type=s1" class="btn btn-primary"><i class="fas fa-redo"></i> Nouveau dimensionnement</a>
                </div>
            </div>
        <?php endif; ?>

        <!-- Historique des calculs -->
        <?php if (!empty($all_calculations)): ?>
            <div class="results-section">
                <h2>
                    <i class="fas fa-history"></i>
                    Historique des calculs
                    <span class="calculation-count"><?php echo count($all_calculations); ?> calcul(s)</span>
                </h2>
                
                <div class="calculations-history">
                    <table class="calculations-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Fréquence</th>
                                <th>Bande passante</th>
                                <th>ER</th>
                                <th>Transport</th>
                                <th>S1 Throughput</th>
                                <!-- Actions column can be added back if needed
                                <th>Actions</th>
                                -->
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($all_calculations as $calc): ?>
                            <tr>
                                <td><?php echo date('d/m/Y H:i', strtotime($calc['calculation_date'])); ?></td>
                                <td><?php echo htmlspecialchars($calc['bandwidth_frequency']); ?> MHz</td>
                                <td><?php echo htmlspecialchars($calc['bandwidth_mhz']); ?> MHz</td>
                                <td><?php echo htmlspecialchars($calc['transport_efficiency']); ?></td>
                                <td><?php echo number_format($calc['transport_throughput'], 2); ?> Mbps</td>
                                <td><?php echo number_format($calc['ss_throughput'], 2); ?> Mbps</td>
                                <!--
                                <td>
                                    <button class="btn btn-sm btn-outline">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                                -->
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>

        <?php if (!$calculation && empty($all_calculations)): ?>
            <!-- État vide -->
            <div class="empty-state">
                <i class="fas fa-calculator"></i>
                <h3>Aucun dimensionnement disponible</h3>
                <p>Effectuez votre premier dimensionnement S1 pour voir les résultats ici.</p>
                <a href="parameters.php?type=s1" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Commencer un dimensionnement
                </a>
            </div>
        <?php endif; ?>
    </div>

    <!-- Add your JS scripts here if needed -->
</body>
</html>