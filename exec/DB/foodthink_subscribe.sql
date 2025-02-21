-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: i12e107.p.ssafy.io    Database: foodthink
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

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
-- Table structure for table `subscribe`
--

DROP TABLE IF EXISTS `subscribe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscribe` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `write_time` datetime(6) DEFAULT NULL,
  `subscribed_user_id` bigint DEFAULT NULL,
  `subscriber_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKodud3e1sdkstisn29inf4t9oj` (`subscribed_user_id`),
  KEY `FKr70r5paocmrbuwcs0rvlo4ur3` (`subscriber_id`),
  CONSTRAINT `FKodud3e1sdkstisn29inf4t9oj` FOREIGN KEY (`subscribed_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKr70r5paocmrbuwcs0rvlo4ur3` FOREIGN KEY (`subscriber_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribe`
--

LOCK TABLES `subscribe` WRITE;
/*!40000 ALTER TABLE `subscribe` DISABLE KEYS */;
INSERT INTO `subscribe` VALUES (72,'2025-02-20 02:32:01.006468',62,61),(75,'2025-02-20 02:37:17.684828',61,62),(93,'2025-02-20 02:42:31.136683',1,62),(97,'2025-02-20 02:42:48.413466',13,62),(99,'2025-02-20 02:42:59.197077',15,62),(100,'2025-02-20 05:47:24.493558',11,69),(101,'2025-02-20 05:47:28.977046',1,69),(102,'2025-02-20 05:47:34.342471',8,69),(103,'2025-02-20 05:47:43.341316',17,69),(104,'2025-02-20 05:47:50.284761',18,69),(105,'2025-02-20 05:47:57.323806',16,69),(106,'2025-02-20 05:48:01.347039',15,69),(107,'2025-02-20 05:48:23.900919',61,69),(108,'2025-02-20 05:48:31.160027',62,69),(109,'2025-02-20 06:13:23.866405',69,61),(110,'2025-02-20 06:44:18.622998',6,62),(111,'2025-02-20 06:49:58.791412',61,74),(112,'2025-02-20 07:15:20.274775',70,69),(114,'2025-02-20 08:59:25.101593',78,78),(115,'2025-02-20 11:48:11.488841',10,69),(116,'2025-02-20 11:48:23.153823',4,69),(118,'2025-02-20 15:57:01.278037',14,68);
/*!40000 ALTER TABLE `subscribe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:28
