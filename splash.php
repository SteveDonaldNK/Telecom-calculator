<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OptiLink - Chargement</title>
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

        .splash-container {
            text-align: center;
            color: white;
            animation: fadeInUp 1s ease-out;
        }

        .logo-container {
            margin-bottom: 2rem;
            position: relative;
        }

        .logo-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            animation: pulse 2s infinite;
        }

        .logo-image i {
            font-size: 3rem;
            color: white;
        }

        .app-name {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            letter-spacing: 2px;
        }

        .app-tagline {
            font-size: 1.25rem;
            opacity: 0.9;
            font-weight: 300;
            margin-bottom: 2rem;
        }

        .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
        }

        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #fff, #f0f0f0);
            border-radius: 2px;
            width: 0%;
            animation: loading 3s ease-in-out forwards;
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
            animation: float 8s infinite linear;
        }

        .floating-icon:nth-child(1) {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
            font-size: 2rem;
        }

        .floating-icon:nth-child(2) {
            top: 60%;
            left: 80%;
            animation-delay: 2s;
            font-size: 1.5rem;
        }

        .floating-icon:nth-child(3) {
            top: 80%;
            left: 20%;
            animation-delay: 4s;
            font-size: 2.5rem;
        }

        .floating-icon:nth-child(4) {
            top: 30%;
            left: 70%;
            animation-delay: 1s;
            font-size: 1.8rem;
        }

        .floating-icon:nth-child(5) {
            top: 70%;
            left: 60%;
            animation-delay: 3s;
            font-size: 2rem;
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

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
            }

            50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
            }
        }

        @keyframes loading {
            0% {
                width: 0%;
            }

            50% {
                width: 70%;
            }

            100% {
                width: 100%;
            }
        }

        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }

            10% {
                opacity: 1;
            }

            90% {
                opacity: 1;
            }

            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        .version {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
        }

        @media (max-width: 768px) {
            .app-name {
                font-size: 2.5rem;
            }

            .app-tagline {
                font-size: 1rem;
            }

            .logo-image {
                width: 100px;
                height: 100px;
            }

            .logo-image i {
                font-size: 2.5rem;
            }
        }
    </style>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
</head>

<body>
    <div class="floating-icons">
        <i class="fas fa-broadcast-tower floating-icon"></i>
        <i class="fas fa-wifi floating-icon"></i>
        <i class="fas fa-signal floating-icon"></i>
        <i class="fas fa-satellite-dish floating-icon"></i>
        <i class="fas fa-network-wired floating-icon"></i>
    </div>

    <div class="splash-container">
        <div class="logo-container">
            <div class="logo-image">
                <img src="images/logo.png" alt="OptiLink Logo" style="width: 80px; height: 80px; border-radius: 50%;">
            </div>
        </div>

        <h1 class="app-name">OptiLink</h1>
        <p class="app-tagline">Optimisation des liaisons télécoms</p>

        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
    </div>

    <div class="version">Version 2.0.0</div>

    <script>
        // Redirection automatique après 3 secondes
        setTimeout(() => {
            // Vérifier si l'utilisateur est connecté
            fetch('check_session.php')
                .then(response => response.json())
                .then(data => {
                    if (data.logged_in) {
                        window.location.href = 'dashboard.php';
                    } else {
                        window.location.href = 'signin.php';
                    }
                })
                .catch(() => {
                    // En cas d'erreur, rediriger vers la page de connexion
                    window.location.href = 'signin.php';
                });
        }, 3000);

        // Animation des icônes flottantes continues
        function createFloatingIcon() {
            const icons = [
                'fas fa-broadcast-tower',
                'fas fa-wifi',
                'fas fa-signal',
                'fas fa-satellite-dish',
                'fas fa-network-wired',
                'fas fa-router',
                'fas fa-mobile-alt'
            ];

            const icon = document.createElement('i');
            icon.className = icons[Math.floor(Math.random() * icons.length)] + ' floating-icon';
            icon.style.left = Math.random() * 100 + '%';
            icon.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            icon.style.animationDuration = (Math.random() * 4 + 6) + 's';

            document.querySelector('.floating-icons').appendChild(icon);

            // Supprimer l'icône après l'animation
            setTimeout(() => {
                if (icon.parentNode) {
                    icon.parentNode.removeChild(icon);
                }
            }, 10000);
        }

        // Créer des icônes flottantes périodiquement
        setInterval(createFloatingIcon, 2000);
    </script>
</body>

</html>