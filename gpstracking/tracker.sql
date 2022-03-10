-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 03 Tem 2020, 07:16:58
-- Sunucu sürümü: 10.3.22-MariaDB
-- PHP Sürümü: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `plg`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `plugin_tracker`
--

CREATE TABLE `plugin_tracker` (
  `id` int(11) NOT NULL,
  `uuid` varchar(60) NOT NULL,
  `siteCode` varchar(60) NOT NULL,
  `trackCode` varchar(60) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `plaque` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  `speed` varchar(255) DEFAULT '0',
  `checking` int(11) DEFAULT NULL,
  `ip` varchar(24) DEFAULT NULL,
  `time` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `plugin_tracker`
--
ALTER TABLE `plugin_tracker`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siteCode` (`siteCode`),
  ADD KEY `uuid` (`uuid`,`siteCode`),
  ADD KEY `trackCode` (`trackCode`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `plugin_tracker`
--
ALTER TABLE `plugin_tracker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
