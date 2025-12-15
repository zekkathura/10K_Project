import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { logger } from './logger';

/**
 * Supabase Client Configuration
 *
 * Environment variables are set via:
 * - Local dev: .env file (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
 * - E2E tests: .env.test.app via npm run start:test
 * - Production builds: EAS Build environment variables
 */

// Detect test environment (E2E testing on port 8082)
const isTestEnv = Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  window.location.port === '8082';

// Default credentials (10k-dev - public anon keys, safe to include in client code)
// Used for: E2E tests, development, and as fallback when env vars not injected
const DEFAULT_SUPABASE_URL = 'https://bywqijumnwvrinllsfjb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5d3FpanVtbnd2cmlubGxzZmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NzIxNDMsImV4cCI6MjA4MTM0ODE0M30.VfqwWFXwhwq0_5_IHvG-CsUlO9Pjbg5kA0OQP0Kf9jE';

// Get credentials - prefer env vars, fall back to defaults
// This ensures the app works even if EAS secrets aren't properly injected
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Log which credentials are being used (for debugging)
const usingDefaults = !process.env.EXPO_PUBLIC_SUPABASE_URL;
if (usingDefaults) {
  logger.warn('[Supabase] Using default (10k-dev) credentials - env vars not found');
}

// Log which environment is being used (dev only, no sensitive data)
logger.info('[Supabase] Environment:', isTestEnv ? 'TEST' : 'PROD');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
