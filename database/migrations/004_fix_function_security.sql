-- Migration: Fix Function Security - Set search_path
-- Description: Prevents search_path manipulation attacks by explicitly setting search_path on all functions
-- Created: 2026-01-08
-- Apply to: BOTH dev and prod

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Fix: update_updated_at_column (used by profiles, games, user_feedback)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix: set_updated_at (used by game_players)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix: update_app_config_updated_at (used by app_config)
CREATE OR REPLACE FUNCTION update_app_config_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix: set_default_display_name (used by profiles)
CREATE OR REPLACE FUNCTION set_default_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.display_name IS NULL OR NEW.display_name = '' THEN
    NEW.display_name := COALESCE(NEW.full_name, split_part(NEW.email, '@', 1));
  END IF;
  RETURN NEW;
END;
$$;

-- Fix: prevent_ended_game_modification (used by games, game_players, turns)
CREATE OR REPLACE FUNCTION prevent_ended_game_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  game_status TEXT;
BEGIN
  -- Get the game status
  IF TG_TABLE_NAME = 'games' THEN
    SELECT status INTO game_status FROM games WHERE id = NEW.id;
  ELSIF TG_TABLE_NAME = 'game_players' THEN
    SELECT status INTO game_status FROM games WHERE id = NEW.game_id;
  ELSIF TG_TABLE_NAME = 'turns' THEN
    SELECT status INTO game_status FROM games WHERE id = NEW.game_id;
  END IF;

  -- Prevent modification if game is ended
  IF game_status = 'ended' THEN
    RAISE EXCEPTION 'Cannot modify data for ended games';
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================
-- GAME LOGIC FUNCTIONS
-- ============================================

-- Fix: create_round
CREATE OR REPLACE FUNCTION create_round(
  p_game_id UUID,
  p_round_number INTEGER
)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_player RECORD;
BEGIN
  FOR v_player IN
    SELECT id FROM game_players WHERE game_id = p_game_id
  LOOP
    INSERT INTO turns (game_id, player_id, turn_number, score, is_bust, is_closed)
    VALUES (p_game_id, v_player.id, p_round_number, 0, false, false);
  END LOOP;
END;
$$;

-- Fix: generate_join_code
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Fix: set_join_code (trigger function)
CREATE OR REPLACE FUNCTION set_join_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := generate_join_code();
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================
-- RLS SECURITY FUNCTIONS
-- ============================================

-- Fix: is_user_in_game
CREATE OR REPLACE FUNCTION is_user_in_game(user_id UUID, game_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM game_players
    WHERE game_players.user_id = is_user_in_game.user_id
    AND game_players.game_id = is_user_in_game.game_id
  );
END;
$$;

-- Fix: get_user_game_ids
CREATE OR REPLACE FUNCTION get_user_game_ids(user_id UUID)
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT game_id
  FROM game_players
  WHERE game_players.user_id = get_user_game_ids.user_id;
END;
$$;

-- Fix: get_coplayer_user_ids
CREATE OR REPLACE FUNCTION get_coplayer_user_ids(user_id UUID)
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT gp.user_id
  FROM game_players gp
  INNER JOIN game_players my_games ON gp.game_id = my_games.game_id
  WHERE my_games.user_id = get_coplayer_user_ids.user_id
    AND gp.user_id != get_coplayer_user_ids.user_id
    AND gp.user_id IS NOT NULL;
END;
$$;

-- Fix: get_friend_game_ids
CREATE OR REPLACE FUNCTION get_friend_game_ids(user_id UUID)
RETURNS SETOF UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT g.id
  FROM games g
  INNER JOIN game_players gp ON g.id = gp.game_id
  WHERE gp.user_id IN (SELECT get_coplayer_user_ids(get_friend_game_ids.user_id))
    AND g.status = 'active';
END;
$$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify all functions have search_path set
-- Run this to check:
-- SELECT
--   p.proname as function_name,
--   pg_get_function_identity_arguments(p.oid) as arguments,
--   CASE
--     WHEN prosecdef THEN 'SECURITY DEFINER'
--     ELSE 'SECURITY INVOKER'
--   END as security,
--   CASE
--     WHEN 'search_path' = ANY(proconfig::text[]) THEN 'SET'
--     ELSE 'NOT SET'
--   END as search_path_status
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND p.proname IN (
--     'update_updated_at_column',
--     'set_updated_at',
--     'update_app_config_updated_at',
--     'set_default_display_name',
--     'prevent_ended_game_modification',
--     'create_round',
--     'generate_join_code',
--     'set_join_code',
--     'is_user_in_game',
--     'get_user_game_ids',
--     'get_coplayer_user_ids',
--     'get_friend_game_ids'
--   )
-- ORDER BY p.proname;
