-- ===================================================================
-- SCRIPT COMPLET DE RÉINITIALISATION ET PEUPLEMENT AVEC LES NOUVELLES DONNÉES
-- ===================================================================

-- 1. Désactivation temporaire des contraintes pour permettre la suppression
SET FOREIGN_KEY_CHECKS=0;

-- 2. Suppression des tables si elles existent
DROP TABLE IF EXISTS `liens_wdm`;
DROP TABLE IF EXISTS `stations`;

-- 3. Réactivation des contraintes
SET FOREIGN_KEY_CHECKS=1;

-- ===================================================================
-- CRÉATION DES TABLES
-- ===================================================================

CREATE TABLE `stations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `capacite_totale_cartes` FLOAT NOT NULL COMMENT 'Capacité totale des cartes d''accès en Gbps',
  `capacite_utilisee_cartes` FLOAT NOT NULL DEFAULT 0 COMMENT 'Capacité utilisée sur les cartes en Gbps',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom_unique` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

ALTER TABLE `liens_wdm`
  ADD CONSTRAINT `fk_station_arrivee` FOREIGN KEY (`station_arrivee_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_station_depart` FOREIGN KEY (`station_depart_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ===================================================================
-- INSERTION DES DONNÉES DE TEST
-- ===================================================================

START TRANSACTION;

--
-- Insertion des données dans la table `stations`
--
INSERT INTO `stations` (`nom`, `capacite_totale_cartes`, `capacite_utilisee_cartes`) VALUES
('KOUSSERI NBN2', 120, 90),
('MAROUA NBN2', 80, 40),
('GAROUA BB3', 120, 120),
('TCHOLLIRE BB3', 40, 40),
('TOUBORO BB3', 80, 40),
('NGAOUNDERE BB3', 120, 90),
('BANYO WDM', 40, 40),
('GANGUI BB3', 300, 70),
('GAROUA BOULAI', 80, 40),
('BELABO', 40, 10),
('BERTOUA BB3', 80, 40),
('YAOUNDE BB3', 480, 420),
('OBALA', 40, 20),
('BIYEM ASSI', 120, 30),
('JAMOT', 240, 100),
('NKOMO', 80, 10),
('YDE FH', 160, 160),
('ZAMENGOE', 80, 50),
('BAFIA', 80, 40),
('EBOLOWA', 80, 30),
('KRIBI', 340, 330),
('EDEA BB3', 120, 100),
('BOUMNYEBEL BB3', 40, 40),
('DOUALA BB3', 480, 410),
('AKWA CTN', 160, 110),
('BASSA', 0, 0),
('AKWA NORD', 0, 0),
('BEPANDA', 200, 180),
('NKONGSAMBA BB3', 60, 20),
('BANGANGTE BB3', 40, 40),
('BAFOUSSAM', 240, 220),
('BAMENDA BB3', 80, 20),
('BUEA', 40, 20),
('BATOKE', 200, 110),
('YDE CTN', 160, 160);

--
-- Insertion des données dans la table `liens_wdm`
--
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), 100, 100),
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), 100, 85),
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 85),
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='MAROUA NBN2'), 100, 100),
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 65),
((SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 100, 95),
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 20),
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 95),
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), 120, 95),
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 120, 105),
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 95),
((SELECT id FROM stations WHERE nom='BANYO WDM'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 120, 95),
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 120, 105),
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='GAROUA BOULAI'), 100, 100),
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 5),
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 65),
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 95),
((SELECT id FROM stations WHERE nom='GAROUA BOULAI'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 20),
((SELECT id FROM stations WHERE nom='GAROUA BOULAI'), (SELECT id FROM stations WHERE nom='BERTOUA BB3'), 120, 100),
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 100, 5),
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 5),
((SELECT id FROM stations WHERE nom='BERTOUA BB3'), (SELECT id FROM stations WHERE nom='GAROUA BOULAI'), 120, 95),
((SELECT id FROM stations WHERE nom='BERTOUA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 120, 120),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='EBOLOWA'), 120, 25),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BERTOUA BB3'), 100, 100),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 100),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 200, 175),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='OBALA'), 100, 95),
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 5),
((SELECT id FROM stations WHERE nom='EBOLOWA'), (SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), 100, 5),
((SELECT id FROM stations WHERE nom='EBOLOWA'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 120, 25),
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 200, 185),
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 200, 175),
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='BEPANDA'), 100, 85),
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 20, 20),
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), 120, 100),
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 200, 100),
((SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), (SELECT id FROM stations WHERE nom='EBOLOWA'), 20, 20),
((SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='OBALA'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 40, 20),
((SELECT id FROM stations WHERE nom='BAFIA'), (SELECT id FROM stations WHERE nom='OBALA'), 20, 10),
((SELECT id FROM stations WHERE nom='BAFIA'), (SELECT id FROM stations WHERE nom='BANGANGTE BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='BANGANGTE BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 20, 20),
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='BANGANGTE BB3'), 300, 240),
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 120, 100),
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='BAMENDA BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='NKONGSAMBA BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='BAMENDA BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 20, 20),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BUEA'), 20, 20),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 20, 20),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BAMENDA BB3'), 100, 100),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 100, 95),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BATOKE'), 100, 95),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BASSA'), 100, 100),
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 120, 85),
((SELECT id FROM stations WHERE nom='BATOKE'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 200, 80),
((SELECT id FROM stations WHERE nom='BATOKE'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 20),
((SELECT id FROM stations WHERE nom='AKWA NORD'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 40, 40),
((SELECT id FROM stations WHERE nom='YDE CTN'), (SELECT id FROM stations WHERE nom='YDE FH'), 200, 130),
((SELECT id FROM stations WHERE nom='YDE CTN'), (SELECT id FROM stations WHERE nom='JAMOT'), 100, 75),
((SELECT id FROM stations WHERE nom='YDE FH'), (SELECT id FROM stations WHERE nom='YDE CTN'), 200, 130),
((SELECT id FROM stations WHERE nom='YDE FH'), (SELECT id FROM stations WHERE nom='ZAMENGOE'), 100, 100),
((SELECT id FROM stations WHERE nom='JAMOT'), (SELECT id FROM stations WHERE nom='YDE CTN'), 100, 75),
((SELECT id FROM stations WHERE nom='JAMOT'), (SELECT id FROM stations WHERE nom='YDE FH'), 200, 130),
((SELECT id FROM stations WHERE nom='ZAMENGOE'), (SELECT id FROM stations WHERE nom='YDE FH'), 100, 75),
((SELECT id FROM stations WHERE nom='ZAMENGOE'), (SELECT id FROM stations WHERE nom='YDE CTN'), 100, 50),
((SELECT id FROM stations WHERE nom='NKOMO'), (SELECT id FROM stations WHERE nom='JAMOT'), 100, 75),
((SELECT id FROM stations WHERE nom='NKOMO'), (SELECT id FROM stations WHERE nom='BIYEM ASSI'), 100, 75),
((SELECT id FROM stations WHERE nom='BIYEM ASSI'), (SELECT id FROM stations WHERE nom='NKOMO'), 100, 75),
((SELECT id FROM stations WHERE nom='BIYEM ASSI'), (SELECT id FROM stations WHERE nom='JAMOT'), 100, 75),
((SELECT id FROM stations WHERE nom='AKWA NORD'), (SELECT id FROM stations WHERE nom='BASSA'), 100, 100),
((SELECT id FROM stations WHERE nom='AKWA NORD'), (SELECT id FROM stations WHERE nom='AKWA CTN'), 45, 45),
((SELECT id FROM stations WHERE nom='BASSA'), (SELECT id FROM stations WHERE nom='AKWA CTN'), 45, 45),
((SELECT id FROM stations WHERE nom='BEPANDA'), (SELECT id FROM stations WHERE nom='AKWA CTN'), 100, 100),
((SELECT id FROM stations WHERE nom='BEPANDA'), (SELECT id FROM stations WHERE nom='KRIBI'), 100, 85);

COMMIT;