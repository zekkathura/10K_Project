-- ============================================================================
-- 10K SCOREKEEPER - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file represents the current state of the Supabase database
-- Last Updated: Current session (see git history)
--
-- IMPORTANT: This is the source of truth for the database schema
-- Any changes to database structure, policies, or functions should be:
-- 1. Made via a new migration file in database/migrations/
-- 2. Applied to Supabase
-- 3. Reflected in this file by updating the relevant sections
-- ============================================================================

-- ============================================================================
-- TABLE SCHEMAS
-- ============================================================================

-- Profiles table (user accounts)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  full_name TEXT,  -- Immutable, from OAuth provider (admin reference only)
  theme_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  join_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  total_rounds INTEGER DEFAULT 10,
  created_by_user_id UUID NOT NULL REFERENCES profiles(id),
  finished_at TIMESTAMP WITH TIME ZONE,
  winning_player_id UUID,
  winning_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game players table (association between games and players)
CREATE TABLE IF NOT EXISTS game_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  is_guest BOOLEAN DEFAULT false,
  is_on_board BOOLEAN DEFAULT false,
  total_score INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turns table (individual scores)
CREATE TABLE IF NOT EXISTS turns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  is_bust BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE turns ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================
-- Note: Using DO blocks to safely add constraints (idempotent)

-- Games constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'games_join_code_format'
  ) THEN
    ALTER TABLE games ADD CONSTRAINT games_join_code_format
    CHECK (join_code ~ '^[A-Z0-9]{6}$');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'games_status_valid'
  ) THEN
    ALTER TABLE games ADD CONSTRAINT games_status_valid
    CHECK (status IN ('active', 'ended', 'complete'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'games_total_rounds_bounds'
  ) THEN
    ALTER TABLE games ADD CONSTRAINT games_total_rounds_bounds
    CHECK (total_rounds BETWEEN 5 AND 30);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'games_winning_player_fk'
  ) THEN
    ALTER TABLE games
      ADD CONSTRAINT games_winning_player_fk
      FOREIGN KEY (winning_player_id) REFERENCES game_players(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Note: player_type and registration_type columns were removed from profiles table
-- Constraints for these columns are no longer needed

-- Turns constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'turns_score_non_negative'
  ) THEN
    ALTER TABLE turns ADD CONSTRAINT turns_score_non_negative
    CHECK (score >= 0);
  END IF;
END $$;

-- Game players constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'game_players_display_order_non_negative'
  ) THEN
    ALTER TABLE game_players ADD CONSTRAINT game_players_display_order_non_negative
    CHECK (display_order >= 0);
  END IF;
END $$;

-- ============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS (for RLS policies)
-- ============================================================================

