-- Migration to add user_id column to bookings table
-- Run this if your database already exists

-- Add user_id column to bookings table
ALTER TABLE bookings ADD COLUMN user_id INTEGER;

-- Add foreign key constraint (SQLite doesn't support adding constraints after table creation)
-- We'll handle the relationship in the application level
