# Development & Production Environment Guide

## Overview

This project uses a **two-tier environment setup**:

| Environment | Supabase Project | Google OAuth | Purpose |
|-------------|------------------|--------------|---------|
| **Production** | `10k-prod` | Shared client | Real users, live app |
| **Development** | `10k-dev` | Shared client | Testing, development, E2E tests |

## Supabase Projects

### 10k-prod (Production)
- **URL**: `https://kpzczvjazzinnugzluhj.supabase.co`
- **Purpose**: Real user data, production app
- **Redirect URLs**:
  - `https://kpzczvjazzinnugzluhj.supabase.co/auth/v1/callback`
  - `https://kpzczvjazzinnugzluhj.supabase.co`
  - `com.10kscorekeeper://` (native app)
  - `https://auth.expo.io/@darkertuesdays/10k-scorekeeper-app`
  - `https://auth.expo.io/*`

### 10k-dev (Development/Testing)
- **URL**: `https://bywqijumnwvrinllsfjb.supabase.co`
- **Purpose**: Testing, development, can be wiped/reset
- **Redirect URLs**:
  - `https://bywqijumnwvrinllsfjb.supabase.co/auth/v1/callback`
  - `https://bywqijumnwvrinllsfjb.supabase.co`
  - `http://localhost:19006/auth/v1/callback`
  - `exp://localhost:8081`
- **Test Users**:
  - `testuser1@10k.test` / `TestPassword123!`
  - `testuser2@10k.test` / `TestPassword123!`

## Environment Files

### `.env` (Production - used by app)
```env
EXPO_PUBLIC_SUPABASE_URL=https://kpzczvjazzinnugzluhj.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
```

### `.env.test` (Development - used by tests)
```env
TEST_SUPABASE_URL=https://bywqijumnwvrinllsfjb.supabase.co
TEST_SUPABASE_ANON_KEY=<dev-anon-key>
TEST_SUPABASE_SERVICE_ROLE_KEY=<dev-service-role-key>
TEST_USER_EMAIL=testuser1@10k.test
TEST_USER_PASSWORD=TestPassword123!
```

## Schema Migration: Dev → Prod

When you've tested schema changes in `10k-dev` and are ready to apply them to production:

### 1. Create Migration File
```sql
-- database/migrations/YYYYMMDD_description.sql
-- Example: database/migrations/20241215_add_player_stats.sql

-- Migration: Add player statistics columns
-- Created: 2024-12-15
-- Tested in: 10k-dev

ALTER TABLE game_players ADD COLUMN IF NOT EXISTS wins INTEGER DEFAULT 0;
ALTER TABLE game_players ADD COLUMN IF NOT EXISTS losses INTEGER DEFAULT 0;
```

### 2. Test in 10k-dev
1. Open Supabase Dashboard → `10k-dev` → SQL Editor
2. Run the migration script
3. Verify with tests or manual testing

### 3. Apply to 10k-prod
1. Open Supabase Dashboard → `10k-prod` → SQL Editor
2. Run the same migration script
3. Verify production app still works

### 4. Update CURRENT_SCHEMA.sql
After applying to both environments, update `database/CURRENT_SCHEMA.sql` to reflect the new schema state.

### 5. Update Reference Files
If schema changed, update `.claude/DATABASE_QUICK_REF.md` with the new columns.

## RLS Policy Migration

Same workflow as schema migrations:

1. **Create policy** in `10k-dev` SQL Editor
2. **Test** that permissions work correctly
3. **Copy** the exact SQL to `10k-prod`
4. **Update** `database/CURRENT_SCHEMA.sql` with new policy
5. **Update** `.claude/RLS_POLICIES_REF.md` if needed

## Testing Workflow

### Unit Tests (Mocked)
```bash
npm test                 # Runs 154 unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```
- Uses mocked Supabase client
- Does NOT connect to any real database
- Safe to run anytime

### E2E Tests (Browser)
```bash
npm run test:e2e         # Headless
npm run test:e2e:headed  # With browser visible
npm run test:e2e:ui      # Playwright UI mode
```
- Tests run against the app's configured database (`.env`)
- Currently tests basic UI without login
- Login tests are skipped (would need app running against dev)

### All Tests
```bash
npm run test:all         # Unit + E2E
```

## Resetting 10k-dev

If you need to reset the dev database to a clean state:

### Option 1: Clear All Data
```sql
-- Run in 10k-dev SQL Editor
TRUNCATE turns, game_players, games, profiles CASCADE;
```

### Option 2: Drop and Recreate
1. Delete all tables in Table Editor
2. Re-run `database/CURRENT_SCHEMA.sql`
3. Recreate test users in Authentication → Users

## Google Cloud OAuth

Currently using **one OAuth client** for both environments:
- Redirect URIs point to respective Supabase auth callbacks
- Both prod and dev Supabase projects work with the same client

If needed, you can create separate OAuth clients:
1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID → "10K Development"
3. Add dev-specific redirect URIs
4. Update `10k-dev` → Authentication → Providers → Google with new client ID

## Checklist: New Feature Development

1. [ ] Create feature branch from `main`
2. [ ] Develop and test locally (app connects to `10k-prod` by default)
3. [ ] Write/update unit tests
4. [ ] If schema changes needed:
   - [ ] Create migration file
   - [ ] Test in `10k-dev` first
   - [ ] Apply to `10k-prod`
   - [ ] Update `CURRENT_SCHEMA.sql`
5. [ ] Run all tests: `npm run test:all`
6. [ ] Commit and push
7. [ ] Create PR to `main`

## Checklist: Database Schema Change

1. [ ] Write migration SQL in `database/migrations/`
2. [ ] Run in `10k-dev` SQL Editor
3. [ ] Test the change works
4. [ ] Run in `10k-prod` SQL Editor
5. [ ] Update `database/CURRENT_SCHEMA.sql`
6. [ ] Update `.claude/DATABASE_QUICK_REF.md`
7. [ ] Commit migration file and schema updates
