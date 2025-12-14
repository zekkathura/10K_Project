import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  try {
    // For web, use simple OAuth redirect
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      return { success: true };
    }

    // For mobile (Expo Go / native), use Expo proxy
    const redirectTo = AuthSession.makeRedirectUri({
      useProxy: true,
    });

    console.log('===== GOOGLE AUTH DEBUG =====');
    console.log('Platform:', Platform.OS);
    console.log('Redirect URL being used:', redirectTo);
    console.log('============================');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      console.log('Opening OAuth URL:', data.url);

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      console.log('WebBrowser result type:', result.type);

      if (result.type === 'success') {
        const { url } = result;
        console.log('Callback URL received:', url);
        console.log('URL hash:', url.split('#')[1]);
        console.log('URL query:', url.split('?')[1]);

        const params = new URLSearchParams(url.split('#')[1]);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        console.log('Access token found:', !!accessToken);
        console.log('Refresh token found:', !!refreshToken);

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          return { success: true };
        } else {
          console.error('Tokens not found in callback URL');
        }
      } else {
        console.log('WebBrowser result:', result);
      }
    }

    return { success: false, error: 'Authentication cancelled' };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
  return { success: true };
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
    console.error('Apple sign-in error:', error);
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
