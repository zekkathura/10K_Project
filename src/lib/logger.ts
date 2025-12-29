/**
 * Secure Logger Utility
 *
 * Replaces console.log throughout the app to:
 * 1. Only log in development mode OR when enabled via backend app_config
 * 2. Sanitize PII (emails, user IDs, tokens) from logs
 * 3. Provide consistent log formatting
 * 4. Send errors to Supabase error_logs table for production monitoring
 *
 * Backend Control:
 *   Set `debug_logging_enabled = 'true'` in Supabase app_config table
 *   to enable debug logging in production builds (for troubleshooting).
 *   This is secure because users cannot modify the backend setting.
 *
 * Error Logging:
 *   Errors are automatically sent to the `error_logs` table in Supabase.
 *   This happens in production AND development (for testing).
 *   Errors are sanitized before sending (no PII).
 *
 * Usage:
 *   import { logger, initializeLogger } from '@/lib/logger';
 *
 *   // During app startup (after Supabase is ready):
 *   initializeLogger(supabase);
 *
 *   logger.debug('Loading game', { gameId });       // Dev or backend-enabled
 *   logger.info('Game started');                    // Dev or backend-enabled
 *   logger.warn('Rate limit approaching');          // Dev or backend-enabled
 *   logger.error('Failed to save', error);          // Always logs + sends to Supabase
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if we're in development mode
// __DEV__ is provided by React Native, process.env.NODE_ENV by bundlers
// Wrap in try-catch to prevent crashes if __DEV__ access fails
let isDev = false;
try {
  isDev = typeof __DEV__ !== 'undefined'
    ? __DEV__
    : process.env.NODE_ENV === 'development';
} catch {
  isDev = false;
}

// Backend-controlled debug flag (fetched from app_config)
// This allows enabling debug logs in production without a new build
let remoteDebugEnabled = false;

// Supabase client reference (set during initialization)
// Using 'any' to avoid circular dependency with supabase.ts
let supabaseClient: any = null;

// App info for error context
let appVersion = '1.0.0';
let appPlatform = 'unknown';

try {
  appVersion = Constants.expoConfig?.extra?.appVersion || '1.0.0';
  appPlatform = Platform.OS || 'unknown';
} catch {
  // Silently fail - use defaults
}

/**
 * Initialize the logger with Supabase client
 * Call this during app startup (after Supabase is created)
 */
export function initializeLogger(client: any): void {
  supabaseClient = client;
}

/**
 * Initialize remote debug setting from app_config
 * Call this during app startup (after Supabase is ready)
 */
export async function initializeRemoteDebug(client: any): Promise<void> {
  try {
    const { data, error } = await client
      .from('app_config')
      .select('value')
      .eq('key', 'debug_logging_enabled')
      .maybeSingle();

    if (!error && data?.value === 'true') {
      remoteDebugEnabled = true;
      // Use console.log directly here since logger isn't fully initialized
      console.log('[LOGGER] Remote debug logging enabled via app_config');
    }
  } catch {
    // Silently fail - debug logging just stays disabled
  }
}

/**
 * Check if debug logging is enabled (dev mode OR backend flag)
 */
function isDebugEnabled(): boolean {
  return isDev || remoteDebugEnabled;
}

// PII patterns to sanitize
const PII_PATTERNS = [
  // Email addresses
  { pattern: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, replacement: '[EMAIL]' },
  // UUIDs (user IDs, game IDs, etc.)
  { pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, replacement: '[UUID]' },
  // JWT tokens (base64 with dots)
  { pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, replacement: '[TOKEN]' },
  // Generic access/refresh tokens
  { pattern: /(access_token|refresh_token|token)['":\s]+['"]?[A-Za-z0-9_-]{20,}['"]?/gi, replacement: '$1: [REDACTED]' },
];

// Keys that should have their values redacted
const SENSITIVE_KEYS = [
  'email', 'password', 'token', 'accessToken', 'refreshToken',
  'user_id', 'userId', 'id', 'secret', 'key', 'apiKey',
];

/**
 * Sanitize a string to remove PII
 */
