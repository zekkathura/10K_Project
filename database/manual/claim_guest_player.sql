-- ============================================================================
-- CLAIM GUEST PLAYER - Manual Migration Script
-- ============================================================================
-- Run this in Supabase SQL Editor when a friend signs up
-- This links their guest game history to their new registered account
--
-- SAFE TO RUN MULTIPLE TIMES - Only updates unclaimed guests
-- ============================================================================

-- STEP 1: Set your variables (EDIT THESE VALUES)
DO $$
DECLARE
  v_guest_name TEXT := 'Mason';                   -- Guest's name from game_players
  v_new_user_email TEXT := 'blinkafailed@gmail.com';  -- Friend's signup email
  v_new_user_id UUID;
  v_updated_count INTEGER;
BEGIN

  -- STEP 2: Get the new user's UUID from their email
  SELECT id INTO v_new_user_id
  FROM profiles
  WHERE email = v_new_user_email;

  IF v_new_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Make sure they signed up first!', v_new_user_email;
  END IF;

  -- STEP 3: Update ALL guest players with this name to link them to the real user
  -- Claims from ALL games (no creator filter)
  -- Only updates unclaimed guests (is_guest=true AND user_id IS NULL)
  UPDATE game_players
  SET
    user_id = v_new_user_id,
    is_guest = false
  WHERE
    player_name = v_guest_name
    AND is_guest = true
    AND user_id IS NULL;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  -- STEP 4: Report results
  RAISE NOTICE '✓ Successfully claimed % guest player record(s) for %', v_updated_count, v_guest_name;
  RAISE NOTICE '  Guest name: %', v_guest_name;
  RAISE NOTICE '  New user email: %', v_new_user_email;
  RAISE NOTICE '  New user ID: %', v_new_user_id;

  IF v_updated_count = 0 THEN
    RAISE WARNING 'No unclaimed guest players found with name "%" in your games', v_guest_name;
  END IF;

END $$;

-- ============================================================================
-- VERIFICATION QUERIES (Uncomment to use)
-- ============================================================================

-- Preview what will be claimed (run this first to verify):
/*
SELECT
  gp.id,
  gp.player_name,
  gp.is_guest,
  gp.user_id,
  gp.total_score,
  COUNT(t.id) as turn_count
FROM game_players gp
LEFT JOIN turns t ON t.player_id = gp.id
WHERE gp.player_name = 'Mason'  -- Replace with guest name
  AND gp.is_guest = true
  AND gp.user_id IS NULL
GROUP BY gp.id, gp.player_name, gp.is_guest, gp.user_id, gp.total_score;
*/

-- Verify claim was successful:
/*
SELECT
  gp.id,
  gp.player_name,
  gp.is_guest,
  p.email as linked_email,
  gp.total_score
FROM game_players gp
LEFT JOIN profiles p ON gp.user_id = p.id
WHERE gp.player_name = 'Mason'  -- Replace with guest name
ORDER BY gp.is_guest DESC;
*/

-- ============================================================================
-- NOTES
-- ============================================================================
-- - Script is SAFE TO RUN MULTIPLE TIMES (idempotent)
-- - Claims ALL guests with matching name (no game creator filter)
-- - Only updates unclaimed guests (is_guest=true AND user_id IS NULL)
-- - All turn history automatically transfers (FK: turns.player_id → game_players.id)
-- - Original guest records remain intact if already claimed
-- ============================================================================
