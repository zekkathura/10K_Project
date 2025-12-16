import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { logger } from './logger';

WebBrowser.maybeCompleteAuthSession();

// Get redirect URL based on environment
function getRedirectUrl(): string {
  // Web uses current origin
  if (Platform.OS === 'web') {
    return window.location.origin;
  }

  // For mobile, use AuthSession.makeRedirectUri() which handles:
  // - Expo Go: Returns exp:// URL that Expo Go can intercept
  // - Standalone builds: Returns the app's custom scheme
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: Constants.expoConfig?.scheme || 'com.10kscorekeeper',
    // Don't use path for OAuth - tokens come in fragment
  });

  return redirectUri;
}

export async function signInWithGoogle() {
  try {
    const redirectTo = getRedirectUrl();
    logger.debug('Google Auth - Platform:', Platform.OS);
    logger.debug('Google Auth - Redirect URL:', redirectTo);
    logger.debug('Google Auth - App Ownership:', Constants.appOwnership);

    // For web, use simple OAuth redirect (page will redirect)
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
      return { success: true };
    }

    // For mobile (Expo Go / native), use browser-based OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;

    if (data?.url) {
      logger.debug('Opening OAuth session with URL');
      logger.debug('OAuth URL (first 100 chars):', data.url.substring(0, 100));

      let result;
      try {
        result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );
        logger.debug('WebBrowser result:', JSON.stringify(result, null, 2));
      } catch (browserError) {
        logger.error('WebBrowser.openAuthSessionAsync error:', browserError);
        return { success: false, error: browserError };
      }

      logger.debug('WebBrowser result type:', result.type);

      if (result.type === 'success') {
        const { url } = result;
        logger.debug('Callback URL received (first 100 chars):', url.substring(0, 100));

        // Parse tokens from URL fragment (after #)
        const fragmentString = url.split('#')[1];
        logger.debug('Fragment exists:', !!fragmentString);

        const params = new URLSearchParams(fragmentString);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');

        if (errorParam) {
          logger.error('OAuth error in callback:', errorParam, errorDescription);
          return { success: false, error: errorDescription || errorParam };
        }

        logger.debug('Tokens found:', { access: !!accessToken, refresh: !!refreshToken });

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          return { success: true };
        } else {
          logger.error('Tokens not found in callback URL');
        }
      } else {
        logger.debug('Auth cancelled or failed:', result.type);
      }
    }

    return { success: false, error: 'Authentication cancelled' };
  } catch (error) {
    logger.error('Google sign-in error', error);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    // Sign out from Supabase (clears session)
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      logger.error('Sign out error', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    logger.error('Sign out exception', err);
    return { success: false, error: err };
  }
}

export async function signInWithApple() {
  try {
    // For web, use Supabase OAuth
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { success: true };
    }

    // For native iOS, use expo-apple-authentication
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Exchange Apple credential for Supabase session
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken!,
      nonce: credential.nonce,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { success: false, error: 'Authentication cancelled' };
    }
    logger.error('Apple sign-in error', error);
    return { success: false, error };
  }
}

export async function checkAppleAuthAvailability(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}
