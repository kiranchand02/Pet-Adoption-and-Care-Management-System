-- Pet Adoption and Care Database Schema
-- MySQL Database Creation Script

CREATE DATABASE IF NOT EXISTS pet_adoption_care;
USE pet_adoption_care;

-- User Authentication Tables
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert default users
INSERT INTO users (username, password_hash, email, role) VALUES
('admin', '$2b$10$hash_for_admin_password', 'admin@petadoption.com', 'admin'),
('user', '$2b$10$hash_for_user_password', 'user@petadoption.com', 'user');

-- 1. Pet Table
CREATE TABLE pet (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    gender ENUM('Male', 'Female', 'Unknown') NOT NULL,
    health_status VARCHAR(200),
    rescue_date DATE,
    current_status ENUM('Available', 'Adopted', 'Under Care', 'Reserved') DEFAULT 'Available'
);

-- 2. Adopter Table
CREATE TABLE adopter (
    adopter_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_details VARCHAR(200) NOT NULL,
    address TEXT,
    preference TEXT,
    adoption_history TEXT
);

-- 3. Adoption Record Table
CREATE TABLE adoption_record (
    adoption_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    adopter_id INT NOT NULL,
    adoption_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (adopter_id) REFERENCES adopter(adopter_id) ON DELETE CASCADE
);

-- 4. Veterinary Care Table
CREATE TABLE veterinary_care (
    care_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    checkup_date DATE NOT NULL,
    treatment TEXT,
    vet_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (pet_id) REFERENCES pet(pet_id) ON DELETE CASCADE
);

-- 5. Shelter Table
CREATE TABLE shelter (
    shelter_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    capacity INT,
    contact_info VARCHAR(200)
);

-- 6. Donation/Volunteer Table
CREATE TABLE donation_volunteer (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2),
    date DATE NOT NULL,
    purpose ENUM('Food', 'Shelter', 'Medical', 'General') NOT NULL
);

-- Add shelter_id to pet table to link pets with shelters
ALTER TABLE pet ADD COLUMN shelter_id INT;
ALTER TABLE pet ADD FOREIGN KEY (shelter_id) REFERENCES shelter(shelter_id);

-- Create indexes for better performance
CREATE INDEX idx_pet_species ON pet(species);
CREATE INDEX idx_pet_status ON pet(current_status);
CREATE INDEX idx_adoption_status ON adoption_record(status);
CREATE INDEX idx_adoption_date ON adoption_record(adoption_date);
CREATE INDEX idx_vet_checkup_date ON veterinary_care(checkup_date);

-- Sample data insertion
INSERT INTO shelter (name, location, capacity, contact_info) VALUES
('Happy Paws Shelter', '123 Main St, City A', 50, 'phone: 555-0101, email: info@happypaws.com'),
('Animal Haven', '456 Oak Ave, City B', 75, 'phone: 555-0102, email: contact@animalhaven.org'),
('Rescue Paradise', '789 Cedar Blvd, City C', 60, 'phone: 555-0103, email: help@rescueparadise.org'),
('Furry Friends Sanctuary', '321 Birch Lane, City D', 40, 'phone: 555-0104, email: info@furryfriends.com'),
('Paws & Hearts Shelter', '654 Willow Dr, City E', 80, 'phone: 555-0105, email: contact@pawshearts.net'),
('Safe Haven Animal Rescue', '987 Spruce St, City F', 35, 'phone: 555-0106, email: admin@safehaven.org');

