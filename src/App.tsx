import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet, Alert, Linking } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import * as WebBrowser from 'expo-web-browser';
import { ThemeProvider } from './lib/theme';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingGameCode, setPendingGameCode] = useState<string | null>(null);

  useEffect(() => {
    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setLoading(false);
    });

    // Get initial session (this will process URL hash on web)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link received:', url);

      // Parse URL to extract game code
      const gameCode = extractGameCode(url);
      if (gameCode) {
        if (session) {
          // User is logged in, attempt to join the game
          await handleJoinGame(gameCode);
        } else {
          // User not logged in, save code for after login
          setPendingGameCode(gameCode);
          Alert.alert(
            'Login Required',
            'Please log in to join this game. The game code will be saved for you.'
          );
        }
      }
    };

    // Listen for incoming links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [session]);

  useEffect(() => {
    // If user just logged in and there's a pending game code, join the game
    if (session && pendingGameCode) {
      handleJoinGame(pendingGameCode);
      setPendingGameCode(null);
    }
  }, [session, pendingGameCode]);

  const extractGameCode = (url: string): string | null => {
    try {
      // Handle both deep link and web URL formats
      // com.10kscorekeeper://join?code=ABC123
      // https://10kscorekeeper.com/join?code=ABC123
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      return code?.toUpperCase() || null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  };

  const handleJoinGame = async (gameCode: string) => {
    try {
      // Check if game exists
      const { data: game, error } = await supabase
        .from('games')
        .select('id, status')
        .eq('join_code', gameCode)
        .eq('status', 'active')
        .single();

      if (error || !game) {
        Alert.alert(
          'Game Not Found',
          `Game Code: ${gameCode} no longer exists or has ended.`
        );
        return;
      }

      // Game exists, show success message
      // The actual join will be handled by HomeScreen when user navigates to it
      Alert.alert(
        'Game Found',
        `Found game ${gameCode}. You can now join from the home screen.`
      );
    } catch (error) {
      console.error('Error checking game:', error);
      Alert.alert('Error', 'Failed to verify game code. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      {session ? <HomeScreen /> : <LoginScreen />}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
