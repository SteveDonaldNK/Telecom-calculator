<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OptiLink - Bienvenue</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }

        .welcome-container {
            text-align: center;
            color: white;
            animation: fadeInUp 1s ease-out;
        }

        .logo-container {
            margin-bottom: 2rem;
            position: relative;
        }

        .logo-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            backdrop-filter: blur(20px);
            border: 3px solid rgba(255, 255, 255, 0.2);
            animation: pulse 3s infinite;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .logo-image i {
            font-size: 4rem;
            color: white;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .app-name {
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1rem;
            text-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            letter-spacing: 3px;
            background: linear-gradient(45deg, #fff, #f0f0f0, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textShine 2s ease-in-out infinite alternate;
        }

        .app-tagline {
            font-size: 1.5rem;
            opacity: 0.9;
            font-weight: 400;
            margin-bottom: 3rem;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .action-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .floating-icons {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .floating-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.1);
            animation: float 15s infinite linear;
            font-size: 2rem;
        }

        .floating-icon:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .floating-icon:nth-child(2) { top: 70%; left: 85%; animation-delay: 3s; }
        .floating-icon:nth-child(3) { top: 90%; left: 15%; animation-delay: 6s; }
        .floating-icon:nth-child(4) { top: 20%; left: 80%; animation-delay: 9s; }
        .floating-icon:nth-child(5) { top: 60%; left: 5%; animation-delay: 12s; }

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

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(255, 255, 255, 0.3);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 20px rgba(255, 255, 255, 0);
            }
        }

        @keyframes textShine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }

        @keyframes float {
            0% {
                transform: translateY(100vh) translateX(-100px) rotate(0deg);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% {
                transform: translateY(-100px) translateX(100px) rotate(360deg);
                opacity: 0;
            }
        }

        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: particleFloat 20s infinite linear;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% {
                transform: translateY(-10vh) translateX(50px);
                opacity: 0;
            }
        }

        @media (max-width: 768px) {
            .app-name {
                font-size: 2.5rem;
            }
            
            .app-tagline {
                font-size: 1.2rem;
            }
            
            .action-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                min-width: 200px;
            }
            
            .logo-image {
                width: 120px;
                height: 120px;
            }
            
            .logo-image i {
                font-size: 3rem;
            }
        }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap" rel="stylesheet">
</head>
<body>
    <div class="particles" id="particles"></div>
    
    <div class="floating-icons">
        <i class="fas fa-broadcast-tower floating-icon"></i>
        <i class="fas fa-wifi floating-icon"></i>
        <i class="fas fa-satellite-dish floating-icon"></i>
        <i class="fas fa-network-wired floating-icon"></i>
        <i class="fas fa-signal floating-icon"></i>
    </div>

    <div class="welcome-container">
        <div class="logo-container">
            <div class="logo-image">
                <i class="fas fa-link"></i>
            </div>
        </div>
        
        <h1 class="app-name">OptiLink</h1>
        <p class="app-tagline">Optimisation des liaisons télécoms</p>
        
        <div class="action-buttons">
            <a href="splash.php" class="btn btn-primary">
                <i class="fas fa-rocket"></i>
                Démarrer l'application
            </a>
            <a href="about.php" class="btn">
                <i class="fas fa-info-circle"></i>
                En savoir plus
            </a>
        </div>
    </div>

    <script>
        // Créer des particules flottantes
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Créer des icônes flottantes supplémentaires
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
            
            const icon = document.createElement('i');
            icon.className = icons[Math.floor(Math.random() * icons.length)] + ' floating-icon';
            icon.style.left = Math.random() * 100 + '%';
            icon.style.fontSize = (Math.random() * 1 + 1.5) + 'rem';
            icon.style.animationDuration = (Math.random() * 5 + 10) + 's';
            
            document.querySelector('.floating-icons').appendChild(icon);
            
            // Supprimer après animation
            setTimeout(() => {
                if (icon.parentNode) {
                    icon.parentNode.removeChild(icon);
                }
            }, 15000);
        }

        // Effets visuels interactifs
        document.addEventListener('mousemove', (e) => {
            const logo = document.querySelector('.logo-image');
            const rect = logo.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (y / rect.height) * 20;
            const rotateY = (x / rect.width) * -20;
            
            logo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Initialisation
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            
            // Créer des icônes périodiquement
            setInterval(createFloatingIcon, 3000);
            
            // Animation d'entrée séquentielle
            const elements = ['.logo-container', '.app-name', '.app-tagline', '.action-buttons'];
            elements.forEach((selector, index) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        element.style.transition = 'all 0.8s ease-out';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, index * 200 + 500);
                }
            });
        });
    </script>
</body>
</html>