function sanitizeString(str: string): string {
  let result = str;
  for (const { pattern, replacement } of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

/**
 * Sanitize an object by redacting sensitive keys
 */
function sanitizeObject(obj: unknown, depth = 0): unknown {
  // Prevent infinite recursion
  if (depth > 5) return '[DEPTH_LIMIT]';

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: sanitizeString(obj.message),
      stack: obj.stack ? sanitizeString(obj.stack) : undefined,
    };
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      // Redact sensitive keys entirely
      if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeObject(value, depth + 1);
      }
    }
    return sanitized;
  }

  return String(obj);
}

/**
 * Format arguments for logging
 * Converts objects to JSON strings so they display properly in logs
 */
function formatArgs(args: unknown[]): string[] {
  return args.map(arg => {
    const sanitized = sanitizeObject(arg);
    if (typeof sanitized === 'object' && sanitized !== null) {
      return JSON.stringify(sanitized);
    }
    return String(sanitized);
  });
}

/**
 * Send error to Supabase error_logs table
 * This is fire-and-forget - we don't wait for it or handle failures
 */
async function sendErrorToBackend(
  level: 'error' | 'warn',
  message: string,
  error?: unknown,
  context?: { screen?: string; action?: string; extra?: Record<string, unknown> }
): Promise<void> {
  // Skip if Supabase client not initialized
  if (!supabaseClient) return;

  try {
    // Get current user ID if available
    let userId: string | null = null;
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      userId = user?.id || null;
    } catch {
      // No user or auth error - that's fine
    }

    // Sanitize error details
    const sanitizedError = error ? sanitizeObject(error) : null;
    const errorObj = sanitizedError as { name?: string; message?: string; stack?: string } | null;

    // Insert error log (fire and forget)
    await supabaseClient.from('error_logs').insert({
      user_id: userId,
      level,
      message: sanitizeString(message),
      error_name: errorObj?.name || null,
      error_stack: errorObj?.stack || null,
      screen: context?.screen || null,
      action: context?.action || null,
      app_version: appVersion,
      platform: appPlatform,
      extra_data: context?.extra ? sanitizeObject(context.extra) : {},
    });
  } catch {
    // Silently fail - don't let logging errors crash the app
    // Also don't recursively try to log this error!
  }
}

/**
 * Logger with PII protection and backend error reporting
 */
export const logger = {
  /**
   * Debug logging - only in development or when backend-enabled
   * Use for detailed debugging information
   */
  debug: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.log('[DEBUG]', ...formatArgs(args));
    }
  },

  /**
   * Info logging - only in development or when backend-enabled
   * Use for general information about app flow
   */
  info: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.log('[INFO]', ...formatArgs(args));
    }
  },

  /**
   * Warning logging - only in development or when backend-enabled
   * Use for potential issues that don't break functionality
   */
  warn: (...args: unknown[]): void => {
    if (isDebugEnabled()) {
      console.warn('[WARN]', ...formatArgs(args));
    }
  },

  /**
   * Error logging - always logs (but sanitized) + sends to Supabase
   * Use for errors that need attention
   *
   * @param message - Human-readable error message
   * @param error - Optional error object
   * @param context - Optional context (screen, action, extra data)
   */
  error: (
    message: string,
    error?: unknown,
    context?: { screen?: string; action?: string; extra?: Record<string, unknown> }
  ): void => {
    // Always log errors to console (sanitized)
    const sanitizedMessage = sanitizeString(message);

    if (isDebugEnabled()) {
      const sanitizedError = error ? sanitizeObject(error) : '';
      const errorStr = typeof sanitizedError === 'object' && sanitizedError !== null
        ? JSON.stringify(sanitizedError)
        : String(sanitizedError);
      console.error('[ERROR]', sanitizedMessage, errorStr);
    } else {
      // In production (without debug enabled), only log the message
      console.error('[ERROR]', sanitizedMessage);
    }

    // Send to Supabase (async, fire-and-forget)
    sendErrorToBackend('error', message, error, context);
  },

  /**
   * Create a scoped logger with a prefix
   * Useful for component-specific logging
   */
  scope: (prefix: string) => ({
    debug: (...args: unknown[]) => logger.debug(`[${prefix}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${prefix}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${prefix}]`, ...args),
    error: (
      message: string,
      error?: unknown,
      context?: { screen?: string; action?: string; extra?: Record<string, unknown> }
    ) => logger.error(`[${prefix}] ${message}`, error, { ...context, screen: context?.screen || prefix }),
  }),
};

// Export isDev for conditional logic elsewhere
export { isDev };
