# Database Schema Management

## 📁 Folder Structure

```
database/
├── CURRENT_SCHEMA.sql              # ⭐ Authoritative schema (SOURCE OF TRUTH)
│
├── migrations/                      # One-time schema evolution scripts
│   └── simplify_profiles_require_display_name_v2.sql
│
├── verification/                    # Check current database state
│   ├── verify_schema.sql            # Verify table structures
│   └── verify_rls_policies.sql      # Verify RLS policies
│
└── manual/                          # Manual one-time operations
    ├── claim_guest_player.sql       # Migrate guest data to users
    ├── clear_all_data.sql           # Wipe all data (DANGEROUS)
    └── production_security_cleanup.sql  # Remove dev-only RLS policies before launch
```

### `CURRENT_SCHEMA.sql` ⭐ **SOURCE OF TRUTH**
This is the **authoritative, complete schema** for the Supabase database. It includes:
- All table definitions
- All RLS policies
- All SECURITY DEFINER functions
- All triggers and constraints
- All indexes

**This file represents the current state of your production database.**

### `migrations/` Directory
One-time schema evolution scripts. Each migration modifies the database structure.
- Run migrations ONCE to evolve schema
- Migrations should be idempotent (safe to re-run)
- See "Database Change Workflow" below for details

### `verification/` Directory
Scripts to verify current database state (read-only queries):
- `verify_schema.sql` - Check table structures, columns, constraints
- `verify_rls_policies.sql` - Check RLS policies and expressions

### `manual/` Directory
Manual operations you run as needed:
- `claim_guest_player.sql` - Migrate guest player data to registered users
- `clear_all_data.sql` - Delete all data (use carefully!)
- `production_security_cleanup.sql` - Remove dev-only RLS policies before launch

---

## 🔄 Database Change Workflow

When you need to make database changes:

### 1. Create Migration File
```bash
# Create a new migration file
touch database/migrations/your_change_name.sql
```

### 2. Write Migration SQL
```sql
-- Example migration
ALTER TABLE profiles ADD COLUMN new_field TEXT;

-- Always include DROP IF EXISTS for safety
DROP POLICY IF EXISTS "Your new policy" ON table_name;
CREATE POLICY "Your new policy" ON table_name ...;
```

### 3. Apply to Supabase
1. Open Supabase SQL Editor
2. Copy your migration SQL
3. Run it
4. Verify no errors

### 4. Update Source of Truth
Update `CURRENT_SCHEMA.sql` to reflect the changes:
- If you added a table: Add full table definition
- If you modified a policy: Update the policy section
- If you added a function: Add to functions section

### 5. Verify Sync (Optional but Recommended)
Run `export_current_schema.sql` in Supabase and compare with `CURRENT_SCHEMA.sql` to ensure they match.

---

## 🚨 Critical Rules

1. **Never modify Supabase directly without creating a migration file**
   - All changes must be documented in `migrations/`

2. **Always update `CURRENT_SCHEMA.sql` after applying changes**
   - This keeps the source of truth in sync

3. **Use `DROP POLICY IF EXISTS` before `CREATE POLICY`**
   - This makes migrations idempotent and safe to re-run

4. **Test migrations on development first**
   - Never run untested SQL on production

5. **Use SECURITY DEFINER functions to avoid RLS recursion**
   - See existing helper functions for examples

---

## 🔍 Common Tasks

### Verify Current Schema Matches Production
```bash
# Run in Supabase SQL Editor
-- Copy contents of export_current_schema.sql and run
```

### Add a New RLS Policy
```sql
-- 1. Create migration file
-- 2. Write SQL:
DROP POLICY IF EXISTS "Policy name" ON table_name;
CREATE POLICY "Policy name"
ON table_name FOR SELECT
TO authenticated
USING (your_condition_here);

-- 3. Apply to Supabase
-- 4. Update CURRENT_SCHEMA.sql
```

### Add a New Table
```sql
-- 1. Create migration file
-- 2. Write SQL:
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... columns
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policies
DROP POLICY IF EXISTS "Default policy" ON new_table;
CREATE POLICY "Default policy" ON new_table ...;

-- 3. Apply to Supabase
-- 4. Update CURRENT_SCHEMA.sql with full table definition and policies
```

### Fix RLS Infinite Recursion
If you get "infinite recursion detected in policy":
1. Create a SECURITY DEFINER helper function (see existing examples)
2. Use the helper function in your policy instead of direct queries
3. See `fix_rls_infinite_recursion.sql` for examples

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
- Run `export_current_schema.sql` in Supabase
- Compare output with `CURRENT_SCHEMA.sql`
- Update `CURRENT_SCHEMA.sql` to match production

### Migration failed to apply
- Check Supabase logs for detailed error
- Verify foreign key relationships exist
- Ensure you're using `DROP IF EXISTS` for policies/functions
- Test migration syntax in SQL editor first
