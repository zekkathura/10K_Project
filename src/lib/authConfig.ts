/**
 * Authentication Configuration
 * Centralized constants for auth-related operations
 */

// App URL scheme - must match app.config.js
export const APP_SCHEME = 'com.10kscorekeeper';

// Timeout configurations (in milliseconds)
export const AUTH_TIMEOUTS = {
  /** Maximum time to wait for OAuth flow to complete */
  OAUTH_FLOW: 30000,
  /** Maximum time to wait for setSession to complete */
  SET_SESSION: 15000,
  /** Maximum time to wait for profile check query */
  PROFILE_CHECK: 15000,
  /** Delay before retrying after a failure */
  RETRY_DELAY: 2000,
  /** Delay for mobile session to settle after OAuth (setSession can be slow on mobile) */
  MOBILE_SESSION_SETTLE: 3000,
};

// Retry configurations
export const AUTH_RETRY = {
  /** Maximum number of retry attempts for profile operations */
  MAX_PROFILE_ATTEMPTS: 3,
  /** Maximum number of retry attempts for session operations */
  MAX_SESSION_ATTEMPTS: 2,
};

// Storage keys
export const AUTH_STORAGE_KEYS = {
  REMEMBER_ME: '10k-remember-me',
};

// Error codes
export const AUTH_ERROR_CODES = {
  /** PostgreSQL permission denied */
  PERMISSION_DENIED: '42501',
  /** PostgreSQL unique violation (duplicate) */
  DUPLICATE: '23505',
  /** Custom: Operation timed out */
  TIMEOUT: 'TIMEOUT',
  /** Custom: User cancelled */
  CANCELLED: 'CANCELLED',
  /** Custom: Session not ready */
  SESSION_NOT_READY: 'SESSION_NOT_READY',
  /** Custom: Network error */
  NETWORK_ERROR: 'NETWORK_ERROR',
};
