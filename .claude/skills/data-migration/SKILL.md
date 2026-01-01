# Data Migration Skill

Use when migrating data between Supabase databases (e.g., 10k-dev to 10k-prod).

## Prerequisites

1. **Service role access** to both databases (see `.claude/SUPABASE_ACCESS.local.md`)
2. **supabase-query.js** utility installed in project root

## Quick Status Check

```bash
node supabase-query.js status
```

Shows table counts for both databases side-by-side.

## Migration Order

**Critical:** Tables must be migrated in dependency order to satisfy foreign keys.

```
1. profiles        (no dependencies)
2. games           (depends on: profiles via created_by_user_id)
3. game_players    (depends on: games, profiles)
4. turns           (depends on: games, game_players)
```

## Migration Process

### Step 1: Check Current State

```bash
node supabase-query.js status
```

### Step 2: Disable Target Triggers (if needed)

Some triggers block inserts into ended games. Check for blocking triggers:

```sql
-- Run on TARGET database
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'turns';
```

Disable if needed:
```sql
ALTER TABLE turns DISABLE TRIGGER prevent_turns_in_ended_games;
```

### Step 3: Export Data from Source

Use batched exports for large tables (500 rows per batch):

```sql
-- Export games (run on SOURCE)
SELECT
  'INSERT INTO games (id, created_by_user_id, join_code, status, current_round, total_rounds, winning_player_id, winning_score, created_at, updated_at) VALUES' || E'\n' ||
  string_agg(
    format('(%L, %L, %L, %L, %s, %s, %L, %s, %L, %L)',
      id, created_by_user_id, join_code, status, current_round, total_rounds,
      winning_player_id, COALESCE(winning_score, 'NULL'), created_at, updated_at),
    E',\n'
  ) || E'\nON CONFLICT (id) DO NOTHING;'
FROM games;
```

```sql
-- Export game_players (run on SOURCE)
SELECT
  'INSERT INTO game_players (id, game_id, user_id, display_name, is_guest, player_order, current_score, created_at) VALUES' || E'\n' ||
  string_agg(
    format('(%L, %L, %L, %L, %s, %s, %s, %L)',
      id, game_id, user_id, display_name,
      CASE WHEN is_guest THEN 'true' ELSE 'false' END,
      player_order, current_score, created_at),
    E',\n'
  ) || E'\nON CONFLICT (id) DO NOTHING;'
FROM game_players;
```

```sql
-- Export turns in batches (run on SOURCE)
SELECT
  'INSERT INTO turns (id, game_id, player_id, turn_number, score, is_bust, is_closed, created_at, notes) VALUES' || E'\n' ||
  string_agg(
    format('(%L, %L, %L, %s, %s, %s, %s, %L, %L)',
      id, game_id, player_id, turn_number, score,
      CASE WHEN is_bust THEN 'true' ELSE 'false' END,
      CASE WHEN is_closed THEN 'true' ELSE 'false' END,
      created_at, COALESCE(notes, '')),
    E',\n'
  ) || E'\nON CONFLICT (id) DO NOTHING;'
FROM (
  SELECT * FROM turns
  ORDER BY id
  LIMIT 500 OFFSET 0  -- Increment OFFSET by 500 for each batch
) t;
```

### Step 4: Run INSERT on Target

Copy the generated INSERT statement and run on TARGET database.

### Step 5: Verify Counts

```bash
node supabase-query.js status
```

### Step 6: Re-enable Triggers

```sql
ALTER TABLE turns ENABLE TRIGGER prevent_turns_in_ended_games;
```

## Lessons Learned

### 1. Boolean Formatting in PostgreSQL
PostgreSQL's `format()` function outputs booleans as `t` and `f`, not `true` and `false`.

**Wrong:**
```sql
format('(%s)', is_bust)  -- Outputs: (t) - causes "column t does not exist"
```

**Right:**
```sql
CASE WHEN is_bust THEN 'true' ELSE 'false' END
```

### 2. Use ON CONFLICT for Idempotent Inserts
Always add `ON CONFLICT (id) DO NOTHING` to handle:
- Retries after partial failures
- Overlapping batches
- Re-running migration safely

### 3. Disable Blocking Triggers
Triggers like `prevent_turns_in_ended_games` will block inserts into games with `status = 'ended'`. Disable before migration, re-enable after.

### 4. Order By ID for Consistent Batching
Use `ORDER BY id` with `LIMIT/OFFSET` for deterministic batching. Random order can cause duplicates across batches.

### 5. Handle NULL Values
Use `COALESCE(column, 'NULL')` or `COALESCE(column, '')` for nullable columns in INSERT statements.

### 6. Batch Large Tables
For tables with >500 rows, use batched exports:
- First batch: `LIMIT 500 OFFSET 0`
- Second batch: `LIMIT 500 OFFSET 500`
- Continue until no results

### 7. Verify After Each Batch
Check counts after each batch to ensure progress:
```sql
SELECT COUNT(*) FROM turns;
```

### 8. Grant service_role Permissions
If service_role gets "permission denied" errors (403 Forbidden), the tables may be missing grants:
```sql
-- Run on the affected database
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- For future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
```

## Guest Player Migration

When migrating player data where users haven't signed up yet:

1. Set `user_id = NULL` for all migrated players
2. Set `is_guest = TRUE`
3. Players can be "claimed" later when users sign up (see `database/manual/claim_guest_player.sql`)

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `column "t" does not exist` | Boolean `t`/`f` in format() | Use CASE WHEN for booleans |
| `Cannot modify ended game` | Trigger blocking insert | Disable trigger before migration |
| `duplicate key violation` | Re-inserting existing rows | Add `ON CONFLICT (id) DO NOTHING` |
| `null value in column "x"` | Missing required field | Check NOT NULL columns, add COALESCE |
| `insert violates foreign key` | Wrong migration order | Migrate parent tables first |

## Verification Queries

```sql
-- Check data integrity after migration
SELECT
  (SELECT COUNT(*) FROM games) as games,
  (SELECT COUNT(*) FROM game_players) as players,
  (SELECT COUNT(*) FROM turns) as turns;

-- Check for orphaned records
SELECT COUNT(*) FROM turns t
WHERE NOT EXISTS (SELECT 1 FROM games g WHERE g.id = t.game_id);

SELECT COUNT(*) FROM game_players gp
WHERE NOT EXISTS (SELECT 1 FROM games g WHERE g.id = gp.game_id);
```
