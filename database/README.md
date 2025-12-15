# Database Schema Management

## 📁 Folder Structure

```
database/
├── CURRENT_SCHEMA.sql              # ⭐ Authoritative schema (SOURCE OF TRUTH)
│
├── verification/                    # Check current database state
│   ├── verify_schema.sql            # Verify table structures
│   ├── verify_rls_policies.sql      # Verify RLS policies
│   └── compare_environments.sql     # Compare dev vs prod schemas
│
└── manual/                          # Manual one-time operations
    ├── claim_guest_player.sql       # Migrate guest data to users
    ├── clear_all_data.sql           # Wipe all data (DANGEROUS)
    ├── create_test_user_profiles.sql # Create test users for E2E
    └── production_security_cleanup.sql  # Remove dev-only RLS policies
```

### `CURRENT_SCHEMA.sql` ⭐ **SOURCE OF TRUTH**
This is the **authoritative, complete schema** for the Supabase database. It includes:
- All table definitions
- All RLS policies
- All SECURITY DEFINER functions
- All triggers and constraints
- All indexes

**This file represents the current state of your production database.**

### `verification/` Directory
Scripts to verify current database state (read-only queries):
- `verify_schema.sql` - Check table structures, columns, constraints
- `verify_rls_policies.sql` - Check RLS policies and expressions
- `compare_environments.sql` - Compare dev vs prod schema for drift

### `manual/` Directory
Manual operations you run as needed:
- `claim_guest_player.sql` - Migrate guest player data to registered users
- `clear_all_data.sql` - Delete all data (use carefully!)
- `create_test_user_profiles.sql` - Create E2E test user profiles
- `production_security_cleanup.sql` - Remove dev-only RLS policies before launch

---

## 🔄 Database Change Workflow

When you need to make database changes:

### 1. Write Change SQL
```sql
-- Example change
ALTER TABLE profiles ADD COLUMN new_field TEXT;

-- Always include DROP IF EXISTS for safety
DROP POLICY IF EXISTS "Your new policy" ON table_name;
CREATE POLICY "Your new policy" ON table_name ...;
```

### 2. Test in 10k-dev First
1. Open Supabase Dashboard → `10k-dev` → SQL Editor
2. Run your SQL
3. Test the change works in the app

### 3. Apply to 10k-prod
1. Open Supabase Dashboard → `10k-prod` → SQL Editor
2. Run the same SQL
3. Verify production app still works

### 4. Update Source of Truth
Update `CURRENT_SCHEMA.sql` to reflect the changes:
- If you added a table: Add full table definition
- If you modified a policy: Update the policy section
- If you added a function: Add to functions section

### 5. Verify Sync (Optional)
Run `compare_environments.sql` in both dev and prod to check for schema drift.

---

## 🚨 Critical Rules

1. **Always update `CURRENT_SCHEMA.sql` after applying changes**
   - This keeps the source of truth in sync

2. **Use `DROP POLICY IF EXISTS` before `CREATE POLICY`**
   - This makes changes idempotent and safe to re-run

3. **Test changes in 10k-dev first**
   - Never run untested SQL on production

4. **Use SECURITY DEFINER functions to avoid RLS recursion**
   - See existing helper functions for examples

---

## 🔍 Common Tasks

### Verify Schema Sync Between Environments
```sql
-- Run compare_environments.sql in both dev and prod
-- Compare the QUICK SUMMARY outputs
```

### Add a New RLS Policy
```sql
-- Write SQL:
DROP POLICY IF EXISTS "Policy name" ON table_name;
CREATE POLICY "Policy name"
ON table_name FOR SELECT
TO authenticated
USING (your_condition_here);

-- Apply to dev, test, then apply to prod
-- Update CURRENT_SCHEMA.sql
```

### Add a New Table
```sql
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... columns
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Default policy" ON new_table;
CREATE POLICY "Default policy" ON new_table ...;

-- Apply to dev, test, then apply to prod
-- Update CURRENT_SCHEMA.sql with full table definition and policies
```

### Fix RLS Infinite Recursion
If you get "infinite recursion detected in policy":
1. Create a SECURITY DEFINER helper function (see existing examples in CURRENT_SCHEMA.sql)
2. Use the helper function in your policy instead of direct queries

---

## 📚 Reference

- **Supabase RLS Docs:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL Policies:** https://www.postgresql.org/docs/current/sql-createpolicy.html
- **SECURITY DEFINER Functions:** https://www.postgresql.org/docs/current/sql-createfunction.html

---

## 🐛 Troubleshooting

### "Infinite recursion detected in policy"
- A policy is querying the same table it's protecting
- **Solution:** Use a SECURITY DEFINER function (see `get_user_game_ids` example)

### "Permission denied for table X"
- RLS is blocking the query
- **Check:** Verify policies with `SELECT * FROM pg_policies WHERE tablename = 'X';`

### Schema drift (CURRENT_SCHEMA.sql doesn't match production)
- Run `compare_environments.sql` in both dev and prod
- Compare QUICK SUMMARY outputs
- Update `CURRENT_SCHEMA.sql` to match production

### SQL change failed to apply
- Check Supabase logs for detailed error
- Verify foreign key relationships exist
- Ensure you're using `DROP IF EXISTS` for policies/functions
- Test SQL syntax in SQL editor first
