import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Alert, Linking, Modal, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { DiceLoader, ThemedLoader } from './components';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import * as WebBrowser from 'expo-web-browser';
import { ThemeProvider, useTheme, useThemedStyles, Theme } from './lib/theme';
import { logger } from './lib/logger';

const REMEMBER_ME_KEY = '10k-remember-me';

type ProfileCheckResult = 'ok' | 'needs_setup' | 'error';

// Profile Setup Modal Component (uses theme)
interface ProfileSetupModalProps {
  visible: boolean;
  displayName: string;
  onChangeDisplayName: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ProfileSetupModal({
  visible,
  displayName,
  onChangeDisplayName,
  onConfirm,
  onCancel,
  loading,
}: ProfileSetupModalProps) {
  const styles = useThemedStyles(createModalStyles);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Welcome!</Text>
          <Text style={styles.modalSubtitle}>
            Enter your display name to get started
          </Text>

          <TextInput
            style={styles.modalInput}
            value={displayName}
            onChangeText={onChangeDisplayName}
            placeholder="Display name"
            placeholderTextColor={styles.placeholder.color}
            autoCapitalize="words"
            maxLength={50}
            autoFocus
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ThemedLoader mode="inline" color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingGameCode, setPendingGameCode] = useState<string | null>(null);

  // Profile setup state
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [creatingProfile, setCreatingProfile] = useState(false);

  // Track if this is a fresh OAuth callback - captured BEFORE Supabase consumes the hash
  const isOAuthCallbackRef = useRef(
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location.hash.includes('access_token')
  );

  useEffect(() => {
    // Check if profile exists for authenticated user
    // Returns 'needs_setup' only if we definitively know no profile exists
    // On error/timeout, assume profile exists and proceed (don't block login)
    const checkProfile = async (user: User): Promise<ProfileCheckResult> => {
      try {
        logger.debug('checkProfile called');

        // Quick timeout - if slow, just proceed (assume profile exists)
        const timeoutPromise = new Promise<{ data: null; error: null; timedOut: true }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: null, timedOut: true }), 5000)
        );

        // Check if profile exists
        const profilePromise = supabase
          .from('profiles')
          .select('id, email')
          .eq('id', user.id)
          .maybeSingle()
          .then(result => ({ ...result, timedOut: false }));

        const result = await Promise.race([profilePromise, timeoutPromise]);

        if (result.timedOut) {
          logger.debug('Profile check timed out, proceeding anyway');
          return 'ok'; // Assume profile exists, don't block login
        }

        logger.debug('Profile check result:', { hasProfile: !!result.data, hasError: !!result.error });

        if (result.error) {
          logger.error('Profile check error', result.error);
          return 'ok'; // On error, proceed anyway - don't block login
        }

        if (!result.data) {
          logger.debug('No profile found, needs setup');
          return 'needs_setup';
        }

