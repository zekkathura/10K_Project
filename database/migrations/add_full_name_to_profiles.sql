-- ============================================================================
-- ADD FULL_NAME TO PROFILES
-- ============================================================================
-- Adds immutable full_name column to store OAuth provider's full name
-- This is for admin visibility only - display_name is what users see/edit
--
-- Run in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS pattern)
-- ============================================================================

-- Add full_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
    RAISE NOTICE 'Added full_name column to profiles table';
  ELSE
    RAISE NOTICE 'full_name column already exists';
  END IF;
END $$;

-- Add comment to document the column purpose
COMMENT ON COLUMN profiles.full_name IS 'Immutable full name from OAuth provider (admin reference only). Do not expose to users or use for display purposes - use display_name instead.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this to verify the column was added:
/*
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
*/
