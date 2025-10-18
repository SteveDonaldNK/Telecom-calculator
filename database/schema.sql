-- Base de données pour l'application OptiLink
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS optilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE optilink;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hash du mot de passe
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des calculs 4G
CREATE TABLE calculations_4g (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bandwidth_frequency INT NOT NULL, -- 1800, 2100, 2600
    bandwidth_mhz DECIMAL(4,1) NOT NULL, -- 5, 10, 15, 20
    radio_mac_throughput DECIMAL(10,2) NOT NULL,
    transport_efficiency DECIMAL(4,3) DEFAULT 0.95, -- Valeur par défaut
    transport_throughput DECIMAL(10,2) NOT NULL,
    control_plane DECIMAL(10,2) NOT NULL,
    ss_throughput DECIMAL(10,2) NOT NULL,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table de configuration des bandes passantes (référence)
CREATE TABLE bandwidth_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bandwidth_mhz DECIMAL(4,1) NOT NULL,
    mac_throughput_mbps DECIMAL(10,2) NOT NULL
);

-- Insertion des données de référence pour les bandes passantes
INSERT INTO bandwidth_config (bandwidth_mhz, mac_throughput_mbps) VALUES
(5.0, 21.6),
(10.0, 50.7),
(15.0, 74.5),
(20.0, 102.9);

-- Index pour optimiser les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_calculations_user_id ON calculations_4g(user_id);
CREATE INDEX idx_calculations_date ON calculations_4g(calculation_date);

-- Structure de la table `stations`
CREATE TABLE `stations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `capacite_totale_cartes` FLOAT NOT NULL COMMENT 'Capacité totale des cartes d''accès en Gbps',
  `capacite_utilisee_cartes` FLOAT NOT NULL DEFAULT 0 COMMENT 'Capacité utilisée sur les cartes en Gbps',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom_unique` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Structure de la table `liens_wdm`
CREATE TABLE `liens_wdm` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `station_depart_id` INT(11) NOT NULL,
  `station_arrivee_id` INT(11) NOT NULL,
  `capacite_totale` FLOAT NOT NULL COMMENT 'Capacité totale du lien en Gbps',
  `capacite_utilisee` FLOAT NOT NULL DEFAULT 0 COMMENT 'Capacité utilisée sur le lien en Gbps',
  PRIMARY KEY (`id`),
  KEY `station_depart_id` (`station_depart_id`),
  KEY `station_arrivee_id` (`station_arrivee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contraintes pour la table `liens_wdm`
ALTER TABLE `liens_wdm`
  ADD CONSTRAINT `fk_station_arrivee` FOREIGN KEY (`station_arrivee_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_station_depart` FOREIGN KEY (`station_depart_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;