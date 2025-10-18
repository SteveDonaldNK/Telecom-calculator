<?php
require_once 'config.php';
requireLogin();

// Récupérer le débit depuis l'URL, s'il est passé
$throughput_mbps = isset($_GET['throughput']) ? floatval($_GET['throughput']) : '';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réservation WDM - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css"> <!-- On utilise votre CSS existant -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

    <style>
        /* Styles spécifiques pour améliorer la page de réservation tout en respectant votre design */
        body {
            background-color: #f4f7f6; /* Un fond légèrement gris comme sur les dashboards */
        }
        .main-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem; /* Ajout de padding pour les écrans mobiles */
        }
        .page-header {
            margin-bottom: 2rem;
            text-align: center;
        }
        .page-header h1 {
            font-size: 2.2rem;
            color: #333;
        }
        .card {
            background: #fff;
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Ombre douce comme vos cards de résultats */
        }
        .card h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #0056b3; /* Utilisation du bleu primaire pour les titres de section */
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 0.5rem;
        }
        .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        .network-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .network-table th, .network-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eef0f2;
            text-align: left;
        }
        .network-table th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .network-table tr:hover {
            background-color: #f8f9fa;
        }
        .capacity-bar {
            width: 100%;
            height: 18px;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }
        .capacity-bar div {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.75rem;
            transition: width 0.5s ease-in-out;
        }
        .capacity-bar .high { background-color: #28a745; } /* Vert */
        .capacity-bar .medium { background-color: #ffc107; } /* Jaune */
        .capacity-bar .low { background-color: #dc3545; } /* Rouge */
        
        .result-zone {
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 5px;
            display: none;
            text-align: center;
            font-weight: 500;
        }
        .result-zone.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .result-zone.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .network-container {
            position: relative; /* Nécessaire pour positionner les boutons de zoom */
        }

        @media (max-width: 992px) {
            .grid-container { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <i class="fas fa-broadcast-tower"></i>
                <span><?php echo APP_NAME; ?></span>
            </div>
            <div class="nav-user">
                <a href="dashboard.php" class="btn btn-outline"><i class="fas fa-home"></i> Dashboard</a>
                <a href="logout.php" class="btn btn-outline"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
            </div>
        </div>
    </nav>

    <div class="main-container">
        <div class="page-header">
            <h1><i class="fas fa-network-wired"></i> Réservation de Capacité WDM</h1>
        </div>

        <!-- Section 1: Formulaire de Réservation -->
        <div class="card">
            <h2><i class="fas fa-edit"></i> Nouvelle Réservation</h2>
            <form id="booking-form">
                <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: flex-end;">
                    <div class="form-group">
                        <label for="source_station">Station de départ</label>
                        <select id="source_station" name="source" required></select>
                    </div>
                    <div class="form-group">
                        <label for="destination_station">Station d'arrivée</label>
                        <select id="destination_station" name="destination" required></select>
                    </div>
                    <div class="form-group">
                        <label for="throughput">Débit requis (Mbps)</label>
                        <input type="number" id="throughput" name="throughput" value="<?php echo $throughput_mbps; ?>" required placeholder="Ex: 10000">
                    </div>
                    <div class="form-actions" style="display: flex; gap: 0.5rem;">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-check"></i> Réserver</button>
                        <button type="button" id="refresh-btn" class="btn btn-outline"><i class="fas fa-sync-alt"></i></button>
                    </div>
                </div>
            </form>
            <div id="result-zone" class="result-zone"></div>
        </div>

        <div class="card">
            <h2><i class="fas fa-project-diagram"></i> Représentation des Liens WDM</h2>
            <div id="network-diagram" style="height: 350px !important;"></div>
            <div class="zoom-controls">
                <button id="zoom-in-btn" class="btn btn-outline" title="Zoom avant">+</button>
                <button id="zoom-out-btn" class="btn btn-outline" title="Zoom arrière">-</button>
                <button id="fit-btn" class="btn btn-outline" title="Vue d'ensemble"><i class="fas fa-expand-arrows-alt"></i></button>
            </div>
        </div>

        <!-- Section 2: État du Réseau -->
        <div class="card">
            <h2><i class="fas fa-chart-bar"></i> État Actuel du Réseau</h2>
            <div class="grid-container">
                <div style="height: 500px; overflow-y: auto;">
                    <h3 style="position: sticky; top: 0; background: #FFF;">État des Cartes d'Accès (Stations)</h3>
                    <table class="network-table">
                        <thead>
                            <tr>
                                <th>Station ADM</th>
                                <th>Disponible (Gbps)</th>
                                <th>Utilisation</th>
                            </tr>
                        </thead>
                        <tbody id="stations-table-body"></tbody>
                    </table>
                </div>
                <div style="height: 500px; overflow-y: auto;">
                    <h3 style="position: sticky; top: 0; background: #FFF;">État des Liens WDM</h3>
                    <table class="network-table">
                        <thead>
                            <tr>
                                <th>Lien (Départ -> Arrivée)</th>
                                <th>Disponible (Gbps)</th>
                                <th>Utilisation</th>
                            </tr>
                        </thead>
                        <tbody id="liens-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <script src="js/reservation.js"></script>
</body>
</html>