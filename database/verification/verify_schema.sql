-- ============================================================================
-- SCHEMA VERIFICATION QUERIES
-- ============================================================================
-- Run this entire file in Supabase SQL Editor to verify current database state
-- Use the output to update .claude/DATABASE_QUICK_REF.md when needed
-- ============================================================================

-- ============================================================================
-- 1. TABLE STRUCTURES (Columns, Types, Nullability)
-- ============================================================================
SELECT
  table_name,
  column_name,
  UPPER(data_type) ||
  CASE WHEN character_maximum_length IS NOT NULL
    THEN '(' || character_maximum_length || ')'
    ELSE ''
  END AS data_type,
  CASE WHEN is_nullable = 'NO' THEN 'NOT NULL' ELSE 'NULL' END AS nullable,
  COALESCE(column_default, '-') AS default_value
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY
  CASE table_name
    WHEN 'profiles' THEN 1
    WHEN 'games' THEN 2
    WHEN 'game_players' THEN 3
    WHEN 'turns' THEN 4
  END,
  ordinal_position;

-- ============================================================================
-- 2. PRIMARY KEYS
-- ============================================================================
SELECT
  tc.table_name,
  kcu.column_name AS primary_key
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tc.table_name;

-- ============================================================================
-- 3. FOREIGN KEYS
-- ============================================================================
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tc.table_name, kcu.column_name;

-- ============================================================================
-- 4. CHECK CONSTRAINTS (Validation Rules)
-- ============================================================================
SELECT
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================================================
-- 5. RLS POLICIES (Summary)
-- ============================================================================
SELECT
  tablename,
  policyname,
  cmd AS command,
  array_to_string(roles, ', ') AS roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tablename, policyname;

-- ============================================================================
-- 6. CUSTOM FUNCTIONS
-- ============================================================================
SELECT
  routine_name,
  routine_type,
  COALESCE(data_type, 'trigger') AS return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_user_in_game',
    'get_user_game_ids',
    'get_coplayer_user_ids',
    'get_friend_game_ids',
    'prevent_ended_game_modification'
  )
ORDER BY routine_name;

-- ============================================================================
-- 7. INDEXES
-- ============================================================================
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tablename, indexname;

-- ============================================================================
-- 8. RLS ENABLED CHECK
-- ============================================================================
SELECT
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'games', 'game_players', 'turns')
ORDER BY tablename;

-- ============================================================================
-- 9. QUICK SUMMARY (Condensed view for DATABASE_QUICK_REF.md)
-- ============================================================================
-- This section provides a condensed view of table structures
-- Copy this output to verify DATABASE_QUICK_REF.md

SELECT
  table_name,
  string_agg(
    column_name || ' ' ||
    UPPER(data_type) ||
    CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END,
    E'\n  '
    ORDER BY ordinal_position
  ) AS columns
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'games', 'game_players', 'turns')
GROUP BY table_name
ORDER BY
  CASE table_name
    WHEN 'profiles' THEN 1
    WHEN 'games' THEN 2
    WHEN 'game_players' THEN 3
    WHEN 'turns' THEN 4
  END;

-- ============================================================================
-- END OF VERIFICATION QUERIES
-- ============================================================================
-- The QUICK SUMMARY (section 9) shows the most important info for updating
-- DATABASE_QUICK_REF.md. Other sections provide detailed constraint info.
-- ============================================================================
