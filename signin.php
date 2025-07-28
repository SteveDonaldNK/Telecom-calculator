<?php
require_once 'config.php';

// Rediriger si déjà connecté
if (isLoggedIn()) {
    redirectTo('dashboard.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login = sanitizeInput($_POST['login']); // Peut être username ou email
    $password = $_POST['password'];
    
    if (empty($login) || empty($password)) {
        $error = 'Tous les champs sont obligatoires.';
    } else {
        try {
            $pdo = $db->getPDO();
            
            // Rechercher l'utilisateur par username ou email
            $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$login, $login]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                // Connexion réussie
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                redirectTo('dashboard.php');
            } else {
                $error = 'Identifiants incorrects.';
            }
        } catch (PDOException $e) {
            $error = 'Erreur de connexion: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="auth-body">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <i class="fas fa-link"></i>
                <h1><?php echo APP_NAME; ?></h1>
                <p>Connectez-vous à votre compte</p>
            </div>
            
            <?php if ($error): ?>
                <div class="alert alert-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form class="auth-form" method="POST" action="">
                <div class="form-group">
                    <label for="login">Nom d'utilisateur ou Email</label>
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" id="login" name="login" required 
                               value="<?php echo isset($_POST['login']) ? htmlspecialchars($_POST['login']) : ''; ?>">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <div class="input-group">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" required>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                    <i class="fas fa-sign-in-alt"></i>
                    Se connecter
                </button>
            </form>
            
            <div class="auth-footer">
                <p>Pas encore de compte? <a href="signup.php">S'inscrire</a></p>
            </div>
        </div>
    </div>
    
    <script src="js/auth.js"></script>
</body>
</html>