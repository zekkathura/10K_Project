-- ============================================
-- ENVIRONMENT COMPARISON SCRIPT
-- ============================================
-- Run this in BOTH 10k-dev and 10k-prod SQL Editors
-- Compare the outputs to identify schema drift
--
-- Usage:
-- 1. Run in 10k-dev, copy output
-- 2. Run in 10k-prod, copy output
-- 3. Compare side-by-side (use diff tool or manually)
-- ============================================

-- Output format designed for easy comparison
SELECT '=== ENVIRONMENT COMPARISON ===' AS section;
SELECT current_database() AS database_name, NOW() AS checked_at;

-- ============================================
-- 1. TABLES
-- ============================================
SELECT '--- TABLES ---' AS section;

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c
   WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- 2. COLUMNS (per table)
-- ============================================
SELECT '--- COLUMNS ---' AS section;

SELECT
  table_name || '.' || column_name AS full_column,
  data_type,
  is_nullable,
  column_default IS NOT NULL AS has_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================
-- 3. INDEXES
-- ============================================
SELECT '--- INDEXES ---' AS section;

SELECT
  tablename || '.' || indexname AS full_index,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- 4. FUNCTIONS
-- ============================================
SELECT '--- FUNCTIONS ---' AS section;

SELECT
  routine_name,
  routine_type,
  data_type AS return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- 5. RLS POLICIES
-- ============================================
SELECT '--- RLS POLICIES ---' AS section;

SELECT
  schemaname || '.' || tablename || '.' || policyname AS full_policy,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 6. TRIGGERS
-- ============================================
SELECT '--- TRIGGERS ---' AS section;

SELECT
  event_object_table || '.' || trigger_name AS full_trigger,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 7. FOREIGN KEYS
-- ============================================
SELECT '--- FOREIGN KEYS ---' AS section;

SELECT
  tc.table_name || '.' || tc.constraint_name AS full_fk,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================
-- 8. QUICK SUMMARY
-- ============================================
SELECT '--- QUICK SUMMARY ---' AS section;

SELECT
  'tables' AS object_type,
  COUNT(*)::TEXT AS count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'

UNION ALL

SELECT
  'columns',
  COUNT(*)::TEXT
FROM information_schema.columns
WHERE table_schema = 'public'

UNION ALL

SELECT
  'functions',
  COUNT(*)::TEXT
FROM information_schema.routines
WHERE routine_schema = 'public'

UNION ALL

SELECT
  'policies',
  COUNT(*)::TEXT
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT
  'indexes',
  COUNT(*)::TEXT
FROM pg_indexes
WHERE schemaname = 'public'

ORDER BY object_type;

SELECT '=== END COMPARISON ===' AS section;
