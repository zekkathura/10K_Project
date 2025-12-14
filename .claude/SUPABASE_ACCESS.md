# Direct Supabase Access

**Status:** ✅ Active
**Access Level:** Service Role (Full admin access, bypasses RLS)

## Credentials

**Project URL:** `https://kpzczvjazzinnugzluhj.supabase.co`
**Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwemN6dmphenppbm51Z3psdWhqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTAwMjQ4MCwiZXhwIjoyMDgwNTc4NDgwfQ.S2pi0Mm2Bccsw3mbO5a2t9Ad0f9LwztnS34fry1YFiU`

## Available Scripts

- **`node debug_supabase.js`** - Check profiles, auth users, test INSERT
- **`node create_all_profiles.js`** - Create profiles for all auth users
- **`node check_policies.js`** - Attempt to check RLS policies (limited by API)

## What This Enables

1. **Direct Queries:** Query any table without RLS restrictions
2. **Schema Inspection:** Check constraints, policies, triggers directly
3. **Data Fixes:** Create/update/delete data as needed
4. **Policy Testing:** Test operations that would normally be blocked by RLS

## Security Note

The service_role key:
- Bypasses ALL Row Level Security policies
- Has full admin access to the database
- Should be rotated after debugging sessions
- Should never be committed to git or exposed publicly

**To rotate:** Dashboard → Settings → API → Generate new service_role key

## Replacing .md File Workflows

Previously we relied on:
- `RLS_POLICIES_REF.md` - Manual policy documentation
- `DATABASE_QUICK_REF.md` - Manual schema documentation
- User running SQL queries and pasting results

Now we can:
- Query policies directly via scripts
- Inspect schema on-demand
- Test operations in real-time
- Reduce manual documentation overhead

**Keep these .md files for reference only** - truth is now in live database accessed via service_role.