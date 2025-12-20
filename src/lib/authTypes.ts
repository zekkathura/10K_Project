/**
 * Authentication Types
 * Type-safe definitions for auth operations
 */

import { Session, User } from '@supabase/supabase-js';

/**
 * Standardized auth error structure
 */
export interface AuthError {
  code: string;
  message: string;
  /** Whether the operation can be retried */
  isRetryable: boolean;
  /** Original error for debugging */
  originalError?: unknown;
}

/**
 * Result type for auth operations - either success or failure
 */
export type AuthResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: AuthError };

/**
 * Profile check result
 * - 'ok': Profile exists, proceed to home
 * - 'needs_setup': No profile found, show setup modal
 * - 'error': Could not verify profile (timeout/network), show error and sign out
 */
export type ProfileCheckResult = 'ok' | 'needs_setup' | 'error';

/**
 * Auth state for the useAuth hook
 */
export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  /** Whether the user needs to complete profile setup */
  needsProfileSetup: boolean;
}

/**
 * Profile data structure
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  full_name?: string | null;
  theme_mode?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Auth event types from Supabase
 */
export type AuthEventType =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY';

/**
 * Helper to create a standardized AuthError
 */
export function createAuthError(
  code: string,
  message: string,
  isRetryable = false,
  originalError?: unknown
): AuthError {
  return { code, message, isRetryable, originalError };
}

/**
 * Helper to create a success result
 */
export function authSuccess<T>(data: T): AuthResult<T> {
  return { success: true, data };
}

/**
 * Helper to create a failure result
 */
export function authFailure(error: AuthError): AuthResult<never> {
  return { success: false, error };
}

/**
 * Type guard to check if result is successful
 */
export function isAuthSuccess<T>(result: AuthResult<T>): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard to check if result is a failure
 */
export function isAuthFailure<T>(result: AuthResult<T>): result is { success: false; error: AuthError } {
  return result.success === false;
}
