import { supabase } from './supabase';
import { Game, GamePlayer, Turn } from './types';
import { validateJoinCode, validatePlayerName, validateScore } from './validation';

function generateJoinCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createGame(userId: string) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const joinCode = generateJoinCode();
    const { data, error } = await supabase
      .from('games')
      .insert({
        created_by_user_id: userId,
        status: 'active',
        total_rounds: 10,
        join_code: joinCode,
      })
      .select()
      .single();

    if (!error) {
      return data as Game;
    }

    // Retry on unique violation of join_code, otherwise throw immediately
    const isDuplicate = (error as any)?.code === '23505' || (error as any)?.message?.includes('join_code');
    if (!isDuplicate || attempt === maxAttempts - 1) {
      throw new Error('Error: Duplicate game codes. Try again later');
    }
  }

  throw new Error('Error: Duplicate game codes. Try again later');
}

export async function getMyGames(userId: string) {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      game_players:game_players!game_players_game_id_fkey(*)
    `)
    .eq('game_players.user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Game[];
}

export async function joinGameByCode(joinCode: string, userId: string, playerName: string) {
  // Validate join code
  const codeValidation = validateJoinCode(joinCode);
  if (!codeValidation.isValid) {
    throw new Error(codeValidation.error);
  }

  // Validate player name
  const nameValidation = validatePlayerName(playerName);
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.error);
  }

  // First, find the game (RLS will ensure it's active and accessible)
  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('id, status')
    .eq('join_code', codeValidation.sanitized!)
    .eq('status', 'active')
    .single();

  if (gameError) throw gameError;
  if (!game) throw new Error('Game not found or has ended');

  // Add player to game
  const { data: existingPlayers } = await supabase
    .from('game_players')
    .select('display_order')
    .eq('game_id', game.id)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existingPlayers && existingPlayers.length > 0
    ? existingPlayers[0].display_order + 1
    : 0;

  const { data, error } = await supabase
    .from('game_players')
    .insert({
      game_id: game.id,
      user_id: userId,
      player_name: nameValidation.sanitized!,
      is_guest: false,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return { gameId: game.id, player: data as GamePlayer };
}

export async function getJoinableGamesWithFriends(userId: string) {
  // Step 1: Find all games where the current user has played
  const { data: myGamePlayers, error: myGamesError } = await supabase
    .from('game_players')
    .select('game_id')
    .eq('user_id', userId);

  if (myGamesError) throw myGamesError;

  const myGameIds = myGamePlayers?.map(gp => gp.game_id) || [];

  if (myGameIds.length === 0) {
    // User hasn't played any games yet, so no friends
    return [];
  }

  // Step 2: Find all other players (friends) from those games
  const { data: friendPlayers, error: friendsError } = await supabase
    .from('game_players')
    .select('user_id')
    .in('game_id', myGameIds)
    .neq('user_id', userId)
    .not('user_id', 'is', null); // Exclude guests

  if (friendsError) throw friendsError;

  const friendUserIds = [...new Set(friendPlayers?.map(fp => fp.user_id) || [])];

  if (friendUserIds.length === 0) {
    // No friends found
    return [];
  }

  // Step 3: Find active games where friends are playing
  const { data: friendGamePlayers, error: friendGamePlayersError } = await supabase
    .from('game_players')
    .select('game_id')
    .in('user_id', friendUserIds);

  if (friendGamePlayersError) throw friendGamePlayersError;

  const friendGameIds = [...new Set(friendGamePlayers?.map(fgp => fgp.game_id) || [])];

  if (friendGameIds.length === 0) {
    return [];
  }

  // Step 4: Get active games, excluding ones current user is already in
  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select(`
      *,
      creator:profiles!created_by_user_id(display_name),
      game_players:game_players!game_players_game_id_fkey(user_id)
    `)
    .in('id', friendGameIds)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (gamesError) throw gamesError;

  // Filter out games where current user is already a player
  const joinableGames = (games || []).filter(game => {
    const playerUserIds = (game as any).game_players?.map((gp: any) => gp.user_id) || [];
    return !playerUserIds.includes(userId);
  });

  // Format the response to include creator's display name
  return joinableGames.map(game => ({
    ...game,
    creator_name: (game as any).creator?.display_name || 'Unknown',
  }));
}

export async function getClaimableGuestPlayers() {
  // Get all guest players from active games
  const { data: guests, error } = await supabase
    .from('game_players')
    .select(`
      *,
      game:games!inner(
        id,
        join_code,
        status
      )
    `)
    .eq('is_guest', true)
    .eq('game.status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return guests || [];
}

export async function claimGuestPlayer(guestPlayerId: string, userId: string, displayName: string) {
  // Convert guest player to registered player
  const { error } = await supabase
    .from('game_players')
    .update({
      user_id: userId,
      player_name: displayName,
      is_guest: false,
    })
    .eq('id', guestPlayerId);

  if (error) throw error;
}

export async function addGuestPlayer(gameId: string, playerName: string) {
  // Validate player name
  const nameValidation = validatePlayerName(playerName);
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.error);
  }

  const { data: existingPlayers } = await supabase
    .from('game_players')
    .select('display_order')
    .eq('game_id', gameId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existingPlayers && existingPlayers.length > 0
    ? existingPlayers[0].display_order + 1
    : 0;

  const { data, error } = await supabase
    .from('game_players')
    .insert({
      game_id: gameId,
      user_id: null,
      player_name: nameValidation.sanitized,
      is_guest: true,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as GamePlayer;
}

export async function getGamePlayers(gameId: string) {
  const { data, error } = await supabase
    .from('game_players')
    .select('*')
    .eq('game_id', gameId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as GamePlayer[];
}

export async function updatePlayerOrder(gameId: string, orderedPlayerIds: string[]) {
  const updates = orderedPlayerIds.map((id, idx) =>
    supabase
      .from('game_players')
      .update({ display_order: idx })
      .eq('id', id)
      .eq('game_id', gameId),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => (r as any).error);
  if (failed && (failed as any).error) {
    throw (failed as any).error;
  }
}

export async function getGameTurns(gameId: string) {
  const { data, error } = await supabase
    .from('turns')
    .select('*')
    .eq('game_id', gameId)
    .order('turn_number', { ascending: true });

  if (error) throw error;
  return data as Turn[];
}

export async function updatePlayerName(playerId: string, newName: string) {
  // Validate player name
  const nameValidation = validatePlayerName(newName);
  if (!nameValidation.isValid) {
    throw new Error(nameValidation.error);
  }

  const { error } = await supabase
    .from('game_players')
    .update({ player_name: nameValidation.sanitized })
    .eq('id', playerId);

  if (error) throw error;
}

export async function updateTurn(turnId: string, playerId: string, oldScore: number, newScore: number, isBust: boolean, oldIsBust: boolean) {
  // Update the turn
  const { error: updateError } = await supabase
    .from('turns')
    .update({
      score: newScore,
      is_bust: isBust,
    })
    .eq('id', turnId);

  if (updateError) throw updateError;

  // Recalculate player's total score if needed
  const scoreDiff = (isBust ? 0 : newScore) - (oldIsBust ? 0 : oldScore);

  if (scoreDiff !== 0) {
    const { data: player } = await supabase
      .from('game_players')
      .select('total_score')
      .eq('id', playerId)
      .single();

    if (player) {
      const newTotal = Math.max(0, player.total_score + scoreDiff);
      const isOnBoard = newTotal >= 500;

      await supabase
        .from('game_players')
        .update({
          total_score: newTotal,
          is_on_board: isOnBoard,
        })
        .eq('id', playerId);
    }
  }
}

export async function deleteTurn(turnId: string, playerId: string, score: number, isBust: boolean) {
  // Delete the turn
  const { error: deleteError } = await supabase
    .from('turns')
    .delete()
    .eq('id', turnId);

  if (deleteError) throw deleteError;

  // Recalculate player's total score if the turn wasn't a bust
  if (!isBust) {
    const { data: player } = await supabase
      .from('game_players')
      .select('total_score')
      .eq('id', playerId)
      .single();

    if (player) {
      const newTotal = Math.max(0, player.total_score - score);
      const isOnBoard = newTotal >= 500;

      await supabase
        .from('game_players')
        .update({
          total_score: newTotal,
          is_on_board: isOnBoard,
        })
        .eq('id', playerId);
    }
  }
}

export async function deleteRound(gameId: string, roundNumber: number) {
  // Get all turns for this round to recalculate player scores
  const { data: roundTurns, error: fetchError } = await supabase
    .from('turns')
    .select('*')
    .eq('game_id', gameId)
    .eq('turn_number', roundNumber);

  if (fetchError) throw fetchError;

  // Delete the turns for this round
  const { error: deleteError } = await supabase
    .from('turns')
    .delete()
    .eq('game_id', gameId)
    .eq('turn_number', roundNumber);

  if (deleteError) throw deleteError;

  // Recalculate each affected player's total score
  if (roundTurns) {
    for (const turn of roundTurns) {
      if (!turn.is_bust && turn.is_closed) {
        const { data: player } = await supabase
          .from('game_players')
          .select('total_score')
          .eq('id', turn.player_id)
          .single();

        if (player) {
          const newTotal = Math.max(0, player.total_score - turn.score);
          const isOnBoard = newTotal >= 500;

          await supabase
            .from('game_players')
            .update({
              total_score: newTotal,
              is_on_board: isOnBoard,
            })
            .eq('id', turn.player_id);
        }
      }
    }
  }
}

export async function removePlayer(playerId: string) {
  // First delete all turns for this player
  const { error: turnsError } = await supabase
    .from('turns')
    .delete()
    .eq('player_id', playerId);

  if (turnsError) throw turnsError;

  // Then delete the player
  const { error: playerError } = await supabase
    .from('game_players')
    .delete()
    .eq('id', playerId);

  if (playerError) throw playerError;
}

export async function addTurn(
  gameId: string,
  playerId: string,
  score: number,
  isBust: boolean,
  isClosed: boolean,
  notes?: string,
  turnNumber?: number
) {
  // Validate score (only if not a bust)
  if (!isBust) {
    const scoreValidation = validateScore(score);
    if (!scoreValidation.isValid) {
      throw new Error(scoreValidation.error);
    }
  }

  // Use provided turn number, or get the next available one
  let finalTurnNumber = turnNumber;

  if (!finalTurnNumber) {
    const { data: lastTurn } = await supabase
      .from('turns')
      .select('turn_number')
      .eq('game_id', gameId)
      .order('turn_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    finalTurnNumber = lastTurn ? lastTurn.turn_number + 1 : 1;
  }

  const { data, error } = await supabase
    .from('turns')
    .insert({
      game_id: gameId,
      player_id: playerId,
      turn_number: finalTurnNumber,
      score: isBust ? 0 : score,
      is_bust: isBust,
      is_closed: isClosed,
      notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Update player's total score and on-board status
  if (!isBust && isClosed) {
    const { data: player } = await supabase
      .from('game_players')
      .select('total_score, is_on_board')
      .eq('id', playerId)
      .single();

    if (player) {
      const newTotal = player.total_score + score;
      const isOnBoard = player.is_on_board || newTotal >= 500;

      await supabase
        .from('game_players')
        .update({
          total_score: newTotal,
          is_on_board: isOnBoard,
        })
        .eq('id', playerId);
    }
  }

  return data as Turn;
}

export async function finishGame(gameId: string, winningPlayerId?: string | null, winningScore?: number | null) {
  const updates = {
    status: 'complete',
    finished_at: new Date().toISOString(),
    winning_player_id: winningPlayerId ?? null,
    winning_score: typeof winningScore === 'number' ? winningScore : null,
  };

  const { error, data } = await supabase.from('games').update(updates).eq('id', gameId).select().maybeSingle();

  if (error) {
    // Fallback to legacy status if "complete" is not allowed in the current schema/RLS
    const fallback = await supabase
      .from('games')
      .update({ ...updates, status: 'ended' })
      .eq('id', gameId)
      .select()
      .maybeSingle();
    if (fallback.error) throw fallback.error;
    return fallback.data as Game;
  }

  return data as Game;
}

export async function reopenGame(gameId: string): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update({
      status: 'active',
      finished_at: null,
      winning_player_id: null,
      winning_score: null,
    })
    .eq('id', gameId)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

export async function updateGameRounds(gameId: string, totalRounds: number) {
  const clamped = Math.min(30, Math.max(5, totalRounds));
  const { data, error } = await supabase
    .from('games')
    .update({ total_rounds: clamped })
    .eq('id', gameId)
    .select('id, total_rounds')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteGame(gameId: string) {
  // Delete all turns for this game
  const { error: turnsError } = await supabase
    .from('turns')
    .delete()
    .eq('game_id', gameId);

  if (turnsError) throw turnsError;

  // Delete all players for this game
  const { error: playersError } = await supabase
    .from('game_players')
    .delete()
    .eq('game_id', gameId);

  if (playersError) throw playersError;

  // Delete the game itself
  const { error: gameError } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId);

  if (gameError) throw gameError;
}

/**
 * Delete user account with proper data handling
 *
 * Strategy: Anonymize rather than delete game history
 * - Game history is preserved for other players' stats
 * - User's game_players records are anonymized (user_id = NULL, marked as deleted guest)
 * - Profile is deleted
 * - User is signed out (auth record remains orphaned but inaccessible)
 *
 * @returns Object with activeGames count and success status
 */
export async function deleteAccount(userId: string): Promise<{ success: boolean; activeGames: number }> {
  // Step 1: Check for active games
  const { data: activeGamePlayers, error: checkError } = await supabase
    .from('game_players')
    .select(`
      id,
      game:games!inner(id, status)
    `)
    .eq('user_id', userId)
    .eq('games.status', 'active');

  if (checkError) throw checkError;

  const activeGames = activeGamePlayers?.length || 0;

  // Step 2: Anonymize all game_players records for this user
  // This preserves game history for other players' stats
  const { error: anonymizeError } = await supabase
    .from('game_players')
    .update({
      user_id: null,
      is_guest: true,
      // Keep player_name as-is so historical games still show who played
    })
    .eq('user_id', userId);

  if (anonymizeError) throw anonymizeError;

  // Step 3: Delete the profile
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) throw profileError;

  // Step 4: Sign out (auth record remains but is orphaned)
  await supabase.auth.signOut();

  return { success: true, activeGames };
}
