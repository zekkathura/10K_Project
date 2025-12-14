-- ============================================================================
-- PRODUCTION SECURITY CLEANUP
-- ============================================================================
-- Run this BEFORE launching to production
-- Removes overly permissive development policies
--
-- ⚠️ WARNING: Test all features after running this script
-- ⚠️ Some operations may fail if RLS policies are too restrictive
-- ============================================================================

-- ============================================================================
-- PHASE 1: Remove Overly Permissive Policies
-- ============================================================================

-- Remove "any authenticated user can do anything" policies
DROP POLICY IF EXISTS "authenticated_all_game_players" ON game_players;
DROP POLICY IF EXISTS "authenticated_all_games" ON games;
DROP POLICY IF EXISTS "authenticated_all_turns" ON turns;

-- Remove "view all profiles" policy (privacy issue)
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

RAISE NOTICE '✓ Phase 1 Complete: Removed overly permissive policies';

-- ============================================================================
-- PHASE 2: Remove Duplicate Policies
-- ============================================================================

-- Remove duplicate INSERT policy on profiles
DROP POLICY IF EXISTS "Auth system can insert profiles" ON profiles;
RAISE NOTICE '  Removed duplicate: Auth system can insert profiles';

-- Remove duplicate UPDATE policy on profiles (keeping authenticated version)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
RAISE NOTICE '  Removed duplicate: Users can update own profile';

RAISE NOTICE '✓ Phase 2 Complete: Removed duplicate policies';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check remaining policies
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'games', 'game_players', 'turns')
GROUP BY tablename
ORDER BY tablename;

RAISE NOTICE '✓ Security cleanup complete!';
RAISE NOTICE '  - Review policy counts above';
RAISE NOTICE '  - Test all features thoroughly';
RAISE NOTICE '  - Run database/verification/verify_rls_policies.sql to verify';

-- ============================================================================
-- EXPECTED POLICY COUNTS (After cleanup)
-- ============================================================================
-- profiles:       ~4-5 policies
-- games:          ~6-7 policies
-- game_players:   ~7-8 policies
-- turns:          ~4-5 policies
-- service_role policies: Keep all (needed for backend operations)
-- ============================================================================

-- ============================================================================
-- POST-CLEANUP TESTING CHECKLIST
-- ============================================================================
-- [ ] Users can sign up with email/password
-- [ ] Users can sign in with Google OAuth
-- [ ] Users can create new games
-- [ ] Users can join games by code
-- [ ] Users can add guest players to their games
-- [ ] Users can record turns/scores
-- [ ] Users can view their own games
-- [ ] Users can view co-player profiles
-- [ ] Users CANNOT view other users' games
-- [ ] Users CANNOT modify other users' data
-- ============================================================================
