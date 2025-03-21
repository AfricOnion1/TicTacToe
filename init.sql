CREATE DATABASE IF NOT EXISTS tictactoe;
USE tictactoe;

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_record VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE EVENT IF NOT EXISTS delete_old_games
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM games WHERE date < DATE_SUB(NOW(), INTERVAL 60 DAY);
//
DELIMITER ;
