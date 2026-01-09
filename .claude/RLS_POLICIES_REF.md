# RLS Policies Reference

**Status:** ⚠️ REFERENCE ONLY - Direct Supabase access available (see SUPABASE_ACCESS.md)

**Source of Truth:** Live Supabase database (query directly via service_role)
**Last Verified:** 2026-01-08 (security hardening - removed permissive policies from PROD)
**Current Mode:**
- **PRODUCTION:** ✅ Secured (permissive policies removed)
- **DEVELOPMENT:** 🚧 Permissive policies enabled for testing

**Note:** This file is maintained for quick reference. For current state, use:
- `node check_policies.js` to query policies programmatically
- Run SQL directly in Supabase SQL Editor with service_role access

---

## Current RLS Policy Status

### ⚠️ Development-Only Policies

**PRODUCTION:** ✅ All permissive `authenticated_all_*` policies removed (2026-01-08)
**DEVELOPMENT:** 🚧 Permissive policies still enabled for easier testing

These policies bypass all security checks for easier development:

```sql
-- DEV ONLY - Removed from PROD on 2026-01-08
authenticated_all_game_players    → ALL operations (using: true) [DEV ONLY]
authenticated_all_games           → ALL operations (using: true) [DEV ONLY - DELETED FROM PROD]
authenticated_all_turns           → ALL operations (using: true) [DEV ONLY]
authenticated_all_extra_rules     → ALL operations (using: true) [DEV ONLY - DELETED FROM PROD]

-- Service role policies (KEEP in both DEV and PROD)
service_role_all_game_players     → ALL operations (using: true) [ADMIN - KEEP]
service_role_all_games            → ALL operations (using: true) [ADMIN - KEEP]
service_role_all_turns            → ALL operations (using: true) [ADMIN - KEEP]
```

**Status:** Production is secured. Development keeps permissive policies for easier testing.

---

## Production-Ready Policies (Keep These)

### **profiles** Table

#### SELECT Policies
- ✅ `Users can view their own profile` - Users can view own profile (auth.uid() = id)
- ✅ `Users can select own profile by id` - Allows profile existence check during signup (auth.uid() = id)
- ✅ `Users can view profiles of players in their games` - Users can view co-players
- ⚠️ `Authenticated users can view all profiles` - [REMOVE IN PROD] Too broad (using: true)

#### INSERT Policies
- ✅ `Users can insert own profile` - Allows profile creation (public role, auth.uid() = id)
- ✅ `Authenticated users can insert own profile` - Allows profile creation (authenticated role, auth.uid() = id)

#### UPDATE Policies
- ✅ `Users can update their own profile` - Users can edit own profile

---

### **games** Table

#### SELECT Policies
- ✅ `Users can view games they are in` - View games user is participating in
- ✅ `Users can view games by join code` - Allow joining by code (status = 'active')
- ✅ `Users can view friend games` - View games of co-players

#### INSERT Policies
- ✅ `Users can create games` - User must be creator (created_by_user_id = auth.uid())

#### UPDATE Policies
- ✅ `Users can update their own games` - Only game creator can update

#### DELETE Policies
- ✅ `Users can delete their own games` - Only game creator can delete

---

### **game_players** Table

#### SELECT Policies
- ✅ `Users can view players in their games` - View players in games user is in
- ✅ `Users can view players in active games` - View players in any active game
- ✅ `Users can view players in completed games` - View players in ended games (for stats)

#### INSERT Policies
- ✅ `Users can join active games` - Users can add themselves to active games
- ✅ `Game creators can add players` - Creators can add guest players

#### UPDATE Policies
- ✅ `Users can update their own player records` - Users can update own record (user_id = auth.uid())
- ✅ `Game creators can update players in their games` - Creators can update any player (checks games table, no recursion)

#### DELETE Policies
- ✅ `Users can remove themselves from games` - Users can leave games (user_id = auth.uid())
- ✅ `Game creators can remove players from their games` - Creators can remove any player (checks games table, no recursion)

---

### **turns** Table

#### SELECT Policies
- ✅ `Users can view turns in their games` - View turns for games user is in
- ✅ `Users can view turns in completed games` - View turns in ended games (for stats)

#### INSERT Policies
- ✅ `Players can add turns in their games` - Add turns to games user is in

#### UPDATE Policies
- ✅ `Players can update turns in their games` - Update turns in games user is in

#### DELETE Policies
- ✅ `Players can delete turns in their games` - Delete turns in games user is in

---

### **user_feedback** Table

#### SELECT Policies
- ✅ `feedback_select_own` - Users can read their own feedback (auth.uid() = user_id)

#### INSERT Policies
- ✅ `feedback_insert_rate_limited` - Users can insert feedback with rate limiting:
  - Rate limit: 5 submissions per 24 hours
  - Enforced via SQL COUNT query in WITH CHECK clause
  - User must be authenticated (auth.uid() = user_id)
  - Returns RLS violation error when limit exceeded

#### ALL Policies
- ✅ `feedback_service_role_all` - Service role has full access (for admin viewing in Supabase Dashboard)

**Note:** No UPDATE or DELETE policies for regular users. Feedback is append-only from user perspective.

---

## Recommended Cleanup Actions

### ✅ Phase 1: Remove Duplicates (COMPLETED)
Duplicate policies have been removed.

### ✅ Phase 2: Fix Infinite Recursion (COMPLETED 2026-01-01)
Removed recursive policies that caused "infinite recursion detected" errors:
- ❌ `Game participants can remove players` - Checked game_players to allow game_players DELETE
- ❌ `Game participants can update players` - Checked game_players to allow game_players UPDATE

Replaced with non-recursive versions that check `games.created_by_user_id` instead.

### ✅ Phase 3: Production Security (COMPLETED 2026-01-08)
Removed overly permissive policies from PRODUCTION:
- ✅ `authenticated_all_games` - Deleted from PROD (kept in DEV)
- ✅ `authenticated_all_extra_rules` - Deleted from PROD (kept in DEV)

**Note:** `authenticated_all_game_players` and `authenticated_all_turns` remain in DEV only for testing.
Production now uses only restrictive policies (users can only access their own games).

---

## Policy Naming Convention

**Pattern:** `{Subject} can {action} {object/condition}`

**Examples:**
- ✅ `Users can view their own profile`
- ✅ `Game creators can add players`
- ✅ `Players can delete turns in their games`

**Avoid:**
- ❌ `authenticated_all_*` (too vague)
- ❌ Generic names without context

---

## Verification Workflow

**To check if this file is up-to-date:**

1. Run `database/verification/verify_rls_policies.sql` in Supabase
2. Compare output with this file
3. Update this file if policies have changed
4. Commit changes to keep documentation in sync

**Why we do this:** Prevents AI from recommending changes incompatible with actual backend structure.