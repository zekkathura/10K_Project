/**
 * useAuth Hook
 * Centralized authentication state and operations
 *
 * This hook is the single source of truth for auth state.
 * Components should use this hook instead of accessing supabase.auth directly.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';
import { logger } from './logger';
import { signInWithGoogle as googleSignIn, signInWithApple as appleSignIn } from './auth';
import {
  AuthResult,
  AuthError,
  ProfileCheckResult,
  UserProfile,
  createAuthError,
  authSuccess,
  authFailure,
} from './authTypes';
import {
  APP_SCHEME,
  AUTH_TIMEOUTS,
  AUTH_RETRY,
  AUTH_STORAGE_KEYS,
  AUTH_ERROR_CODES,
} from './authConfig';
import { withRetry, raceWithTimeout, sleep } from './asyncUtils';

/**
 * Show alert across platforms
 */
function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
}

/**
 * Validate email format
 */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate password strength
 * Requires: 8+ chars, uppercase, lowercase, symbol
 */
function isValidPassword(value: string): boolean {
  const hasMin = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  return hasMin && hasUpper && hasLower && hasSymbol;
}

/**
 * Validate display name
 * Allows: letters (including accented), spaces, hyphens, apostrophes
 * Length: 2-50 characters
 */
function validateDisplayName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, error: 'Please enter a display name' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'Display name must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Display name must be 50 characters or less' };
  }

  const validNamePattern = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]*[a-zA-ZÀ-ÿ]$|^[a-zA-ZÀ-ÿ]$/;
  if (!validNamePattern.test(trimmed)) {
    return { valid: false, error: 'Display name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  if (/\s{2,}/.test(trimmed)) {
    return { valid: false, error: 'Display name cannot have multiple consecutive spaces' };
  }

  return { valid: true };
}

/**
 * Auth hook return type
 */
export interface UseAuthReturn {
  // State
  session: Session | null;
  user: User | null;
  loading: boolean;

  // Profile setup
  needsProfileSetup: boolean;
  pendingUser: User | null;
  suggestedDisplayName: string;

  // Auth operations
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithApple: () => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;

  // Profile operations
  createProfile: (displayName: string) => Promise<AuthResult>;
  cancelProfileSetup: () => Promise<void>;

  // Validation helpers (exposed for UI)
  isValidEmail: (email: string) => boolean;
  isValidPassword: (password: string) => boolean;
  validateDisplayName: (name: string) => { valid: boolean; error?: string };
}

/**
 * Main authentication hook
 */
