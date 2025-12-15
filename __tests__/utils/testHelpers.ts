/**
 * Test Helper Utilities
 *
 * Common utilities for writing tests across the application.
 */

/**
 * Generate a random 6-character join code (like the app does)
 */
export function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate a valid UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a random email for testing
 */
export function generateTestEmail(prefix: string = 'test'): string {
  const random = Math.random().toString(36).substring(7);
  return `${prefix}_${random}@test.example.com`;
}

/**
 * Generate a random player name
 */
export function generatePlayerName(): string {
  const adjectives = ['Quick', 'Lucky', 'Bold', 'Swift', 'Clever'];
  const nouns = ['Roller', 'Player', 'Gamer', 'Scorer', 'Dicer'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
}

/**
 * Wait for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a mock game object for testing
 */
export function createMockGame(overrides: Partial<{
  id: string;
  join_code: string;
  created_by: string;
  status: string;
  total_rounds: number;
}> = {}) {
  return {
    id: generateUUID(),
    join_code: generateJoinCode(),
    created_by: generateUUID(),
    status: 'active',
    total_rounds: 10,
    current_round: 1,
    winner_player_id: null,
    winning_score: null,
    game_name: null,
    finished_at: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock player object for testing
 */
export function createMockPlayer(overrides: Partial<{
  id: string;
  game_id: string;
  user_id: string | null;
  player_name: string;
  is_guest: boolean;
  total_score: number;
  display_order: number;
}> = {}) {
  return {
    id: generateUUID(),
    game_id: generateUUID(),
    user_id: generateUUID(),
    player_name: generatePlayerName(),
    is_guest: false,
    total_score: 0,
    is_on_board: false,
    display_order: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock turn object for testing
 */
export function createMockTurn(overrides: Partial<{
  id: string;
  game_id: string;
  player_id: string;
  turn_number: number;
  score: number;
  is_bust: boolean;
  is_closed: boolean;
}> = {}) {
  return {
    id: generateUUID(),
    game_id: generateUUID(),
    player_id: generateUUID(),
    turn_number: 1,
    score: 0,
    is_bust: false,
    is_closed: false,
    notes: null,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Assert that a promise rejects with a specific error
 */
export async function expectToThrow(
  fn: () => Promise<any>,
  expectedMessage?: string | RegExp
): Promise<void> {
  let threw = false;
  let error: Error | null = null;

  try {
    await fn();
  } catch (e) {
    threw = true;
    error = e as Error;
  }

  expect(threw).toBe(true);
  if (expectedMessage && error) {
    if (typeof expectedMessage === 'string') {
      expect(error.message).toContain(expectedMessage);
    } else {
      expect(error.message).toMatch(expectedMessage);
    }
  }
}
