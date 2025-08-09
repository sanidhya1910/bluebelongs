-- Blue Belongs Diving School Database Schema
-- For use with Cloudflare D1 or any SQLite database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  birthdate DATE,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'instructor', 'customer')),
  phone TEXT,
  certification_level TEXT,
  total_dives INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  used_at DATETIME
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  dives INTEGER,
  price TEXT,
  level TEXT,
  certification TEXT,
  category TEXT CHECK (category IN ('beginner', 'certification', 'specialty')),
  available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  course_price TEXT,
  preferred_date DATE NOT NULL,
  experience TEXT,
  medical_cleared BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled', 'refunded')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Medical forms table
CREATE TABLE IF NOT EXISTS medical_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  medical_answers TEXT, -- JSON string of medical questionnaire answers
  physician_approval BOOLEAN DEFAULT FALSE,
  physician_notes TEXT,
  form_completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email logs table (for tracking sent emails)
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER,
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'booking_confirmation', 'reminder', 'cancellation', etc.
  subject TEXT,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Insert sample courses
INSERT OR IGNORE INTO courses (id, title, description, duration, dives, price, level, certification, category) VALUES
-- Entry Level Programs
('try-scuba', 'Try Scuba', 'Safe and exhilarating introduction to scuba diving, perfect for non-swimmers.', '3 hours', 1, '₹4,500', 'Beginner', 'Try Scuba Experience', 'beginner'),
('basic-diver', 'SSI Basic Diver', 'Gateway to exploring depths of up to 12 meters with an experienced SSI Professional.', '4 hours', 1, '₹7,500', 'Beginner', 'SSI Basic Diver', 'beginner'),
('scuba-diver', 'SSI Scuba Diver', 'Excellent starting point combining online learning with practical dives.', '2 days', 2, '₹15,000', 'Beginner', 'SSI Scuba Diver', 'beginner'),
('open-water', 'SSI Open Water Diver', 'Globally recognized certification program. Your gateway to lifelong diving adventures.', '4 days', 4, '₹35,000', 'Beginner', 'SSI Open Water Diver', 'beginner'),

-- Continuing Education
('advanced-adventurer', 'SSI Advanced Adventurer', 'Sample five SSI specialties through Adventure Dives.', '3 days', 5, '₹25,000', 'Intermediate', 'SSI Advanced Adventurer', 'certification'),
('scuba-skill-update', 'SSI Scuba Skill Update', 'Refresh your skills after inactivity.', '1 day', 0, '₹8,000', 'Refresher', 'Skill Update', 'certification'),
('diver-stress-rescue', 'SSI Diver Stress and Rescue', 'Comprehensive course to manage emergencies effectively.', '3-4 days', 4, 'Contact for pricing', 'Advanced', 'SSI Diver Stress and Rescue', 'certification'),

-- Specialties
('deep-diving', 'SSI Deep Diving Specialty', 'Prepare for dives ranging from 18 to 40 meters deep.', '2 days', 4, 'Contact for pricing', 'Advanced', 'SSI Deep Diving Specialty', 'specialty'),
('perfect-buoyancy', 'SSI Perfect Buoyancy', 'Master buoyancy control underwater.', '1-2 days', 2, 'Contact for pricing', 'Open Water', 'SSI Perfect Buoyancy', 'specialty'),
('nitrox', 'SSI Nitrox Specialty', 'Learn enriched air nitrox diving for longer bottom times.', '1 day', 2, 'Contact for pricing', 'Open Water', 'SSI Nitrox Specialty', 'specialty'),
('navigation', 'SSI Navigation Specialty', 'Master underwater navigation with compass and natural techniques.', '2 days', 3, 'Contact for pricing', 'Open Water', 'SSI Navigation Specialty', 'specialty'),
('fish-identification', 'SSI Fish Identification', 'Learn to identify fish species, their behaviors, and habitats.', '2 days', 2, 'Contact for pricing', 'Open Water', 'SSI Fish Identification', 'specialty'),
('wreck-diving', 'SSI Wreck Diving (Havelock Only)', 'Explore and navigate wreck dive sites safely.', '2 days', 4, 'Contact for pricing', 'Advanced', 'SSI Wreck Diving', 'specialty'),
('night-diving', 'SSI Night & Limited Visibility (Havelock Only)', 'Safely navigate underwater environments in low light.', '2 days', 3, 'Contact for pricing', 'Open Water', 'SSI Night & Limited Visibility', 'specialty');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_medical_forms_booking ON medical_forms(booking_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
