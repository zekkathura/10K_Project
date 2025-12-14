-- ============================================================================
-- CLEAR ALL DATA - Development Reset Script
-- ============================================================================
-- WARNING: This will DELETE ALL DATA from all tables!
-- Tables and schema will remain intact, only rows are deleted.
-- Use this to start fresh during development.
-- ============================================================================

-- Disable triggers temporarily to speed up deletion
SET session_replication_role = replica;

-- ============================================================================
-- DELETE DATA (in order to respect foreign key constraints)
-- ============================================================================

-- Step 1: Delete turns (no FK dependencies, but references game_players & games)
DELETE FROM turns;

-- Step 2: Delete game_players (references games & profiles)
DELETE FROM game_players;

-- Step 3: Delete games (references profiles)
DELETE FROM games;

-- Step 4: Delete profiles (references auth.users via CASCADE)
-- Note: This will also delete from auth.users due to CASCADE
DELETE FROM profiles;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- ============================================================================
-- VERIFICATION QUERY (run after to confirm)
-- ============================================================================
-- Uncomment to verify all tables are empty:

-- SELECT 'profiles' AS table_name, COUNT(*) AS row_count FROM profiles
-- UNION ALL
-- SELECT 'games', COUNT(*) FROM games
-- UNION ALL
-- SELECT 'game_players', COUNT(*) FROM game_players
-- UNION ALL
-- SELECT 'turns', COUNT(*) FROM turns;

-- Expected output: All tables should show 0 rows

-- ============================================================================
-- NOTES
-- ============================================================================
-- - This script is SAFE to run multiple times
-- - Table structure, RLS policies, and functions are NOT affected
-- - Only ROW DATA is deleted
-- - If you want to also clear auth.users, run separately:
--   DELETE FROM auth.users;
-- ============================================================================
