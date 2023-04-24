-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 24. Apr 2023 um 11:30
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `ponsdb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `arab`
--

CREATE TABLE `arab` (
  `Arab_Id` int(11) NOT NULL,
  `header` text NOT NULL,
  `Arab_Rom_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `hit`
--

CREATE TABLE `hit` (
  `Hit_Id` int(11) NOT NULL,
  `language` text NOT NULL,
  `type` text NOT NULL,
  `opendict` tinyint(1) NOT NULL,
  `Hit_Req_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `request`
--

CREATE TABLE `request` (
  `Req_Id` int(11) NOT NULL,
  `transdir` text NOT NULL COMMENT 'Richtung der Übersetzung'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rom`
--

CREATE TABLE `rom` (
  `Rom_Id` int(11) NOT NULL,
  `headword` text NOT NULL,
  `wordclass` text NOT NULL,
  `Rom_Hit_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `translation`
--

CREATE TABLE `translation` (
  `Translation_Id` int(11) NOT NULL,
  `source` text NOT NULL,
  `target` text NOT NULL,
  `Translation_Arab_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `arab`
--
ALTER TABLE `arab`
  ADD PRIMARY KEY (`Arab_Id`),
  ADD KEY `Arab_Rom_Id` (`Arab_Rom_Id`);

--
-- Indizes für die Tabelle `hit`
--
ALTER TABLE `hit`
  ADD PRIMARY KEY (`Hit_Id`),
  ADD KEY `Hit_Req_Id` (`Hit_Req_Id`);

--
-- Indizes für die Tabelle `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`Req_Id`);

--
-- Indizes für die Tabelle `rom`
--
ALTER TABLE `rom`
  ADD PRIMARY KEY (`Rom_Id`),
  ADD KEY `Rom_Hit_Id` (`Rom_Hit_Id`);

--
-- Indizes für die Tabelle `translation`
--
ALTER TABLE `translation`
  ADD PRIMARY KEY (`Translation_Id`),
  ADD KEY `Translation_Arab_Id` (`Translation_Arab_Id`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `arab`
--
ALTER TABLE `arab`
  ADD CONSTRAINT `arab_ibfk_1` FOREIGN KEY (`Arab_Rom_Id`) REFERENCES `rom` (`Rom_Id`);

--
-- Constraints der Tabelle `hit`
--
ALTER TABLE `hit`
  ADD CONSTRAINT `hit_ibfk_1` FOREIGN KEY (`Hit_Req_Id`) REFERENCES `request` (`Req_Id`);

--
-- Constraints der Tabelle `rom`
--
ALTER TABLE `rom`
  ADD CONSTRAINT `rom_ibfk_1` FOREIGN KEY (`Rom_Hit_Id`) REFERENCES `hit` (`Hit_Id`);

--
-- Constraints der Tabelle `translation`
--
ALTER TABLE `translation`
  ADD CONSTRAINT `translation_ibfk_1` FOREIGN KEY (`Translation_Arab_Id`) REFERENCES `arab` (`Arab_Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
