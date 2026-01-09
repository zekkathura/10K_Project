-- Migration: Remove Development-Only Permissive Policies
-- Description: Remove overly permissive RLS policies used for development
-- Created: 2026-01-08
-- ⚠️ CRITICAL: Apply to PRODUCTION ONLY - DO NOT run in dev database

-- ============================================
-- REMOVE PERMISSIVE DEVELOPMENT POLICIES
-- ============================================

-- These policies bypass security checks with USING (true) and WITH CHECK (true)
-- They were useful for development but must be removed before production launch

-- Games table: Remove authenticated_all_games
DROP POLICY IF EXISTS "authenticated_all_games" ON games;

-- Extra rules table: Remove authenticated_all_extra_rules
DROP POLICY IF EXISTS "authenticated_all_extra_rules" ON extra_rules;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify permissive policies are removed
-- Run this to check remaining policies:
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual as using_clause,
--   with_check as with_check_clause
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND (qual = 'true' OR with_check = 'true')
--   AND cmd != 'SELECT'  -- SELECT with true is often intentional for public read
-- ORDER BY tablename, policyname;

-- Expected result: Should only show:
-- 1. error_logs.Anyone can log errors (INSERT) - Intentional for unauthenticated error logging
-- 2. Service role policies (intentional admin access)

-- ============================================
-- WHAT THIS FIXES
-- ============================================

-- Before: authenticated_all_games allowed any authenticated user to do anything to any game
-- After: Only proper RLS policies remain:
--   - Users can view games they're in
--   - Users can view games by join code (active only)
--   - Users can view friend games
--   - Users can create games (must be creator)
--   - Users can update/delete own games (must be creator)

-- Before: authenticated_all_extra_rules allowed any authenticated user to modify house rules
-- After: Only proper RLS policies remain:
--   - All authenticated users can read extra rules
--   - Only service_role can modify (admin only via Supabase Dashboard)

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- If you need to restore development mode (NOT recommended for production):
-- CREATE POLICY "authenticated_all_games" ON games FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "authenticated_all_extra_rules" ON extra_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
