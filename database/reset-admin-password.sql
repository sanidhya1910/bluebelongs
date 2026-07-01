-- Set / rotate the admin account password.
--
-- The old admin login relied on a hardcoded password ('neilu@havelock') and an
-- unverifiable bcrypt hash baked into the worker. That has been removed, so the
-- admin password MUST be reset to a new PBKDF2 hash before the admin can log in.
--
-- Steps:
--   1. Generate a hash:
--        node generate-hash.js 'your-new-strong-admin-password'
--   2. Paste the printed value in place of PASTE_PBKDF2_HASH_HERE below.
--   3. Apply it to the remote D1 database:
--        npx wrangler d1 execute bluebelong-bookings \
--          --file=./database/reset-admin-password.sql \
--          --config=wrangler.worker.toml --remote
--
-- (Drop --remote to apply against the local dev database instead.)

UPDATE users
SET password_hash = 'PASTE_PBKDF2_HASH_HERE',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'nilanjana@bluebelong.com';
