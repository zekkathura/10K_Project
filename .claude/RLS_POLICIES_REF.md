# RLS Policies Reference

**Status:** ⚠️ REFERENCE ONLY - Direct Supabase access available (see SUPABASE_ACCESS.md)

**Source of Truth:** Live Supabase database (query directly via service_role)
**Last Verified:** 2025-12-13
**Current Mode:** 🚧 DEVELOPMENT (Permissive policies enabled)

**Note:** This file is maintained for quick reference. For current state, use:
- `node check_policies.js` to query policies programmatically
- Run SQL directly in Supabase SQL Editor with service_role access

---

## Current RLS Policy Status

### ⚠️ Development-Only Policies (REMOVE BEFORE PRODUCTION)

These policies bypass all security checks for easier development:

```sql
-- game_players table
authenticated_all_game_players    → ALL operations (using: true)
service_role_all_game_players     → ALL operations (using: true) [KEEP - needed]

-- games table
authenticated_all_games           → ALL operations (using: true)
service_role_all_games            → ALL operations (using: true) [KEEP - needed]

-- turns table
authenticated_all_turns           → ALL operations (using: true)
service_role_all_turns            → ALL operations (using: true) [KEEP - needed]
```

**Action Required:** Delete `authenticated_all_*` policies before production launch.

---

## Production-Ready Policies (Keep These)

### **profiles** Table

#### SELECT Policies
- ✅ `Users can view their own profile` - Users can view own profile (auth.uid() = id)
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

#### INSERT Policies
- ✅ `Users can join active games` - Users can add themselves to active games
- ✅ `Game creators can add players` - Creators can add guest players

#### UPDATE Policies
- ✅ `Users can update their own player records` - Users can update own record
- ✅ `Game creators can update players in their games` - Creators can update any player

#### DELETE Policies
- ✅ `Users can remove themselves from games` - Users can leave games
- ✅ `Game creators can remove players from their games` - Creators can remove any player

---

### **turns** Table

#### SELECT Policies
- ✅ `Users can view turns in their games` - View turns for games user is in

#### INSERT Policies
- ✅ `Players can add turns in their games` - Add turns to games user is in

#### UPDATE Policies
- ✅ `Players can update turns in their games` - Update turns in games user is in

#### DELETE Policies
- ✅ `Players can delete turns in their games` - Delete turns in games user is in

---

## Recommended Cleanup Actions

### ✅ Phase 1: Remove Duplicates (COMPLETED)
Duplicate policies have been removed.

### Phase 2: Production Security (Before Launch)
```sql
-- Remove overly permissive policies
DROP POLICY IF EXISTS "authenticated_all_game_players" ON game_players;
DROP POLICY IF EXISTS "authenticated_all_games" ON games;
DROP POLICY IF EXISTS "authenticated_all_turns" ON turns;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
```

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