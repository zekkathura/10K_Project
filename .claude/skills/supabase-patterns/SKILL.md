---
name: supabase-patterns
description: Use when working with Supabase database operations, queries, mutations, realtime subscriptions, or RLS policies
---

# Supabase Database Patterns

This Skill provides conventions for working with Supabase in the 10K Scorekeeper app.

## Database Schema Source of Truth

**ALWAYS** refer to `database/CURRENT_SCHEMA.sql` as the source of truth for:
- Table structure
- Column types
- Constraints
- RLS policies

Never assume schema - check the file first.

## Core Tables

- `profiles` - User profiles (id, email, display_name, registered_name, theme_mode)
- `games` - Game instances (id, game_name, join_code, status, total_rounds, winning_player_id, winning_score, finished_at)
- `game_players` - Players in games (id, game_id, user_id, player_name, is_guest, display_order)
- `turns` - Score entries (id, game_id, player_id, turn_number, score, is_bust)

## Common Query Patterns

### Basic Query with Error Handling

```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .single(); // or .maybeSingle() if might not exist

if (error) throw error;
```

### Insert with Validation

```typescript
import { validateGameName } from '../lib/validation';

const nameValidation = validateGameName(gameName);
if (!nameValidation.isValid) {
  throw new Error(nameValidation.error);
}

const { data, error } = await supabase
  .from('games')
  .insert({
    game_name: nameValidation.sanitized,
    // other fields...
  })
  .select()
  .single();

if (error) throw error;
return data;
```

### Update Pattern

```typescript
const { error } = await supabase
  .from('table_name')
  .update({ column: newValue })
  .eq('id', itemId);

if (error) throw error;
```

### Realtime Subscriptions

```typescript
import { RealtimeChannel } from '@supabase/supabase-js';

useEffect(() => {
  let channel: RealtimeChannel | null = null;

  const subscribe = async () => {
    channel = supabase
      .channel(`unique-channel-name`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'table_name',
        filter: `id=eq.${someId}`
      }, (payload) => {
        // Handle change
        loadData();
      });

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED' && status !== 'CLOSED') {
        console.warn('Realtime subscribe status:', status);
      }
    });
  };

  subscribe();

  return () => {
    const cleanup = async () => {
      if (channel) {
        await channel.unsubscribe();
        supabase.removeChannel(channel);
      }
    };
    cleanup();
  };
}, [someId]);
```

## Validation Before Database Operations

Always validate inputs using functions from `src/lib/validation.ts`:
- `validateGameName(name)` - For game names
- `validatePlayerName(name)` - For player names
- `validateJoinCode(code)` - For join codes
- `validateScore(score)` - For scores

## Error Handling Convention

```typescript
try {
  const result = await supabaseOperation();
  // Success handling
} catch (error) {
  console.error('Descriptive error message', error);
  if (Platform.OS === 'web') {
    window.alert('Error: User-friendly message');
  } else {
    Alert.alert('Error', 'User-friendly message');
  }
}
```

## Common Operations

All common database operations are in `src/lib/database.ts`:
- `createGame(gameName, userId)`
- `getMyGames(userId)`
- `joinGameByCode(joinCode, userId, playerName)`
- `getGamePlayers(gameId)`
- `getGameTurns(gameId)`
- `addTurn(gameId, playerId, score, isBust, ...)`
- `updateTurn(turnId, playerId, oldScore, newScore, isBust, ...)`
- `deleteTurn(turnId, playerId, score, isBust)`
- `deleteRound(gameId, roundNumber)`
- `removePlayer(playerId)`
- `addGuestPlayer(gameId, playerName)`
- `deleteGame(gameId)`
- `finishGame(gameId, winnerId, winningScore)`
- `updatePlayerName(playerId, newName)`
- `updatePlayerOrder(gameId, playerIds)`
- `updateGameRounds(gameId, totalRounds)`

**Prefer using these functions** instead of writing raw Supabase queries.

## When Adding New Database Operations

1. Check `CURRENT_SCHEMA.sql` for table structure
2. Add validation if needed
3. Create function in `src/lib/database.ts`
4. Export and use throughout the app
5. Handle errors with try-catch
6. Use Platform.OS check for alerts

## PostgreSQL Permissions

### GRANT Permissions (Required)

**IMPORTANT:** PostgreSQL has TWO layers of security:
1. **GRANT permissions** - Controls which roles can access tables at all
2. **RLS policies** - Controls which rows a role can see/modify

Both must be configured correctly. Even with RLS disabled, queries fail without GRANT permissions.

**Required GRANT permissions for all tables:**

```sql
-- Profiles table
GRANT SELECT ON profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- Games table
GRANT SELECT, INSERT, UPDATE, DELETE ON games TO authenticated;

-- Game Players table
GRANT SELECT, INSERT, UPDATE, DELETE ON game_players TO authenticated;

-- Turns table
GRANT SELECT, INSERT, UPDATE, DELETE ON turns TO authenticated;

-- App Config table (read-only)
GRANT SELECT ON app_config TO anon;
GRANT SELECT ON app_config TO authenticated;
```

**Verify GRANT permissions:**
```sql
SELECT grantee, table_name, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
ORDER BY table_name, grantee;
```

## RLS (Row Level Security)

All tables use RLS. Queries automatically respect user permissions. If a query fails with permission errors, check BOTH GRANT permissions AND RLS policies.

### Verification Scripts

**Always use these scripts to check current database state:**
- `database/verification/verify_rls_policies.sql` - List all RLS policies with roles and expressions
- `database/verification/verify_schema.sql` - Verify table structure

**Quick policy check:**
```sql
SELECT tablename, policyname, roles, cmd, qual AS using_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Reference Documentation
- `.claude/RLS_POLICIES_REF.md` - Quick reference for expected policies
- `.claude/DATABASE_QUICK_REF.md` - Quick reference for table columns

### DEV vs PROD Policies

**DEV ONLY policies** (permissive, remove before production):
- `authenticated_all_*` - Bypass all checks for authenticated users
- `Anon can * (DEV ONLY)` - Allow anon role for testing

**KEEP for production:**
- `service_role_all_*` - Needed for admin operations
- Specific role-based policies (e.g., "Users can view their own profile")

### Common RLS Errors

| Error Code | Meaning | Fix |
|------------|---------|-----|
| `42501` | Permission denied | Check RLS policy for the role and operation |
| `23505` | Unique constraint violation | Record already exists |

### Policy Cleanup Before Production

```sql
-- Remove DEV ONLY policies
DROP POLICY IF EXISTS "authenticated_all_game_players" ON game_players;
DROP POLICY IF EXISTS "authenticated_all_games" ON games;
DROP POLICY IF EXISTS "authenticated_all_turns" ON turns;
DROP POLICY IF EXISTS "Anon can view all profiles (DEV ONLY)" ON profiles;
DROP POLICY IF EXISTS "Anon can update all profiles (DEV ONLY)" ON profiles;
DROP POLICY IF EXISTS "Anon can insert profiles (DEV ONLY)" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
```