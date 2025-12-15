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
- `src/screens/GameScreen.tsx` – main game logic, realtime sync

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
- `react-native-web-patterns` – Platform.OS checks, alerts, web compatibility
- `supabase-patterns` – DB queries, realtime, RLS, error handling
- `theme-styling` – Theme usage, modal structure, button patterns
- `validation-errors` – Input validation, error display
- `modal-components` – Standard modal layouts
- `testing-patterns` – Unit tests, E2E tests, mocking, test utilities

**Why:** Skills load on-demand, reducing context. They contain all implementation patterns.

### Essential Patterns Only
- **Alerts**: Always check `Platform.OS` (web = `window.alert`, native = `Alert.alert`)
- **DB Schema**: Check `CURRENT_SCHEMA.sql` before queries (don't assume structure)
- **Validation**: Use `src/lib/validation.ts` functions before any DB operation
- **Database Ops**: Use functions from `src/lib/database.ts` (don't write raw Supabase queries)
- **Themes**: Use `useTheme()` and `useThemedStyles()` – never hardcode colors
- **Loading States**: Use `<ThemedLoader />` from `src/components` (red dice on web, spinner on native)

## Recent Critical Fixes
- ✅ Auth security: Fixed `secureTextEntry`, removed unsafe password masking
- ✅ Round removal: Validates scores exist before allowing round reduction
- ✅ Platform compatibility: All alerts work on web + mobile
- ✅ Guest login removed: Simplified auth flow (guest players in-game only)

## Quick Start
```bash
npm start              # Dev server
npm test               # Run tests
```

**Key paths:**
- Screens: `src/screens/`
- Shared components: `src/components/` (ThemedLoader, DiceLoader)
- Components reference: `.claude/LOADER_COMPONENTS_REF.md`
- Database schema: `.claude/DATABASE_QUICK_REF.md` (AI quick reference - table columns)
- Database RLS policies: `.claude/RLS_POLICIES_REF.md` (AI quick reference - security policies)
- Database DDL: `database/CURRENT_SCHEMA.sql` (full authoritative schema)
- Database migrations: `database/migrations/` (one-time schema evolution scripts)
- Database verification: `database/verification/` (check current state)
- Database utilities: `database/manual/` (manual operations like claim, clear data, prod cleanup)
- Tests: `__tests__/`

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

## Development Philosophy
- **Prefer editing** over creating new files
- **Use existing functions** from `src/lib/database.ts`
- **Check Skills** before implementing common patterns
- **Validate inputs** before DB operations
- **Test on web + mobile** (Platform.OS differences matter)