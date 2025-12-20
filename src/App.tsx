import React, { useEffect, useState, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Alert, Linking, Modal, Text, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedLoader } from './components';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import * as WebBrowser from 'expo-web-browser';
import { ThemeProvider, useTheme, useThemedStyles, Theme } from './lib/theme';
import { logger } from './lib/logger';

// Error Boundary to catch crashes and display error screen instead of closing
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging (won't show in prod due to logger)
    console.error('App crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Something went wrong</Text>
          <Text style={errorStyles.message}>
            The app encountered an error and needs to restart.
          </Text>
          <ScrollView style={errorStyles.errorBox}>
            <Text style={errorStyles.errorText}>
              {this.state.error?.message || 'Unknown error'}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={errorStyles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={errorStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorBox: {
    maxHeight: 150,
    backgroundColor: '#2a2a4e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

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

  // Track if this is a fresh OAuth callback
  // On web: check URL hash for access_token (captured BEFORE Supabase consumes it)
  // On mobile: we'll detect via onAuthStateChange SIGNED_IN event
  const isOAuthCallbackRef = useRef(
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location.hash.includes('access_token')
  );
  // Track if we've already handled a fresh sign-in in this session (prevents re-processing)
  const handledFreshSignInRef = useRef(false);

  useEffect(() => {
    // Check if profile exists for authenticated user
    // Returns 'needs_setup' only if profile genuinely doesn't exist
    // Returns 'error' if we can't determine profile status (timeout, RLS, network issues)
    const checkProfile = async (user: User, retryCount = 0): Promise<ProfileCheckResult> => {
      try {
        logger.debug('checkProfile called for user:', user.id, 'retry:', retryCount);

        // On mobile OAuth, the session might not be fully ready immediately
        // Force a session refresh to ensure auth headers are set correctly
        if (retryCount === 0 && Platform.OS !== 'web') {
          logger.debug('Mobile platform - ensuring session is ready');
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session) {
            logger.debug('Session not ready yet, waiting...');
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        // Longer timeout for mobile networks
        const timeoutPromise = new Promise<{ data: null; error: null; timedOut: true }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: null, timedOut: true }), 10000)
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
          logger.error('Profile check timed out');
          return 'error'; // Can't determine profile status, sign out and retry
        }

        logger.debug('Profile check result:', { hasProfile: !!result.data, hasError: !!result.error });

        if (result.error) {
          logger.error('Profile check error:', result.error);

          // If we get a permission error (42501), the session might not be ready yet
          // Retry once after a delay (mobile OAuth race condition)
          if (result.error.code === '42501' && retryCount < 2) {
            logger.debug('Permission error - session may not be ready, retrying after delay...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return checkProfile(user, retryCount + 1);
          }

          // On error, return error state to trigger sign out
          return 'error';
        }

        if (!result.data) {
          logger.debug('No profile found, needs setup');
          return 'needs_setup';
        }

        logger.debug('Profile exists, proceeding');
        return 'ok';
      } catch (err) {
        logger.error('Error checking profile:', err);
        return 'error';
      }
    };

    // Helper to show profile setup modal
    const showProfileSetup = (session: Session) => {
      const user = session.user;
      const suggestedName = user.user_metadata?.full_name ||
                           user.user_metadata?.name ||
                           user.email?.split('@')[0] ||
                           '';
      setPendingUser(user);
      setNewDisplayName(suggestedName);
      setNeedsProfileSetup(true);
      setSession(session);
      setLoading(false);
    };

    // Timeout fallback - if auth doesn't complete in 15 seconds, show login
    // This prevents the app from being stuck on loading forever
    const authTimeout = setTimeout(() => {
      console.log('[APP_DEBUG] Auth timeout - forcing loading=false');
      setLoading(false);
    }, 15000);

    // Listen for auth changes first
    console.log('[APP_DEBUG] Setting up auth listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[APP_DEBUG] Auth state changed:', _event, 'hasSession:', !!session);
      logger.debug('=== Auth state changed ===');
      logger.debug('Event:', _event);
      logger.debug('Has session:', !!session);
      logger.debug('User ID:', session?.user?.id || 'none');

      // Check profile when user signs in or session is restored
      // SIGNED_IN: Fresh login (email/password or OAuth)
      // TOKEN_REFRESHED: Session restored from storage
      // INITIAL_SESSION: First session check after app load (mobile OAuth uses this)
      if (session?.user && (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'INITIAL_SESSION')) {
        // Mark that we've seen a fresh sign-in (used to skip rememberMe check in getSession)
        if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
          handledFreshSignInRef.current = true;
        }

        logger.debug('Checking profile for event:', _event);
        const result = await checkProfile(session.user);
        logger.debug('Profile check result:', result);

        if (result === 'error') {
          logger.error('Profile check failed, signing out');
          await supabase.auth.signOut();
          const errorMsg = 'Unable to verify your profile. Please try logging in again.';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Connection Error', errorMsg);
          }
          setSession(null);
          setLoading(false);
          return;
        }

        if (result === 'needs_setup') {
          logger.debug('Profile needs setup, showing modal');
          showProfileSetup(session);
          return;
        }
        logger.debug('Profile exists, proceeding to home');
      }

      setSession(session);
      setLoading(false);
    });

    // Get initial session (this will process URL hash on web)
    console.log('[APP_DEBUG] Calling getSession...');
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      console.log('[APP_DEBUG] getSession returned:', 'hasSession:', !!session, 'error:', error?.message || 'none');
      if (error) {
        logger.error('Error getting session', error);
        setSession(null);
        setLoading(false);
        return;
      }
      logger.debug('Initial session:', session ? 'authenticated' : 'none');

      // Check "remember me" preference - if false, clear any RESTORED session on app load
      // But don't clear if this is a fresh login (OAuth callback)
      if (session?.user) {
        // Detect fresh OAuth login:
        // - Web: isOAuthCallbackRef (captured at component mount from URL hash)
        // - Mobile: handledFreshSignInRef (set by onAuthStateChange SIGNED_IN/INITIAL_SESSION)
        const isFreshOAuthLogin = isOAuthCallbackRef.current || handledFreshSignInRef.current;
        logger.debug('getSession: isFreshOAuthLogin =', isFreshOAuthLogin);

        if (!isFreshOAuthLogin) {
          try {
            const rememberMeValue = await AsyncStorage.getItem(REMEMBER_ME_KEY);
            logger.debug('getSession: rememberMe value =', rememberMeValue);
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
          // Clear the refs after first use so subsequent app loads don't skip the check
          isOAuthCallbackRef.current = false;
          handledFreshSignInRef.current = false;
        }
      }

      // Check profile on initial load (in case SIGNED_IN/INITIAL_SESSION was missed)
      if (session?.user) {
        logger.debug('getSession: Checking profile on initial load');
        const result = await checkProfile(session.user);
        logger.debug('getSession: Profile check result:', result);

        if (result === 'needs_setup') {
          logger.debug('getSession: Profile needs setup, showing modal');
          showProfileSetup(session);
          return;
        }
        logger.debug('getSession: Profile exists, proceeding to home');
      }

      console.log('[APP_DEBUG] Setting loading=false, session:', !!session);
      setSession(session);
      setLoading(false);
    });

    return () => {
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
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
      // Verify session is still valid before profile operation
      // On mobile, session retrieval can be flaky - trust pendingUser if session check fails
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        logger.warn('Session check returned null, but pendingUser exists - proceeding with profile creation');
        // On mobile, don't sign out - the session may just not be immediately available
        // We already have pendingUser from when auth succeeded, so proceed
      } else {
        // Verify the session user matches the pending user (catch OAuth session issues)
        const currentUserId = sessionData.session.user.id;
        if (currentUserId !== pendingUser.id) {
          logger.error('Session user mismatch:', { current: currentUserId, pending: pendingUser.id });
          const alertMsg = 'Session mismatch. Please sign out and try again.';
          if (Platform.OS === 'web') {
            window.alert(alertMsg);
          } else {
            Alert.alert('Error', alertMsg);
          }
          await handleCancelSetup();
          return;
        }
      }

      // Extract full name from OAuth metadata (Google provides this)
      const fullName = pendingUser.user_metadata?.full_name ||
                       pendingUser.user_metadata?.name ||
                       null;

      // Check if profile already exists (could have been created by trigger or previous attempt)
      let existingProfile: { id: string } | null = null;
      const { data: profileData, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', pendingUser.id)
        .maybeSingle();

      existingProfile = profileData;

      // If the check fails with permission error, session might still be settling
      if (checkError) {
        logger.error('Error checking existing profile:', checkError);
        if (checkError.code === '42501') {
          // Try a short delay and retry once
          logger.debug('Permission error on profile check, waiting for session to settle...');
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Re-verify session
          const { data: retrySession } = await supabase.auth.getSession();
          if (!retrySession?.session) {
            const alertMsg = 'Session expired. Please sign in again.';
            if (Platform.OS === 'web') {
              window.alert(alertMsg);
            } else {
              Alert.alert('Error', alertMsg);
            }
            await handleCancelSetup();
            return;
          }

          // Retry the profile check
          logger.debug('Retrying profile check after session settle...');
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', pendingUser.id)
            .maybeSingle();

          if (retryError) {
            logger.error('Retry profile check failed:', retryError);
            const alertMsg = `Failed to check profile (${retryError.code}). Please try signing out and back in.`;
            if (Platform.OS === 'web') {
              window.alert(alertMsg);
            } else {
              Alert.alert('Error', alertMsg);
            }
            return;
          }
          existingProfile = retryProfile;
        }
      }

      let error;
      if (existingProfile) {
        // Profile exists - update it
        const result = await supabase
          .from('profiles')
          .update({
            display_name: trimmedName,
            email: pendingUser.email,
          })
          .eq('id', pendingUser.id);
        error = result.error;
      } else {
        // Profile doesn't exist - insert it
        const result = await supabase
          .from('profiles')
          .insert({
            id: pendingUser.id,
            email: pendingUser.email,
            display_name: trimmedName,
            full_name: fullName, // Immutable, for admin reference only
          });
        error = result.error;
      }

      if (error) {
        logger.error('Failed to create profile', error);
        // Always show error code for debugging (doesn't expose sensitive info)
        const errorCode = error.code || 'unknown';
        const errorHint = error.hint || error.message || '';
        let alertMsg = `Failed to create profile (${errorCode}).`;

        // Add helpful hints for common errors
        if (errorCode === '42501') {
          alertMsg += ' Permission denied - please try signing out and back in.';
        } else if (errorCode === '23505') {
          alertMsg += ' Profile may already exist.';
        } else if (errorHint) {
          alertMsg += ` ${errorHint}`;
        }

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

  // Use simple ActivityIndicator for initial load - this runs before ErrorBoundary
  // so we need the most stable, basic component possible to prevent crashes
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </ErrorBoundary>
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
