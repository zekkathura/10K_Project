// URL polyfill is imported in index.js (must be first)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { logger } from './logger';
import Constants from 'expo-constants';

/**
 * Supabase Client Configuration
 *
 * IMPORTANT: Production builds MUST have valid credentials. No fallback to dev.
 *
 * Environment variables are set via:
 * - Local dev: .env file (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
 * - E2E tests: .env.test.app via npm run start:test
 * - Production builds: EAS Build environment variables (set in eas.json + EAS Secrets)
 */

// PRODUCTION CREDENTIALS - hardcoded for production builds
// These are PUBLIC anon keys (safe in client code - RLS protects data)
const PROD_SUPABASE_URL = 'https://kpzczvjazzinnugzluhj.supabase.co';
const PROD_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwemN6dmphenppbm51Z3psdWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMDI0ODAsImV4cCI6MjA4MDU3ODQ4MH0.DCJ2Wjcu0CJxOh1XNmBNz4wUo73Ip0kSbvnh3Vev0VY';

// DEVELOPMENT CREDENTIALS - for local dev and E2E testing
const DEV_SUPABASE_URL = 'https://bywqijumnwvrinllsfjb.supabase.co';
const DEV_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5d3FpanVtbnd2cmlubGxzZmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NzIxNDMsImV4cCI6MjA4MTM0ODE0M30.VfqwWFXwhwq0_5_IHvG-CsUlO9Pjbg5kA0OQP0Kf9jE';

/**
 * Determine which environment to use based on APP_ENV
 *
 * APP_ENV is set in eas.json for each build profile:
 * - 'production' or 'preview' → Use PROD credentials
 * - 'development' or 'preview-dev' → Use DEV credentials
 * - Not set (local expo start) → Check .env file, then fall back to DEV
 */
function getCredentials(): { url: string; key: string } {
  // Get APP_ENV from build config (set in eas.json env section)
  const appEnv = Constants.expoConfig?.extra?.environment ||
                 process.env.APP_ENV ||
                 'development';

  // Production and preview builds ALWAYS use prod credentials
  if (appEnv === 'production' || appEnv === 'preview') {
    return { url: PROD_SUPABASE_URL, key: PROD_SUPABASE_ANON_KEY };
  }

  // Development builds use dev credentials
  // Also check env vars for local development with .env file
  const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars point to prod, use prod (for local testing with prod)
  if (envUrl?.includes('kpzczvjazzinnugzluhj')) {
    return { url: PROD_SUPABASE_URL, key: PROD_SUPABASE_ANON_KEY };
  }

  // Otherwise use dev credentials
  return { url: DEV_SUPABASE_URL, key: DEV_SUPABASE_ANON_KEY };
}

const { url: supabaseUrl, key: supabaseAnonKey } = getCredentials();

// Only detect session in URL on web (causes issues on mobile)
const isWeb = Platform.OS === 'web';

// Wrap in try-catch to prevent crashes during initialization
let supabase: ReturnType<typeof createClient>;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: isWeb,  // Only on web - prevents mobile crashes
    },
  });
} catch (error) {
  logger.error('Failed to initialize Supabase client', error);
  // Create a minimal client that will fail gracefully
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

// Get friendly server name (secure - only shows friendly name, not URL)
export function getServerName(): string {
  // Production URL contains 'kpzczvjazzinnugzluhj'
  if (supabaseUrl.includes('kpzczvjazzinnugzluhj')) {
    return '10K-prod';
  }
  // Development URL contains 'bywqijumnwvrinllsfjb'
  return '10K-dev';
}

export { supabase };
