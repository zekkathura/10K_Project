-- ============================================================================
-- MIGRATION: Simplify profiles table and require display_name (v2 - ROBUST)
-- ============================================================================
-- Changes:
-- 1. Make display_name NOT NULL (required for all users)
-- 2. Remove player_type column (if exists)
-- 3. Remove registration_type column (if exists)
-- 4. Remove registered_name column (if exists)
-- 5. Add trigger to auto-set display_name from email if not provided
--
-- This version safely handles any starting schema state
-- ============================================================================

-- Step 1: Ensure display_name column exists (add if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN display_name TEXT;
  END IF;
END $$;

-- Step 2: Add trigger function to auto-populate display_name from email
CREATE OR REPLACE FUNCTION set_default_display_name()
RETURNS TRIGGER AS $$
BEGIN
  -- If display_name is null or empty, use email prefix
  IF NEW.display_name IS NULL OR trim(NEW.display_name) = '' THEN
    NEW.display_name := split_part(NEW.email, '@', 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger to run before insert
DROP TRIGGER IF EXISTS trigger_set_default_display_name ON profiles;
CREATE TRIGGER trigger_set_default_display_name
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_default_display_name();

-- Step 4: Populate existing NULL display_names from email
-- (Safely handles if registered_name doesn't exist)
UPDATE profiles
SET display_name = split_part(email, '@', 1)
WHERE display_name IS NULL OR trim(display_name) = '';

-- Step 5: Make display_name NOT NULL
ALTER TABLE profiles
  ALTER COLUMN display_name SET NOT NULL;

-- Step 6: Drop unnecessary columns (IF THEY EXIST)
DO $$
BEGIN
  -- Drop player_type if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'player_type'
  ) THEN
    ALTER TABLE profiles DROP COLUMN player_type;
  END IF;

  -- Drop registration_type if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'registration_type'
  ) THEN
    ALTER TABLE profiles DROP COLUMN registration_type;
  END IF;

  -- Drop registered_name if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'registered_name'
  ) THEN
    ALTER TABLE profiles DROP COLUMN registered_name;
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check that all profiles have display_name:
SELECT id, email, display_name FROM profiles WHERE display_name IS NULL;
-- (Should return 0 rows)

-- Check final column structure:
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
-- Should show: id, email, display_name (NOT NULL), created_at, updated_at, theme_mode

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✓ Migration completed successfully!';
  RAISE NOTICE '  - display_name column ensured (NOT NULL)';
  RAISE NOTICE '  - Trigger set_default_display_name() created';
  RAISE NOTICE '  - Unnecessary columns removed (if they existed)';
END $$;
