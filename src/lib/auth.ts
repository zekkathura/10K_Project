/**
 * Authentication Functions
 * Low-level auth operations for OAuth providers
 *
 * Note: For most use cases, use the useAuth hook instead of these functions directly.
 */

import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { logger } from './logger';
import { APP_SCHEME, AUTH_TIMEOUTS } from './authConfig';
import { raceWithTimeout } from './asyncUtils';

// Complete any pending auth session (needed for web OAuth redirects)
try {
  WebBrowser.maybeCompleteAuthSession();
} catch (error) {
  logger.debug('maybeCompleteAuthSession failed (non-critical)');
}

/**
 * Simple result type for auth functions
 */
interface AuthFunctionResult {
  success: boolean;
  error?: string | Error | unknown;
}

/**
 * Get the appropriate redirect URL based on the current environment
 */
function getRedirectUrl(): string {
  // Web uses current origin
  if (Platform.OS === 'web') {
    return window.location.origin;
  }

  const appOwnership = Constants.appOwnership;
  const isStandalone = appOwnership === null && !__DEV__;

  logger.debug('getRedirectUrl:', { appOwnership, __DEV__, isStandalone });

  // For standalone production builds, use direct scheme
  if (isStandalone) {
    return `${APP_SCHEME}://`;
  }

  // For Expo Go and dev clients, use AuthSession
  const authSessionUri = AuthSession.makeRedirectUri({ scheme: APP_SCHEME });
  logger.debug('Using AuthSession URI:', authSessionUri);
  return authSessionUri;
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<AuthFunctionResult> {
  try {
    const redirectTo = getRedirectUrl();
    logger.debug('Google Auth - Starting with redirect:', redirectTo);

    // Web: Simple OAuth redirect
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: { prompt: 'select_account' },
        },
      });

      if (error) throw error;
      return { success: true };
    }

    // Mobile: Browser-based OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: { prompt: 'select_account' },
      },
    });

    if (error) throw error;

    if (!data?.url) {
      return { success: false, error: 'No OAuth URL received' };
    }

    logger.debug('Opening browser for OAuth');

    // Open browser for authentication
    let result;
    try {
      result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    } catch (browserError) {
      logger.error('Browser error:', browserError);
      return { success: false, error: browserError };
    }

    logger.debug('Browser result type:', result.type);

    if (result.type !== 'success') {
      return { success: false, error: 'Authentication cancelled' };
    }

    // Parse tokens from callback URL
    const { url } = result;
    const fragmentString = url.split('#')[1];

    if (!fragmentString) {
      logger.error('No fragment in callback URL');
      return { success: false, error: 'Invalid callback URL' };
    }

    const params = new URLSearchParams(fragmentString);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      logger.error(`OAuth error: ${errorParam}`, errorDescription);
      return { success: false, error: errorDescription || errorParam };
    }

    if (!accessToken || !refreshToken) {
      logger.error('Tokens not found in callback');
      return { success: false, error: 'No authentication tokens received' };
    }

    logger.debug('Setting session with tokens');
    const startTime = Date.now();

    // Set session - let it complete naturally, onAuthStateChange will handle navigation
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const elapsed = Date.now() - startTime;
      if (error) {
        logger.error(`setSession error after ${elapsed}ms:`, error.message);
        return { success: false, error: error.message };
      }

      logger.debug(`Session set successfully in ${elapsed}ms`);
      return { success: true };
    } catch (err) {
      const elapsed = Date.now() - startTime;
      logger.error(`setSession exception after ${elapsed}ms:`, err);
      return { success: false, error: err };
    }
  } catch (error) {
    logger.error('Google sign-in error:', error);
    return { success: false, error };
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<AuthFunctionResult> {
  try {
    // Web: Use Supabase OAuth redirect
    if (Platform.OS === 'web') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin },
      });

      if (error) throw error;
      return { success: true };
    }

    // iOS: Use native Apple Authentication for best UX
    if (Platform.OS === 'ios') {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Exchange Apple credential for Supabase session
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) throw error;
      return { success: true };
    }

    // Android: Use browser-based OAuth (similar to Google flow)
    const redirectTo = getRedirectUrl();
    logger.debug('Apple Auth (Android) - Starting with redirect:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (!data?.url) {
      return { success: false, error: 'No OAuth URL received' };
    }

    logger.debug('Opening browser for Apple OAuth');

    // Open browser for authentication
    let result;
    try {
      result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    } catch (browserError) {
      logger.error('Browser error:', browserError);
      return { success: false, error: browserError };
    }

    logger.debug('Browser result type:', result.type);

    if (result.type !== 'success') {
      return { success: false, error: 'Authentication cancelled' };
    }

    // Parse tokens from callback URL
    const { url } = result;
    const fragmentString = url.split('#')[1];

    if (!fragmentString) {
      logger.error('No fragment in callback URL');
      return { success: false, error: 'Invalid callback URL' };
    }

    const params = new URLSearchParams(fragmentString);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      logger.error(`OAuth error: ${errorParam}`, errorDescription);
      return { success: false, error: errorDescription || errorParam };
    }

    if (!accessToken || !refreshToken) {
      logger.error('Tokens not found in callback');
      return { success: false, error: 'No authentication tokens received' };
    }

    logger.debug('Setting session with tokens');

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      logger.error('setSession error:', sessionError.message);
      return { success: false, error: sessionError.message };
    }

    logger.debug('Apple session set successfully');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { success: false, error: 'Authentication cancelled' };
    }
    logger.error('Apple sign-in error:', error);
    return { success: false, error };
  }
}

/**
 * Sign out from Supabase
 */
export async function signOut(): Promise<AuthFunctionResult> {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) {
      logger.error('Sign out error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    logger.error('Sign out exception:', err);
    return { success: false, error: err };
  }
}

/**
 * Check if Apple Authentication is available (iOS only)
 */
export async function checkAppleAuthAvailability(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}