INSERT INTO pet (name, species, breed, age, gender, health_status, rescue_date, current_status, shelter_id) VALUES
('Buddy', 'Dog', 'Golden Retriever', 3, 'Male', 'Healthy', '2024-01-15', 'Available', 1),
('Whiskers', 'Cat', 'Persian', 2, 'Female', 'Needs vaccination', '2024-02-10', 'Available', 1),
('Max', 'Dog', 'German Shepherd', 5, 'Male', 'Healthy', '2024-01-20', 'Adopted', 2),
('Luna', 'Cat', 'Siamese', 1, 'Female', 'Healthy', '2024-03-01', 'Available', 1),
('Charlie', 'Dog', 'Labrador', 4, 'Male', 'Healthy', '2024-02-20', 'Adopted', 2),
('Mittens', 'Cat', 'Maine Coon', 3, 'Female', 'Spayed, healthy', '2024-01-25', 'Available', 3),
('Rex', 'Dog', 'Bulldog', 6, 'Male', 'Arthritis treatment', '2024-02-05', 'Under Care', 1),
('Bella', 'Dog', 'Beagle', 2, 'Female', 'Healthy', '2024-03-10', 'Available', 4),
('Shadow', 'Cat', 'British Shorthair', 7, 'Male', 'Senior care needed', '2024-01-30', 'Available', 2),
('Daisy', 'Rabbit', 'Holland Lop', 1, 'Female', 'Healthy', '2024-03-05', 'Available', 3),
('Tweety', 'Bird', 'Canary', 2, 'Male', 'Healthy', '2024-02-15', 'Available', 4),
('Coco', 'Bird', 'Cockatiel', 3, 'Female', 'Healthy', '2024-03-12', 'Adopted', 5),
('Snowball', 'Rabbit', 'Angora', 2, 'Male', 'Needs grooming', '2024-02-28', 'Available', 5),
('Ginger', 'Cat', 'Orange Tabby', 4, 'Female', 'Healthy', '2024-01-18', 'Adopted', 6),
('Rocky', 'Dog', 'Rottweiler', 5, 'Male', 'Healthy', '2024-02-22', 'Available', 6),
('Patches', 'Cat', 'Calico', 3, 'Female', 'Healthy', '2024-03-08', 'Available', 1),
('Buster', 'Dog', 'Jack Russell', 2, 'Male', 'High energy, healthy', '2024-03-15', 'Available', 2),
('Fluffy', 'Rabbit', 'Lionhead', 1, 'Female', 'Healthy', '2024-03-20', 'Available', 3),
('Polly', 'Bird', 'Parakeet', 1, 'Female', 'Young, healthy', '2024-03-18', 'Available', 4),
('Oreo', 'Cat', 'Tuxedo', 2, 'Male', 'Neutered, healthy', '2024-02-12', 'Adopted', 5),
('Zeus', 'Dog', 'Great Dane', 4, 'Male', 'Healthy giant', '2024-01-28', 'Available', 6),
('Nemo', 'Fish', 'Goldfish', 1, 'Unknown', 'Healthy', '2024-03-22', 'Available', 1),
('Spike', 'Hedgehog', 'African Pygmy', 2, 'Male', 'Healthy', '2024-03-25', 'Available', 2),
('Princess', 'Guinea Pig', 'Peruvian', 1, 'Female', 'Healthy', '2024-03-28', 'Available', 3),
('Bandit', 'Ferret', 'Domestic', 3, 'Male', 'Playful, healthy', '2024-03-30', 'Available', 4),
('Rosie', 'Pig', 'Pot-bellied', 2, 'Female', 'Healthy', '2024-04-01', 'Available', 5);

