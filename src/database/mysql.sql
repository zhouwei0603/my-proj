CREATE DATABASE IF NOT EXISTS `mydb` DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS `mydbuser`@`localhost` IDENTIFIED BY 'Password01!';
GRANT SELECT, INSERT, UPDATE, DELETE ON `mydb`.* TO `mydbuser`@`localhost`;
FLUSH PRIVILEGES;

CREATE USER IF NOT EXISTS `mydbuser`@`%` IDENTIFIED BY 'Password01!';
GRANT SELECT, INSERT, UPDATE, DELETE ON `mydb`.* TO `mydbuser`@`%`;
FLUSH PRIVILEGES;

USE mydb;

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar_url` varchar(1000) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `country_code` varchar(4) DEFAULT NULL,
  `wx_openid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  UNIQUE KEY `wx_openid_UNIQUE` (`wx_openid`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `part` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `po` (
  `id` varchar(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `created` datetime NOT NULL,
  `createdby` varchar(100) NOT NULL,
  `modified` datetime DEFAULT NULL,
  `modifiedby` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `poitem` (
  `id` varchar(36) NOT NULL,
  `poid` varchar(36) NOT NULL,
  `partid` varchar(36) NOT NULL,
  `count` int NOT NULL,
  `created` datetime NOT NULL,
  `createdby` varchar(100) NOT NULL,
  `modified` datetime DEFAULT NULL,
  `modifiedby` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `part_po_uk` (`poid`,`partid`),
  KEY `part_idx` (`partid`),
  KEY `po_idx` (`poid`),
  CONSTRAINT `part` FOREIGN KEY (`partid`) REFERENCES `part` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `po` FOREIGN KEY (`poid`) REFERENCES `po` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;