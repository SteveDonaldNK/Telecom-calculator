<?php
require_once 'config.php';
requireLogin();

// Récupérer les statistiques de l'utilisateur
try {
    $pdo = $db->getPDO();
    $stmt = $pdo->prepare("SELECT COUNT(*) as total_calculations FROM calculations_4g WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $stats = $stmt->fetch();
    
    // Récupérer les derniers calculs
    $stmt = $pdo->prepare("
        SELECT bandwidth_frequency, bandwidth_mhz, transport_throughput, ss_throughput, calculation_date 
        FROM calculations_4g 
        WHERE user_id = ? 
        ORDER BY calculation_date DESC 
        LIMIT 5
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $recent_calculations = $stmt->fetchAll();
    
} catch (PDOException $e) {
    $stats = ['total_calculations' => 0];
    $recent_calculations = [];
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo APP_NAME; ?></title>
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
                <span>Bienvenue, <?php echo htmlspecialchars($_SESSION['username']); ?></span>
                <a href="logout.php" class="btn btn-outline">
                    <i class="fas fa-sign-out-alt"></i>
                    Déconnexion
                </a>
            </div>
        </div>
    </nav>

    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Tableau de bord</h1>
            <p>Gestion et calcul des débits télécoms</p>
        </div>

        <div class="dashboard-grid">
            <!-- Section Calculs -->
            <div class="dashboard-section">
                <h2><i class="fas fa-calculator"></i> Calculs de débit</h2>
                <div class="calculation-buttons">
                    <a href="parameters.php?type=4g" class="calc-card calc-4g">
                        <div class="calc-icon">
                            <i class="fas fa-signal"></i>
                        </div>
                        <div class="calc-content">
                            <h3>Calcul 4G</h3>
                            <p>Calculer le débit et les paramètres LTE</p>
                            <span class="calc-status available">Disponible</span>
                        </div>
                    </a>
                    
                    <div class="calc-card calc-5g disabled">
                        <div class="calc-icon">
                            <i class="fas fa-wifi"></i>
                        </div>
                        <div class="calc-content">
                            <h3>Calcul 5G</h3>
                            <p>Calculer le débit et les paramètres 5G NR</p>
                            <span class="calc-status coming-soon">Fonctionnalités à venir</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Statistiques -->
            <div class="dashboard-section">
                <h2><i class="fas fa-chart-bar"></i> Statistiques</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number"><?php echo $stats['total_calculations']; ?></div>
                            <div class="stat-label">Calculs effectués</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number"><?php echo count($recent_calculations); ?></div>
                            <div class="stat-label">Calculs récents</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-network-wired"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">4G/5G</div>
                            <div class="stat-label">Technologies</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section Historique -->
            <div class="dashboard-section full-width">
                <h2><i class="fas fa-history"></i> Calculs récents</h2>
                <?php if (empty($recent_calculations)): ?>
                    <div class="empty-state">
                        <i class="fas fa-calculator"></i>
                        <h3>Aucun calcul effectué</h3>
                        <p>Commencez par effectuer votre premier calcul 4G</p>
                        <a href="parameters.php?type=4g" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Nouveau calcul 4G
                        </a>
                    </div>
                <?php else: ?>
                    <div class="calculations-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fréquence</th>
                                    <th>Bande passante</th>
                                    <th>Débit Transport</th>
                                    <th>Débit SS</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($recent_calculations as $calc): ?>
                                <tr>
                                    <td><?php echo $calc['bandwidth_frequency']; ?> MHz</td>
                                    <td><?php echo $calc['bandwidth_mhz']; ?> MHz</td>
                                    <td><?php echo number_format($calc['transport_throughput'], 2); ?> Mbps</td>
                                    <td><?php echo number_format($calc['ss_throughput'], 2); ?> Mbps</td>
                                    <td><?php echo date('d/m/Y H:i', strtotime($calc['calculation_date'])); ?></td>
                                    <td>
                                        <a href="results.php" class="btn btn-sm btn-outline">
                                            <i class="fas fa-eye"></i>
                                            Voir
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-footer">
                        <a href="results.php" class="btn btn-outline">
                            <i class="fas fa-list"></i>
                            Voir tous les calculs
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script src="js/dashboard.js"></script>
</body>
</html>
