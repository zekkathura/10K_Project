export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  theme_mode?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  created_by_user_id: string;
  join_code: string;
  status: 'active' | 'ended' | 'complete';
   total_rounds?: number;
  finished_at: string | null;
  winning_player_id?: string | null;
  winning_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface GamePlayer {
  id: string;
  game_id: string;
  user_id: string | null;
  player_name: string;
  is_guest: boolean;
  is_on_board: boolean;
  total_score: number;
  display_order: number;
  created_at: string;
}

export interface Turn {
  id: string;
  game_id: string;
  player_id: string;
  turn_number: number;
  score: number;
  is_bust: boolean;
  is_closed: boolean;
  notes: string | null;
  created_at: string;
}
