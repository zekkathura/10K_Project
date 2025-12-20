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

### EAS Account Details (Verified)

| Setting | Value |
|---------|-------|
| **Account** | `tuesdaylabs` |
| **Project** | `@tuesdaylabs/10k-scorekeeper` |
| **CLI Version** | `>= 5.0.0` |

**Configured Secrets** (EAS Dashboard → Project → Secrets):
- `DEV_SUPABASE_URL` - 10k-dev Supabase URL
- `DEV_SUPABASE_ANON_KEY` - 10k-dev anon key
- `PROD_SUPABASE_URL` - 10k-prod Supabase URL
- `PROD_SUPABASE_ANON_KEY` - 10k-prod anon key

**eas.json Profile → Secret Mapping**:
| Profile | Secrets Used |
|---------|--------------|
| `development` | `DEV_SUPABASE_URL`, `DEV_SUPABASE_ANON_KEY` |
| `preview` | `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY` |
| `production` | `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY` |

**Previous Builds**: Successfully built Android preview APKs (can verify with `eas build:list`)

### Prerequisites

1. **Install EAS CLI**: `npm install -g eas-cli`
2. **Login to Expo**: `eas login`
3. **Configure project** (one-time): `eas build:configure`
4. **Set EAS Project ID**: Update `app.config.js` and `eas.json` with your project ID

### Environment Variables for Builds

Secrets are **already configured** in EAS Dashboard (see "EAS Account Details" above).

The `eas.json` file references these secrets using `${SECRET_NAME}` syntax:
```json
"env": {
  "EXPO_PUBLIC_SUPABASE_URL": "${PROD_SUPABASE_URL}",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY": "${PROD_SUPABASE_ANON_KEY}"
}
```

**To verify secrets**: `eas secret:list`

**To add/update secrets**:
- Via CLI: `eas secret:create --name SECRET_NAME --value "secret_value"`
- Via Dashboard: EAS Project → Secrets

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
- **Account**: tuesdaylabs.dev@gmail.com
- **Client ID**: `1093429431588-21hos0ib9ckco2eguu6eubbhgriof1ql.apps.googleusercontent.com`
- Redirect URIs point to respective Supabase auth callbacks
- Both prod and dev Supabase projects work with the same client

**OAuth Consent Screen Status**: Testing (requires test users to be added)
- Test users: `blinkafailed@gmail.com`, `tuesdaylabs.dev@gmail.com`
- To add more: Google Cloud Console → OAuth consent screen → Test users

If needed, you can create separate OAuth clients:
1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID → "10K Development"
3. Add dev-specific redirect URIs
4. Update `10k-dev` → Authentication → Providers → Google with new client ID

## Mobile Testing (Expo Go vs Development Build)

### Option 1: Development Build (Recommended for Consistent Testing)

Build a development APK with a stable custom URL scheme. This is the most reliable way to test OAuth on mobile.

```bash
# Build development APK
eas build --profile development --platform android

# Download and install the APK on your device
```

**Benefits**:
- Stable redirect URL: `com.10kscorekeeper://`
- No need to update Supabase URLs each session
- Works offline (doesn't need tunnel)
- Better approximation of production behavior

**Setup**:
1. The redirect URL `com.10kscorekeeper://` is already in Supabase 10k-prod
2. Build the APK: `eas build --profile development --platform android`
3. Install on device via download or `adb install`
4. Google OAuth will use the stable custom scheme

### Option 2: Expo Go (Quick Testing)

Expo Go uses dynamic `exp://` URLs that change each tunnel session.

```bash
# Start tunnel
npx expo start --tunnel

# Note the URL (e.g., exp://exud4dm-tuesdaylabs-8082.exp.direct)
# This URL changes each time you restart the tunnel!
```

**Manual Setup Each Session**:
1. Start tunnel: `npx expo start --tunnel`
2. Copy the exp:// URL from the terminal
3. Add URL to Supabase 10k-prod → Authentication → URL Configuration → Redirect URLs
4. Test OAuth login on phone

**Why exp:// URLs Change**:
- Expo's ngrok tunnel assigns different subdomains each session
- The URL includes your username and a random hash
- Cannot use wildcards (`exp://*`) - Supabase requires exact matches

### Option 3: Expo Go with Wildcard (May Not Work)

Supabase might support wildcard patterns:
```
exp://*.exp.direct
```

Try adding this to redirect URLs. If it works, no manual updates needed.

### Redirect URL Summary

| Platform | Redirect URL | Where Configured |
|----------|--------------|------------------|
| Web | `https://kpzczvjazzinnugzluhj.supabase.co` | Supabase (static) |
| Dev Build | `com.10kscorekeeper://` | Supabase + app.config.js scheme |
| Expo Go | `exp://[random]-tuesdaylabs-8082.exp.direct` | Supabase (manual each session) |

### How OAuth Flow Works on Mobile

1. User taps "Sign in with Google"
2. App determines redirect URL based on environment:
   - **Standalone builds**: Uses explicit `com.10kscorekeeper://` (via `Constants.appOwnership`)
   - **Expo Go**: Uses `AuthSession.makeRedirectUri()` for `exp://` URLs
3. Supabase generates Google OAuth URL with redirect
4. `WebBrowser.openAuthSessionAsync()` opens browser
5. User authenticates with Google
6. Google redirects to Supabase callback
7. Supabase redirects to app's redirect URL with tokens
8. App extracts tokens from URL fragment and sets session
9. App.tsx's `checkProfile` detects new user → shows ProfileSetupModal

**Important**: `AuthSession.makeRedirectUri()` can return `localhost:8081` in standalone builds, which breaks OAuth. The fix in `src/lib/auth.ts` explicitly uses the app scheme for standalone builds.

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