INSERT INTO adopter (name, contact_details, address, preference, adoption_history) VALUES
('John Smith', 'phone: 555-1234, email: john@email.com', '789 Pine St, City C', 'Dogs, medium to large size', 'First time adopter'),
('Sarah Johnson', 'phone: 555-5678, email: sarah@email.com', '321 Elm St, City D', 'Cats, indoor pets', 'Previously adopted 1 cat'),
('Mike Wilson', 'phone: 555-9876, email: mike@email.com', '456 Maple Ave, City E', 'Small dogs, puppies', 'Experienced dog owner'),
('Lisa Chen', 'phone: 555-4321, email: lisa@email.com', '123 Oak Dr, City F', 'Birds, exotic pets', 'Bird enthusiast'),
('David Brown', 'phone: 555-8765, email: david@email.com', '789 Elm Ct, City G', 'Cats, senior pets', 'Senior pet advocate'),
('Emma Davis', 'phone: 555-2468, email: emma@email.com', '321 Pine Rd, City H', 'Rabbits, small animals', 'Small animal lover'),
('Robert Taylor', 'phone: 555-1357, email: robert@email.com', '654 Cedar Ave, City I', 'Large dogs, working breeds', 'Active lifestyle'),
('Jennifer White', 'phone: 555-9753, email: jennifer@email.com', '987 Birch St, City J', 'Any species, rescue advocate', 'Multiple pet household'),
('Kevin Martinez', 'phone: 555-8642, email: kevin@email.com', '147 Willow Ln, City K', 'Dogs, family pets', 'Family with children'),
('Amanda Garcia', 'phone: 555-7531, email: amanda@email.com', '258 Spruce Blvd, City L', 'Cats, quiet companions', 'Apartment living');

INSERT INTO adoption_record (pet_id, adopter_id, adoption_date, status) VALUES
(3, 1, '2024-03-01', 'Approved'),
(1, 2, '2024-03-15', 'Pending'),
(5, 3, '2024-03-18', 'Approved'),
(12, 4, '2024-03-20', 'Approved'),
(14, 5, '2024-03-22', 'Approved'),
(20, 6, '2024-03-25', 'Approved'),
(8, 7, '2024-03-28', 'Pending'),
(16, 8, '2024-03-30', 'Pending'),
(21, 9, '2024-04-02', 'Approved'),
(11, 10, '2024-04-05', 'Pending'),
(2, 1, '2024-04-08', 'Pending'),
(4, 3, '2024-04-10', 'Approved'),
(6, 2, '2024-04-12', 'Pending'),
(9, 5, '2024-04-15', 'Pending'),
(10, 6, '2024-04-18', 'Approved'),
(13, 4, '2024-04-20', 'Pending'),
(15, 7, '2024-04-22', 'Pending'),
(17, 8, '2024-04-25', 'Approved'),
(18, 9, '2024-04-28', 'Pending'),
(19, 10, '2024-04-30', 'Pending');

