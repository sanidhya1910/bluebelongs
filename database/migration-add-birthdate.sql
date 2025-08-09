-- Migration to add birthdate column to users table
ALTER TABLE users ADD COLUMN birthdate DATE;
