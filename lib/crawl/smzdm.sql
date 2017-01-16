SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `smzdm_record`;
CREATE TABLE `smzdm_record` (
  `title` varchar(1000) DEFAULT NULL,
  `price` varchar(1000) DEFAULT NULL,
  `link` varchar(1000) DEFAULT NULL,
  `page_url` varchar(1000) DEFAULT NULL,
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `md5` varchar(100) NOT NULL,
  PRIMARY KEY (`md5`),
  KEY `md5_index` (`md5`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