INSERT INTO veterinary_care (pet_id, checkup_date, treatment, vet_name) VALUES
(1, '2024-02-01', 'Routine checkup, vaccinations', 'Dr. Emily Wilson'),
(2, '2024-02-15', 'Vaccination, deworming', 'Dr. Michael Brown'),
(3, '2024-02-28', 'Pre-adoption health check', 'Dr. Emily Wilson'),
(4, '2024-03-02', 'Spay surgery, post-op care', 'Dr. Sarah Martinez'),
(5, '2024-02-25', 'Vaccination, health certificate', 'Dr. James Lee'),
(6, '2024-01-28', 'Spay surgery, dental cleaning', 'Dr. Emily Wilson'),
(7, '2024-02-08', 'Arthritis medication, joint supplements', 'Dr. Michael Brown'),
(8, '2024-03-12', 'Routine checkup, heartworm test', 'Dr. Sarah Martinez'),
(9, '2024-02-02', 'Senior wellness exam, blood work', 'Dr. James Lee'),
(10, '2024-03-07', 'Vaccination, nail trim', 'Dr. Emily Wilson'),
(11, '2024-02-18', 'Wing clipping, health check', 'Dr. Michael Brown'),
(12, '2024-03-14', 'Pre-adoption exam, microchip', 'Dr. Sarah Martinez'),
(13, '2024-03-01', 'Grooming, parasite check', 'Dr. James Lee'),
(14, '2024-01-20', 'Spay surgery, vaccination', 'Dr. Emily Wilson'),
(15, '2024-02-24', 'Routine checkup, deworming', 'Dr. Michael Brown'),
(16, '2024-03-10', 'Vaccination, behavior assessment', 'Dr. Sarah Martinez'),
(17, '2024-03-17', 'Neuter surgery, recovery', 'Dr. James Lee'),
(18, '2024-03-22', 'Health check, diet consultation', 'Dr. Emily Wilson'),
(19, '2024-03-20', 'Wing examination, nutrition advice', 'Dr. Michael Brown'),
(20, '2024-02-14', 'Neuter surgery, vaccination', 'Dr. Sarah Martinez'),
(21, '2024-01-30', 'Routine checkup, X-rays', 'Dr. James Lee'),
(22, '2024-03-24', 'Water quality test, feeding guide', 'Dr. Emily Wilson'),
(23, '2024-03-27', 'Quill examination, diet plan', 'Dr. Michael Brown'),
(24, '2024-03-29', 'Vaccination, social behavior check', 'Dr. Sarah Martinez'),
(25, '2024-04-01', 'Health screening, play assessment', 'Dr. James Lee'),
(26, '2024-04-03', 'Vaccination, weight monitoring', 'Dr. Emily Wilson'),
(1, '2024-04-10', 'Follow-up vaccination, health assessment', 'Dr. Emily Wilson'),
(2, '2024-04-12', 'Dental cleaning, oral health check', 'Dr. Michael Brown'),
(4, '2024-04-15', 'Post-spay checkup, suture removal', 'Dr. Sarah Martinez'),
(6, '2024-04-18', 'Dental follow-up, tartar removal', 'Dr. Emily Wilson'),
(7, '2024-04-20', 'Arthritis medication adjustment', 'Dr. Michael Brown'),
(8, '2024-04-22', 'Heartworm prevention, flea treatment', 'Dr. Sarah Martinez'),
(9, '2024-04-25', 'Senior blood panel, kidney function', 'Dr. James Lee'),
(11, '2024-04-28', 'Wing health check, beak trim', 'Dr. Michael Brown'),
(13, '2024-04-30', 'Grooming session, mat removal', 'Dr. James Lee'),
(15, '2024-05-02', 'Behavioral assessment, training tips', 'Dr. Michael Brown'),
(17, '2024-05-05', 'Energy level evaluation, diet plan', 'Dr. James Lee'),
(19, '2024-05-08', 'Young bird development check', 'Dr. Michael Brown'),
(21, '2024-05-10', 'Large breed joint examination', 'Dr. James Lee'),
(23, '2024-05-12', 'Exotic pet wellness, quill health', 'Dr. Michael Brown'),
(25, '2024-05-15', 'Ferret vaccination, play behavior', 'Dr. James Lee');

INSERT INTO donation_volunteer (donor_name, amount, date, purpose) VALUES
('Anonymous Donor', 500.00, '2024-01-10', 'Food'),
('Pet Lovers Club', 1000.00, '2024-02-05', 'Medical'),
('Local Business', 750.00, '2024-03-01', 'Shelter');

-- ========================================
-- PET MANAGEMENT STORED PROCEDURES
-- ========================================

DELIMITER //

-- Add New Pet
CREATE PROCEDURE AddPet(
    IN p_name VARCHAR(100),
    IN p_species VARCHAR(50),
    IN p_breed VARCHAR(100),
    IN p_age INT,
    IN p_gender ENUM('Male', 'Female', 'Unknown'),
    IN p_health_status VARCHAR(200),
    IN p_rescue_date DATE,
    IN p_shelter_id INT
)
BEGIN
    INSERT INTO pet (name, species, breed, age, gender, health_status, rescue_date, current_status, shelter_id)
    VALUES (p_name, p_species, p_breed, p_age, p_gender, p_health_status, p_rescue_date, 'Available', p_shelter_id);
    SELECT LAST_INSERT_ID() as pet_id;
END //

