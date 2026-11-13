-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: celdi
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `prospects`
--

DROP TABLE IF EXISTS `prospects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prospects` (
  `idprospects` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `telephone` varchar(54) NOT NULL,
  `email` varchar(100) NOT NULL,
  `source` varchar(45) NOT NULL,
  `statut` enum('NOUVEAU','CONTACTE','CLIENT','PERDU') NOT NULL DEFAULT 'NOUVEAU',
  `assigned_to` int DEFAULT NULL,
  PRIMARY KEY (`idprospects`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_prospects_users_idx` (`assigned_to`),
  CONSTRAINT `fk_prospects_users` FOREIGN KEY (`assigned_to`) REFERENCES `utilisateurs` (`idusers`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prospects`
--

LOCK TABLES `prospects` WRITE;
/*!40000 ALTER TABLE `prospects` DISABLE KEYS */;
INSERT INTO `prospects` VALUES (13,'lili','0022655907423','lucienneo133@gmail.com','v','CONTACTE',2),(15,'lolo','01192739','grace@gmail.com','facebook','CONTACTE',2),(16,'Pulcherie','55907423','d@gmail.com','whatsaap','PERDU',2),(17,'lili','0022655907423','j@mail.com','message','CLIENT',2);
/*!40000 ALTER TABLE `prospects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(200) NOT NULL,
  `role` enum('admin','commercial','responsable') NOT NULL,
  PRIMARY KEY (`idusers`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (1,'Alice','alice@gmail.com','$2a$10$cgJcDfWeXDWwYqnTF6t3SO0IeIcoBVXzu3DkEN5HjoGDBGqpQU/4e','admin'),(2,'Awa','awa@gmail.com','$2a$10$ssvtF3rNSiq233uGd9xQCO97.lc2ZohhCr7Kti.PjepuOK9SpfuEW','commercial'),(3,'Issouf','issouf@gmail.com','$2a$10$XIPuEsWj/C4zl9q3eRP9au4vjna1m9WToRd3DVPGGbgxCgXmSEwSy','responsable'),(4,'user','lucienneo133@gmail.com','$2a$10$6Vzc7ImqmzVQj7e9AODjZOHe1qZ3fA8gz4PXmTYVNemwk7.sYxu7u','commercial'),(9,'lili','d@gmail.com','$2a$10$qkkxu92ayPNj7UU2tkVPMOL1H/aOhyQWLk3AZqpu00g3TEf4HMhMa','commercial');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-14  0:10:30
