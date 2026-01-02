/**
 * Unit Tests for Database Functions
 *
 * Tests all database operations in src/lib/database.ts
 * Uses mocked Supabase client for isolation.
 */

import {
  generateUUID,
  generateJoinCode,
  createMockGame,
  createMockPlayer,
  createMockTurn,
} from '../utils/testHelpers';

// Create mock that will be used by jest.mock
const mockFrom = jest.fn();

// Mock Supabase - must use factory function for proper hoisting
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

// Alias for cleaner test code
const mockSupabaseClient = { from: mockFrom };

// Import after mocking
import {
  createGame,
  getMyGames,
  joinGameByCode,
  addGuestPlayer,
  getGamePlayers,
  updatePlayerOrder,
  getGameTurns,
  updatePlayerName,
  updateTurn,
  deleteTurn,
  deleteRound,
  removePlayer,
  addTurn,
  finishGame,
  reopenGame,
  updateGameRounds,
  deleteGame,
  claimGuestPlayer,
  getClaimableGuestPlayers,
  getJoinableGamesWithFriends,
} from '../../src/lib/database';

// Helper to create chainable mock
function createChainableMock(finalValue: any = { data: null, error: null }) {
  const mock: any = {};
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'not', 'order', 'limit', 'single', 'maybeSingle'];

  methods.forEach(method => {
    mock[method] = jest.fn().mockReturnValue(mock);
  });

  // Final methods that return the result
  mock.single = jest.fn().mockResolvedValue(finalValue);
  mock.maybeSingle = jest.fn().mockResolvedValue(finalValue);

  // For non-single queries, return array
  const arrayMethods = ['select', 'delete', 'update'];
  arrayMethods.forEach(method => {
    const original = mock[method];
    mock[method] = jest.fn((...args: any[]) => {
      // If this is the end of the chain (no .single()), resolve with array
      const result = original(...args);
      result.then = (resolve: any) => resolve(finalValue);
      return result;
    });
  });

  return mock;
}

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================
// createGame
// ============================================
describe('createGame', () => {
  it('creates a game with generated join code', async () => {
    const userId = generateUUID();
    const mockGame = createMockGame({ created_by: userId });

    const chainMock = createChainableMock({ data: mockGame, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await createGame(userId);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('games');
    expect(chainMock.insert).toHaveBeenCalledWith(expect.objectContaining({
      created_by_user_id: userId,
      status: 'active',
      total_rounds: 10,
    }));
    expect(result).toEqual(mockGame);
  });

  it('retries on duplicate join code error', async () => {
    const userId = generateUUID();
    const mockGame = createMockGame({ created_by: userId });

    // First call fails with duplicate, second succeeds
    let callCount = 0;
    const chainMock: any = {};
    ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'order', 'limit'].forEach(method => {
      chainMock[method] = jest.fn().mockReturnValue(chainMock);
    });
    chainMock.single = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key' } });
      }
      return Promise.resolve({ data: mockGame, error: null });
    });

    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await createGame(userId);

    expect(chainMock.insert).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockGame);
  });

  it('throws after max retry attempts', async () => {
    const userId = generateUUID();

    const chainMock: any = {};
    ['select', 'insert', 'update', 'delete', 'eq', 'neq', 'in', 'order', 'limit'].forEach(method => {
      chainMock[method] = jest.fn().mockReturnValue(chainMock);
    });
    chainMock.single = jest.fn().mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'duplicate key' },
    });

    mockSupabaseClient.from.mockReturnValue(chainMock);

    await expect(createGame(userId)).rejects.toThrow('Duplicate game codes');
  });
});

