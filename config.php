<?php
// Configuration de la base de données et sessions
session_start();

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'telecom_calculator');
define('DB_USER', 'root'); // À modifier selon ta configuration
define('DB_PASS', '');     // À modifier selon ta configuration

// Classe pour la gestion de la base de données
class Database {
    private $pdo;
    
    public function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            die("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }
    
    public function getPDO() {
        return $this->pdo;
    }
}

// Fonctions utilitaires
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: signin.php');
        exit();
    }
}

function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function redirectTo($page) {
    header("Location: $page");
    exit();
}

// Configuration de l'application
define('APP_NAME', 'Telecom Calculator');
define('BASE_URL', 'http://localhost/telecom_calculator/'); // À modifier selon ton environnement

// Initialisation de la base de données
$db = new Database();
?>
