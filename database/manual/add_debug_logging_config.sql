-- Add debug_logging_enabled to app_config
-- This controls whether debug/info/warn logs appear in production builds
--
-- Usage:
--   - 'true' = Debug logging enabled (logs visible in production)
--   - 'false' or missing = Debug logging disabled (production default)
--
-- Security: Only you can modify this via Supabase dashboard
-- Users cannot override this setting from the app

-- Insert the setting (defaults to 'false' - disabled in production)
INSERT INTO app_config (key, value)
VALUES ('debug_logging_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- To ENABLE debug logging in production (for troubleshooting):
-- UPDATE app_config SET value = 'true' WHERE key = 'debug_logging_enabled';

-- To DISABLE debug logging (recommended for normal operation):
-- UPDATE app_config SET value = 'false' WHERE key = 'debug_logging_enabled';

-- Verify the setting:
SELECT * FROM app_config WHERE key = 'debug_logging_enabled';
