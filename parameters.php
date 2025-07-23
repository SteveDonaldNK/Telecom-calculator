<?php
require_once 'config.php';
requireLogin();

$type = $_GET['type'] ?? '4g';
$error = '';
$success = '';

// Configuration des bandes passantes LTE
$lte_config = [
    5.0 => 21.6,
    10.0 => 50.7,
    15.0 => 74.5,
    20.0 => 102.9
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $type === '4g') {
    $bandwidth_frequency = (int)$_POST['bandwidth_frequency'];
    $bandwidth_mhz = (float)$_POST['bandwidth_mhz'];
    $transport_efficiency = (float)($_POST['transport_efficiency'] ?? 0.95);
    
    // Validation
    if (!in_array($bandwidth_frequency, [1800, 2100, 2600])) {
        $error = 'Fréquence de bande invalide.';
    } elseif (!isset($lte_config[$bandwidth_mhz])) {
        $error = 'Bande passante invalide.';
    } elseif ($transport_efficiency < 0.1 || $transport_efficiency > 1.0) {
        $error = 'L\'efficacité de transport doit être entre 0.1 et 1.0.';
    } else {
        // Calculs selon les formules
        $radio_mac_throughput = $lte_config[$bandwidth_mhz];
        $radio_payload_throughput = $radio_mac_throughput; // Radio Payload = Radio MAC
        $transport_throughput = $radio_payload_throughput * $transport_efficiency;
        $control_plane = $transport_throughput * 0.02;
        $ss_throughput = $transport_throughput * 1.02; // SS = Transport × 1.02
        
        try {
            $pdo = $db->getPDO();
            $stmt = $pdo->prepare("
                INSERT INTO calculations_4g 
                (user_id, bandwidth_frequency, bandwidth_mhz, radio_mac_throughput, 
                 transport_efficiency, transport_throughput, control_plane, ss_throughput) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $_SESSION['user_id'],
                $bandwidth_frequency,
                $bandwidth_mhz,
                $radio_mac_throughput,
                $transport_efficiency,
                $transport_throughput,
                $control_plane,
                $ss_throughput
            ]);
            
            // Stocker les résultats en session pour l'affichage
            $_SESSION['last_calculation'] = [
                'type' => '4g',
                'bandwidth_frequency' => $bandwidth_frequency,
                'bandwidth_mhz' => $bandwidth_mhz,
                'transport_efficiency' => $transport_efficiency,
                'radio_mac_throughput' => $radio_mac_throughput,
                'radio_payload_throughput' => $radio_payload_throughput,
                'transport_throughput' => $transport_throughput,
                'control_plane' => $control_plane,
                'ss_throughput' => $ss_throughput
            ];
            
            redirectTo('results.php');
            
        } catch (PDOException $e) {
            $error = 'Erreur lors de la sauvegarde: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saisie des paramètres - <?php echo APP_NAME; ?></title>
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
                    <i class="fas fa-arrow-left"></i>
                    Retour
                </a>
                <a href="logout.php" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i>
                    Déconnexion
                </a>
            </div>
        </div>
    </nav>

    <div class="parameters-container">
        <div class="parameters-header">
            <h1>
                <i class="fas fa-cog"></i>
                Saisie des paramètres
                <?php if ($type === '4g'): ?>
                    <span class="tech-badge badge-4g">4G LTE</span>
                <?php else: ?>
                    <span class="tech-badge badge-5g">5G NR</span>
                <?php endif; ?>
            </h1>
        </div>

        <?php if ($type === '5g'): ?>
            <!-- Message pour 5G -->
            <div class="coming-soon-section">
                <div class="coming-soon-card">
                    <i class="fas fa-wifi"></i>
                    <h2>Calculs 5G NR</h2>
                    <p>Les fonctionnalités de calcul pour la technologie 5G New Radio seront bientôt disponibles.</p>
                    <a href="dashboard.php" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Retour au tableau de bord
                    </a>
                </div>
            </div>
        <?php else: ?>
            <!-- Formulaire 4G -->
            <div class="parameters-form-container">
                <?php if ($error): ?>
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <?php echo $error; ?>
                    </div>
                <?php endif; ?>

                <form class="parameters-form" method="POST" action="">
                    <div class="form-section">
                        <h3><i class="fas fa-signal"></i> Paramètres de fréquence</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="bandwidth_frequency">Fréquence de bande (MHz)</label>
                                <select id="bandwidth_frequency" name="bandwidth_frequency" required>
                                    <option value="">Sélectionnez une fréquence</option>
                                    <option value="1800" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '1800') ? 'selected' : ''; ?>>1800 MHz</option>
                                    <option value="2100" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '2100') ? 'selected' : ''; ?>>2100 MHz</option>
                                    <option value="2600" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '2600') ? 'selected' : ''; ?>>2600 MHz</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="bandwidth_mhz">Bande passante LTE (MHz)</label>
                                <select id="bandwidth_mhz" name="bandwidth_mhz" required>
                                    <option value="">Sélectionnez la bande passante</option>
                                    <option value="5" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '5') ? 'selected' : ''; ?>>5 MHz (21.6 Mbps)</option>
                                    <option value="10" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '10') ? 'selected' : ''; ?>>10 MHz (50.7 Mbps)</option>
                                    <option value="15" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '15') ? 'selected' : ''; ?>>15 MHz (74.5 Mbps)</option>
                                    <option value="20" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '20') ? 'selected' : ''; ?>>20 MHz (102.9 Mbps)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-sliders-h"></i> Paramètres avancés</h3>
                        
                        <div class="form-group">
                            <label for="transport_efficiency">Efficacité de transport (TE)</label>
                            <div class="input-with-helper">
                                <input type="number" id="transport_efficiency" name="transport_efficiency" 
                                       step="0.001" min="0.1" max="1.0" 
                                       value="<?php echo isset($_POST['transport_efficiency']) ? $_POST['transport_efficiency'] : '0.95'; ?>">
                                <small class="helper-text">Valeur par défaut: 0.95 (95%)</small>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-info-circle"></i> Formules de calcul</h3>
                        <div class="formulas-info">
                            <div class="formula-item">
                                <strong>Radio Payload Throughput</strong> = Radio MAC Throughput
                            </div>
                            <div class="formula-item">
                                <strong>Transport Throughput</strong> = Radio Payload Throughput × Transport Efficiency (TE)
                            </div>
                            <div class="formula-item">
                                <strong>Control Plane</strong> = Transport Throughput × 0.02
                            </div>
                            <div class="formula-item">
                                <strong>SS Throughput</strong> = Transport Throughput × 1.02
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-large">
                            <i class="fas fa-calculator"></i>
                            Calculer le débit 4G
                        </button>
                        <a href="dashboard.php" class="btn btn-outline btn-large">
                            <i class="fas fa-times"></i>
                            Annuler
                        </a>
                    </div>
                </form>
            </div>
        <?php endif; ?>
    </div>

    <script src="js/parameters.js"></script>
</body>
</html>
