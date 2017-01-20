SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `sm_post`;
CREATE TABLE `sm_post` (
  `id` INT(8) NOT NULL AUTO_INCREMENT,PRIMARY KEY(`id` ),
  `title` varchar(1000) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `tag` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