        return 'ok';
      } catch (err) {
        logger.error('Error checking profile', err);
        return 'ok'; // On error, proceed anyway - don't block login
      }
    };

    // Listen for auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      logger.debug('Auth state changed:', _event);

      // Check profile when user signs in
      if (_event === 'SIGNED_IN' && session?.user) {
        const result = await checkProfile(session.user);

        if (result === 'needs_setup') {
          // Store user and show profile setup modal
          const suggestedName = session.user.user_metadata?.full_name ||
                               session.user.user_metadata?.name ||
                               session.user.email?.split('@')[0] ||
                               '';
          setPendingUser(session.user);
          setNewDisplayName(suggestedName);
          setNeedsProfileSetup(true);
          setSession(session); // Keep session but show setup modal
          setLoading(false);
          return;
        }
      }

      setSession(session);
      setLoading(false);
    });

    // Get initial session (this will process URL hash on web)
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        logger.error('Error getting session', error);
        setSession(null);
        setLoading(false);
        return;
      }
      logger.debug('Initial session:', session ? 'authenticated' : 'none');

      // Check "remember me" preference - if false, clear any RESTORED session on app load
      // But don't clear if this is a fresh login (OAuth callback with access_token in URL)
      if (session?.user) {
        // Use ref captured at component mount (before Supabase consumed the hash)
        const isFreshOAuthLogin = isOAuthCallbackRef.current;

        if (!isFreshOAuthLogin) {
          try {
            const rememberMeValue = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            if (rememberMeValue === 'false') {
              logger.debug('Remember me is disabled, clearing restored session');
              await supabase.auth.signOut();
              setSession(null);
              setLoading(false);
              return;
            }
          } catch (err) {
            logger.error('Error checking remember me preference', err);
          }
        } else {
          logger.debug('Fresh OAuth login detected, skipping remember me check');
          // Clear the ref after first use so subsequent page loads don't skip the check
          isOAuthCallbackRef.current = false;
        }
      }

      // Check profile on initial load (in case SIGNED_IN was missed)
      if (session?.user) {
        const result = await checkProfile(session.user);

        if (result === 'needs_setup') {
          const suggestedName = session.user.user_metadata?.full_name ||
                               session.user.user_metadata?.name ||
                               session.user.email?.split('@')[0] ||
                               '';
          setPendingUser(session.user);
          setNewDisplayName(suggestedName);
          setNeedsProfileSetup(true);
          setSession(session);
          setLoading(false);
          return;
        }
      }

      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      logger.debug('Deep link received');

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
      logger.error('Error parsing URL', error);
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
      logger.error('Error checking game', error);
      Alert.alert('Error', 'Failed to verify game code. Please try again.');
    }
  };

  // Validate display name - letters and spaces only, 2-50 chars
  const validateDisplayName = (name: string): { valid: boolean; error?: string } => {
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

    // Only allow letters (including accented), spaces, hyphens, and apostrophes
    // This allows names like "Mary-Jane", "O'Brien", "José"
    const validNamePattern = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ' -]*[a-zA-ZÀ-ÿ]$|^[a-zA-ZÀ-ÿ]$/;
    if (!validNamePattern.test(trimmed)) {
      return { valid: false, error: 'Display name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    // Check for excessive spaces
    if (/\s{2,}/.test(trimmed)) {
      return { valid: false, error: 'Display name cannot have multiple consecutive spaces' };
    }

    return { valid: true };
  };

  // Handle profile creation from setup modal
  const handleCreateProfile = async () => {
    if (!pendingUser) return;

    const trimmedName = newDisplayName.trim();
    const validation = validateDisplayName(trimmedName);

    if (!validation.valid) {
      const alertMsg = validation.error || 'Invalid display name';
      if (Platform.OS === 'web') {
        window.alert(alertMsg);
      } else {
        Alert.alert('Error', alertMsg);
      }
      return;
    }

    setCreatingProfile(true);

    try {
      // Extract full name from OAuth metadata (Google provides this)
      const fullName = pendingUser.user_metadata?.full_name ||
                       pendingUser.user_metadata?.name ||
                       null;

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: pendingUser.id,
          email: pendingUser.email,
          display_name: trimmedName,
          full_name: fullName, // Immutable, for admin reference only
        });

      if (error) {
        logger.error('Failed to create profile', error);
        const alertMsg = 'Failed to create profile. Please try again.';
        if (Platform.OS === 'web') {
          window.alert(alertMsg);
        } else {
          Alert.alert('Error', alertMsg);
        }
        return;
      }

      logger.debug('Profile created successfully');
      // Clear setup state - user can now proceed to home
      setNeedsProfileSetup(false);
      setPendingUser(null);
      setNewDisplayName('');
    } catch (err) {
      logger.error('Error creating profile', err);
      const alertMsg = 'An error occurred. Please try again.';
      if (Platform.OS === 'web') {
        window.alert(alertMsg);
      } else {
        Alert.alert('Error', alertMsg);
      }
    } finally {
      setCreatingProfile(false);
    }
  };

  // Handle cancel from setup modal - sign out
  const handleCancelSetup = async () => {
    setNeedsProfileSetup(false);
    setPendingUser(null);
    setNewDisplayName('');
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {Platform.OS === 'web' ? (
          <>
            <DiceLoader size={70} />
            <Text style={styles.loadingText}>Loading...</Text>
          </>
        ) : (
          <>
            <View style={{ width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
              <ThemedLoader mode="inline" size="large" color="#DC2626" />
            </View>
            <Text style={styles.loadingText}>Loading...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <ThemeProvider>
      {session ? <HomeScreen /> : <LoginScreen />}
      <StatusBar style="auto" />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        visible={needsProfileSetup}
        displayName={newDisplayName}
        onChangeDisplayName={setNewDisplayName}
        onConfirm={handleCreateProfile}
        onCancel={handleCancelSetup}
        loading={creatingProfile}
      />
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});

// Themed styles for the profile setup modal
const createModalStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    modalInput: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: theme.colors.inputBorder,
      borderRadius: 10,
      padding: 14,
      fontSize: 16,
      marginBottom: 20,
      color: theme.colors.inputText,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.buttonSecondary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButton: {
      flex: 1,
      backgroundColor: theme.colors.accent,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: theme.colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    placeholder: {
      color: theme.colors.placeholder,
    },
  });
