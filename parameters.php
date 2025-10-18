<?php
require_once 'config.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once 'config.php';
requireLogin();
$type = $_GET['type'] ?? '4g';
$error = '';
$success = '';

// Configuration des bandes passantes LTE (valeurs corrigées)
$lte_config = [
    5.0 => 24.6,   // Corrigé de 21.6 à 24.6
    10.0 => 50.7,
    15.0 => 76.5,  // Corrigé de 74.5 à 76.5
    20.0 => 102.9
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $type === 's1') {
    error_log('POST request received');
    $bandwidth_frequency = (int)$_POST['bandwidth_frequency'];
    $bandwidth_mhz = (float)$_POST['bandwidth_mhz'];
    $extension_ratio = 1.16; // Valeur fixe pour Extension Ratio (ER)

    error_log("Input values: frequency=$bandwidth_frequency, bandwidth=$bandwidth_mhz, extension_ratio=$extension_ratio");
    
    // Validation
    if (!in_array($bandwidth_frequency, [1800, 2100, 2600])) {
        $error = 'Fréquence de bande invalide.';
        error_log('Validation failed: Invalid frequency');
    } elseif (!isset($lte_config[$bandwidth_mhz])) {
        $error = 'Bande passante invalide.';
        error_log('Validation failed: Invalid bandwidth');
    } elseif ($extension_ratio < 1.0 || $extension_ratio > 2.0) {
        $error = 'L\'Extension Ratio doit être entre 1.0 et 2.0.';
        error_log('Validation failed: Invalid extension ratio');
    } else {
        error_log('Validation passed, performing calculations');
        // Calculs selon les formules
        $radio_mac_throughput = $lte_config[$bandwidth_mhz];
        $radio_payload_throughput = $radio_mac_throughput; // Radio Payload = Radio MAC
        $transport_throughput = $radio_payload_throughput * $extension_ratio;
        $control_plane = $transport_throughput * 0.02;
        $s1_throughput = $transport_throughput * 1.02; // S1 = Transport × 1.02
        
        try {
            $pdo = $db->getPDO();
            error_log('Database connection established');
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
                $extension_ratio,
                $transport_throughput,
                $control_plane,
                $s1_throughput
            ]);
            $last_id = $pdo->lastInsertId();
            error_log('Database insertion successful');
            
            // Stocker les résultats en session pour l'affichage
            $_SESSION['last_calculation'] = [
                'type' => 's1',
                'bandwidth_frequency' => $bandwidth_frequency,
                'bandwidth_mhz' => $bandwidth_mhz,
                'extension_ratio' => $extension_ratio,
                'radio_mac_throughput' => $radio_mac_throughput,
                'radio_payload_throughput' => $radio_payload_throughput,
                'transport_throughput' => $transport_throughput,
                'control_plane' => $control_plane,
                's1_throughput' => $s1_throughput
            ];
            error_log('Session data set, redirecting to results.php');
            redirectTo('results.php?id=' . $last_id);
            
        } catch (PDOException $e) {
            $error = 'Erreur lors de la sauvegarde: ' . $e->getMessage();
            error_log('Database error: ' . $e->getMessage());
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
                <?php if ($type === 's1'): ?>
                    <span class="tech-badge badge-s1">Dimensionnement S1</span>
                <?php else: ?>
                    <span class="tech-badge badge-ng">Dimensionnement NG</span>
                <?php endif; ?>
            </h1>
        </div>

        <?php if ($type === 'ng'): ?>
            <!-- Message pour NG -->
            <div class="coming-soon-section">
                <div class="coming-soon-card">
                    <i class="fas fa-wifi"></i>
                    <h2>Dimensionnement NG</h2>
                    <p>Les fonctionnalités de dimensionnement pour la technologie Next Generation seront bientôt disponibles.</p>
                    <a href="dashboard.php" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Retour au tableau de bord
                    </a>
                </div>
            </div>
        <?php else: ?>
            <!-- Formulaire S1 -->
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
                                <label for="bandwidth_frequency">Bande de fréquence (MHz)</label>
                                <select id="bandwidth_frequency" name="bandwidth_frequency" required>
                                    <option value="">Sélectionnez une bande de fréquence</option>
                                    <option value="1800" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '1800') ? 'selected' : ''; ?>>1800 MHz</option>
                                    <option value="2100" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '2100') ? 'selected' : ''; ?>>2100 MHz</option>
                                    <option value="2600" <?php echo (isset($_POST['bandwidth_frequency']) && $_POST['bandwidth_frequency'] == '2600') ? 'selected' : ''; ?>>2600 MHz</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="bandwidth_mhz">Largeur de spectre (MHz)</label>
                                <select id="bandwidth_mhz" name="bandwidth_mhz" required>
                                    <option value="">Sélectionnez une largeur de spectre</option>
                                    <option value="5" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '5') ? 'selected' : ''; ?>>5 MHz</option>
                                    <option value="10" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '10') ? 'selected' : ''; ?>>10 MHz</option>
                                    <option value="15" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '15') ? 'selected' : ''; ?>>15 MHz</option>
                                    <option value="20" <?php echo (isset($_POST['bandwidth_mhz']) && $_POST['bandwidth_mhz'] == '20') ? 'selected' : ''; ?>>20 MHz</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-sliders-h"></i> Paramètres avancés</h3>
                        
                        <div class="form-group">
                            <label for="extension_ratio">Extension Ratio (ER)</label>
                            <div class="input-with-helper">
                                <input type="number" id="extension_ratio" name="extension_ratio" 
                                       step="0.01" min="1.0" max="2.0" 
                                       value="1.16" readonly>
                                <small class="helper-text">Valeur fixe: 1.16</small>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-large">
                            <i class="fas fa-calculator"></i>
                            Dimensionner
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