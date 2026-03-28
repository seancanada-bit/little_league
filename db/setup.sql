-- Baseball Coach - Database Setup
-- Run this in your MySQL database via phpMyAdmin or CLI

CREATE DATABASE IF NOT EXISTS baseball_coach
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE baseball_coach;

CREATE TABLE IF NOT EXISTS quiz_scores (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(100)   NOT NULL,
    score       TINYINT        NOT NULL DEFAULT 0,
    total       TINYINT        NOT NULL DEFAULT 0,
    played_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_player (player_name),
    INDEX idx_score  (score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
