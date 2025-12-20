-- ============================================================================
-- 10K SCOREKEEPER - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Extracted from 10k-dev on 2025-12-15
-- This file represents the authoritative schema for both dev and prod
--
-- USAGE: Run this entire file in Supabase SQL Editor to set up the database
-- ============================================================================

-- ============================================================================
-- TABLE SCHEMAS
-- ============================================================================

-- App config table (version checking, maintenance mode)
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extra rules table (house rules)
CREATE TABLE IF NOT EXISTS extra_rules (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  proposer TEXT,
  approved_by TEXT,
  revoked_by TEXT,
  rule_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Profiles table (user accounts)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  full_name TEXT,
  theme_mode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  join_code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  total_rounds INTEGER DEFAULT 10,
  created_by_user_id UUID NOT NULL REFERENCES profiles(id),
  finished_at TIMESTAMP WITH TIME ZONE,
  winning_player_id UUID,
  winning_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Game players table (association between games and players)
CREATE TABLE IF NOT EXISTS game_players (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL,
  is_guest BOOLEAN DEFAULT false,
  is_on_board BOOLEAN DEFAULT false,
  total_score INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add FK constraint for winning_player_id after game_players exists
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

-- Turns table (individual scores)
CREATE TABLE IF NOT EXISTS turns (
  id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  turn_number INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  is_bust BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE turns ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CONSTRAINTS
-- ============================================================================

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
    SELECT 1 FROM pg_constraint WHERE conname = 'turns_score_non_negative'
  ) THEN
    ALTER TABLE turns ADD CONSTRAINT turns_score_non_negative
    CHECK (score >= 0);
  END IF;
END $$;

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
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_extra_rules_rule_number ON extra_rules(rule_number);
CREATE INDEX IF NOT EXISTS idx_game_players_user_id ON game_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_players_game_id ON game_players(game_id);
CREATE INDEX IF NOT EXISTS idx_turns_game_id ON turns(game_id);
CREATE INDEX IF NOT EXISTS idx_turns_player_id ON turns(player_id);
CREATE INDEX IF NOT EXISTS idx_games_join_code ON games(join_code);
CREATE INDEX IF NOT EXISTS idx_games_created_by ON games(created_by_user_id);

-- ============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_user_in_game(p_user_id uuid, p_game_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM game_players
    WHERE user_id = p_user_id
    AND game_id = p_game_id
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_game_ids(p_user_id uuid)
 RETURNS TABLE(game_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT gp.game_id
  FROM game_players gp
  WHERE gp.user_id = p_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_coplayer_user_ids(p_user_id uuid)
 RETURNS TABLE(user_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_friend_game_ids(p_user_id uuid)
 RETURNS TABLE(game_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.prevent_ended_game_modification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS prevent_turns_in_ended_games ON turns;
CREATE TRIGGER prevent_turns_in_ended_games
BEFORE INSERT OR UPDATE ON turns
FOR EACH ROW
EXECUTE FUNCTION prevent_ended_game_modification();

DROP TRIGGER IF EXISTS prevent_players_in_ended_games ON game_players;
CREATE TRIGGER prevent_players_in_ended_games
BEFORE INSERT ON game_players
FOR EACH ROW
EXECUTE FUNCTION prevent_ended_game_modification();

-- ============================================================================
-- RLS POLICIES - APP_CONFIG
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read app config" ON app_config;
CREATE POLICY "Anyone can read app config" ON app_config FOR SELECT TO anon, authenticated
USING (true);

-- ============================================================================
-- RLS POLICIES - EXTRA_RULES
-- ============================================================================

DROP POLICY IF EXISTS "extra_rules_select_authenticated" ON extra_rules;
CREATE POLICY "extra_rules_select_authenticated" ON extra_rules FOR SELECT TO authenticated
USING (true);

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Auth system can insert profiles" ON profiles;
CREATE POLICY "Auth system can insert profiles" ON profiles FOR INSERT TO authenticated
WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON profiles;
CREATE POLICY "Authenticated users can insert own profile" ON profiles FOR INSERT TO authenticated
WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
CREATE POLICY "Authenticated users can view all profiles" ON profiles FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO public
WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS "Users can select own profile by id" ON profiles;
CREATE POLICY "Users can select own profile by id" ON profiles FOR SELECT TO authenticated
USING ((auth.uid() = id));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated
USING ((auth.uid() = id))
WITH CHECK ((auth.uid() = id));

DROP POLICY IF EXISTS "Users can view profiles of players in their games" ON profiles;
CREATE POLICY "Users can view profiles of players in their games" ON profiles FOR SELECT TO authenticated
USING (((id = auth.uid()) OR (id IN ( SELECT get_coplayer_user_ids.user_id
   FROM get_coplayer_user_ids(auth.uid()) get_coplayer_user_ids(user_id)))));

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT TO authenticated
USING ((auth.uid() = id));

-- ============================================================================
-- RLS POLICIES - GAMES
-- ============================================================================

DROP POLICY IF EXISTS "Users can create games" ON games;
CREATE POLICY "Users can create games" ON games FOR INSERT TO authenticated
WITH CHECK ((created_by_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own games" ON games;
CREATE POLICY "Users can delete their own games" ON games FOR DELETE TO authenticated
USING ((created_by_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own games" ON games;
CREATE POLICY "Users can update their own games" ON games FOR UPDATE TO authenticated
USING ((created_by_user_id = auth.uid()))
WITH CHECK ((created_by_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view friend games" ON games;
CREATE POLICY "Users can view friend games" ON games FOR SELECT TO authenticated
USING (((status = 'active'::text) AND (id IN ( SELECT get_friend_game_ids.game_id
   FROM get_friend_game_ids(auth.uid()) get_friend_game_ids(game_id)))));

DROP POLICY IF EXISTS "Users can view games by join code" ON games;
CREATE POLICY "Users can view games by join code" ON games FOR SELECT TO authenticated
USING ((status = 'active'::text));

DROP POLICY IF EXISTS "Users can view games they are in" ON games;
CREATE POLICY "Users can view games they are in" ON games FOR SELECT TO authenticated
USING ((id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

-- Bypass policies for data import
DROP POLICY IF EXISTS "authenticated_all_games" ON games;
CREATE POLICY "authenticated_all_games" ON games FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_games" ON games;
CREATE POLICY "service_role_all_games" ON games FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES - GAME_PLAYERS
-- ============================================================================

DROP POLICY IF EXISTS "Game creators can add players" ON game_players;
CREATE POLICY "Game creators can add players" ON game_players FOR INSERT TO authenticated
WITH CHECK ((game_id IN ( SELECT games.id
   FROM games
  WHERE (games.created_by_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Game creators can remove players from their games" ON game_players;
CREATE POLICY "Game creators can remove players from their games" ON game_players FOR DELETE TO authenticated
USING ((game_id IN ( SELECT games.id
   FROM games
  WHERE (games.created_by_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Game creators can update players in their games" ON game_players;
CREATE POLICY "Game creators can update players in their games" ON game_players FOR UPDATE TO authenticated
USING ((game_id IN ( SELECT games.id
   FROM games
  WHERE (games.created_by_user_id = auth.uid()))))
WITH CHECK ((game_id IN ( SELECT games.id
   FROM games
  WHERE (games.created_by_user_id = auth.uid()))));

DROP POLICY IF EXISTS "Users can join active games" ON game_players;
CREATE POLICY "Users can join active games" ON game_players FOR INSERT TO authenticated
WITH CHECK (((user_id = auth.uid()) AND (game_id IN ( SELECT games.id
   FROM games
  WHERE (games.status = 'active'::text)))));

DROP POLICY IF EXISTS "Users can remove themselves from games" ON game_players;
CREATE POLICY "Users can remove themselves from games" ON game_players FOR DELETE TO authenticated
USING ((user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own player records" ON game_players;
CREATE POLICY "Users can update their own player records" ON game_players FOR UPDATE TO authenticated
USING ((user_id = auth.uid()))
WITH CHECK ((user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can view players in active games" ON game_players;
CREATE POLICY "Users can view players in active games" ON game_players FOR SELECT TO authenticated
USING ((EXISTS ( SELECT 1
   FROM games g
  WHERE ((g.id = game_players.game_id) AND (g.status = 'active'::text)))));

DROP POLICY IF EXISTS "Users can view players in their games" ON game_players;
CREATE POLICY "Users can view players in their games" ON game_players FOR SELECT TO authenticated
USING ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

-- Bypass policies for data import
DROP POLICY IF EXISTS "authenticated_all_game_players" ON game_players;
CREATE POLICY "authenticated_all_game_players" ON game_players FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_game_players" ON game_players;
CREATE POLICY "service_role_all_game_players" ON game_players FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- RLS POLICIES - TURNS
-- ============================================================================

DROP POLICY IF EXISTS "Players can add turns in their games" ON turns;
CREATE POLICY "Players can add turns in their games" ON turns FOR INSERT TO authenticated
WITH CHECK ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

DROP POLICY IF EXISTS "Players can delete turns in their games" ON turns;
CREATE POLICY "Players can delete turns in their games" ON turns FOR DELETE TO authenticated
USING ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

DROP POLICY IF EXISTS "Players can update turns in their games" ON turns;
CREATE POLICY "Players can update turns in their games" ON turns FOR UPDATE TO authenticated
USING ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))))
WITH CHECK ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

DROP POLICY IF EXISTS "Users can view turns in their games" ON turns;
CREATE POLICY "Users can view turns in their games" ON turns FOR SELECT TO authenticated
USING ((game_id IN ( SELECT get_user_game_ids.game_id
   FROM get_user_game_ids(auth.uid()) get_user_game_ids(game_id))));

-- Bypass policies for data import
DROP POLICY IF EXISTS "authenticated_all_turns" ON turns;
CREATE POLICY "authenticated_all_turns" ON turns FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_turns" ON turns;
CREATE POLICY "service_role_all_turns" ON turns FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

INSERT INTO app_config (key, value, description) VALUES
('min_app_version', '1.0.0', 'Minimum app version required'),
('force_update', 'false', 'If true, users must update'),
('maintenance_mode', 'false', 'If true, shows maintenance message'),
('maintenance_message', 'The app is currently under maintenance.', 'Message shown during maintenance')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- TABLE COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles - RLS enabled';
COMMENT ON TABLE games IS 'Game records - RLS enabled';
COMMENT ON TABLE game_players IS 'Game player associations - RLS enabled';
COMMENT ON TABLE turns IS 'Game turn records - RLS enabled';
COMMENT ON TABLE app_config IS 'App configuration - version checking, maintenance mode';
COMMENT ON TABLE extra_rules IS 'House rules - authenticated read, admin write';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
