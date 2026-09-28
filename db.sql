CREATE DATABASE IF NOT EXISTS medtracker_db;
USE medtracker_db;

CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dosage INT NOT NULL,
    frequency INT NOT NULL,
    duration INT NOT NULL,
    start_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL
);

INSERT INTO medications (name, dosage, frequency, duration, start_date, category) VALUES
('Ibuprofen', 200, 3, 7, '2025-03-15', 'Painkiller'),
('Amoxicillin', 500, 3, 10, '2025-03-12', 'Antibiotic'),
('Vitamin D', 1000, 1, 30, '2025-03-10', 'Vitamin'),
('Cetirizine', 10, 1, 14, '2025-03-08', 'Allergy');