// ============================================
// getMyGames
// ============================================
describe('getMyGames', () => {
  it('returns games for user', async () => {
    const userId = generateUUID();
    const mockGames = [
      createMockGame({ created_by: userId }),
      createMockGame({ created_by: userId }),
    ];

    const chainMock = createChainableMock();
    chainMock.order = jest.fn().mockResolvedValue({ data: mockGames, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await getMyGames(userId);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('games');
    expect(chainMock.select).toHaveBeenCalled();
    expect(chainMock.eq).toHaveBeenCalledWith('game_players.user_id', userId);
    expect(result).toEqual(mockGames);
  });

  it('throws on database error', async () => {
    const userId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.order = jest.fn().mockResolvedValue({ data: null, error: new Error('DB Error') });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await expect(getMyGames(userId)).rejects.toThrow('DB Error');
  });
});

// ============================================
// joinGameByCode
// ============================================
describe('joinGameByCode', () => {
  it('validates join code format', async () => {
    const userId = generateUUID();

    await expect(joinGameByCode('', userId, 'Player')).rejects.toThrow('Join code is required');
    await expect(joinGameByCode('ABC', userId, 'Player')).rejects.toThrow('Join code must be exactly 6 characters');
  });

  it('validates player name', async () => {
    const userId = generateUUID();

    await expect(joinGameByCode('ABC123', userId, '')).rejects.toThrow('Player name is required');
  });

  it('joins game successfully', async () => {
    const userId = generateUUID();
    const gameId = generateUUID();
    const mockPlayer = createMockPlayer({ game_id: gameId, user_id: userId });

    // Mock game lookup
    const gameChainMock = createChainableMock({ data: { id: gameId, status: 'active' }, error: null });
    // Mock existing players lookup
    const playersChainMock = createChainableMock();
    playersChainMock.limit = jest.fn().mockResolvedValue({ data: [], error: null });
    // Mock player insert
    const insertChainMock = createChainableMock({ data: mockPlayer, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation((table: string) => {
      callCount++;
      if (table === 'games') return gameChainMock;
      if (table === 'game_players' && callCount <= 2) return playersChainMock;
      return insertChainMock;
    });

    const result = await joinGameByCode('ABC123', userId, 'TestPlayer');

    expect(result.gameId).toBe(gameId);
    expect(result.player).toEqual(mockPlayer);
  });
});

// ============================================
// addGuestPlayer
// ============================================
describe('addGuestPlayer', () => {
  it('validates player name', async () => {
    const gameId = generateUUID();

    await expect(addGuestPlayer(gameId, '')).rejects.toThrow('Player name is required');
    await expect(addGuestPlayer(gameId, '   ')).rejects.toThrow('Player name cannot be empty');
  });

  it('adds guest player with correct display order', async () => {
    const gameId = generateUUID();
    const mockPlayer = createMockPlayer({ game_id: gameId, is_guest: true, display_order: 2 });

    // Mock existing players (2 already exist)
    const playersChainMock = createChainableMock();
    playersChainMock.limit = jest.fn().mockResolvedValue({ data: [{ display_order: 1 }], error: null });

    // Mock insert
    const insertChainMock = createChainableMock({ data: mockPlayer, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return playersChainMock;
      return insertChainMock;
    });

    const result = await addGuestPlayer(gameId, 'GuestPlayer');

    expect(insertChainMock.insert).toHaveBeenCalledWith(expect.objectContaining({
      game_id: gameId,
      user_id: null,
      is_guest: true,
      display_order: 2,
    }));
    expect(result).toEqual(mockPlayer);
  });
});

// ============================================
// getGamePlayers
// ============================================
describe('getGamePlayers', () => {
  it('returns players ordered by display_order', async () => {
    const gameId = generateUUID();
    const mockPlayers = [
      createMockPlayer({ game_id: gameId, display_order: 0 }),
      createMockPlayer({ game_id: gameId, display_order: 1 }),
    ];

    const chainMock = createChainableMock();
    chainMock.order = jest.fn().mockResolvedValue({ data: mockPlayers, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await getGamePlayers(gameId);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('game_players');
    expect(chainMock.eq).toHaveBeenCalledWith('game_id', gameId);
    expect(chainMock.order).toHaveBeenCalledWith('display_order', { ascending: true });
    expect(result).toEqual(mockPlayers);
  });
});

// ============================================
// getGameTurns
// ============================================
describe('getGameTurns', () => {
  it('returns turns ordered by turn_number', async () => {
    const gameId = generateUUID();
    const mockTurns = [
      createMockTurn({ game_id: gameId, turn_number: 1 }),
      createMockTurn({ game_id: gameId, turn_number: 2 }),
    ];

    const chainMock = createChainableMock();
    chainMock.order = jest.fn().mockResolvedValue({ data: mockTurns, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await getGameTurns(gameId);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('turns');
    expect(chainMock.eq).toHaveBeenCalledWith('game_id', gameId);
    expect(chainMock.order).toHaveBeenCalledWith('turn_number', { ascending: true });
    expect(result).toEqual(mockTurns);
  });
});

// ============================================
// updatePlayerName
// ============================================
describe('updatePlayerName', () => {
  it('validates new name', async () => {
    const playerId = generateUUID();

    await expect(updatePlayerName(playerId, '')).rejects.toThrow('Player name is required');
    await expect(updatePlayerName(playerId, 'A'.repeat(31))).rejects.toThrow('Player name must be 30 characters or less');
  });

  it('updates player name', async () => {
    const playerId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.eq = jest.fn().mockResolvedValue({ data: null, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await updatePlayerName(playerId, 'NewName');

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('game_players');
    expect(chainMock.update).toHaveBeenCalledWith({ player_name: 'NewName' });
    expect(chainMock.eq).toHaveBeenCalledWith('id', playerId);
  });
});

// ============================================
// addTurn
// ============================================
describe('addTurn', () => {
  it('validates score when not a bust', async () => {
    const gameId = generateUUID();
    const playerId = generateUUID();

    await expect(addTurn(gameId, playerId, -100, false, true)).rejects.toThrow('Score cannot be negative');
    await expect(addTurn(gameId, playerId, 25000, false, true)).rejects.toThrow('Score cannot exceed 20,000');
  });

  it('allows any score when bust', async () => {
    const gameId = generateUUID();
    const playerId = generateUUID();
    const mockTurn = createMockTurn({ game_id: gameId, player_id: playerId, is_bust: true, score: 0 });

    // Mock last turn lookup
    const lastTurnMock = createChainableMock();
    lastTurnMock.maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });

    // Mock turn insert
    const insertMock = createChainableMock({ data: mockTurn, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return lastTurnMock;
      return insertMock;
    });

    // Should not throw even with invalid score because it's a bust
    const result = await addTurn(gameId, playerId, 999, true, false);
    expect(result.is_bust).toBe(true);
  });

  it('auto-generates turn number if not provided', async () => {
    const gameId = generateUUID();
    const playerId = generateUUID();
    const mockTurn = createMockTurn({ game_id: gameId, player_id: playerId, turn_number: 5 });

    // Mock last turn lookup (returns turn 4)
    const lastTurnMock = createChainableMock();
    lastTurnMock.maybeSingle = jest.fn().mockResolvedValue({ data: { turn_number: 4 }, error: null });

    // Mock turn insert
    const insertMock = createChainableMock({ data: mockTurn, error: null });

    // Mock player lookup for score update
    const playerMock = createChainableMock({ data: { total_score: 0, is_on_board: false }, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation((table: string) => {
      callCount++;
      if (callCount === 1) return lastTurnMock; // turns - get last
      if (callCount === 2) return insertMock;   // turns - insert
      return playerMock;                         // game_players - update score
    });

    await addTurn(gameId, playerId, 500, false, true);

    expect(insertMock.insert).toHaveBeenCalledWith(expect.objectContaining({
      turn_number: 5,
    }));
  });

  it('uses provided turn number', async () => {
    const gameId = generateUUID();
    const playerId = generateUUID();
    const mockTurn = createMockTurn({ game_id: gameId, player_id: playerId, turn_number: 10 });

    // Mock turn insert (no need for last turn lookup when turn_number provided)
    const insertMock = createChainableMock({ data: mockTurn, error: null });

    // Mock player lookup
    const playerMock = createChainableMock({ data: { total_score: 0, is_on_board: false }, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return insertMock;
      return playerMock;
    });

    await addTurn(gameId, playerId, 500, false, true, undefined, 10);

    expect(insertMock.insert).toHaveBeenCalledWith(expect.objectContaining({
      turn_number: 10,
    }));
  });

  it('updates player total_score when turn is closed', async () => {
    const gameId = generateUUID();
    const playerId = generateUUID();
    const mockTurn = createMockTurn({ game_id: gameId, player_id: playerId, score: 500 });

    // Mock turn insert
    const insertMock = createChainableMock({ data: mockTurn, error: null });

    // Mock player lookup
    const playerSelectMock = createChainableMock({ data: { total_score: 1000, is_on_board: true }, error: null });

    // Mock player update
    const playerUpdateMock = createChainableMock({ data: null, error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return insertMock;
      if (callCount === 2) return playerSelectMock;
      return playerUpdateMock;
    });

    await addTurn(gameId, playerId, 500, false, true, undefined, 1);

    // Should update total_score to 1500 (1000 + 500)
    expect(playerUpdateMock.update).toHaveBeenCalledWith(expect.objectContaining({
      total_score: 1500,
      is_on_board: true,
    }));
  });
});

// ============================================
// finishGame
// ============================================
describe('finishGame', () => {
  it('finishes game with winner info', async () => {
    const gameId = generateUUID();
    const winnerId = generateUUID();
    const mockGame = createMockGame({ id: gameId, status: 'ended' });

    const chainMock = createChainableMock({ data: mockGame, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await finishGame(gameId, winnerId, 10500);

    expect(chainMock.update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'ended',
      winning_player_id: winnerId,
      winning_score: 10500,
    }));
    expect(result).toEqual(mockGame);
  });

  it('finishes game without winner', async () => {
    const gameId = generateUUID();
    const mockGame = createMockGame({ id: gameId, status: 'ended' });

    const chainMock = createChainableMock({ data: mockGame, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await finishGame(gameId);

    expect(chainMock.update).toHaveBeenCalledWith(expect.objectContaining({
      winning_player_id: null,
      winning_score: null,
    }));
  });

  it('throws on database error', async () => {
    const gameId = generateUUID();
    const dbError = new Error('Database error');

    const chainMock = createChainableMock({ data: null, error: dbError });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await expect(finishGame(gameId)).rejects.toThrow('Database error');
  });
});

// ============================================
// reopenGame
// ============================================
describe('reopenGame', () => {
  it('resets game to active status', async () => {
    const gameId = generateUUID();
    const mockGame = createMockGame({ id: gameId, status: 'active' });

    const chainMock = createChainableMock({ data: mockGame, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await reopenGame(gameId);

    expect(chainMock.update).toHaveBeenCalledWith({
      status: 'active',
      finished_at: null,
      winning_player_id: null,
      winning_score: null,
    });
    expect(result.status).toBe('active');
  });
});

// ============================================
// updateGameRounds
// ============================================
describe('updateGameRounds', () => {
  it('clamps rounds to minimum of 5', async () => {
    const gameId = generateUUID();

    const chainMock = createChainableMock({ data: { id: gameId, total_rounds: 5 }, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await updateGameRounds(gameId, 3);

    expect(chainMock.update).toHaveBeenCalledWith({ total_rounds: 5 });
  });

  it('clamps rounds to maximum of 30', async () => {
    const gameId = generateUUID();

    const chainMock = createChainableMock({ data: { id: gameId, total_rounds: 30 }, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await updateGameRounds(gameId, 50);

    expect(chainMock.update).toHaveBeenCalledWith({ total_rounds: 30 });
  });

  it('accepts valid round counts', async () => {
    const gameId = generateUUID();

    const chainMock = createChainableMock({ data: { id: gameId, total_rounds: 15 }, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await updateGameRounds(gameId, 15);

    expect(chainMock.update).toHaveBeenCalledWith({ total_rounds: 15 });
  });
});

// ============================================
// deleteGame
// ============================================
describe('deleteGame', () => {
  it('deletes turns, players, then game in order', async () => {
    const gameId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.eq = jest.fn().mockResolvedValue({ data: null, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await deleteGame(gameId);

    // Should be called 3 times: turns, game_players, games
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('turns');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('game_players');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('games');
    expect(chainMock.delete).toHaveBeenCalledTimes(3);
  });

  it('throws if turns deletion fails', async () => {
    const gameId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.eq = jest.fn().mockResolvedValue({ data: null, error: new Error('Delete failed') });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await expect(deleteGame(gameId)).rejects.toThrow('Delete failed');
  });
});

// ============================================
// removePlayer
// ============================================
describe('removePlayer', () => {
  it('deletes turns then player', async () => {
    const playerId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.eq = jest.fn().mockResolvedValue({ data: null, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await removePlayer(playerId);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith('turns');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('game_players');
    expect(chainMock.delete).toHaveBeenCalledTimes(2);
  });
});

// ============================================
// claimGuestPlayer
// ============================================
describe('claimGuestPlayer', () => {
  it('converts guest to registered player', async () => {
    const guestId = generateUUID();
    const userId = generateUUID();

    const chainMock = createChainableMock();
    chainMock.eq = jest.fn().mockResolvedValue({ data: null, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await claimGuestPlayer(guestId, userId, 'MyName');

    expect(chainMock.update).toHaveBeenCalledWith({
      user_id: userId,
      player_name: 'MyName',
      is_guest: false,
    });
    expect(chainMock.eq).toHaveBeenCalledWith('id', guestId);
  });
});

// ============================================
// updateTurn
// ============================================
describe('updateTurn', () => {
  it('updates turn score and recalculates player total', async () => {
    const turnId = generateUUID();
    const playerId = generateUUID();

    // Mock turn update
    const turnUpdateMock = createChainableMock();
    turnUpdateMock.eq = jest.fn().mockResolvedValue({ error: null });

    // Mock player select
    const playerSelectMock = createChainableMock({ data: { total_score: 1000 }, error: null });

    // Mock player update
    const playerUpdateMock = createChainableMock();
    playerUpdateMock.eq = jest.fn().mockResolvedValue({ error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return turnUpdateMock;
      if (callCount === 2) return playerSelectMock;
      return playerUpdateMock;
    });

    // Update from score 500 (not bust) to 700 (not bust)
    await updateTurn(turnId, playerId, 500, 700, false, false);

    expect(turnUpdateMock.update).toHaveBeenCalledWith({
      score: 700,
      is_bust: false,
    });

    // Score diff = 700 - 500 = 200, new total = 1000 + 200 = 1200
    expect(playerUpdateMock.update).toHaveBeenCalledWith(expect.objectContaining({
      total_score: 1200,
    }));
  });

  it('handles bust to non-bust transition', async () => {
    const turnId = generateUUID();
    const playerId = generateUUID();

    const turnUpdateMock = createChainableMock();
    turnUpdateMock.eq = jest.fn().mockResolvedValue({ error: null });

    const playerSelectMock = createChainableMock({ data: { total_score: 1000 }, error: null });
    const playerUpdateMock = createChainableMock();
    playerUpdateMock.eq = jest.fn().mockResolvedValue({ error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return turnUpdateMock;
      if (callCount === 2) return playerSelectMock;
      return playerUpdateMock;
    });

    // Update from bust (0) to 500 (not bust)
    // oldIsBust = true means old score was 0
    await updateTurn(turnId, playerId, 0, 500, false, true);

    // Score diff = 500 - 0 = 500
    expect(playerUpdateMock.update).toHaveBeenCalledWith(expect.objectContaining({
      total_score: 1500,
    }));
  });
});

// ============================================
// deleteTurn
// ============================================
describe('deleteTurn', () => {
  it('deletes turn and updates player score if not bust', async () => {
    const turnId = generateUUID();
    const playerId = generateUUID();

    const deleteChainMock = createChainableMock();
    deleteChainMock.eq = jest.fn().mockResolvedValue({ error: null });

    const playerSelectMock = createChainableMock({ data: { total_score: 1500 }, error: null });

    const playerUpdateMock = createChainableMock();
    playerUpdateMock.eq = jest.fn().mockResolvedValue({ error: null });

    let callCount = 0;
    mockSupabaseClient.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return deleteChainMock;
      if (callCount === 2) return playerSelectMock;
      return playerUpdateMock;
    });

    // Delete turn with score 500 (not bust)
    await deleteTurn(turnId, playerId, 500, false);

    expect(deleteChainMock.delete).toHaveBeenCalled();
    // New total = 1500 - 500 = 1000
    expect(playerUpdateMock.update).toHaveBeenCalledWith(expect.objectContaining({
      total_score: 1000,
    }));
  });

  it('deletes turn without updating score if bust', async () => {
    const turnId = generateUUID();
    const playerId = generateUUID();

    const deleteChainMock = createChainableMock();
    deleteChainMock.eq = jest.fn().mockResolvedValue({ error: null });

    mockSupabaseClient.from.mockReturnValue(deleteChainMock);

    // Delete bust turn - should not update player score
    await deleteTurn(turnId, playerId, 0, true);

    expect(deleteChainMock.delete).toHaveBeenCalled();
    // from() should only be called once (for turns), not for game_players
    expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1);
  });
});

// ============================================
// getClaimableGuestPlayers
// ============================================
describe('getClaimableGuestPlayers', () => {
  it('returns guest players from active games', async () => {
    const mockGuests = [
      createMockPlayer({ is_guest: true }),
      createMockPlayer({ is_guest: true }),
    ];

    const chainMock = createChainableMock();
    chainMock.order = jest.fn().mockResolvedValue({ data: mockGuests, error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    const result = await getClaimableGuestPlayers();

    expect(chainMock.eq).toHaveBeenCalledWith('is_guest', true);
    expect(chainMock.eq).toHaveBeenCalledWith('game.status', 'active');
    expect(result).toEqual(mockGuests);
  });
});

// ============================================
// updatePlayerOrder
// ============================================
describe('updatePlayerOrder', () => {
  it('updates display order for all players', async () => {
    const gameId = generateUUID();
    const playerIds = [generateUUID(), generateUUID(), generateUUID()];

    const chainMock = createChainableMock();
    // Chain mock needs to return for each eq call
    const eqMock = jest.fn().mockReturnValue(chainMock);
    chainMock.eq = eqMock;
    chainMock.then = (resolve: any) => resolve({ error: null });
    mockSupabaseClient.from.mockReturnValue(chainMock);

    await updatePlayerOrder(gameId, playerIds);

    // Should update 3 players
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('game_players');
    expect(chainMock.update).toHaveBeenCalledTimes(3);
  });
});
