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
  v_guest_name TEXT := 'John Smith';              -- Guest's name from game_players
  v_new_user_email TEXT := 'john@example.com';    -- Friend's signup email
  v_game_creator_email TEXT := 'your@email.com';  -- Your email (for safety)
  v_new_user_id UUID;
  v_creator_id UUID;
  v_updated_count INTEGER;
BEGIN

  -- STEP 2: Get the new user's UUID from their email
  SELECT id INTO v_new_user_id
  FROM profiles
  WHERE email = v_new_user_email;

  IF v_new_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Make sure they signed up first!', v_new_user_email;
  END IF;

  -- STEP 3: Get your UUID (game creator) for safety check
  SELECT id INTO v_creator_id
  FROM profiles
  WHERE email = v_game_creator_email;

  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Game creator with email % not found', v_game_creator_email;
  END IF;

  -- STEP 4: Update guest players to link them to the real user
  -- Only updates guests in YOUR games (safety measure)
  -- Only updates unclaimed guests (is_guest=true)
  UPDATE game_players
  SET
    user_id = v_new_user_id,
    is_guest = false
  WHERE
    player_name = v_guest_name
    AND is_guest = true
    AND user_id IS NULL
    AND game_id IN (
      SELECT id FROM games WHERE created_by_user_id = v_creator_id
    );

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;

  -- STEP 5: Report results
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
  g.game_name,
  gp.total_score,
  COUNT(t.id) as turn_count
FROM game_players gp
JOIN games g ON gp.game_id = g.id
LEFT JOIN turns t ON t.player_id = gp.id
WHERE gp.player_name = 'John Smith'  -- Replace with guest name
  AND gp.is_guest = true
  AND gp.user_id IS NULL
  AND g.created_by_user_id = (SELECT id FROM profiles WHERE email = 'your@email.com')
GROUP BY gp.id, gp.player_name, gp.is_guest, gp.user_id, g.game_name, gp.total_score;
*/

-- Verify claim was successful:
/*
SELECT
  gp.id,
  gp.player_name,
  gp.is_guest,
  p.email as linked_email,
  g.game_name,
  gp.total_score
FROM game_players gp
JOIN games g ON gp.game_id = g.id
LEFT JOIN profiles p ON gp.user_id = p.id
WHERE gp.player_name = 'John Smith'  -- Replace with guest name
  AND g.created_by_user_id = (SELECT id FROM profiles WHERE email = 'your@email.com')
ORDER BY gp.is_guest DESC, g.created_at;
*/

-- ============================================================================
-- NOTES
-- ============================================================================
-- - Script is SAFE TO RUN MULTIPLE TIMES (idempotent)
-- - Only affects YOUR games (safety filter by created_by_user_id)
-- - Only updates unclaimed guests (is_guest=true AND user_id IS NULL)
-- - All turn history automatically transfers (FK: turns.player_id → game_players.id)
-- - Original guest records remain intact if already claimed
-- ============================================================================
