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
-- Table structure for table `feedlike`
--

DROP TABLE IF EXISTS `feedlike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedlike` (
  `like_id` bigint NOT NULL AUTO_INCREMENT,
  `write_time` datetime(6) DEFAULT NULL,
  `feed_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `FKqb8a7la00qt1mxfwjmxnv70kh` (`feed_id`),
  KEY `FKgippfj7n6qbwjuv0wij2g4apc` (`user_id`),
  CONSTRAINT `FKgippfj7n6qbwjuv0wij2g4apc` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKqb8a7la00qt1mxfwjmxnv70kh` FOREIGN KEY (`feed_id`) REFERENCES `feed` (`feed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedlike`
--

LOCK TABLES `feedlike` WRITE;
/*!40000 ALTER TABLE `feedlike` DISABLE KEYS */;
INSERT INTO `feedlike` VALUES (67,'2025-02-20 05:58:27.566730',71,69),(68,'2025-02-20 05:58:30.630797',70,69),(69,'2025-02-20 05:58:33.553189',69,69),(70,'2025-02-20 06:01:32.703849',73,69),(71,'2025-02-20 06:05:46.162665',74,69),(72,'2025-02-20 06:13:03.441209',76,69),(73,'2025-02-20 06:21:32.549588',80,69),(74,'2025-02-20 06:26:13.936852',81,69),(75,'2025-02-20 07:04:16.737672',84,69),(76,'2025-02-20 07:17:30.221508',73,70),(78,'2025-02-20 07:32:36.184045',85,69),(79,'2025-02-20 07:34:39.338103',88,69),(80,'2025-02-20 07:34:44.248313',92,69),(81,'2025-02-20 08:05:39.918861',93,69),(82,'2025-02-20 08:49:49.698089',94,69),(83,'2025-02-20 08:50:00.579770',91,69),(84,'2025-02-20 08:50:06.742696',87,69),(86,'2025-02-20 10:58:51.411839',91,70),(87,'2025-02-20 11:00:37.067187',83,70),(88,'2025-02-20 15:20:45.216702',93,61),(89,'2025-02-20 15:50:23.347397',97,68),(90,'2025-02-20 16:04:50.636757',97,62),(91,'2025-02-20 16:04:58.677692',94,62),(92,'2025-02-20 16:05:06.269168',81,62),(93,'2025-02-20 16:05:14.844656',71,62),(94,'2025-02-20 23:54:14.876409',97,61),(95,'2025-02-20 23:54:29.078339',73,61),(96,'2025-02-20 23:54:36.360483',92,61),(97,'2025-02-20 23:54:49.494256',94,61),(98,'2025-02-20 23:54:54.151989',91,61);
/*!40000 ALTER TABLE `feedlike` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:11:26
