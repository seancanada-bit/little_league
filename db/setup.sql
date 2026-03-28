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

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  first_name_lower VARCHAR(50) NOT NULL,
  UNIQUE KEY unique_name_lower (first_name_lower),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add player_id to quiz_scores (run only if column doesn't exist)
ALTER TABLE quiz_scores ADD COLUMN IF NOT EXISTS player_id INT DEFAULT NULL;

-- Teams table (for future monetization)
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  slug VARCHAR(60) NOT NULL,
  access_code VARCHAR(20) NOT NULL,
  league_name VARCHAR(100) DEFAULT NULL,
  coach_name VARCHAR(100) DEFAULT NULL,
  coach_email VARCHAR(200) DEFAULT NULL,
  plan ENUM('free','team','league') NOT NULL DEFAULT 'free',
  active TINYINT(1) NOT NULL DEFAULT 1,
  max_players INT NOT NULL DEFAULT 25,
  expires_at DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_slug (slug),
  UNIQUE KEY unique_code (access_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add team_id to players (nullable — free players have no team)
-- ALTER TABLE players ADD COLUMN team_id INT DEFAULT NULL;
-- ALTER TABLE players ADD INDEX idx_team (team_id);

-- Decision game scores
CREATE TABLE IF NOT EXISTS decision_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  scenario_id VARCHAR(100) NOT NULL,
  correct TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);