-- Function to check if user is in a specific game (bypasses RLS)
CREATE OR REPLACE FUNCTION is_user_in_game(p_user_id UUID, p_game_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM game_players
    WHERE user_id = p_user_id
    AND game_id = p_game_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all game IDs for a user (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_game_ids(p_user_id UUID)
RETURNS TABLE(game_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT gp.game_id
  FROM game_players gp
  WHERE gp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get co-player user IDs (bypasses RLS)
CREATE OR REPLACE FUNCTION get_coplayer_user_ids(p_user_id UUID)
RETURNS TABLE(user_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT gp.user_id
  FROM game_players gp
  WHERE gp.game_id IN (
    SELECT game_id FROM get_user_game_ids(p_user_id)
  )
  AND gp.user_id IS NOT NULL
  AND gp.user_id != p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get game IDs where user's co-players are playing (bypasses RLS)
CREATE OR REPLACE FUNCTION get_friend_game_ids(p_user_id UUID)
RETURNS TABLE(game_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT gp.game_id
  FROM game_players gp
  WHERE gp.user_id IN (
    SELECT user_id FROM get_coplayer_user_ids(p_user_id)
  )
  AND gp.game_id NOT IN (
    SELECT game_id FROM get_user_game_ids(p_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to prevent modification of ended games
CREATE OR REPLACE FUNCTION prevent_ended_game_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM games
    WHERE id = NEW.game_id
    AND status = 'ended'
  ) THEN
    RAISE EXCEPTION 'Cannot modify ended game';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to prevent turns in ended games
DROP TRIGGER IF EXISTS prevent_turns_in_ended_games ON turns;
CREATE TRIGGER prevent_turns_in_ended_games
BEFORE INSERT OR UPDATE ON turns
FOR EACH ROW
EXECUTE FUNCTION prevent_ended_game_modification();

-- Trigger to prevent adding players to ended games
DROP TRIGGER IF EXISTS prevent_players_in_ended_games ON game_players;
CREATE TRIGGER prevent_players_in_ended_games
BEFORE INSERT ON game_players
FOR EACH ROW
EXECUTE FUNCTION prevent_ended_game_modification();

-- ============================================================================
-- RLS POLICIES - PROFILES TABLE
-- ============================================================================

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can read profiles of players they've played with (FIXED - no recursion)
DROP POLICY IF EXISTS "Users can view profiles of players in their games" ON profiles;
CREATE POLICY "Users can view profiles of players in their games"
ON profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR
  id IN (
    SELECT user_id FROM get_coplayer_user_ids(auth.uid())
  )
);

-- Users can update only their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Profiles are created by the auth system
DROP POLICY IF EXISTS "Auth system can insert profiles" ON profiles;
CREATE POLICY "Auth system can insert profiles"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - GAMES TABLE
-- ============================================================================

-- Users can read games they are playing in
DROP POLICY IF EXISTS "Users can view games they are in" ON games;
CREATE POLICY "Users can view games they are in"
ON games FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- Users can read active games where their friends are playing
DROP POLICY IF EXISTS "Users can view friend games" ON games;
CREATE POLICY "Users can view friend games"
ON games FOR SELECT
TO authenticated
USING (
  status = 'active'
  AND id IN (
    SELECT game_id FROM get_friend_game_ids(auth.uid())
  )
);

-- Users can read games by join code (to join)
DROP POLICY IF EXISTS "Users can view games by join code" ON games;
CREATE POLICY "Users can view games by join code"
ON games FOR SELECT
TO authenticated
USING (status = 'active');

-- Users can create games
DROP POLICY IF EXISTS "Users can create games" ON games;
CREATE POLICY "Users can create games"
ON games FOR INSERT
TO authenticated
WITH CHECK (created_by_user_id = auth.uid());

-- Users can update games they created
DROP POLICY IF EXISTS "Users can update their own games" ON games;
CREATE POLICY "Users can update their own games"
ON games FOR UPDATE
TO authenticated
USING (created_by_user_id = auth.uid())
WITH CHECK (created_by_user_id = auth.uid());

-- Users can delete games they created
DROP POLICY IF EXISTS "Users can delete their own games" ON games;
CREATE POLICY "Users can delete their own games"
ON games FOR DELETE
TO authenticated
USING (created_by_user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES - GAME_PLAYERS TABLE (FIXED - no recursion)
-- ============================================================================

-- Users can read players in games they're part of
DROP POLICY IF EXISTS "Users can view players in their games" ON game_players;
CREATE POLICY "Users can view players in their games"
ON game_players FOR SELECT
TO authenticated
USING (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- Users can read players in active games (for join preview)
DROP POLICY IF EXISTS "Users can view players in active games" ON game_players;
CREATE POLICY "Users can view players in active games"
ON game_players FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM games g
    WHERE g.id = game_players.game_id
    AND g.status = 'active'
  )
);

-- Users can add themselves to active games
DROP POLICY IF EXISTS "Users can join active games" ON game_players;
CREATE POLICY "Users can join active games"
ON game_players FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND game_id IN (
    SELECT id
    FROM games
    WHERE status = 'active'
  )
);

-- Game creators can add players (including guests)
DROP POLICY IF EXISTS "Game creators can add players" ON game_players;
CREATE POLICY "Game creators can add players"
ON game_players FOR INSERT
TO authenticated
WITH CHECK (
  game_id IN (
    SELECT id
    FROM games
    WHERE created_by_user_id = auth.uid()
  )
);

-- Users can update their own player record (for claiming guests)
DROP POLICY IF EXISTS "Users can update their own player records" ON game_players;
CREATE POLICY "Users can update their own player records"
ON game_players FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Game creators can update player records in their games
DROP POLICY IF EXISTS "Game creators can update players in their games" ON game_players;
CREATE POLICY "Game creators can update players in their games"
ON game_players FOR UPDATE
TO authenticated
USING (
  game_id IN (
    SELECT id
    FROM games
    WHERE created_by_user_id = auth.uid()
  )
)
WITH CHECK (
  game_id IN (
    SELECT id
    FROM games
    WHERE created_by_user_id = auth.uid()
  )
);

-- Users can delete their own player record (leave game)
DROP POLICY IF EXISTS "Users can remove themselves from games" ON game_players;
CREATE POLICY "Users can remove themselves from games"
ON game_players FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Game creators can remove players from their games
DROP POLICY IF EXISTS "Game creators can remove players from their games" ON game_players;
CREATE POLICY "Game creators can remove players from their games"
ON game_players FOR DELETE
TO authenticated
USING (
  game_id IN (
    SELECT id
    FROM games
    WHERE created_by_user_id = auth.uid()
  )
);

-- ============================================================================
-- RLS POLICIES - TURNS TABLE
-- ============================================================================

-- Users can read turns in games they're part of
DROP POLICY IF EXISTS "Users can view turns in their games" ON turns;
CREATE POLICY "Users can view turns in their games"
ON turns FOR SELECT
TO authenticated
USING (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- Players can add turns to games they're in
DROP POLICY IF EXISTS "Players can add turns in their games" ON turns;
CREATE POLICY "Players can add turns in their games"
ON turns FOR INSERT
TO authenticated
WITH CHECK (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- Players can update turns in games they're in
DROP POLICY IF EXISTS "Players can update turns in their games" ON turns;
CREATE POLICY "Players can update turns in their games"
ON turns FOR UPDATE
TO authenticated
USING (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
)
WITH CHECK (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- Players can delete turns in games they're in
DROP POLICY IF EXISTS "Players can delete turns in their games" ON turns;
CREATE POLICY "Players can delete turns in their games"
ON turns FOR DELETE
TO authenticated
USING (
  game_id IN (
    SELECT game_id FROM get_user_game_ids(auth.uid())
  )
);

-- ============================================================================
-- INDEXES (Optional - for performance)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_turns_game_id ON turns(game_id);
CREATE INDEX IF NOT EXISTS idx_turns_player_id ON turns(player_id);
CREATE INDEX IF NOT EXISTS idx_games_join_code ON games(join_code);
CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by_user_id);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles - RLS enabled';
COMMENT ON TABLE games IS 'Game records - RLS enabled';
COMMENT ON TABLE game_players IS 'Game player associations - RLS enabled';
COMMENT ON TABLE turns IS 'Game turn records - RLS enabled';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
