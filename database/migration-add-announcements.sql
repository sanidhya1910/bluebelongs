-- Migration: add the announcements + announcement_replies tables (message board).
-- Apply with:
--   npx wrangler d1 execute bluebelong-bookings \
--     --file=./database/migration-add-announcements.sql \
--     --config=wrangler.worker.toml --remote
-- (Drop --remote to apply to the local dev database.)

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'announcement')),
  priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcement_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  announcement_id INTEGER NOT NULL,
  user_id INTEGER,
  user_name TEXT,
  user_email TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (announcement_id) REFERENCES announcements(id)
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(active);
CREATE INDEX IF NOT EXISTS idx_announcement_replies_announcement ON announcement_replies(announcement_id);
