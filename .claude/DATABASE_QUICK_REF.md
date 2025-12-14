# Database Quick Reference

**Status:** ⚠️ REFERENCE ONLY - Direct Supabase access available (see SUPABASE_ACCESS.md)

**Source of Truth:** Live Supabase database (query directly via service_role)
**Last Verified:** 2025-12-13

**Note:** This file is maintained for quick reference. For current schema:
- Use `node debug_supabase.js` to inspect live data
- Query information_schema directly via service_role
- Run SQL in Supabase SQL Editor

## Tables Overview

### profiles (User accounts)
```
id            UUID NOT NULL PK (→ auth.users.id)
email         TEXT NOT NULL
display_name  TEXT NOT NULL  (required, user's display name)
created_at    TIMESTAMP WITH TIME ZONE
updated_at    TIMESTAMP WITH TIME ZONE
theme_mode    TEXT
```

**RLS:** Users can view/update own profile + view co-players' profiles

**Note:** All profiles are registered users (have accounts). Guest players exist only in `game_players` with `is_guest=true` and `user_id=NULL`.

---

### games
```
id                  UUID NOT NULL PK
created_by_user_id  UUID → profiles.id
join_code           TEXT NOT NULL UNIQUE (6 chars, A-Z0-9)
status              TEXT NOT NULL ('active', 'ended', 'complete')
created_at          TIMESTAMP WITH TIME ZONE
updated_at          TIMESTAMP WITH TIME ZONE
finished_at         TIMESTAMP WITH TIME ZONE
winning_player_id   UUID → game_players.id
winning_score       INTEGER
total_rounds        INTEGER (5-30)
```

**RLS:** Users can view their games + friend games (active) + create/update/delete own games

---

### game_players (Players in games)
```
id              UUID NOT NULL PK
game_id         UUID NOT NULL → games.id (CASCADE)
user_id         UUID → profiles.id (SET NULL)
player_name     TEXT NOT NULL
is_guest        BOOLEAN
is_on_board     BOOLEAN
total_score     INTEGER
display_order   INTEGER NOT NULL
created_at      TIMESTAMP WITH TIME ZONE
```

**RLS:** Users can view players in their games + join active games + update own records
Game creators can add/update/remove all players

---

### turns (Scores per round)
```
id           UUID NOT NULL PK
game_id      UUID NOT NULL → games.id (CASCADE)
player_id    UUID NOT NULL → game_players.id (CASCADE)
turn_number  INTEGER NOT NULL
score        INTEGER NOT NULL
is_bust      BOOLEAN
is_closed    BOOLEAN
notes        TEXT
created_at   TIMESTAMP WITH TIME ZONE
```

**RLS:** Users can view/add/update/delete turns in their games

---

## Key Security Functions

- `is_user_in_game(user_id, game_id)` - Check game membership
- `get_user_game_ids(user_id)` - Get user's game IDs
- `get_coplayer_user_ids(user_id)` - Get co-player IDs
- `get_friend_game_ids(user_id)` - Get friend game IDs
- `prevent_ended_game_modification()` - Trigger to block changes to ended games

---

## Usage Notes

- **For detailed constraints/policies:** Check `database/CURRENT_SCHEMA.sql`
- **For current backend data:** User can paste table query results when needed
- **For DB operations:** Use functions from `src/lib/database.ts`