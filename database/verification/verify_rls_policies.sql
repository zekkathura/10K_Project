-- ============================================================================
-- RLS POLICY VERIFICATION
-- ============================================================================
-- Run this in Supabase SQL Editor to check all RLS policies
-- Compare output with expected policies in CURRENT_SCHEMA.sql
-- ============================================================================

-- Check RLS enabled status for all tables
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- List all policies with details
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd AS command,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- EXPECTED POLICIES (for reference)
-- ============================================================================
-- profiles:
--   - Users can view own profile (SELECT, auth.uid() = id)
--   - Users can insert own profile (INSERT, auth.uid() = id)
--   - Users can update own profile (UPDATE, auth.uid() = id)
--
-- games:
--   - Users can view games they created (SELECT, auth.uid() = created_by_user_id)
--   - Users can view games they joined (SELECT, via game_players)
--   - Users can insert own games (INSERT, auth.uid() = created_by_user_id)
--   - Users can update own games (UPDATE, auth.uid() = created_by_user_id)
--
-- game_players:
--   - Users can view players in games they're in (SELECT)
--   - Game creator can insert players (INSERT)
--   - etc.
--
-- turns:
--   - Users can view turns in games they're in (SELECT)
--   - Users can insert own turns (INSERT)
--   - etc.
-- ============================================================================
