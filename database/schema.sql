CREATE DATABASE IF NOT EXISTS agriculture_disease_management;
USE agriculture_disease_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('farmer','expert','scientist','admin') NOT NULL,
    phone VARCHAR(30),
    address VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    farm_name VARCHAR(150),
    farm_location VARCHAR(255),
    farm_size VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    area VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(150) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    symptoms TEXT,
    causes TEXT,
    prevention TEXT,
    treatment TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS disease_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    crop_id INT,
    crop_name VARCHAR(100) NOT NULL,
    symptoms TEXT NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    status ENUM('Pending','Under Review','Diagnosed','Treatment Recommended','Resolved') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS diagnoses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    expert_id INT NOT NULL,
    disease_id INT,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES disease_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    expert_id INT,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    response TEXT,
    status ENUM('Pending','Answered') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS farming_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expert_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS research_findings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scientist_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    crop VARCHAR(100),
    disease VARCHAR(150),
    findings TEXT NOT NULL,
    published TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scientist_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_reports_farmer ON disease_reports(farmer_id);
CREATE INDEX idx_reports_status ON disease_reports(status);
CREATE INDEX idx_crops_farmer ON crops(farmer_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_queries_farmer ON queries(farmer_id);

INSERT IGNORE INTO users (name,email,password,role,phone,address)
VALUES
('Demo Farmer','farmer@example.com','$2b$10$e0NR0V5Q7rM2jJ7Jp6wJuex7mX3y6p9G2Wc0m1r5nKQ3p4z4q6qK6','farmer','9000000001','Coimbatore'),
('Demo Expert','expert@example.com','$2b$10$e0NR0V5Q7rM2jJ7Jp6wJuex7mX3y6p9G2Wc0m1r5nKQ3p4z4q6qK6','expert','9000000002','Coimbatore'),
('Demo Scientist','scientist@example.com','$2b$10$e0NR0V5Q7rM2jJ7Jp6wJuex7mX3y6p9G2Wc0m1r5nKQ3p4z4q6qK6','scientist','9000000003','Tamil Nadu'),
('Demo Admin','admin@example.com','$2b$10$e0NR0V5Q7rM2jJ7Jp6wJuex7mX3y6p9G2Wc0m1r5nKQ3p4z4q6qK6','admin','9000000004','Tamil Nadu');

INSERT IGNORE INTO diseases (id,disease_name,crop,symptoms,causes,prevention,treatment,description)
VALUES
(1,'Leaf Blight','Rice','Brown lesions and drying leaves','Fungal infection and humid conditions','Use clean seed and proper spacing','Remove affected leaves and use suitable fungicide as advised by an expert','A common crop disease affecting rice leaves.'),
(2,'Early Blight','Tomato','Dark circular leaf spots and yellowing','Fungal infection','Crop rotation and sanitation','Remove affected foliage and follow expert treatment guidance','A fungal disease commonly affecting tomato plants.'),
(3,'Powdery Mildew','Cucumber','White powder-like growth on leaves','Fungal infection with favorable humidity','Good airflow and field sanitation','Use recommended fungicide and improve ventilation','A disease recognized by white powdery growth.');

INSERT IGNORE INTO farming_tips (id,expert_id,title,category,content)
SELECT 1,id,'Regular Crop Inspection','Prevention','Inspect crops regularly for early symptoms and report unusual changes quickly.'
FROM users WHERE email='expert@example.com';

INSERT IGNORE INTO research_findings (id,scientist_id,title,crop,disease,findings,published)
SELECT 1,id,'Crop Disease Trend Study','Rice','Leaf Blight','Regular monitoring and timely expert intervention can help manage disease spread.',1
FROM users WHERE email='scientist@example.com';
