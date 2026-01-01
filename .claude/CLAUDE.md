# 10K Scorekeeper – Project Context

**Purpose:** Minimal, high-efficiency context for AI assistants. Use `.claude/skills/` for implementation patterns.

## Tech Stack
Expo SDK 54 (React Native Web) + TypeScript + Supabase (Postgres/Auth/Realtime)

## Authentication
- **Email/password** (secure: `secureTextEntry`, Platform-aware alerts)
- **Google OAuth** (web + mobile)
- **No guest login** – users must create accounts; guest players added within games

## Core Architecture

**Database** (source of truth: live Supabase database):
- `profiles` (user accounts, theme preferences)
- `games` (join codes, rounds, winner tracking, status)
- `game_players` (user + guest players per game)
- `turns` (scores, busts, per round)
- `app_config` (version requirements, maintenance mode, debug logging control)
- `error_logs` (production error tracking - insert only, view via Supabase dashboard)

**Why We Maintain Verification Scripts:**
AI assistants lack direct database access. To prevent recommending changes incompatible with actual backend structure, we maintain reference files (`.claude/*.md`) that mirror live database state. User runs verification scripts in Supabase and shares output to keep AI synchronized with reality.

**Schema Verification Workflow:**
When user says "verify schema" or provides SQL query output:
1. User runs `database/verification/verify_schema.sql` in Supabase
2. User pastes QUICK SUMMARY output (section 9 - just column lists)
3. Compare output with `.claude/DATABASE_QUICK_REF.md`
4. Update DATABASE_QUICK_REF.md if differences found
5. Keep changes minimal - only update what changed

**RLS Policy Verification:**
When debugging auth/permission issues or after policy changes:
1. User runs `database/verification/verify_rls_policies.sql` in Supabase
2. Compare output with `.claude/RLS_POLICIES_REF.md`
3. Update RLS_POLICIES_REF.md if policies changed
4. This prevents AI from assuming outdated policy structure

**Key Files**:
- `src/lib/database.ts` – all DB operations (prefer these functions over raw Supabase queries)
- `src/lib/validation.ts` – input validators (always use before DB ops)
- `src/lib/theme.ts` – dark/light theme system
- `src/lib/logger.ts` – secure logging with PII sanitization and backend-controlled debug mode
- `src/lib/versionCheck.ts` – app version checking against backend requirements
- `src/screens/GameScreen.tsx` – main game logic, realtime sync

**Auth Utilities** (centralized authentication logic):
- `src/lib/authConfig.ts` – constants: `APP_SCHEME`, `AUTH_TIMEOUTS`, `AUTH_STORAGE_KEYS`, `AUTH_ERROR_CODES`
- `src/lib/authTypes.ts` – type-safe: `AuthResult<T>`, `AuthError`, `ProfileCheckResult`
- `src/lib/asyncUtils.ts` – utilities: `sleep`, `withRetry`, `withTimeout`, `raceWithTimeout`
- `src/lib/useAuth.ts` – comprehensive auth hook (future use)
- `src/lib/auth.ts` – low-level OAuth functions (Google, Apple)

## Guest Players & Data Migration

**Workflow for pre-seeding historical game data:**

1. **Import Excel data** → Create games with guest players (`is_guest=true`, `user_id=NULL`)
2. **Friends sign up** → They create accounts with real emails
3. **Claim guest data** → Run `database/claim_guest_player.sql` in Supabase to migrate history

**Key Points:**
- Guest players are just names in `game_players` (no auth accounts)
- When claimed, guest records update: `user_id` set + `is_guest=false`
- All turn history automatically transfers (FK relationship intact)
- Claim process is **idempotent** - safe to run multiple times
- Claim process is **repeatable** - can re-seed data and re-claim as needed
- Only affects games created by you (safety filter)

**Files:**
- `database/manual/claim_guest_player.sql` - Manual claim script (edit variables, run in Supabase)
- See file comments for verification queries

## AI Assistant Efficiency

