-- ===================================================================
-- SCRIPT DE RÉINITIALISATION ET INSERTION PROVENANT DE BD.xlsx
-- ===================================================================

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `liens_wdm`;
DROP TABLE IF EXISTS `stations`;

SET FOREIGN_KEY_CHECKS=1;

-- ===================================================================
-- CRÉATION DES TABLES (identique à votre schéma)
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

START TRANSACTION;

-- Insertion des données dans la table `stations`
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
('BATOKE', 200, 210),
('YDE CTN', 160, 160),
('BOUMBYEBEL BB3', 0, 0),
('MBANGA BB3', 0, 0),
('LIMBE', 0, 0);

-- Insertion des données dans la table `liens_wdm`
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), (SELECT id FROM stations WHERE nom='MAROUA NBN2'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), (SELECT id FROM stations WHERE nom='MAROUA NBN2'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='KOUSSERI NBN2'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MAROUA NBN2'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='MAROUA NBN2'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='MAROUA NBN2'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 65);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 55);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 55);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='TOUBORO BB3'), (SELECT id FROM stations WHERE nom='TCHOLLIRE BB3'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='BANYO WDM'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BANYO WDM'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BANYO WDM'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='NGAOUNDERE BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='GAROUA BOULAI'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 5);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='GAROUA BB3'), 100, 65);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GANGUI BB3'), (SELECT id FROM stations WHERE nom='TOUBORO BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BOULAI'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='GAROUA BOULAI'), (SELECT id FROM stations WHERE nom='BERTOUA BB3'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='GANGUI BB3'), 100, 5);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 100, 5);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BELABO'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BERTOUA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BERTOUA BB3'), (SELECT id FROM stations WHERE nom='GAROUA BOULAI'), 120, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 200, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='EBOLOWA'), 120, 25);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BERTOUA BB3'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 300, 240);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 200, 185);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 200, 175);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='OBALA'), 20, 10);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BELABO'), 100, 5);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YAOUNDE BB3'), (SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EBOLOWA'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 120, 25);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EBOLOWA'), (SELECT id FROM stations WHERE nom='KRIBI'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 200, 185);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 200, 175);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='BEPANDA'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='KRIBI'), (SELECT id FROM stations WHERE nom='EBOLOWA'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='BOUMNYEBEL BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 200, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='EDEA BB3'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BOUMBYEBEL BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BOUMBYEBEL BB3'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='OBALA'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 20, 10);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='OBALA'), (SELECT id FROM stations WHERE nom='BAFIA'), 20, 10);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFIA'), (SELECT id FROM stations WHERE nom='OBALA'), 20, 10);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFIA'), (SELECT id FROM stations WHERE nom='BANGANGTE BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BANGANGTE BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BANGANGTE BB3'), (SELECT id FROM stations WHERE nom='BAFIA'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 200, 165);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 300, 240);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='BANYO WDM'), 120, 105);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='BAMENDA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='BANGANGTE BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAFOUSSAM'), (SELECT id FROM stations WHERE nom='NKONGSAMBA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BAMENDA BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BUEA'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BUEA'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='MBANGA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 200, 165);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='YAOUNDE BB3'), 100, 100);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BATOKE'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='BATOKE'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='KRIBI'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='LIMBE'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='DOUALA BB3'), (SELECT id FROM stations WHERE nom='EDEA BB3'), 120, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BATOKE'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BATOKE'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MBANGA BB3'), (SELECT id FROM stations WHERE nom='DOUALA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='MBANGA BB3'), (SELECT id FROM stations WHERE nom='NKONGSAMBA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NKONGSAMBA BB3'), (SELECT id FROM stations WHERE nom='MBANGA BB3'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NKONGSAMBA BB3'), (SELECT id FROM stations WHERE nom='BAFOUSSAM'), 20, 20);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YDE FH'), (SELECT id FROM stations WHERE nom='YDE CTN'), 200, 185);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YDE FH'), (SELECT id FROM stations WHERE nom='JAMOT'), 200, 130);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YDE CTN'), (SELECT id FROM stations WHERE nom='YDE FH'), 200, 185);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YDE CTN'), (SELECT id FROM stations WHERE nom='ZAMENGOE'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='YDE CTN'), (SELECT id FROM stations WHERE nom='BIYEM ASSI'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='JAMOT'), (SELECT id FROM stations WHERE nom='NKOMO'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='JAMOT'), (SELECT id FROM stations WHERE nom='YDE FH'), 200, 130);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='JAMOT'), (SELECT id FROM stations WHERE nom='ZAMENGOE'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='ZAMENGOE'), (SELECT id FROM stations WHERE nom='YDE CTN'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='ZAMENGOE'), (SELECT id FROM stations WHERE nom='JAMOT'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NKOMO'), (SELECT id FROM stations WHERE nom='JAMOT'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='NKOMO'), (SELECT id FROM stations WHERE nom='BIYEM ASSI'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BIYEM ASSI'), (SELECT id FROM stations WHERE nom='YDE CTN'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BIYEM ASSI'), (SELECT id FROM stations WHERE nom='NKOMO'), 100, 75);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='AKWA CTN'), (SELECT id FROM stations WHERE nom='BASSA'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='AKWA CTN'), (SELECT id FROM stations WHERE nom='BEPANDA'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='AKWA NORD'), (SELECT id FROM stations WHERE nom='BASSA'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='AKWA NORD'), (SELECT id FROM stations WHERE nom='BEPANDA'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BASSA'), (SELECT id FROM stations WHERE nom='AKWA CTN'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BASSA'), (SELECT id FROM stations WHERE nom='AKWA NORD'), 100, 45);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BASSA'), (SELECT id FROM stations WHERE nom='AKWA CTN'), 100, 95);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BEPANDA'), (SELECT id FROM stations WHERE nom='KRIBI'), 100, 85);
INSERT INTO `liens_wdm` (`station_depart_id`, `station_arrivee_id`, `capacite_totale`, `capacite_utilisee`) VALUES
((SELECT id FROM stations WHERE nom='BEPANDA'), (SELECT id FROM stations WHERE nom='AKWA NORD'), 100, 45);

COMMIT;
