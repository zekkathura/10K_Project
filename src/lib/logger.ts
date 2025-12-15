/**
 * Secure Logger Utility
 *
 * Replaces console.log throughout the app to:
 * 1. Only log in development mode (never in production builds)
 * 2. Sanitize PII (emails, user IDs, tokens) from logs
 * 3. Provide consistent log formatting
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.debug('Loading game', { gameId });       // Dev only
 *   logger.info('Game started');                    // Dev only
 *   logger.warn('Rate limit approaching');          // Dev only
 *   logger.error('Failed to save', error);          // Always logs (without stack in prod)
 */

// Check if we're in development mode
// __DEV__ is provided by React Native, process.env.NODE_ENV by bundlers
const isDev = typeof __DEV__ !== 'undefined'
  ? __DEV__
  : process.env.NODE_ENV === 'development';

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
      // Only include stack in dev
      ...(isDev && obj.stack ? { stack: sanitizeString(obj.stack) } : {}),
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
 * Logger with PII protection
 */
export const logger = {
  /**
   * Debug logging - only in development
   * Use for detailed debugging information
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[DEBUG]', ...formatArgs(args));
    }
  },

  /**
   * Info logging - only in development
   * Use for general information about app flow
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.log('[INFO]', ...formatArgs(args));
    }
  },

  /**
   * Warning logging - only in development
   * Use for potential issues that don't break functionality
   */
  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn('[WARN]', ...formatArgs(args));
    }
  },

  /**
   * Error logging - always logs (but sanitized)
   * Use for errors that need attention
   */
  error: (message: string, error?: unknown): void => {
    // Always log errors, but sanitize in production
    const sanitizedMessage = sanitizeString(message);

    if (isDev) {
      const sanitizedError = error ? sanitizeObject(error) : '';
      const errorStr = typeof sanitizedError === 'object' && sanitizedError !== null
        ? JSON.stringify(sanitizedError)
        : String(sanitizedError);
      console.error('[ERROR]', sanitizedMessage, errorStr);
    } else {
      // In production, only log the message (not the full error object)
      console.error('[ERROR]', sanitizedMessage);
    }
  },

  /**
   * Create a scoped logger with a prefix
   * Useful for component-specific logging
   */
  scope: (prefix: string) => ({
    debug: (...args: unknown[]) => logger.debug(`[${prefix}]`, ...args),
    info: (...args: unknown[]) => logger.info(`[${prefix}]`, ...args),
    warn: (...args: unknown[]) => logger.warn(`[${prefix}]`, ...args),
    error: (message: string, error?: unknown) => logger.error(`[${prefix}] ${message}`, error),
  }),
};

// Export isDev for conditional logic elsewhere
export { isDev };