### Use Skills First (`.claude/skills/`)
**Before writing code, check these Skills for patterns:**
- `expo-dev-server` – **CRITICAL:** Always kill old processes before starting Expo, environment switching
- `screen-layout` – **Screen architecture, safe areas, HomeScreen contentWrapper pattern**
- `react-native-web-patterns` – Platform.OS checks, alerts, web compatibility
- `supabase-patterns` – DB queries, realtime, GRANT permissions, RLS, error handling
- `theme-styling` – Theme usage, modal structure, button patterns, themed alert modals
- `validation-errors` – Input validation, error display
- `modal-components` – Standard modal layouts, safe area handling for modals
- `testing-patterns` – Unit tests, E2E tests, mocking, test utilities
- `local-build` – WSL local builds, unlimited APKs without EAS quota

**Why:** Skills load on-demand, reducing context. They contain all implementation patterns.

### Essential Patterns Only
- **Alerts**: Always check `Platform.OS` (web = `window.alert`, native = `Alert.alert`)
- **DB Schema**: Check `CURRENT_SCHEMA.sql` before queries (don't assume structure)
- **Validation**: Use `src/lib/validation.ts` functions before any DB operation
- **Database Ops**: Use functions from `src/lib/database.ts` (don't write raw Supabase queries)
- **Themes**: Use `useTheme()` and `useThemedStyles()` – never hardcode colors
- **Loading States**: Use `<ThemedLoader />` from `src/components` with cycling messages and 1-second minimum display time
- **Themed Alerts**: Use custom Modal with theme colors instead of native `Alert.alert` for consistent dark/light mode
- **Safe Areas**: See `screen-layout` skill – screens in HomeScreen's contentWrapper don't need insets (parent handles it); standalone screens and full-screen modals do

## Recent Critical Fixes
- ✅ Auth security: Fixed `secureTextEntry`, removed unsafe password masking
- ✅ Round removal: Validates scores exist before allowing round reduction
- ✅ Platform compatibility: All alerts work on web + mobile
- ✅ Guest login removed: Simplified auth flow (guest players in-game only)
- ✅ Safe area handling: Added `react-native-safe-area-context` for proper status bar/home indicator spacing
- ✅ OAuth redirect: Standalone builds use explicit `com.10kscorekeeper://` scheme (not `AuthSession.makeRedirectUri()`)
- ✅ Profile creation: Removed duplicate logic from LoginScreen - App.tsx's ProfileSetupModal handles all OAuth profile creation
- ✅ HomeScreen header: Changed from fixed `height` to `minHeight` to accommodate safe area insets on phones with notches
- ✅ Auth refactoring: Centralized auth constants, added timeout utilities, removed session polling workaround from LoginScreen
- ✅ Dice animation: NativeDiceLoader uses "Wide Wobble" (±18° rotation, 2 oscillations, decay)
- ✅ Loading UX: Cycling humorous messages on Stats/Games screens, 1-second minimum display
- ✅ Themed alerts: "No Game Selected" uses custom Modal respecting dark/light theme
- ✅ Env cleanup: Simplified to `.env` + `.env.alternatives` + `.env.test`
- ✅ Guest validation: Guest player names validated with `validatePlayerName()` before DB insertion
- ✅ ThemedAlert: Cross-platform modal alert component for consistent dark/light mode
- ✅ Delete account: `deleteAccount()` function anonymizes game history, deletes profile
- ✅ Privacy Policy: Added link in Settings screen (Legal section)
- ✅ Secure logging: All console.log/error replaced with `logger` (PII sanitization, backend-controlled debug)
- ✅ Error logging: Errors automatically sent to Supabase `error_logs` table (sanitized, no PII)
- ✅ Layout architecture: HomeScreen uses `NAV_BAR_HEIGHT + insets.bottom` for dynamic content padding
- ✅ Responsive buttons: Quick score buttons use calculated widths + `maxFontSizeMultiplier` for device consistency
- ✅ ScreenContainer: Reusable layout wrapper component added to `src/components/`

## Environments

**Two-tier setup** (industry standard for small projects):

| Environment | Supabase Project | Purpose |
|-------------|------------------|---------|
| **Production** | `10k-prod` | Real users, live app |
| **Development** | `10k-dev` | Testing, development |

**Environment Files:**
- `.env` – Active credentials (app reads this file)
- `.env.alternatives` – Reference file with PROD and DEV credentials to copy from
- `.env.test` – Jest tests only (uses `TEST_` prefix variables)

**To switch environments:** Copy desired section from `.env.alternatives` into `.env`, restart Expo with `--clear`

**Build Configuration:**
- `app.config.js` – Dynamic Expo config (version, package names per environment)
- `eas.json` – EAS Build profiles (development, preview-dev, preview, production)

**EAS Account:** `tuesdaylabs` (project: `@tuesdaylabs/10k-scorekeeper`)

**Configured Secrets:** `DEV_SUPABASE_URL`, `DEV_SUPABASE_ANON_KEY`, `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY`

**Build Profiles:**
| Profile | App ID | Supabase | Use Case |
|---------|--------|----------|----------|
| `development` | `com.tenk.scorekeeper.dev` | 10k-dev | Local dev (requires dev server) |
| `preview-dev` | `com.tenk.scorekeeper.previewdev` | 10k-dev | **E2E testing** (standalone APK) |
| `preview` | `com.tenk.scorekeeper.preview` | 10k-prod | Internal testing |
| `production` | `com.tenk.scorekeeper` | 10k-prod | App Store release |

**Build Commands (EAS Cloud):**
```bash
eas build --profile preview-dev --platform android  # E2E testing APK (uses dev Supabase)
eas build --profile preview --platform android      # Sideloadable APK (uses prod Supabase)
eas build --profile production --platform android   # Google Play AAB
```

**Note:** Android only - no iOS App Store release planned.

**⚠️ PRODUCTION RELEASE REQUIREMENT:**
For official Google Play releases, **use EAS cloud builds** (not local builds):
```bash
eas build --profile production --platform android   # Cloud build - includes mapping files
```
Cloud builds automatically include R8/ProGuard deobfuscation mapping files, which Google Play needs to provide readable crash reports. Local builds (`--local`) do NOT include these files and will show a warning in Google Play Console. Internal testing can use local builds, but production releases should use cloud builds.

**Local Builds (WSL - Unlimited, No Quota):**
```bash
# From WSL terminal (or Claude Code can trigger automatically)
cd /mnt/c/Users/blink/Documents/10K/10k-scorekeeper
eas build --profile preview-dev --platform android --local --output ./build/10k-preview-dev.apk
```
- **No EAS quota limits** - builds run locally in WSL
- **Output**: `build/` directory
- **See skill**: `.claude/skills/local-build/SKILL.md` for full documentation

**Pre-built Files in `build/` Directory:**
- `build/10k-preview-dev.apk` - Standalone APK (10k-dev Supabase, no dev server needed)
- `build/10k-dev.apk` - Development APK (requires Metro dev server running)
- `build/10k-production-v{VERSION}-b{BUILD}.aab` - Production AAB for Google Play

**AAB Naming Convention:**
- Format: `10k-production-v{APP_VERSION}-b{BUILD_NUMBER}.aab`
- Example: `10k-production-v1.0.1-b4.aab`
- Old AABs archived to `build/archive/`

**⚠️ REQUIRED: Production Build Workflow:**
Before building a new AAB, Claude Code MUST:
1. **Ask user for version** (recommend +0.0.1, e.g., 1.0.0 → 1.0.1)
2. **Auto-increment BUILD_NUMBER** by 1
3. **Archive existing AABs** to `build/archive/`
4. **Build with versioned filename**

See `.claude/skills/local-build/SKILL.md` for full workflow details.

Install existing APK: `adb install -r build/10k-preview-dev.apk`

**See**: `.claude/DEV_PROD_GUIDE.md` for detailed migration workflow and EAS Build setup

## Quick Start
```bash
npm start              # Dev server (uses .env → 10k-prod)
npm test               # Unit tests (154 tests, mocked Supabase)
npm run test:e2e       # E2E tests (Playwright browser tests)
npm run test:e2e:mobile # Mobile E2E tests (Maestro - requires device/emulator)
npm run test:all       # Run all tests
```

**Key paths:**
- Screens: `src/screens/`
- Shared components: `src/components/` (ThemedLoader, DiceLoader, ThemedAlert)
- Components reference: `.claude/LOADER_COMPONENTS_REF.md`
- Color palette: `.claude/COLORS_REF.md` (theme colors reference)
- Database schema: `.claude/DATABASE_QUICK_REF.md` (AI quick reference - table columns)
- Database RLS policies: `.claude/RLS_POLICIES_REF.md` (AI quick reference - security policies)
- Database DDL: `database/CURRENT_SCHEMA.sql` (full authoritative schema)
- Database verification: `database/verification/` (check current state)
- Database utilities: `database/manual/` (manual operations like claim, clear data, prod cleanup)
- Tests: `__tests__/` (all tests)
  - Unit tests: `__tests__/unit/`
  - Web E2E tests: `__tests__/e2e/` (Playwright)
  - Mobile E2E tests: `__tests__/e2e-mobile/` (Maestro flows)

## Git Workflow

**Permissions**: Git commands pre-approved in `.claude/settings.local.json`

**Security**: `.gitignore` protects secrets (`.env` files, build artifacts, logs)

**Standard workflow**:
```bash
git add .gitignore .claude/ src/ __tests__/ database/ [safe files]
git commit -m "message"
git push                # First push may need: --set-upstream origin [branch]
git checkout -b [new-branch]
```

**Never commit**: `.env*`, `.expo/`, `*.log`, `temp_*`, `nul` (already in .gitignore)

## Privacy Policy & Store Listing

**Privacy Policy:**
- **Live URL**: https://sites.google.com/view/10kscorekeeper-privacy-policy/home (hosted on Google Sites)
- **Local reference**: `docs/privacy-policy.html` (template/reference, NOT the live policy)
- **Workflow**: Edit `docs/privacy-policy.html` → manually copy changes to Google Sites

**Store Listing:**
- **Reference file**: `docs/store-description.md` (app store copy)
- **Workflow**: Edit file → manually copy to Google Play Console

**When to update privacy policy:**
- Adding new data collection (error logs, analytics, etc.)
- Changing data retention policies
- Adding third-party integrations

## Development Philosophy
- **Prefer editing** over creating new files
- **Use existing functions** from `src/lib/database.ts`
- **Check Skills** before implementing common patterns
- **Validate inputs** before DB operations
- **Test on web + mobile** (Platform.OS differences matter)

## Mobile E2E Testing (Maestro)

**Purpose:** True end-to-end testing on Android devices/emulators using [Maestro](https://maestro.mobile.dev/).

### Prerequisites
- **Maestro CLI** – Install via PowerShell (Admin): `iwr -useb 'https://get.maestro.mobile.dev' | iex`
- **Java 17** – Required by Maestro (Eclipse Adoptium Temurin recommended)
- **Android Studio** – For Android Emulator (Device Manager → Create Virtual Device)
- **ADB** – Comes with Android SDK (typically at `C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools\`)

**Environment Variables (Windows):**
```bash
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot
```

### Test Users (in 10k-dev Supabase)
Create these users in 10k-dev Supabase → Authentication → Users:
- `testuser1@10k.test` / `TestPassword123!`
- `testuser2@10k.test` / `TestPassword123!`

### Running Mobile E2E Tests

```bash
# 1. Build preview-dev APK (uses 10k-dev Supabase)
eas build --profile preview-dev --platform android

# 2. Start Android Emulator (via Android Studio Device Manager)
# 3. Install APK (EAS prompts to install, or use adb)
adb install -r <path-to-apk>

# 4. Run all Maestro flows
npm run test:e2e:mobile

# Run single flow
npm run test:e2e:mobile:flow __tests__/e2e-mobile/flows/01-app-launch.yaml

# Interactive test builder
npm run test:e2e:mobile:studio
```

### Test Flows
Located in `__tests__/e2e-mobile/flows/`:
- `01-app-launch.yaml` – Verify app launches, login screen visible
- `02-login-email-nolaucnh.yaml` – **First-time user** (no profile) - tests Welcome modal + profile creation
- `02b-login-returning-user-nolaunch.yaml` – **Returning user** (has profile) - tests direct Home access
- `03-google-oauth-nolaunch.yaml` – Google OAuth initiation (manual completion)
- `04-create-game.yaml` – Create a new game after login
- `05-navigation.yaml` – Test all navigation tabs
- `06-gameplay-scores.yaml` – Score entry, quick buttons, bust
- `07-game-finish.yaml` – Build game to 10,000+ points
- `08-settings-theme.yaml` – Settings modal and theme toggle
- `09-join-game.yaml` – Join game modal with code input

**See:** `__tests__/e2e-mobile/README.md` for detailed Maestro documentation