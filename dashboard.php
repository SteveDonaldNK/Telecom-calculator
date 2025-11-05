<?php
require_once 'config.php';
requireLogin();

// Récupérer les statistiques de l'utilisateur
try {
    $pdo = $db->getPDO();
    $stmt = $pdo->prepare("SELECT COUNT(*) as total_calculations FROM calculations_4g WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $stats = $stmt->fetch();
    
    // Récupérer les derniers dimensionnements
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        /* Styles spécifiques pour le dashboard OptiLink */
        .dashboard-hero {
            position: relative;
            height: 300px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            background-size: cover;
            background-position: center;
            border-radius: var(--radius-lg);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            overflow: hidden;
        }

        .dashboard-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300"><g opacity="0.1"><circle cx="100" cy="50" r="20" fill="%23fff"/><circle cx="300" cy="80" r="15" fill="%23fff"/><circle cx="500" cy="60" r="25" fill="%23fff"/><circle cx="700" cy="90" r="18" fill="%23fff"/><circle cx="900" cy="40" r="22" fill="%23fff"/><circle cx="1100" cy="70" r="16" fill="%23fff"/></g></svg>');
            animation: float-pattern 20s infinite linear;
        }

        @keyframes float-pattern {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(100px); }
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 1rem;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .hero-logo img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .hero-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
            font-size: 1.125rem;
            opacity: 0.9;
        }

        /* Cards de dimensionnement avec images */
        .calc-card {
            position: relative;
            overflow: hidden;
            background: var(--surface-color);
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 2rem;
            text-decoration: none;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }

        .calc-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: url('images/telecom.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.1;
            border-radius: 0 var(--radius-lg) 0 50%;
        }

        .calc-card.calc-s1 {
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border-color: var(--primary-color);
        }

        .calc-card.calc-s1:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(37, 99, 235, 0.2);
            border-color: var(--primary-dark);
        }

        .calc-card.calc-ng {
            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
            border-color: var(--secondary-color);
            opacity: 0.7;
        }

        .calc-icon {
            width: 4rem;
            height: 4rem;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .calc-card.calc-s1 .calc-icon {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        }

        .calc-card.calc-ng .calc-icon {
            background: linear-gradient(135deg, var(--secondary-color), #475569);
        }

        .calc-icon::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: rotate(45deg);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .calc-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .calc-status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 500;
        }

        .calc-status.available {
            background: #dcfce7;
            color: var(--success-color);
        }

        .calc-status.coming-soon {
            background: #fef3c7;
            color: var(--warning-color);
        }

        /* Section des traitements avec image de fond */
        .treatments-section {
            background: var(--surface-color);
            border-radius: var(--radius-lg);
            padding: 2rem;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
            position: relative;
            overflow: hidden;
        }

        .treatments-section::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 150px;
            height: 150px;
            background: url('images/telecom.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.05;
            border-radius: 50%;
            transform: translate(50px, -50px);
        }

        .treatments-section > * {
            position: relative;
            z-index: 1;
        }

        /* Table responsive avec style moderne */
        .calculations-table {
            background: var(--surface-color);
            border-radius: var(--radius-md);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .calculations-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .calculations-table th {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .calculations-table td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-secondary);
        }

        .calculations-table tr:hover {
            background: var(--background-color);
        }

        .calculations-table tr:last-child td {
            border-bottom: none;
        }

        /* État vide avec illustration */
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
            position: relative;
        }

        .empty-state::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 200px;
            background: url('images/telecom.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.1;
            border-radius: 50%;
        }

        .empty-state > * {
            position: relative;
            z-index: 1;
        }

        .empty-state i {
            font-size: 4rem;
            color: var(--text-muted);
            margin-bottom: 1rem;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }

        .empty-state p {
            font-size: 1.125rem;
            margin-bottom: 2rem;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Icônes flottantes animées */
        .floating-telecom-icons {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        }

        .floating-telecom-icon {
            position: absolute;
            color: rgba(102, 126, 234, 0.1);
            font-size: 1.5rem;
            animation: floatUp 15s infinite linear;
        }

        @keyframes floatUp {
            0% {
                transform: translateY(100vh) translateX(var(--random-x, 0)) rotate(0deg);
                opacity: 0;
            }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% {
                transform: translateY(-100px) translateX(var(--random-x, 0)) rotate(360deg);
                opacity: 0;
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .dashboard-hero {
                height: 200px;
                margin-bottom: 1rem;
            }

            .hero-title {
                font-size: 2rem;
            }

            .calc-card {
                flex-direction: column;
                text-align: center;
                padding: 1.5rem;
            }

            .calculations-table {
                overflow-x: auto;
            }

            .calculations-table table {
                min-width: 600px;
            }
        }
    </style>
</head>
<body>
    <!-- Icônes flottantes -->
    <div class="floating-telecom-icons" id="floating-icons"></div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <i class="fas fa-link"></i>
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
        <!-- Section Hero avec image de fond -->
        <div class="dashboard-hero">
            <div class="hero-content">
                <div class="hero-logo">
                    <img src="images/logo.png" alt="OptiLink Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <i class="fas fa-link" style="display: none; font-size: 2rem;"></i>
                </div>
                <h1 class="hero-title">Tableau de bord</h1>
                <p class="hero-subtitle">Optimisation et dimensionnement des liaisons télécoms</p>
            </div>
        </div>

        <div class="dashboard-grid">
            <!-- Section Traitements récents -->
            <div class="dashboard-section full-width treatments-section">
                <h2><i class="fas fa-history"></i> Traitements récents</h2>
                <?php if (empty($recent_calculations)): ?>
                    <div class="empty-state">
                        <i class="fas fa-calculator"></i>
                        <h3>Aucun traitement effectué</h3>
                        <p>Commencez par effectuer votre premier dimensionnement S1</p>
                        <a href="parameters.php?type=s1" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Nouveau dimensionnement
                        </a>
                    </div>
                <?php else: ?>
                    <div class="calculations-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bande de fréquence</th>
                                    <th>Largeur de spectre</th>
                                    <th>Débit Transport</th>
                                    <th>Débit S1</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($recent_calculations as $calc): ?>
                                <tr>
                                    <td><strong><?php echo $calc['bandwidth_frequency']; ?> MHz</strong></td>
                                    <td><?php echo $calc['bandwidth_mhz']; ?> MHz</td>
                                    <td><?php echo number_format($calc['transport_throughput'], 2); ?> Mbps</td>
                                    <td><strong><?php echo number_format($calc['ss_throughput'], 2); ?> Mbps</strong></td>
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
                            Voir tous les traitements
                        </a>
                    </div>
                <?php endif; ?>
            </div>
            <!-- Section Dimensionnements -->
            <div class="dashboard-section full-width">
                <h2><i class="fas fa-calculator"></i> Dimensionnements</h2>
                <div class="calculation-buttons flex-column">
                    <a href="parameters.php?type=s1" class="calc-card calc-s1">
                        <div class="calc-icon">
                            <i class="fas fa-signal"></i>
                        </div>
                        <div class="calc-content">
                            <h3>Dimensionnement S1</h3>
                            <span class="calc-status available">Disponible</span>
                        </div>
                    </a>
                    
                    <div class="calc-card calc-ng disabled">
                        <div class="calc-icon">
                            <i class="fas fa-wifi"></i>
                        </div>
                        <div class="calc-content">
                            <h3>Dimensionnement NG</h3>
                            <span class="calc-status coming-soon">Fonctionnalités à venir</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/dashboard.js"></script>
    <script>
        // Créer des icônes télécoms flottantes
        function createFloatingIcon() {
            const icons = [
                'fas fa-broadcast-tower',
                'fas fa-wifi',
                'fas fa-signal',
                'fas fa-satellite-dish',
                'fas fa-network-wired',
                'fas fa-router',
                'fas fa-mobile-alt',
                'fas fa-tower-broadcast'
            ];
            
            const container = document.getElementById('floating-icons');
            const icon = document.createElement('i');
            icon.className = icons[Math.floor(Math.random() * icons.length)] + ' floating-telecom-icon';
            
            // Position aléatoire
            const randomX = Math.random() * 100;
            icon.style.left = randomX + '%';
            icon.style.setProperty('--random-x', (Math.random() - 0.5) * 100 + 'px');
            
            // Délai aléatoire
            icon.style.animationDelay = Math.random() * 5 + 's';
            icon.style.animationDuration = (Math.random() * 5 + 10) + 's';
            
            container.appendChild(icon);
            
            // Supprimer après animation
            setTimeout(() => {
                if (icon.parentNode) {
                    icon.parentNode.removeChild(icon);
                }
            }, 15000);
        }

        // Démarrer les animations
        document.addEventListener('DOMContentLoaded', function() {
            // Créer des icônes périodiquement
            setInterval(createFloatingIcon, 2000);
            
            // Animation d'entrée des éléments
            const elements = document.querySelectorAll('.calc-card, .dashboard-section');
            elements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100 + 300);
            });

            // Gestion du clic sur la carte NG (disabled)
            document.querySelector('.calc-card.calc-ng').addEventListener('click', function(e) {
                e.preventDefault();
                
                // Animation de feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Notification
                showNotification('Les fonctionnalités de dimensionnement NG seront bientôt disponibles !', 'info');
            });
        });

        // Fonction de notification simple
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'info' ? '#3b82f6' : '#10b981'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                z-index: 1000;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                font-weight: 500;
                max-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Animation d'entrée
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Suppression automatique
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        }
    </script>
</body>
</html>