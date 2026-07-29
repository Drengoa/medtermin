-- MedTermin demo/seed data
-- Run AFTER schema.sql: mysql -u root -p < seed.sql
-- All accounts below use the password: password123

USE medtermin;

-- Specializations
INSERT INTO specializations (name) VALUES
('Cardiology'),
('Dermatology'),
('Pediatrics');

-- Offices
INSERT INTO offices (name, address) VALUES
('Central Clinic', '12 Main Street'),
('North Side Clinic', '45 Park Avenue');

-- Users (password for all: password123)
INSERT INTO users (first_name, last_name, email, password, role, phone) VALUES
('Patricia', 'Patient', 'patient@example.com', '$2b$10$5DwkxRnSaz9SrXQtor2xJ./yZjz2ZnYZX5yc0f/XRnY6GuLkkcjb.', 'patient', '0641234567'),
('Daniel', 'Doctor', 'doctor@example.com', '$2b$10$5DwkxRnSaz9SrXQtor2xJ./yZjz2ZnYZX5yc0f/XRnY6GuLkkcjb.', 'doctor', '0611234567'),
('Sarah', 'Skinwell', 'sarah.derma@example.com', '$2b$10$5DwkxRnSaz9SrXQtor2xJ./yZjz2ZnYZX5yc0f/XRnY6GuLkkcjb.', 'doctor', '0621234567'),
('Adrian', 'Admin', 'admin@example.com', '$2b$10$5DwkxRnSaz9SrXQtor2xJ./yZjz2ZnYZX5yc0f/XRnY6GuLkkcjb.', 'admin', '0601234567');

-- Doctors (linking users to specialization + office)
-- Daniel Doctor (user_id 2) - Cardiology, Central Clinic
-- Sarah Skinwell (user_id 3) - Dermatology, North Side Clinic
INSERT INTO doctors (user_id, specialization_id, office_id, bio) VALUES
(2, 1, 1, 'Cardiologist with 10+ years of experience in preventive heart care.'),
(3, 2, 2, 'Dermatologist specializing in skin health and dermatoscopy.');

-- Availability (day_of_week: 1=Monday ... 5=Friday)
INSERT INTO availability (doctor_id, day_of_week, start_time, end_time, slot_duration) VALUES
(1, 1, '08:00:00', '14:00:00', 30),
(1, 3, '08:00:00', '14:00:00', 30),
(1, 5, '08:00:00', '14:00:00', 30),
(2, 2, '10:00:00', '18:00:00', 20),
(2, 4, '10:00:00', '18:00:00', 20);

-- One sample appointment so "My Appointments" isn't empty on first login
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES
(1, 1, '2026-08-10', '09:00:00', 'pending', 'Routine check-up');