-- Update Pet Information
CREATE PROCEDURE UpdatePet(
    IN p_pet_id INT,
    IN p_name VARCHAR(100),
    IN p_species VARCHAR(50),
    IN p_breed VARCHAR(100),
    IN p_age INT,
    IN p_gender ENUM('Male', 'Female', 'Unknown'),
    IN p_health_status VARCHAR(200),
    IN p_shelter_id INT
)
BEGIN
    UPDATE pet 
    SET name = p_name, species = p_species, breed = p_breed, age = p_age, 
        gender = p_gender, health_status = p_health_status, shelter_id = p_shelter_id
    WHERE pet_id = p_pet_id;
    SELECT ROW_COUNT() as affected_rows;
END //

-- Mark Pet Status
CREATE PROCEDURE MarkPetStatus(
    IN p_pet_id INT,
    IN p_status ENUM('Available', 'Adopted', 'Under Care', 'Reserved')
)
BEGIN
    UPDATE pet SET current_status = p_status WHERE pet_id = p_pet_id;
    SELECT ROW_COUNT() as affected_rows;
END //

-- Get Pet Details
CREATE PROCEDURE GetPetDetails(IN p_pet_id INT)
BEGIN
    SELECT p.*, s.name as shelter_name, s.location as shelter_location
    FROM pet p
    LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
    WHERE p.pet_id = p_pet_id;
END //

-- List All Pets with Filter
CREATE PROCEDURE ListPets(
    IN p_status VARCHAR(20),
    IN p_species VARCHAR(50)
)
BEGIN
    SELECT p.*, s.name as shelter_name
    FROM pet p
    LEFT JOIN shelter s ON p.shelter_id = s.shelter_id
    WHERE (p_status IS NULL OR p.current_status = p_status)
    AND (p_species IS NULL OR p.species = p_species)
    ORDER BY p.rescue_date DESC;
END //

DELIMITER ;

-- ========================================
-- PASSWORD RESET PROCEDURES
-- ========================================

DELIMITER //