export function useAuth(): UseAuthReturn {
  // Core state
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile setup state
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [suggestedDisplayName, setSuggestedDisplayName] = useState('');

  // Track fresh OAuth to skip remember-me check
  const isOAuthCallbackRef = useRef(
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location.hash.includes('access_token')
  );
  const handledFreshSignInRef = useRef(false);

  /**
   * Check if profile exists for a user
   */
  const checkProfile = useCallback(async (user: User): Promise<ProfileCheckResult> => {
    logger.debug('checkProfile called for user:', user.id);

    try {
      // On mobile, wait for session to settle
      if (Platform.OS !== 'web') {
        logger.debug('Mobile platform - waiting for session to settle');
        await sleep(AUTH_TIMEOUTS.MOBILE_SESSION_SETTLE);
      }

      // Query with timeout - wrap in async IIFE to get proper Promise
      const profileQuery = (async () => {
        const result = await supabase
          .from('profiles')
          .select('id, email')
          .eq('id', user.id)
          .maybeSingle();
        return result as { data: { id: string; email: string } | null; error: any };
      })();

      const result = await raceWithTimeout(profileQuery, AUTH_TIMEOUTS.PROFILE_CHECK);

      if (result.timedOut) {
        logger.warn('Profile check timed out');
        return 'needs_setup';
      }

      const { data, error } = result.data;

      if (error) {
        logger.error('Profile check error:', error);

        // Retry on permission error (session might not be ready)
        if (error.code === AUTH_ERROR_CODES.PERMISSION_DENIED) {
          logger.debug('Permission error - retrying after delay');
          await sleep(AUTH_TIMEOUTS.RETRY_DELAY);

          const retryQuery = (async () => {
            const r = await supabase
              .from('profiles')
              .select('id, email')
              .eq('id', user.id)
              .maybeSingle();
            return r as { data: { id: string; email: string } | null; error: any };
          })();

          const retryResult = await raceWithTimeout(retryQuery, AUTH_TIMEOUTS.PROFILE_CHECK);

          if (!retryResult.timedOut && retryResult.data?.data) {
            logger.debug('Profile found on retry');
            return 'ok';
          }
        }

        return 'needs_setup';
      }

      if (!data) {
        logger.debug('No profile found');
        return 'needs_setup';
      }

      logger.debug('Profile exists');
      return 'ok';
    } catch (err) {
      logger.error('Error checking profile:', err);
      return 'needs_setup';
    }
  }, []);

  /**
   * Show profile setup modal
   */
  const showProfileSetup = useCallback((session: Session) => {
    const user = session.user;
    const suggested = user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email?.split('@')[0] ||
                      '';

    setPendingUser(user);
    setSuggestedDisplayName(suggested);
    setNeedsProfileSetup(true);
    setSession(session);
    setLoading(false);
  }, []);

  /**
   * Handle auth state changes
   */
  useEffect(() => {
    logger.debug('Setting up auth listener');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.debug('Auth state changed:', event, 'hasSession:', !!session);

      if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          handledFreshSignInRef.current = true;
        }

        const result = await checkProfile(session.user);

        if (result === 'needs_setup') {
          showProfileSetup(session);
          return;
        }
      }

      setSession(session);
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        logger.error('Error getting session:', error);
        setSession(null);
        setLoading(false);
        return;
      }

      // Check remember-me preference
      if (session?.user) {
        const isFreshOAuth = isOAuthCallbackRef.current || handledFreshSignInRef.current;

        if (!isFreshOAuth) {
          try {
            const rememberMe = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
            if (rememberMe === 'false') {
              logger.debug('Remember me disabled, clearing session');
              await supabase.auth.signOut();
              setSession(null);
              setLoading(false);
              return;
            }
          } catch (err) {
            logger.error('Error checking remember me:', err);
          }
        } else {
          isOAuthCallbackRef.current = false;
          handledFreshSignInRef.current = false;
        }

        // Check profile
        const result = await checkProfile(session.user);
        if (result === 'needs_setup') {
          showProfileSetup(session);
          return;
        }
      }

      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkProfile, showProfileSetup]);

  /**
   * Sign in with email and password
   */
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return authFailure(createAuthError('VALIDATION', 'Please enter email and password'));
    }

    if (!isValidEmail(trimmedEmail)) {
      return authFailure(createAuthError('VALIDATION', 'Please enter a valid email address'));
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return authFailure(createAuthError(error.name, error.message, false, error));
      }

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Email sign-in error:', err);
      return authFailure(createAuthError('UNKNOWN', err.message || 'Failed to sign in', false, err));
    }
  }, []);

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    try {
      const result = await googleSignIn();

      if (!result.success) {
        const errorMsg = typeof result.error === 'string' ? result.error : 'Failed to sign in with Google';
        return authFailure(createAuthError('OAUTH', errorMsg, true, result.error));
      }

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Google sign-in error:', err);
      return authFailure(createAuthError('UNKNOWN', 'An unexpected error occurred', false, err));
    }
  }, []);

  /**
   * Sign in with Apple
   */
  const signInWithApple = useCallback(async (): Promise<AuthResult> => {
    try {
      const result = await appleSignIn();

      if (!result.success) {
        const errorMsg = typeof result.error === 'string' ? result.error : 'Failed to sign in with Apple';
        return authFailure(createAuthError('OAUTH', errorMsg, true, result.error));
      }

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Apple sign-in error:', err);
      return authFailure(createAuthError('UNKNOWN', 'An unexpected error occurred', false, err));
    }
  }, []);

  /**
   * Sign up with email and password
   * Note: Profile creation is handled by onAuthStateChange + createProfile
   */
  const signUp = useCallback(async (
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResult> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = displayName.trim();

    // Validation
    if (!trimmedEmail || !trimmedName || !password) {
      return authFailure(createAuthError('VALIDATION', 'Please enter all required fields'));
    }

    if (!isValidEmail(trimmedEmail)) {
      return authFailure(createAuthError('VALIDATION', 'Please enter a valid email address'));
    }

    const nameValidation = validateDisplayName(trimmedName);
    if (!nameValidation.valid) {
      return authFailure(createAuthError('VALIDATION', nameValidation.error || 'Invalid display name'));
    }

    if (!isValidPassword(password)) {
      return authFailure(createAuthError('VALIDATION', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 symbol'));
    }

    try {
      const redirectTo = AuthSession.makeRedirectUri({ scheme: APP_SCHEME });

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        return authFailure(createAuthError(error.name, error.message, false, error));
      }

      // Create profile immediately for email signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: trimmedEmail,
            display_name: trimmedName,
          });

        if (profileError) {
          logger.error('Profile creation error:', profileError);
          // Don't fail - user can set name later
        }
      }

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Sign-up error:', err);
      return authFailure(createAuthError('UNKNOWN', err.message || 'Failed to sign up', false, err));
    }
  }, []);

  /**
   * Sign out
   */
  const signOut = useCallback(async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
        return authFailure(createAuthError(error.name, error.message, false, error));
      }

      setSession(null);
      setNeedsProfileSetup(false);
      setPendingUser(null);

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Sign-out error:', err);
      return authFailure(createAuthError('UNKNOWN', err.message || 'Failed to sign out', false, err));
    }
  }, []);

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return authFailure(createAuthError('VALIDATION', 'Please enter your email'));
    }

    if (!isValidEmail(trimmedEmail)) {
      return authFailure(createAuthError('VALIDATION', 'Please enter a valid email address'));
    }

    try {
      const redirectTo = AuthSession.makeRedirectUri({ scheme: APP_SCHEME });

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });

      if (error) {
        return authFailure(createAuthError(error.name, error.message, false, error));
      }

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Password reset error:', err);
      return authFailure(createAuthError('UNKNOWN', err.message || 'Failed to send reset link', false, err));
    }
  }, []);

  /**
   * Create profile (for OAuth users)
   */
  const createProfile = useCallback(async (displayName: string): Promise<AuthResult> => {
    if (!pendingUser) {
      return authFailure(createAuthError('NO_USER', 'No pending user for profile creation'));
    }

    const trimmedName = displayName.trim();
    const validation = validateDisplayName(trimmedName);

    if (!validation.valid) {
      return authFailure(createAuthError('VALIDATION', validation.error || 'Invalid display name'));
    }

    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', pendingUser.id)
        .maybeSingle();

      const fullName = pendingUser.user_metadata?.full_name ||
                       pendingUser.user_metadata?.name ||
                       null;

      let error;
      if (existing) {
        // Update existing
        const result = await supabase
          .from('profiles')
          .update({
            display_name: trimmedName,
            email: pendingUser.email,
          })
          .eq('id', pendingUser.id);
        error = result.error;
      } else {
        // Insert new
        const result = await supabase
          .from('profiles')
          .insert({
            id: pendingUser.id,
            email: pendingUser.email,
            display_name: trimmedName,
            full_name: fullName,
          });
        error = result.error;
      }

      if (error) {
        logger.error('Profile creation failed:', error);
        return authFailure(createAuthError(error.code || 'DB_ERROR', error.message, false, error));
      }

      // Clear setup state
      setNeedsProfileSetup(false);
      setPendingUser(null);
      setSuggestedDisplayName('');

      return authSuccess(undefined);
    } catch (err: any) {
      logger.error('Profile creation error:', err);
      return authFailure(createAuthError('UNKNOWN', err.message || 'Failed to create profile', false, err));
    }
  }, [pendingUser]);

  /**
   * Cancel profile setup (signs out)
   */
  const cancelProfileSetup = useCallback(async () => {
    setNeedsProfileSetup(false);
    setPendingUser(null);
    setSuggestedDisplayName('');
    await supabase.auth.signOut();
    setSession(null);
  }, []);

  return {
    // State
    session,
    user: session?.user ?? null,
    loading,

    // Profile setup
    needsProfileSetup,
    pendingUser,
    suggestedDisplayName,

    // Auth operations
    signInWithEmail,
    signInWithGoogle,
    signInWithApple,
    signUp,
    signOut,
    resetPassword,

    // Profile operations
    createProfile,
    cancelProfileSetup,

    // Validation helpers
    isValidEmail,
    isValidPassword,
    validateDisplayName,
  };
}
