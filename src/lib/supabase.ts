// URL polyfill is imported in index.js (must be first)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase Client Configuration
 *
 * Environment variables are set via:
 * - Local dev: .env file (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
 * - E2E tests: .env.test.app via npm run start:test
 * - Production builds: EAS Build environment variables
 */

// Default credentials (10k-dev - public anon keys, safe to include in client code)
// Used for: E2E tests, development, and as fallback when env vars not injected
const DEFAULT_SUPABASE_URL = 'https://bywqijumnwvrinllsfjb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5d3FpanVtbnd2cmlubGxzZmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NzIxNDMsImV4cCI6MjA4MTM0ODE0M30.VfqwWFXwhwq0_5_IHvG-CsUlO9Pjbg5kA0OQP0Kf9jE';

// Helper to check if a string is a valid Supabase URL
// Catches cases where EAS secrets aren't expanded (e.g., literal "${SECRET_NAME}")
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith('https://') && url.includes('supabase.co');
}

// Helper to check if a string looks like a valid JWT (anon key)
function isValidAnonKey(key: string | undefined): boolean {
  if (!key) return false;
  return key.startsWith('eyJ') && key.split('.').length === 3;
}

// Get credentials - validate env vars, fall back to defaults if invalid
// This fixes crash when EAS secrets contain literal "${SECRET_NAME}" instead of actual values
const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = isValidSupabaseUrl(envUrl) ? envUrl! : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = isValidAnonKey(envKey) ? envKey! : DEFAULT_SUPABASE_ANON_KEY;

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
  console.error('Failed to initialize Supabase client:', error);
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

export { supabase };
