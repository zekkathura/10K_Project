/**
 * Test Supabase Client
 *
 * Provides a Supabase client configured for testing.
 * Uses service_role key to bypass RLS for test setup/teardown.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test environment variables (loaded by jest.setup.js)
const TEST_SUPABASE_URL = process.env.TEST_SUPABASE_URL || '';
const TEST_SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || '';
const TEST_SUPABASE_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Supabase client with anon key (respects RLS policies)
 * Use this to test as a regular user would experience
 */
export const testSupabase: SupabaseClient = createClient(
  TEST_SUPABASE_URL,
  TEST_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Supabase client with service_role key (bypasses RLS)
 * Use this for test setup, teardown, and data verification
 */
export const adminSupabase: SupabaseClient = createClient(
  TEST_SUPABASE_URL,
  TEST_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Check if test Supabase is configured
 */
export function isTestSupabaseConfigured(): boolean {
  return Boolean(TEST_SUPABASE_URL && TEST_SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Clean up test data created during tests
 * Call this in afterEach/afterAll hooks
 */
export async function cleanupTestData(options: {
  gameIds?: string[];
  playerIds?: string[];
  profileIds?: string[];
}): Promise<void> {
  const { gameIds = [], playerIds = [], profileIds = [] } = options;

  // Delete in order to respect foreign keys
  if (gameIds.length > 0) {
    // Turns are deleted via cascade when players are deleted
    await adminSupabase.from('game_players').delete().in('game_id', gameIds);
    await adminSupabase.from('games').delete().in('id', gameIds);
  }

  if (playerIds.length > 0) {
    await adminSupabase.from('turns').delete().in('player_id', playerIds);
    await adminSupabase.from('game_players').delete().in('id', playerIds);
  }

  if (profileIds.length > 0) {
    // Note: This requires careful handling due to auth.users foreign key
    await adminSupabase.from('profiles').delete().in('id', profileIds);
  }
}

/**
 * Generate a unique test identifier
 */
export function testId(prefix: string = 'test'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
