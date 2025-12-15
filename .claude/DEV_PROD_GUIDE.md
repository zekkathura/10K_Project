# Development & Production Environment Guide

## Overview

This project uses a **two-tier environment setup**:

| Environment | Supabase Project | Google OAuth | Purpose |
|-------------|------------------|--------------|---------|
| **Production** | `10k-prod` | Shared client | Real users, live app |
| **Development** | `10k-dev` | Shared client | Testing, development, E2E tests |

## EAS Build (Production Builds)

Use **EAS Build** to create production-ready Android APKs/AABs and iOS builds.

### Build Profiles (`eas.json`)

| Profile | APP_ENV | Package Name | Use Case |
|---------|---------|--------------|----------|
| `development` | development | `com.tenk.scorekeeper.dev` | Dev builds for testing |
| `preview` | preview | `com.tenk.scorekeeper.preview` | Internal testing, beta |
| `production` | production | `com.tenk.scorekeeper` | Google Play / App Store |

### Building for Android

```bash
# Development APK (can sideload)
eas build --profile development --platform android

# Preview APK (internal testing)
eas build --profile preview --platform android

# Production AAB (Google Play upload)
eas build --profile production --platform android
```

### Building for iOS

```bash
eas build --profile production --platform ios
```

### Prerequisites

1. **Install EAS CLI**: `npm install -g eas-cli`
2. **Login to Expo**: `eas login`
3. **Configure project** (one-time): `eas build:configure`
4. **Set EAS Project ID**: Update `app.config.js` and `eas.json` with your project ID

### Environment Variables for Builds

Set in EAS dashboard (Project → Secrets):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

Or set per-profile in `eas.json` under `build.<profile>.env`.

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

**Two test modes available:**

#### 1. Basic UI Tests (Production Server)
```bash
npm run test:e2e         # Runs @noauth tests only
npm run test:e2e:headed  # With browser visible
npm run test:e2e:ui      # Playwright UI mode
```
- Auto-starts server on port 8081
- Tests basic UI without login (tagged with `@noauth`)
- Uses production Supabase credentials

#### 2. Full Tests with Login (Dev Server)
```bash
# Terminal 1: Start test server (uses 10k-dev)
npm run start:test

# Terminal 2: Run full E2E tests
npm run test:e2e:dev
```
- Requires `npm run start:test` running on port 8082
- Tests login, game creation, full user journeys
- Uses 10k-dev Supabase with test users

**E2E Test User Setup (10k-dev Supabase):**
1. Go to Supabase Dashboard → 10k-dev → Authentication → Users
2. Click "Add user" → "Create new user"
3. Create test users with **email confirmation disabled**:
   - `testuser1@10k.test` / `TestPassword123!`
   - `testuser2@10k.test` / `TestPassword123!`
4. Run profile creation SQL in SQL Editor:
   ```sql
   INSERT INTO profiles (id, email, display_name)
   SELECT id, email,
     CASE WHEN email = 'testuser1@10k.test' THEN 'Test User 1'
          WHEN email = 'testuser2@10k.test' THEN 'Test User 2'
          ELSE 'Test User' END
   FROM auth.users WHERE email LIKE '%@10k.test'
   ON CONFLICT (id) DO NOTHING;
   ```
5. Verify: Run `SELECT * FROM profiles WHERE email LIKE '%@10k.test';`

**Key UI Elements for E2E Tests:**
- **Login Screen**: Email placeholder `you@example.com`, password `Enter password`, button `LOG IN`
- **After Login (HomeScreen)**: Nav tabs `Home`, `Game`, `Play`, `Stats`, `Rules`
- **GamesListScreen**: Section titles `My Active Games (X)`, `Join Game` button
- **Settings**: Click settings icon in header (image), button text `Sign Out`
- **Create Game**: Click `Play` nav → shows `Create New Game` title → `Create Game` button
- **Error Messages**: Shown via `window.alert()` dialogs (capture with `page.on('dialog')`)

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

## Environment Sync Verification

Use `database/verification/compare_environments.sql` to check for schema drift between dev and prod.

### Quick Comparison

```sql
-- Run in both environments, compare outputs
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

### Full Comparison

1. Run `compare_environments.sql` in **10k-dev** SQL Editor
2. Run `compare_environments.sql` in **10k-prod** SQL Editor
3. Compare the "QUICK SUMMARY" section - counts should match:
   - tables
   - columns
   - functions
   - policies
   - indexes

### If Drift is Found

| Scenario | Fix |
|----------|-----|
| Missing table in dev | Run the migration file in dev |
| Missing column in dev | Run the migration file in dev |
| Extra table in dev | Delete it or create migration for prod |
| Completely out of sync | Reset dev with `CURRENT_SCHEMA.sql` |

### Resetting Dev to Match Prod

```sql
-- WARNING: Deletes all dev data!
-- Run in 10k-dev SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then run database/CURRENT_SCHEMA.sql to recreate everything
-- Then recreate test users in Authentication → Users
```

## Version Management

The app supports remote version checking to prompt users to update when breaking changes are deployed.

### How It Works

1. **Backend**: `app_config` table stores version requirements
2. **Frontend**: `src/lib/versionCheck.ts` checks on app startup
3. **User sees**: Update prompt (soft) or forced update (blocking)

### app_config Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `min_app_version` | `"1.0.0"` | Minimum version allowed |
| `force_update` | `"false"` | If true, blocks app until updated |
| `maintenance_mode` | `"false"` | Shows maintenance screen |
| `maintenance_message` | `"..."` | Message shown during maintenance |

### Updating Version Requirements

When deploying breaking changes:

```sql
-- Run in Supabase SQL Editor (10k-prod)
UPDATE app_config SET value = '1.1.0' WHERE key = 'min_app_version';

-- For critical updates that MUST be installed:
UPDATE app_config SET value = 'true' WHERE key = 'force_update';
```

### Checking App Version

```typescript
import { checkAppVersion } from './lib/versionCheck';

const result = await checkAppVersion();
// result.needsUpdate - true if below minimum
// result.forceUpdate - true if must update immediately
// result.maintenanceMode - true if app in maintenance
```

### Migration File

Run `database/migrations/add_app_config.sql` in both dev and prod Supabase projects to create the `app_config` table.

## Checklist: App Store Release

1. [ ] Update version in `app.config.js` (`APP_VERSION`, `BUILD_NUMBER`)
2. [ ] Run all tests: `npm run test:all`
3. [ ] Build production: `eas build --profile production --platform android`
4. [ ] Test the build on device
5. [ ] Upload to Google Play Console / App Store Connect
6. [ ] After release, update `min_app_version` in Supabase if needed
