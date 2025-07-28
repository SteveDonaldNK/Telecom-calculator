<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>À propos - OptiLink</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            animation: fadeInDown 1s ease-out;
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 1rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .header p {
            font-size: 1.25rem;
            opacity: 0.9;
        }

        .content-grid {
            display: grid;
            gap: 2rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            margin-bottom: 3rem;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            animation: fadeInUp 1s ease-out;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            background: rgba(255, 255, 255, 0.15);
        }

        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #fff;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        .feature-card p {
            opacity: 0.9;
            margin-bottom: 1rem;
        }

        .feature-list {
            list-style: none;
            padding: 0;
        }

        .feature-list li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
        }

        .feature-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        .tech-stack {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: fadeInUp 1.2s ease-out;
        }

        .tech-stack h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
        }

        .tech-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .tech-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tech-item i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
        }

        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-weight: 600;
            transition: all 0.3s ease;
            margin-top: 2rem;
        }

        .back-button:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .center {
            text-align: center;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 1rem;
            }
            
            .feature-card {
                padding: 1.5rem;
            }
        }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>À propos d'OptiLink</h1>
            <p>Solution professionnelle d'optimisation des liaisons télécoms</p>
        </div>

        <div class="content-grid">
            <div class="feature-card">
                <i class="fas fa-signal feature-icon"></i>
                <h3>Dimensionnement S1</h3>
                <p>Calculez précisément les débits et performances des liaisons S1 selon les standards télécoms.</p>
                <ul class="feature-list">
                    <li>Support des bandes 1800/2100/2600 MHz</li>
                    <li>Largeurs de spectre : 5, 10, 15, 20 MHz</li>
                    <li>Calculs avec Extension Ratio optimisé</li>
                    <li>Résultats détaillés et exportables</li>
                </ul>
            </div>

            <div class="feature-card">
                <i class="fas fa-wifi feature-icon"></i>
                <h3>Dimensionnement NG</h3>
                <p>Prochainement disponible : dimensionnement des réseaux Next Generation.</p>
                <ul class="feature-list">
                    <li>Calculs 5G NR avancés</li>
                    <li>Support multi-bandes</li>
                    <li>Configurations MIMO</li>
                    <li>Analyses temps réel</li>
                </ul>
            </div>

            <div class="feature-card">
                <i class="fas fa-chart-line feature-icon"></i>
                <h3>Analyse & Reporting</h3>
                <p>Outils d'analyse avancés pour optimiser vos réseaux télécoms.</p>
                <ul class="feature-list">
                    <li>Historique complet des traitements</li>
                    <li>Export PDF professionnel</li>
                    <li>Graphiques de performance</li>
                    <li>Rapports personnalisés</li>
                </ul>
            </div>

            <div class="feature-card">
                <i class="fas fa-shield-alt feature-icon"></i>
                <h3>Sécurité & Fiabilité</h3>
                <p>Plateforme sécurisée avec authentification robuste et données protégées.</p>
                <ul class="feature-list">
                    <li>Authentification sécurisée</li>
                    <li>Données chiffrées</li>
                    <li>Sauvegarde automatique</li>
                    <li>Interface responsive</li>
                </ul>
            </div>
        </div>

        <div class="tech-stack">
            <h2>Technologies utilisées</h2>
            <div class="tech-grid">
                <div class="tech-item">
                    <i class="fab fa-php"></i>
                    <div>PHP 7.4+</div>
                </div>
                <div class="tech-item">
                    <i class="fas fa-database"></i>
                    <div>MySQL</div>
                </div>
                <div class="tech-item">
                    <i class="fab fa-js-square"></i>
                    <div>JavaScript ES6+</div>
                </div>
                <div class="tech-item">
                    <i class="fab fa-css3-alt"></i>
                    <div>CSS3 Moderne</div>
                </div>
                <div class="tech-item">
                    <i class="fab fa-html5"></i>
                    <div>HTML5</div>
                </div>
                <div class="tech-item">
                    <i class="fas fa-mobile-alt"></i>
                    <div>Responsive</div>
                </div>
            </div>
        </div>

        <div class="center">
            <a href="index.php" class="back-button">
                <i class="fas fa-arrow-left"></i>
                Retour à l'accueil
            </a>
        </div>
    </div>

    <script>
        // Animation des cartes au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);

        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease-out';
                observer.observe(card);
            });
        });
    </script>
</body>
</html>