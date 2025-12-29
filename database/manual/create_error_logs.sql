-- Error Logs Table
-- Run this in BOTH 10k-dev AND 10k-prod Supabase projects
--
-- This table captures errors from the mobile app for debugging.
-- Users can INSERT errors but cannot READ them (only viewable via dashboard).

-- ============================================
-- 1. CREATE THE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Who experienced the error (NULL if not logged in)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Error details
  level TEXT NOT NULL CHECK (level IN ('error', 'warn', 'info')),
  message TEXT NOT NULL,
  error_name TEXT,                          -- Error type (e.g., "TypeError")
  error_stack TEXT,                         -- Stack trace (sanitized)

  -- Context
  screen TEXT,                              -- Which screen user was on
  action TEXT,                              -- What they were doing

  -- Device/App info
  app_version TEXT,                         -- e.g., "1.0.0"
  platform TEXT,                            -- "android", "ios", "web"

  -- Additional data (flexible JSON field)
  extra_data JSONB DEFAULT '{}'::jsonb
);

-- Index for querying recent errors
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

-- Index for filtering by level
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);

-- Index for filtering by user
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);

-- ============================================
-- 2. SET UP ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can INSERT errors (even anonymous users)
-- This allows logging errors before/during login
CREATE POLICY "Anyone can log errors" ON error_logs
  FOR INSERT
  WITH CHECK (true);

-- Policy: No one can SELECT via the API
-- Errors are only viewable through Supabase Dashboard (service role)
CREATE POLICY "No public read access" ON error_logs
  FOR SELECT
  USING (false);

-- Policy: No one can UPDATE or DELETE via the API
CREATE POLICY "No public update access" ON error_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "No public delete access" ON error_logs
  FOR DELETE
  USING (false);

-- ============================================
-- 3. GRANT PERMISSIONS
-- ============================================

-- Allow authenticated and anonymous users to insert
GRANT INSERT ON error_logs TO authenticated;
GRANT INSERT ON error_logs TO anon;

-- ============================================
-- 4. USEFUL QUERIES (run in SQL Editor)
-- ============================================

-- View recent errors (last 24 hours):
-- SELECT created_at, level, message, screen, platform, app_version
-- FROM error_logs
-- WHERE created_at > NOW() - INTERVAL '24 hours'
-- ORDER BY created_at DESC;

-- Most common errors:
-- SELECT message, COUNT(*) as count
-- FROM error_logs
-- WHERE level = 'error'
-- GROUP BY message
-- ORDER BY count DESC
-- LIMIT 10;

-- Errors by screen:
-- SELECT screen, COUNT(*) as count
-- FROM error_logs
-- WHERE level = 'error' AND screen IS NOT NULL
-- GROUP BY screen
-- ORDER BY count DESC;

-- Errors by app version:
-- SELECT app_version, COUNT(*) as count
-- FROM error_logs
-- WHERE level = 'error'
-- GROUP BY app_version
-- ORDER BY count DESC;

-- Clear old logs (keep last 30 days):
-- DELETE FROM error_logs WHERE created_at < NOW() - INTERVAL '30 days';
