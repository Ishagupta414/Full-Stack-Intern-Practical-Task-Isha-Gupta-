CREATE DATABASE IF NOT EXISTS task_board_db;

USE task_board_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, status)
VALUES
('Complete Mini Task Board', 'todo'),
('Learn Next.js API Routes', 'in-progress'),
('Connect MySQL Database', 'done');