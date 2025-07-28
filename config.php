<?php
// Configuration de la base de données et sessions
session_start();

// Configure PHP error logging
ini_set('display_errors', 'On'); // Disable error display in production
ini_set('display_startup_errors', 0);
error_reporting(E_ALL); // Log all errors
$log_dir = __DIR__ . '/logs'; // Logs directory path
$log_file = $log_dir . '/php_errors.log'; // Log file path

// Create logs directory if it doesn't exist
if (!file_exists($log_dir)) {
    mkdir($log_dir, 0777, true); // Create directory with write permissions
    chmod($log_dir, 0777); // Ensure directory is writable
}

// Set log file and ensure it's writable
ini_set('error_log', $log_file);
if (!file_exists($log_file)) {
    touch($log_file); // Create log file if it doesn't exist
}
chmod($log_file, 0666); // Ensure log file is writable by web server

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'optilink');
define('DB_USER', 'root'); // À modifier selon ta configuration
define('DB_PASS', '123@bc9Z');     // À modifier selon ta configuration

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
            error_log("Erreur de connexion à la base de données: " . $e->getMessage());
            die("Erreur de connexion à la base de données.");
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
define('APP_NAME', 'OptiLink');
define('BASE_URL', 'http://localhost/'); // À modifier selon ton environnement

// Initialisation de la base de données
$db = new Database();
?>