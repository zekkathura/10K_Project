-- ============================================================================
-- MIGRATION: Drop game_name column from games table
-- ============================================================================
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (idempotent)
-- ============================================================================

-- Drop the column if it exists
ALTER TABLE games DROP COLUMN IF EXISTS game_name;

-- ============================================================================
-- VERIFICATION: Run this to confirm the column is gone
-- ============================================================================
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'games' ORDER BY ordinal_position;
-- ============================================================================