-- Generate Password Reset Token
CREATE PROCEDURE GenerateResetToken(
    IN p_email VARCHAR(100)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_token VARCHAR(255);
    
    -- Check if user exists
    SELECT user_id INTO v_user_id FROM users WHERE email = p_email;
    
    IF v_user_id IS NOT NULL THEN
        -- Generate token (in real implementation, this would be a secure random token)
        SET v_token = CONCAT('reset_', v_user_id, '_', UNIX_TIMESTAMP());
        
        -- Insert reset token (expires in 1 hour)
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (v_user_id, v_token, DATE_ADD(NOW(), INTERVAL 1 HOUR));
        
        SELECT v_token as reset_token, 'Token generated successfully' as message;
    ELSE
        SELECT NULL as reset_token, 'Email not found' as message;
    END IF;
END //

-- Verify Reset Token
CREATE PROCEDURE VerifyResetToken(
    IN p_token VARCHAR(255)
)
BEGIN
    SELECT u.user_id, u.username, u.email, prt.token
    FROM password_reset_tokens prt
    JOIN users u ON prt.user_id = u.user_id
    WHERE prt.token = p_token 
    AND prt.expires_at > NOW() 
    AND prt.used = FALSE;
END //

-- Reset Password
CREATE PROCEDURE ResetPassword(
    IN p_token VARCHAR(255),
    IN p_new_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    
    -- Get user_id from valid token
    SELECT prt.user_id INTO v_user_id
    FROM password_reset_tokens prt
    WHERE prt.token = p_token 
    AND prt.expires_at > NOW() 
    AND prt.used = FALSE;
    
    IF v_user_id IS NOT NULL THEN
        -- Update password
        UPDATE users SET password_hash = p_new_password_hash WHERE user_id = v_user_id;
        
        -- Mark token as used
        UPDATE password_reset_tokens SET used = TRUE WHERE token = p_token;
        
        SELECT 'Password reset successfully' as message, 1 as success;
    ELSE
        SELECT 'Invalid or expired token' as message, 0 as success;
    END IF;
END //

DELIMITER ;

-- ========================================
-- USAGE EXAMPLES
-- ========================================

-- Add a new pet
-- CALL AddPet('Luna', 'Cat', 'Siamese', 1, 'Female', 'Healthy', '2024-03-20', 1);

-- Update pet information
-- CALL UpdatePet(1, 'Buddy Updated', 'Dog', 'Golden Retriever', 4, 'Male', 'Excellent health', 1);

-- Mark pet as adopted
-- CALL MarkPetStatus(1, 'Adopted');

-- Mark pet as under treatment
-- CALL MarkPetStatus(2, 'Under Care');

-- Mark pet as available
-- CALL MarkPetStatus(3, 'Available');

-- Get specific pet details
-- CALL GetPetDetails(1);

-- List all available pets
-- CALL ListPets('Available', NULL);

-- List all dogs
-- CALL ListPets(NULL, 'Dog');

-- List available cats
-- CALL ListPets('Available', 'Cat');

-- ========================================
-- ADOPTER MANAGEMENT STORED PROCEDURES
-- ========================================

DELIMITER //

-- Register New Adopter
CREATE PROCEDURE RegisterAdopter(
    IN p_name VARCHAR(100),
    IN p_contact_details VARCHAR(200),
    IN p_address TEXT,
    IN p_preference TEXT
)
BEGIN
    INSERT INTO adopter (name, contact_details, address, preference, adoption_history)
    VALUES (p_name, p_contact_details, p_address, p_preference, 'New adopter');
    SELECT LAST_INSERT_ID() as adopter_id;
END //

-- Update Adopter Information
CREATE PROCEDURE UpdateAdopter(
    IN p_adopter_id INT,
    IN p_name VARCHAR(100),
    IN p_contact_details VARCHAR(200),
    IN p_address TEXT,
    IN p_preference TEXT
)
BEGIN
    UPDATE adopter 
    SET name = p_name, contact_details = p_contact_details, 
        address = p_address, preference = p_preference
    WHERE adopter_id = p_adopter_id;
    SELECT ROW_COUNT() as affected_rows;
END //

-- Get Adopter Details
CREATE PROCEDURE GetAdopterDetails(IN p_adopter_id INT)
BEGIN
    SELECT * FROM adopter WHERE adopter_id = p_adopter_id;
END //

-- View Adopter's Adoption History
CREATE PROCEDURE ViewAdoptionHistory(IN p_adopter_id INT)
BEGIN
    SELECT ar.adoption_id, ar.adoption_date, ar.status,
           p.name as pet_name, p.species, p.breed, p.age, p.gender
    FROM adoption_record ar
    JOIN pet p ON ar.pet_id = p.pet_id
    WHERE ar.adopter_id = p_adopter_id
    ORDER BY ar.adoption_date DESC;
END //

-- List All Adopters
CREATE PROCEDURE ListAdopters()
BEGIN
    SELECT adopter_id, name, contact_details, preference
    FROM adopter
    ORDER BY name;
END //

DELIMITER ;

-- ========================================
-- ADOPTER MANAGEMENT USAGE EXAMPLES
-- ========================================

-- Register new adopter
-- CALL RegisterAdopter('Mike Wilson', 'phone: 555-9999, email: mike@email.com', '456 Maple Ave, City E', 'Small dogs, puppies');

-- Update adopter preferences
-- CALL UpdateAdopter(1, 'John Smith Updated', 'phone: 555-1234, email: john.new@email.com', '789 Pine St, City C', 'Large dogs, active breeds');

-- Get adopter details
-- CALL GetAdopterDetails(1);

-- View adoption history for specific adopter
-- CALL ViewAdoptionHistory(1);

-- List all registered adopters
-- CALL ListAdopters();