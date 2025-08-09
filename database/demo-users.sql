-- Insert demo users for testing
INSERT OR IGNORE INTO users (name, email, password_hash, role, phone, birthdate) VALUES 
  ('John Doe', 'customer@bluebelong.com', 'hashed_password_demo123', 'customer', '+1234567890', '1990-05-15'),
  ('Nilanjana Admin', 'nilanjana@bluebelong.com', '$2b$10$QU5QZJ704lTfrkX9W/4RIuWbQGaYjptGmOjrlcIJuPL.cHBpHpNDe', 'admin', '+0987654321', '1985-03-22');
