import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { logger } from './logger';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  try {
    // For web, use simple OAuth redirect
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account', // Always show account picker
          },
        },
      });

      if (error) throw error;
      return { success: true };
    }

    // For mobile (Expo Go / native), use Expo proxy
    const redirectTo = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    logger.debug('Google Auth - Platform:', Platform.OS);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account', // Always show account picker
        },
      },
    });

    if (error) throw error;

    if (data?.url) {
      logger.debug('Opening OAuth session');

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      logger.debug('WebBrowser result type:', result.type);

      if (result.type === 'success') {
        const { url } = result;
        const params = new URLSearchParams(url.split('#')[1]);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

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
