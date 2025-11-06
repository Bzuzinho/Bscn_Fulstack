-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 24, 2025 at 04:56 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bscn`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('bscn_cache_spatie.permission.cache', 'a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:9:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:16:\"aceder_dashboard\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:2;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:18:\"gerir_utilizadores\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:2;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:11:\"ver_faturas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:2;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:13:\"editar_fichas\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:2;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:11:\"ver_eventos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:3;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:13:\"criar_eventos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:3;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:14:\"editar_eventos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:3;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:14:\"apagar_eventos\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:2;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:16:\"gerir_convocados\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:2;i:1;i:3;}}}s:5:\"roles\";a:2:{i:0;a:3:{s:1:\"a\";i:2;s:1:\"b\";s:13:\"administrador\";s:1:\"c\";s:3:\"web\";}i:1;a:3:{s:1:\"a\";i:3;s:1:\"b\";s:9:\"treinador\";s:1:\"c\";s:3:\"web\";}}}', 1760702456);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catalogo_fatura_itens`
--

CREATE TABLE `catalogo_fatura_itens` (
  `id` bigint UNSIGNED NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_unitario` decimal(8,2) NOT NULL DEFAULT '0.00',
  `imposto_percentual` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `catalogo_fatura_itens`
--

INSERT INTO `catalogo_fatura_itens` (`id`, `descricao`, `valor_unitario`, `imposto_percentual`, `created_at`, `updated_at`) VALUES
(1, 'Inscrição', 15.00, 0.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11'),
(2, 'Touca', 5.00, 0.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11'),
(3, 'Sweat', 25.00, 23.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11'),
(4, 'Mochila', 30.00, 23.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11'),
(5, 'Óculos', 20.00, 23.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11'),
(6, 'Calções', 18.00, 23.00, '2025-08-20 20:41:11', '2025-08-20 20:41:11');

-- --------------------------------------------------------

--
-- Table structure for table `convocatorias`
--

CREATE TABLE `convocatorias` (
  `id` bigint UNSIGNED NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` date DEFAULT NULL,
  `ficheiro_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dados_configuracao`
--

CREATE TABLE `dados_configuracao` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `consentimento` tinyint(1) DEFAULT '0',
  `data_consentimento` date DEFAULT NULL,
  `ficheiro_consentimento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `declaracao_transporte` tinyint(1) DEFAULT '0',
  `data_transporte` date DEFAULT NULL,
  `ficheiro_transporte` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afiliacao` tinyint(1) DEFAULT '0',
  `data_afiliacao` date DEFAULT NULL,
  `ficheiro_afiliacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dados_configuracao`
--

INSERT INTO `dados_configuracao` (`id`, `user_id`, `consentimento`, `data_consentimento`, `ficheiro_consentimento`, `declaracao_transporte`, `data_transporte`, `ficheiro_transporte`, `afiliacao`, `data_afiliacao`, `ficheiro_afiliacao`, `created_at`, `updated_at`) VALUES
(1, 5, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, '2025-07-13 19:30:46', '2025-07-13 19:30:46'),
(2, 4, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, '2025-07-13 22:24:04', '2025-07-13 22:24:04'),
(3, 7, 1, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, '2025-07-13 22:42:10', '2025-07-27 06:29:32'),
(4, 2, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, '2025-07-16 09:39:10', '2025-07-16 09:39:10'),
(5, 1, 0, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, '2025-07-16 12:22:19', '2025-07-16 12:22:19'),
(7, 10, 1, NULL, NULL, 1, NULL, NULL, 1, NULL, NULL, '2025-07-28 12:47:17', '2025-07-28 12:47:24');

-- --------------------------------------------------------

--
-- Table structure for table `dados_desportivos`
--

CREATE TABLE `dados_desportivos` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `batimento` int DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `patologias` text COLLATE utf8mb4_unicode_ci,
  `medicamentos` text COLLATE utf8mb4_unicode_ci,
  `numero_federacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pmb` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inscricao` date DEFAULT NULL,
  `atestado_medico` tinyint(1) NOT NULL DEFAULT '0',
  `data_atestado` date DEFAULT NULL,
  `informacoes_medicas` text COLLATE utf8mb4_unicode_ci,
  `arquivo_am_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dados_desportivos`
--

INSERT INTO `dados_desportivos` (`id`, `user_id`, `altura`, `peso`, `batimento`, `observacoes`, `created_at`, `updated_at`, `patologias`, `medicamentos`, `numero_federacao`, `pmb`, `data_inscricao`, `atestado_medico`, `data_atestado`, `informacoes_medicas`, `arquivo_am_path`) VALUES
(1, 5, NULL, NULL, NULL, NULL, '2025-07-09 13:45:20', '2025-07-09 13:45:20', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(2, 1, NULL, NULL, NULL, NULL, '2025-07-10 15:50:13', '2025-07-10 15:50:13', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(3, 4, NULL, NULL, NULL, NULL, '2025-07-13 22:24:04', '2025-07-13 22:24:04', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(4, 7, NULL, NULL, NULL, NULL, '2025-07-13 22:42:10', '2025-07-16 13:41:15', NULL, NULL, '1234', '1234', '2000-01-01', 1, '2000-01-01', 'teste', NULL),
(5, 2, NULL, NULL, NULL, NULL, '2025-07-16 09:39:10', '2025-07-16 13:25:51', NULL, NULL, '1234', '12345', '2000-01-01', 1, '2000-01-01', 'teste', NULL),
(7, 10, NULL, NULL, NULL, NULL, '2025-07-28 12:47:17', '2025-07-28 12:47:24', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `dados_financeiros`
--

CREATE TABLE `dados_financeiros` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `estado_pagamento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_recibo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia_pagamento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `mensalidade_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dados_financeiros`
--

INSERT INTO `dados_financeiros` (`id`, `user_id`, `estado_pagamento`, `numero_recibo`, `referencia_pagamento`, `created_at`, `updated_at`, `mensalidade_id`) VALUES
(10, 10, NULL, NULL, NULL, '2025-07-31 14:08:22', '2025-08-17 21:36:59', 1),
(11, 2, NULL, NULL, NULL, '2025-08-04 07:36:10', '2025-08-17 00:02:18', 1),
(12, 5, NULL, NULL, NULL, '2025-08-04 07:51:47', '2025-08-17 20:19:15', NULL),
(13, 4, NULL, NULL, NULL, '2025-08-17 00:02:28', '2025-08-17 00:02:28', 7),
(14, 7, NULL, NULL, NULL, '2025-08-17 21:04:09', '2025-08-17 21:04:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `encarregado_user`
--

CREATE TABLE `encarregado_user` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `encarregado_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `encarregado_user`
--

INSERT INTO `encarregado_user` (`id`, `user_id`, `encarregado_id`, `created_at`, `updated_at`) VALUES
(4, 5, 4, NULL, NULL),
(5, 5, 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `escaloes`
--

CREATE TABLE `escaloes` (
  `id` bigint UNSIGNED NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `escaloes`
--

INSERT INTO `escaloes` (`id`, `nome`, `descricao`, `created_at`, `updated_at`) VALUES
(1, 'Pré-Competição', NULL, NULL, NULL),
(2, 'Cadetes A', NULL, NULL, NULL),
(3, 'Cadetes B', NULL, NULL, NULL),
(4, 'Infantis', NULL, NULL, NULL),
(5, 'Juvenis', NULL, NULL, NULL),
(6, 'Juniores', NULL, NULL, NULL),
(7, 'Seniores', NULL, NULL, NULL),
(8, 'Masters', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `eventos`
--

CREATE TABLE `eventos` (
  `id` bigint UNSIGNED NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `transporte` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime NOT NULL,
  `local` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_evento_id` bigint UNSIGNED NOT NULL,
  `visibilidade` enum('privado','restrito','publico') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'restrito',
  `transporte_disponivel` tinyint(1) NOT NULL DEFAULT '0',
  `local_partida` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hora_partida` time DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `convocatoria_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regulamento_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `convocatoria_id` bigint UNSIGNED DEFAULT NULL,
  `tem_transporte` tinyint(1) NOT NULL DEFAULT '0',
  `transporte_descricao` text COLLATE utf8mb4_unicode_ci,
  `regulamento_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eventos`
--

INSERT INTO `eventos` (`id`, `titulo`, `descricao`, `transporte`, `data_inicio`, `data_fim`, `local`, `tipo_evento_id`, `visibilidade`, `transporte_disponivel`, `local_partida`, `hora_partida`, `observacoes`, `convocatoria_path`, `regulamento_path`, `created_at`, `updated_at`, `convocatoria_id`, `tem_transporte`, `transporte_descricao`, `regulamento_id`) VALUES
(1, 'Prova de teste', NULL, NULL, '2025-08-09 09:00:00', '2025-08-09 18:00:00', 'Benedita', 1, 'publico', 0, NULL, NULL, NULL, NULL, NULL, '2025-08-07 22:09:19', '2025-08-07 22:09:19', NULL, 0, NULL, NULL),
(2, 'Teste de permissões', NULL, NULL, '2025-08-09 09:00:00', '2025-08-09 12:00:00', 'Benedita', 2, 'privado', 0, NULL, NULL, NULL, NULL, NULL, '2025-08-07 22:43:34', '2025-08-07 22:43:34', NULL, 0, NULL, NULL),
(3, 'teste evento', 'TEste de evento', NULL, '2025-08-18 09:00:00', '2025-08-18 18:00:00', 'Leiria', 1, 'publico', 0, 'benedita', '08:00:00', 'Teste', NULL, NULL, '2025-08-16 22:05:06', '2025-08-16 23:02:34', NULL, 1, 'TEste de evento', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `eventos_tipos`
--

CREATE TABLE `eventos_tipos` (
  `id` bigint UNSIGNED NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eventos_tipos`
--

INSERT INTO `eventos_tipos` (`id`, `nome`, `cor`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Prova', '#0d6efd', 'bi-flag', NULL, NULL),
(2, 'Reunião', '#6f42c1', 'bi-people', NULL, NULL),
(3, 'Encontro', '#198754', 'bi-calendar-heart', NULL, NULL),
(4, 'Treino', '#ffc107', 'bi-activity', NULL, NULL),
(5, 'Treino Especial', '#fd7e14', 'bi-stopwatch', NULL, NULL),
(6, 'Evento Interno', '#20c997', 'bi-house', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `eventos_users`
--

CREATE TABLE `eventos_users` (
  `id` bigint UNSIGNED NOT NULL,
  `evento_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `convocado` tinyint(1) NOT NULL DEFAULT '0',
  `presenca_confirmada` tinyint(1) DEFAULT NULL,
  `justificacao` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `evento_escalao`
--

CREATE TABLE `evento_escalao` (
  `id` bigint UNSIGNED NOT NULL,
  `evento_id` bigint UNSIGNED NOT NULL,
  `escalao_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `evento_escalao`
--

INSERT INTO `evento_escalao` (`id`, `evento_id`, `escalao_id`, `created_at`, `updated_at`) VALUES
(1, 3, 2, NULL, NULL),
(2, 3, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `evento_tipos`
--

CREATE TABLE `evento_tipos` (
  `id` bigint UNSIGNED NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faturas`
--

CREATE TABLE `faturas` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `data_fatura` date DEFAULT NULL,
  `mes` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_emissao` datetime DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estado_pagamento` tinyint(1) NOT NULL DEFAULT '0',
  `numero_recibo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia_pagamento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faturas`
--

INSERT INTO `faturas` (`id`, `user_id`, `data_fatura`, `mes`, `data_emissao`, `valor`, `estado_pagamento`, `numero_recibo`, `referencia_pagamento`, `created_at`, `updated_at`) VALUES
(115, 10, NULL, '2025-06', '2025-08-17 00:00:00', 222.00, 0, NULL, NULL, '2025-08-20 21:01:10', '2025-08-20 21:01:10'),
(116, 7, NULL, '2025-07', '2025-08-20 00:00:00', 40.00, 0, NULL, NULL, '2025-08-20 22:07:52', '2025-08-20 22:07:52');

-- --------------------------------------------------------

--
-- Table structure for table `fatura_itens`
--

CREATE TABLE `fatura_itens` (
  `id` bigint UNSIGNED NOT NULL,
  `fatura_id` bigint UNSIGNED NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_unitario` decimal(8,2) NOT NULL,
  `quantidade` decimal(10,2) NOT NULL DEFAULT '1.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `imposto_percentual` decimal(8,2) DEFAULT NULL,
  `total_linha` decimal(10,2) DEFAULT NULL,
  `dados_financeiros_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fatura_itens`
--

INSERT INTO `fatura_itens` (`id`, `fatura_id`, `descricao`, `valor_unitario`, `quantidade`, `created_at`, `updated_at`, `imposto_percentual`, `total_linha`, `dados_financeiros_id`) VALUES
(22, 115, 'teste', 2.00, 1.00, '2025-08-20 21:01:10', '2025-08-20 21:01:10', 0.00, 2.00, NULL),
(23, 115, 'teste2', 44.00, 5.00, '2025-08-20 21:01:10', '2025-08-20 21:01:10', 0.00, 220.00, NULL),
(24, 116, 'Master - 4x Semana', 35.00, 1.00, '2025-08-20 22:07:52', '2025-08-20 22:07:52', 0.00, 35.00, NULL),
(25, 116, 'Touca', 5.00, 1.00, '2025-08-20 22:07:52', '2025-08-20 22:07:52', 0.00, 5.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mensalidades`
--

CREATE TABLE `mensalidades` (
  `id` bigint UNSIGNED NOT NULL,
  `designacao` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mensalidades`
--

INSERT INTO `mensalidades` (`id`, `designacao`, `valor`, `created_at`, `updated_at`) VALUES
(1, 'Infantis - 2x Semana', 25.00, '2025-07-30 22:28:47', '2025-07-30 22:28:47'),
(4, 'Master - 3x Semana', 30.00, '2025-07-30 22:29:36', '2025-07-30 22:29:36'),
(7, 'Master - 4x Semana', 35.00, '2025-07-30 23:03:48', '2025-07-30 23:03:48');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_06_24_000000_create_athletes_table', 1),
(5, '2025_06_24_000001_create_athlete_guardian_table', 1),
(6, '2025_06_25_224747_create_atletas_table', 1),
(7, 'create_dados_desportivos_table', 2),
(8, 'create_dados_financeiros_table', 2),
(9, 'create_dados_pessoais_table', 2),
(10, 'create_resultados_table', 2),
(11, 'create_saude_atletas_table', 2),
(12, '2025_06_26_115231_create_permission_tables', 3),
(13, '2025_06_26_165733_add_imagem_perfil_to_atletas_table', 4),
(14, '2025_06_26_225651_add_role_to_users_table', 5),
(15, 'create_escaloes_table', 6),
(22, '2025_06_30_232106_create_tipo_user_table', 7),
(23, '2025_06_30_232107_create_tipo_user_user_table', 7),
(24, 'create_tipo_membro_migration', 7),
(25, '2025_07_02_094153_create_user_escaloes_table', 8),
(27, '2025_07_02_160709_create_encarregado_user_table', 9),
(28, '2025_07_07_221234_add_dados_pessoais_to_users_table', 10),
(29, '2025_07_09_145002_add_patologias_and_medicamentos_to_dados_desportivos_table', 11),
(30, '2025_07_09_152132_add_observacoes_config_to_users_table', 12),
(31, '2025_07_13_151103_create_faturas_table', 13),
(32, '2025_07_13_151517_create_mensalidades_table', 14),
(33, '2025_07_13_000000_create_dados_configuracao_table', 15),
(34, '2025_07_16_141600_add_campos_extra_to_dados_desportivos_table', 16),
(35, '2025_07_16_155614_create_presencas_table', 17),
(36, '2025_07_16_160627_create_treinos_table', 18),
(37, '2025_07_16_163619_create_resultados_table', 19),
(38, '2025_07_16_184742_add_user_id_to_presencas_table', 20),
(39, '2025_07_16_215614_add_fields_to_presencas_table', 21),
(40, '2025_07_29_000000_create_fatura_itens_table', 22),
(41, '2025_07_31_001002_add_mensalidade_id_to_users_table', 23),
(42, '2025_07_31_144033_add_dados_financeiros_id_to_fatura_itens_table', 24),
(44, '2025_07_31_150647_add_mensalidade_id_to_dados_financeiros_table', 25),
(45, '2025_08_06_221848_create_eventos_modulo_tables', 26),
(46, '2025_08_06_222458_create_eventos_modulo_tables', 27),
(47, '2025_08_07_153854_create_eventos_tipos_table', 28),
(50, '2025_08_07_222239_add_descricao_to_eventos_table', 29),
(51, '2025_08_08_004956_add_transporte_to_eventos_table', 29),
(52, '2025_08_08_000000_create_convocatorias_table', 30),
(53, '2025_08_08_000001_alter_eventos_add_campos_transporte_convocatoria', 31),
(54, '2025_08_08_005029_create_evento_escalao_table', 32),
(55, '2025_08_08_092139_create_convocatorias_table', 33),
(56, '2025_08_08_092148_alter_eventos_add_campos_transporte_convocatoria', 34),
(57, '2025_08_17_000001_add_quantidade_total_to_fatura_itens', 34),
(58, '2025_08_17_000002_alter_faturas_mes_to_date_and_unique', 35),
(59, '2025_08_17_120000_normalizar_faturas_data_e_mes', 36),
(60, '2025_08_17_000000_fix_faturas_unique_index', 37),
(61, '2025_08_17_210000_add_qty_total_to_fatura_itens', 38),
(62, '2025_08_18_000000_fix_default_valor_in_faturas', 39),
(63, '2025_08_18_120000_add_data_emissao_and_nullable_mes_to_faturas', 40),
(64, '2025_08_20_000000_create_catalogo_fatura_itens_table', 41);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(2, 'App\\Models\\User', 1),
(4, 'App\\Models\\User', 2),
(9, 'App\\Models\\User', 4),
(9, 'App\\Models\\User', 5),
(9, 'App\\Models\\User', 7),
(9, 'App\\Models\\User', 10),
(4, 'App\\Models\\User', 12),
(6, 'App\\Models\\User', 14);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'aceder_dashboard', 'web', '2025-07-27 08:30:45', '2025-07-27 08:30:45'),
(2, 'gerir_utilizadores', 'web', '2025-07-27 08:30:45', '2025-07-27 08:30:45'),
(3, 'ver_faturas', 'web', '2025-07-27 08:30:45', '2025-07-27 08:30:45'),
(4, 'editar_fichas', 'web', '2025-07-27 08:30:45', '2025-07-27 08:30:45'),
(5, 'ver_eventos', 'web', '2025-08-06 21:58:28', '2025-08-06 21:58:28'),
(6, 'criar_eventos', 'web', '2025-08-06 21:58:28', '2025-08-06 21:58:28'),
(7, 'editar_eventos', 'web', '2025-08-06 21:58:28', '2025-08-06 21:58:28'),
(8, 'apagar_eventos', 'web', '2025-08-06 21:58:28', '2025-08-06 21:58:28'),
(9, 'gerir_convocados', 'web', '2025-08-06 21:58:28', '2025-08-06 21:58:28');

-- --------------------------------------------------------

--
-- Table structure for table `presencas`
--

CREATE TABLE `presencas` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `data` date NOT NULL,
  `numero_treino` tinyint NOT NULL,
  `presenca` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `presencas`
--

INSERT INTO `presencas` (`id`, `user_id`, `data`, `numero_treino`, `presenca`, `created_at`, `updated_at`) VALUES
(3, 7, '2025-07-02', 4, 1, '2025-07-17 07:31:00', '2025-07-17 10:38:32'),
(4, 7, '2025-07-03', 1, 1, '2025-07-17 10:38:47', '2025-07-17 10:38:47');

-- --------------------------------------------------------

--
-- Table structure for table `resultados`
--

CREATE TABLE `resultados` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `epoca` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` date NOT NULL,
  `escalao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `competicao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `local` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `piscina` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prova` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tempo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `resultados`
--

INSERT INTO `resultados` (`id`, `user_id`, `epoca`, `data`, `escalao`, `competicao`, `local`, `piscina`, `prova`, `tempo`, `created_at`, `updated_at`) VALUES
(1, 7, '2024/2025', '2025-01-01', 'Master', 'Leiria', 'Leiria', '25 M', '50 L', '27,00', '2025-07-17 15:16:57', '2025-07-17 15:18:30');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(2, 'administrador', 'web', '2025-07-04 08:27:07', '2025-07-04 08:27:07'),
(3, 'treinador', 'web', '2025-07-04 08:27:20', '2025-07-04 08:27:20'),
(4, 'atleta', 'web', '2025-07-04 08:27:29', '2025-07-04 08:27:29'),
(5, 'encarregado de educação', 'web', '2025-07-04 08:27:38', '2025-07-04 08:27:38'),
(6, 'dirigente', 'web', '2025-07-04 08:27:44', '2025-07-04 08:27:44'),
(7, 'utilizador', 'web', '2025-07-04 08:27:51', '2025-07-04 08:27:51'),
(9, 'admin', 'web', '2025-07-28 12:47:23', '2025-07-28 12:47:23');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(5, 3),
(6, 3),
(7, 3),
(9, 3);

-- --------------------------------------------------------

--
-- Table structure for table `saude_atletas`
--

CREATE TABLE `saude_atletas` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `patologias` text COLLATE utf8mb4_unicode_ci,
  `medicamentos` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('oqNz9e1zpgyGVPJaHtwaj0GpOwftrBDeqRr6uob7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiTjNwalIzZk1DQWlsa0pLVmllS2p2c1NrWHlQMW9zUGJmVWRVd2FldyI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoxNjoiaHR0cDovL2JzY24udGVzdCI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjIyOiJodHRwOi8vYnNjbi50ZXN0L2xvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1761064123),
('YCI1rnab4afuqKnAJCIKk0lzOMhiCxu0IDw2J1Xt', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiYllKNkhmd0RwMHRSczBWcTZVWEE2NmFFMFZmSFB5MzN1RmNEdjRHciI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czoxNjoiaHR0cDovL2JzY24udGVzdCI7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjI5OiJodHRwOi8vYnNjbi50ZXN0L3V0aWxpemFkb3JlcyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1760633762);

-- --------------------------------------------------------

--
-- Table structure for table `tipo_membros`
--

CREATE TABLE `tipo_membros` (
  `id` bigint UNSIGNED NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tipo_membros`
--

INSERT INTO `tipo_membros` (`id`, `nome`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', '2025-07-02 09:18:47', '2025-07-02 09:18:47'),
(2, 'Treinador', '2025-07-02 09:18:47', '2025-07-02 09:18:47'),
(3, 'Atleta', '2025-07-02 09:18:47', '2025-07-02 09:18:47'),
(4, 'Encarregado de Educação', '2025-07-02 09:18:47', '2025-07-02 09:18:47'),
(5, 'Patrocinador', '2025-07-02 09:18:47', '2025-07-02 09:18:47'),
(6, 'Sócio', '2025-07-02 09:18:47', '2025-07-02 09:18:47');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_users`
--

CREATE TABLE `tipo_users` (
  `id` bigint UNSIGNED NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tipo_users`
--

INSERT INTO `tipo_users` (`id`, `nome`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', '2025-07-01 14:29:31', '2025-07-01 14:29:31'),
(3, 'Atleta', NULL, NULL),
(4, 'Treinador', NULL, NULL),
(5, 'Encarregado de Educação', NULL, NULL),
(6, 'Patrocinador', NULL, NULL),
(7, 'Sócio', NULL, NULL),
(8, 'Administrador', NULL, NULL),
(9, 'Atleta', NULL, NULL),
(10, 'Treinador', NULL, NULL),
(11, 'Encarregado de Educação', NULL, NULL),
(12, 'Patrocinador', NULL, NULL),
(13, 'Sócio', NULL, NULL),
(14, 'Administrador', NULL, NULL),
(15, 'Atleta', NULL, NULL),
(16, 'Treinador', NULL, NULL),
(17, 'Encarregado de Educação', NULL, NULL),
(18, 'Patrocinador', NULL, NULL),
(19, 'Sócio', NULL, NULL),
(20, 'Administrador', NULL, NULL),
(21, 'Atleta', NULL, NULL),
(22, 'Treinador', NULL, NULL),
(23, 'Encarregado de Educação', NULL, NULL),
(24, 'Patrocinador', NULL, NULL),
(25, 'Sócio', NULL, NULL),
(26, 'Administrador', NULL, NULL),
(27, 'Atleta', NULL, NULL),
(28, 'Treinador', NULL, NULL),
(29, 'Encarregado de Educação', NULL, NULL),
(30, 'Patrocinador', NULL, NULL),
(31, 'Sócio', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tipo_user_user`
--

CREATE TABLE `tipo_user_user` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `tipo_user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tipo_user_user`
--

INSERT INTO `tipo_user_user` (`id`, `user_id`, `tipo_user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 4, 3, NULL, NULL),
(3, 4, 5, NULL, NULL),
(4, 5, 3, NULL, NULL),
(6, 7, 5, NULL, NULL),
(7, 7, 3, NULL, NULL),
(9, 2, 5, NULL, NULL),
(11, 10, 3, NULL, NULL),
(12, 10, 5, NULL, NULL),
(14, 12, 3, NULL, NULL),
(15, 14, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `treinos`
--

CREATE TABLE `treinos` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` date NOT NULL,
  `sessao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `treinos`
--

INSERT INTO `treinos` (`id`, `user_id`, `numero`, `data`, `sessao`, `created_at`, `updated_at`) VALUES
(1, 7, '1', '2025-01-01', '2', '2025-07-17 07:30:22', '2025-07-17 07:30:33'),
(5, 7, '5', '2022-05-05', '4', '2025-07-17 12:41:13', '2025-07-17 12:41:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `numero_socio` int DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensalidade_id` bigint UNSIGNED DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `nif` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cartao_cidadao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `sexo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `morada` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `localidade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `empresa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_civil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocupacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_irmaos` int DEFAULT NULL,
  `menor` tinyint(1) NOT NULL DEFAULT '0',
  `estado_utilizador` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `encarregado_id` bigint UNSIGNED DEFAULT NULL,
  `escalao_id` bigint UNSIGNED DEFAULT NULL,
  `profile_photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacoes_config` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `numero_socio`, `estado`, `name`, `email`, `mensalidade_id`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `nif`, `cartao_cidadao`, `contacto`, `data_nascimento`, `sexo`, `morada`, `codigo_postal`, `localidade`, `empresa`, `escola`, `estado_civil`, `ocupacao`, `nacionalidade`, `numero_irmaos`, `menor`, `estado_utilizador`, `encarregado_id`, `escalao_id`, `profile_photo_path`, `observacoes_config`) VALUES
(1, 1, '1', 'User Administrador', 'admin@bscn.pt', NULL, NULL, '$2y$12$wjHK6ObONNzmpH36NUTB7.Kc2mLvVCXdlUH96KqJRsg4j2uepdaFa', NULL, '2025-06-26 10:39:23', '2025-07-28 07:33:25', 'admin', NULL, NULL, NULL, '1990-01-01', '2', 'teste', '2475-125', 'Benedita', 'BSCN', 'BSCN', 'Solteiro', 'ADMIN', 'Portuguesa', 0, 0, NULL, NULL, NULL, 'profile_photos/gWEn349YWWeXcscz2lmOZg71y5pmImsc0OIHJWkN.png', NULL),
(2, 3, '1', 'Test User', 'test@example.com', NULL, '2025-06-26 11:01:12', '$2y$12$jKLud7eVR6/5w5IDIbChHOThgVnzPidcSygWw.HrmggAOgoir23cy', 'Pi2C88owHAVDF3Gm1qIzea7fTJ0w2Xp1d1RONRVYhI7Lkdq6P4p1CBSR2GAT', '2025-06-26 11:01:13', '2025-08-07 22:34:31', 'atleta', '123456789', '12345', NULL, '2000-08-20', '0', 'teste', '2475-124', 'Benedita', 'BSCN', 'BSCN', 'Solteiro', 'Teste', 'Portuguesa', NULL, 0, NULL, NULL, NULL, NULL, NULL),
(4, 4, '1', 'User1 User2', 'user1@gmail.com', NULL, NULL, '$2y$12$wnpzP5BjPIp642N7WPfYDuRjZ08usrqmUfX4BjnDABTrrAmgn5kDO', NULL, '2025-07-02 09:22:28', '2025-08-17 00:07:46', 'admin', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL, 'Solteiro', NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL),
(5, 5, '1', 'user3 user', 'user21@gmail.com', NULL, NULL, '$2y$12$0Zik/3iQhfP8d4pbWbOSN.r2KGtCUz.aPjg7f2rXrugk69aPMeYiy', NULL, '2025-07-02 09:23:26', '2025-08-17 00:07:59', 'admin', '123456789', '22222', '961123123', '2015-08-04', '1', 'Rua da alegria', '2475-125', 'Benedita', 'teste', 'teste', 'Divorciado', 'teste', 'Portuguesa', 1, 1, NULL, NULL, NULL, 'profile_photos/aRXYNNxTHdGrFXGibLH3ZMZLVuwEEZGDynCRhOKX.jpg', NULL),
(7, 6, '1', 'User7 user81', 'user8@gmail.com', 4, NULL, '$2y$12$auGByStv8Lp9pJJhOYUD/uFhgzTDKoKyJdBuDgi7e6j74OFq2/MGO', NULL, '2025-07-13 22:41:34', '2025-08-17 22:29:25', 'admin', '123456789', '123456', '968931574', '2000-01-01', '1', 'Rua teste', '2475-125', 'Benedita', 'Teste', 'Teste', 'Casado', 'Teste', 'Portuguesa', 1, 0, NULL, NULL, NULL, 'profile_photos/zWybaSMsv4vBXX1dvMfC3TLNtUEWE9cNCdgkgSq9.jpg', NULL),
(10, 7, '1', 'User8 User9', 'email2@gmail.com', 1, NULL, '$2y$12$SCMyPZ5s/PPKT2G7AK1tke/kIX/RVx6uYw86mD9rCjQLvLRNx7WMe', NULL, '2025-07-28 12:47:00', '2025-08-17 22:15:57', 'admin', '123456789', NULL, NULL, '1980-08-10', '0', NULL, NULL, NULL, NULL, NULL, 'Solteiro', NULL, NULL, NULL, 0, '1', NULL, NULL, 'profile_photos/rHqER2FOmDsXUtTajLAeBy9K52vaisNb72sfdmlR.jpg', NULL),
(12, 8, '1', 'Teste2', 'teste2@bscn.pt', NULL, NULL, '$2y$12$bIrc5jnKm2TJ3AReOdv.1egUXxy5AWKPC6xsHpVYh6zDNYlIjSyo6', NULL, '2025-10-13 16:04:39', '2025-10-13 16:04:39', 'admin', '123456789', NULL, '961123123', '2000-01-01', 'Masculino', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL, 'profile_photos/X7cMrn5XFlBHE7ghMqSciWnogf7frN1zYwL4eXMr.jpg', NULL),
(14, 9, '1', 'teste4 test5', 'teste5@bscn.pt', NULL, NULL, '$2y$12$DNdEGjrkZaHyVEZK2kEryuVsinPRYe5/oaoh66dmNtAi.AlTGktIy', NULL, '2025-10-16 10:43:31', '2025-10-16 10:43:31', 'dirigente', '123456789', NULL, '961123456', '2000-01-01', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL, 'profile_photos/dV7CZFCWc6YKTVATKxKoqIWlFpAhwML9xTec2ylx.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_escaloes`
--

CREATE TABLE `user_escaloes` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `escalao_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_escaloes`
--

INSERT INTO `user_escaloes` (`id`, `user_id`, `escalao_id`, `created_at`, `updated_at`) VALUES
(1, 4, 8, NULL, NULL),
(2, 5, 2, NULL, NULL),
(4, 7, 8, NULL, NULL),
(5, 2, 8, NULL, NULL),
(6, 10, 8, NULL, NULL),
(8, 12, 4, NULL, NULL),
(9, 14, 7, NULL, NULL),
(10, 14, 8, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `catalogo_fatura_itens`
--
ALTER TABLE `catalogo_fatura_itens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `convocatorias`
--
ALTER TABLE `convocatorias`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dados_configuracao`
--
ALTER TABLE `dados_configuracao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dados_configuracao_user_id_foreign` (`user_id`);

--
-- Indexes for table `dados_desportivos`
--
ALTER TABLE `dados_desportivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dados_desportivos_user_id_foreign` (`user_id`);

--
-- Indexes for table `dados_financeiros`
--
ALTER TABLE `dados_financeiros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dados_financeiros_user_id_foreign` (`user_id`),
  ADD KEY `dados_financeiros_mensalidade_id_foreign` (`mensalidade_id`);

--
-- Indexes for table `encarregado_user`
--
ALTER TABLE `encarregado_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `encarregado_user_user_id_foreign` (`user_id`),
  ADD KEY `encarregado_user_encarregado_id_foreign` (`encarregado_id`);

--
-- Indexes for table `escaloes`
--
ALTER TABLE `escaloes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `escaloes_nome_unique` (`nome`);

--
-- Indexes for table `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventos_tipo_evento_id_foreign` (`tipo_evento_id`),
  ADD KEY `eventos_convocatoria_id_foreign` (`convocatoria_id`);

--
-- Indexes for table `eventos_tipos`
--
ALTER TABLE `eventos_tipos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eventos_users`
--
ALTER TABLE `eventos_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventos_users_evento_id_foreign` (`evento_id`),
  ADD KEY `eventos_users_user_id_foreign` (`user_id`);

--
-- Indexes for table `evento_escalao`
--
ALTER TABLE `evento_escalao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evento_escalao_evento_id_foreign` (`evento_id`);

--
-- Indexes for table `evento_tipos`
--
ALTER TABLE `evento_tipos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faturas`
--
ALTER TABLE `faturas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `faturas_user_mes_unique` (`user_id`,`mes`);

--
-- Indexes for table `fatura_itens`
--
ALTER TABLE `fatura_itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fatura_itens_fatura_id_foreign` (`fatura_id`),
  ADD KEY `fatura_itens_dados_financeiros_id_foreign` (`dados_financeiros_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mensalidades`
--
ALTER TABLE `mensalidades`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `presencas`
--
ALTER TABLE `presencas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `presencas_user_id_foreign` (`user_id`);

--
-- Indexes for table `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resultados_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `saude_atletas`
--
ALTER TABLE `saude_atletas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `saude_atletas_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tipo_membros`
--
ALTER TABLE `tipo_membros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tipo_membros_nome_unique` (`nome`);

--
-- Indexes for table `tipo_users`
--
ALTER TABLE `tipo_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tipo_user_user`
--
ALTER TABLE `tipo_user_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_user_user_user_id_foreign` (`user_id`),
  ADD KEY `tipo_user_user_tipo_user_id_foreign` (`tipo_user_id`);

--
-- Indexes for table `treinos`
--
ALTER TABLE `treinos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `treinos_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_encarregado_id_foreign` (`encarregado_id`),
  ADD KEY `users_mensalidade_id_foreign` (`mensalidade_id`);

--
-- Indexes for table `user_escaloes`
--
ALTER TABLE `user_escaloes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_escaloes_user_id_foreign` (`user_id`),
  ADD KEY `user_escaloes_escalao_id_foreign` (`escalao_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `catalogo_fatura_itens`
--
ALTER TABLE `catalogo_fatura_itens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `convocatorias`
--
ALTER TABLE `convocatorias`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dados_configuracao`
--
ALTER TABLE `dados_configuracao`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dados_desportivos`
--
ALTER TABLE `dados_desportivos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `dados_financeiros`
--
ALTER TABLE `dados_financeiros`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `encarregado_user`
--
ALTER TABLE `encarregado_user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `escaloes`
--
ALTER TABLE `escaloes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `eventos_tipos`
--
ALTER TABLE `eventos_tipos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `eventos_users`
--
ALTER TABLE `eventos_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `evento_escalao`
--
ALTER TABLE `evento_escalao`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `evento_tipos`
--
ALTER TABLE `evento_tipos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faturas`
--
ALTER TABLE `faturas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `fatura_itens`
--
ALTER TABLE `fatura_itens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mensalidades`
--
ALTER TABLE `mensalidades`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `presencas`
--
ALTER TABLE `presencas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `saude_atletas`
--
ALTER TABLE `saude_atletas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipo_membros`
--
ALTER TABLE `tipo_membros`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tipo_users`
--
ALTER TABLE `tipo_users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tipo_user_user`
--
ALTER TABLE `tipo_user_user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `treinos`
--
ALTER TABLE `treinos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_escaloes`
--
ALTER TABLE `user_escaloes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dados_configuracao`
--
ALTER TABLE `dados_configuracao`
  ADD CONSTRAINT `dados_configuracao_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dados_desportivos`
--
ALTER TABLE `dados_desportivos`
  ADD CONSTRAINT `dados_desportivos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dados_financeiros`
--
ALTER TABLE `dados_financeiros`
  ADD CONSTRAINT `dados_financeiros_mensalidade_id_foreign` FOREIGN KEY (`mensalidade_id`) REFERENCES `mensalidades` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `dados_financeiros_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `encarregado_user`
--
ALTER TABLE `encarregado_user`
  ADD CONSTRAINT `encarregado_user_encarregado_id_foreign` FOREIGN KEY (`encarregado_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `encarregado_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_convocatoria_id_foreign` FOREIGN KEY (`convocatoria_id`) REFERENCES `convocatorias` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `eventos_tipo_evento_id_foreign` FOREIGN KEY (`tipo_evento_id`) REFERENCES `eventos_tipos` (`id`);

--
-- Constraints for table `eventos_users`
--
ALTER TABLE `eventos_users`
  ADD CONSTRAINT `eventos_users_evento_id_foreign` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `eventos_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `evento_escalao`
--
ALTER TABLE `evento_escalao`
  ADD CONSTRAINT `evento_escalao_evento_id_foreign` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `faturas`
--
ALTER TABLE `faturas`
  ADD CONSTRAINT `faturas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fatura_itens`
--
ALTER TABLE `fatura_itens`
  ADD CONSTRAINT `fatura_itens_dados_financeiros_id_foreign` FOREIGN KEY (`dados_financeiros_id`) REFERENCES `dados_financeiros` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fatura_itens_fatura_id_foreign` FOREIGN KEY (`fatura_id`) REFERENCES `faturas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `presencas`
--
ALTER TABLE `presencas`
  ADD CONSTRAINT `presencas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `resultados_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saude_atletas`
--
ALTER TABLE `saude_atletas`
  ADD CONSTRAINT `saude_atletas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tipo_user_user`
--
ALTER TABLE `tipo_user_user`
  ADD CONSTRAINT `tipo_user_user_tipo_user_id_foreign` FOREIGN KEY (`tipo_user_id`) REFERENCES `tipo_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tipo_user_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `treinos`
--
ALTER TABLE `treinos`
  ADD CONSTRAINT `treinos_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_encarregado_id_foreign` FOREIGN KEY (`encarregado_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_mensalidade_id_foreign` FOREIGN KEY (`mensalidade_id`) REFERENCES `mensalidades` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_escaloes`
--
ALTER TABLE `user_escaloes`
  ADD CONSTRAINT `user_escaloes_escalao_id_foreign` FOREIGN KEY (`escalao_id`) REFERENCES `escaloes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_escaloes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
