-- Migration: add the reviews table (D1-backed customer course reviews).
-- Apply with:
--   npx wrangler d1 execute bluebelong-bookings \
--     --file=./database/migration-add-reviews.sql \
--     --config=wrangler.worker.toml --remote
-- (Drop --remote to apply to the local dev database.)

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  booking_id INTEGER,
  course_id TEXT,
  course_name TEXT,
  reviewer_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  approved_at DATETIME,
  approved_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_course ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
