import React, { useEffect, useState, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Alert, Linking, Modal, Text, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedLoader, ThemedAlertProvider } from './components';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { ThemeProvider, useThemedStyles, Theme } from './lib/theme';
import { logger, initializeRemoteDebug } from './lib/logger';
import { AUTH_STORAGE_KEYS, AUTH_TIMEOUTS, AUTH_ERROR_CODES } from './lib/authConfig';
import { ProfileCheckResult } from './lib/authTypes';
import { raceWithTimeout, sleep } from './lib/asyncUtils';
import { checkAppVersion, getStoreUrl, VersionCheckResult } from './lib/versionCheck';

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
    // Log error for debugging (sanitized by logger)
    logger.error('App crashed:', error, errorInfo);
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

// Update Required Modal Component
interface UpdateRequiredModalProps {
  visible: boolean;
  versionInfo: VersionCheckResult | null;
  onUpdate: () => void;
  onDismiss?: () => void; // Only available if not force update
}

function UpdateRequiredModal({
  visible,
  versionInfo,
  onUpdate,
  onDismiss,
}: UpdateRequiredModalProps) {
  const styles = useThemedStyles(createModalStyles);

  if (!versionInfo) return null;

  const isForced = versionInfo.forceUpdate;
  const isMaintenance = versionInfo.maintenanceMode;

  const title = isMaintenance ? 'Maintenance Mode' : 'Update Required';
  const message = isMaintenance
    ? versionInfo.maintenanceMessage || 'The app is currently under maintenance. Please try again later.'
    : isForced
    ? `A critical update is required to continue using 10K Scorekeeper.\n\nYour version: ${versionInfo.currentVersion}\nRequired: ${versionInfo.minVersion || 'latest'}`
    : `A new version of 10K Scorekeeper is available.\n\nYour version: ${versionInfo.currentVersion}\nLatest: ${versionInfo.minVersion || 'latest'}`;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isForced || isMaintenance ? undefined : onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={[styles.modalSubtitle, { textAlign: 'center', marginBottom: 20 }]}>
            {message}
          </Text>

          <View style={styles.modalButtons}>
            {!isForced && !isMaintenance && onDismiss && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onDismiss}
              >
                <Text style={styles.cancelButtonText}>Later</Text>
              </TouchableOpacity>
            )}

            {!isMaintenance && (
              <TouchableOpacity
                style={[styles.confirmButton, { flex: isForced ? 1 : undefined }]}
                onPress={onUpdate}
              >
                <Text style={styles.confirmButtonText}>Update Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Loading status for progress display - exported for LoginScreen
export type LoadingStatus =
  | 'initializing'      // App starting up
  | 'checking_session'  // Checking for existing session
  | 'authenticating'    // OAuth in progress
  | 'verifying_account' // Checking if profile exists
  | 'loading_profile'   // Profile found, loading data
  | null;               // Not loading

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true); // Start true - show loading while checking session
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>('initializing');
  const [pendingGameCode, setPendingGameCode] = useState<string | null>(null);

  // Profile setup state
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [creatingProfile, setCreatingProfile] = useState(false);

  // Version check state
  const [versionCheckResult, setVersionCheckResult] = useState<VersionCheckResult | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
  // Track if profile check has been completed for current session
  const profileCheckedRef = useRef(false);

  // Helper to show profile setup modal
  const showProfileSetup = (user: User) => {
    const suggestedName = user.user_metadata?.full_name ||
                         user.user_metadata?.name ||
                         user.email?.split('@')[0] ||
                         '';
    setPendingUser(user);
    setNewDisplayName(suggestedName);
    setNeedsProfileSetup(true);
    setLoadingStatus(null);
    setLoading(false);
  };

  // Check if profile exists for authenticated user
  const checkProfile = async (user: User, retryCount = 0): Promise<ProfileCheckResult> => {
    try {
      logger.debug('checkProfile called for user:', user.id, 'retry:', retryCount);
      setLoadingStatus('verifying_account');

      // On mobile, wait for session to settle before querying
      // This prevents RLS queries from hanging when session isn't fully established
      if (Platform.OS !== 'web' && retryCount === 0) {
        logger.debug('Mobile platform - waiting for session to settle:', AUTH_TIMEOUTS.MOBILE_SESSION_SETTLE, 'ms');
        await sleep(AUTH_TIMEOUTS.MOBILE_SESSION_SETTLE);
      }

      // Check if profile exists (with timeout)
      const profilePromise = supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user.id)
        .maybeSingle();

      const result = await raceWithTimeout(profilePromise, AUTH_TIMEOUTS.PROFILE_CHECK);

      if (result.timedOut) {
        // On timeout, retry with longer delays
        if (retryCount < 2) {
          logger.warn('Profile check timed out, retrying... (attempt', retryCount + 2, ')');
          await sleep(AUTH_TIMEOUTS.RETRY_DELAY * (retryCount + 1));
          return checkProfile(user, retryCount + 1);
        }
        logger.error('Profile check timed out after all retries');
        return 'error';
      }

      const { data, error } = result.data as { data: { id: string; email: string } | null; error: any };
      logger.debug('Profile check result:', { hasProfile: !!data, hasError: !!error });

      if (error) {
        logger.error('Profile check error:', error);
        if (error.code === AUTH_ERROR_CODES.PERMISSION_DENIED && retryCount < 2) {
          logger.debug('Permission error - retrying after delay...');
          await sleep(AUTH_TIMEOUTS.RETRY_DELAY);
          return checkProfile(user, retryCount + 1);
        }
        return 'needs_setup'; // Be lenient - let user try to create profile
      }

      if (!data) {
        logger.debug('No profile found, needs setup');
        return 'needs_setup';
      }

      logger.debug('Profile exists, proceeding');
      setLoadingStatus('loading_profile');
      return 'ok';
    } catch (err) {
      logger.error('Error checking profile:', err);
      return 'needs_setup';
    }
  };

  // Effect 1: Set up auth listener and get initial session
  // This effect ONLY updates session state - no profile checks
  useEffect(() => {
    logger.debug('Setting up auth listener...');
    setLoadingStatus('checking_session');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      logger.debug('Auth state changed:', _event, 'hasSession:', !!newSession);

      // Track fresh sign-in for remember-me logic
      if (_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') {
        handledFreshSignInRef.current = true;
      }

      // Reset profile checked flag when session changes
      if (newSession?.user?.id !== session?.user?.id) {
        profileCheckedRef.current = false;
      }

      // Just update session state - profile check happens in separate effect
      setSession(newSession);
    });

    // Get initial session
    logger.debug('Calling getSession...');
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
      logger.debug('getSession returned:', 'hasSession:', !!initialSession, 'error:', error?.message || 'none');

      if (error) {
        logger.error('Error getting session', error);
        setSession(null);
        setLoading(false);
        setLoadingStatus(null);
        return;
      }

      // Check "remember me" preference
      if (initialSession?.user) {
        const isFreshOAuthLogin = isOAuthCallbackRef.current || handledFreshSignInRef.current;

        if (!isFreshOAuthLogin) {
          try {
            const rememberMeValue = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME);
            if (rememberMeValue === 'false') {
              logger.debug('Remember me is disabled, clearing restored session');
              await supabase.auth.signOut();
              setSession(null);
              setLoading(false);
              setLoadingStatus(null);
              return;
            }
          } catch (err) {
            logger.error('Error checking remember me preference', err);
          }
        } else {
          isOAuthCallbackRef.current = false;
          handledFreshSignInRef.current = false;
        }
      }

      // Set session - profile check will happen in the next effect
      setSession(initialSession);

      // If no session, we're done loading
      if (!initialSession) {
        setLoading(false);
        setLoadingStatus(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Effect: Initialize remote debug and check app version on startup
  useEffect(() => {
    const runStartupChecks = async () => {
      try {
        // Initialize remote debug logging first (controls what gets logged)
        await initializeRemoteDebug(supabase);

        // Then check app version
        logger.debug('Checking app version...');
        const result = await checkAppVersion();
        logger.debug('Version check result:', result);

        setVersionCheckResult(result);

        // Show modal if update needed or maintenance mode
        if (result.needsUpdate || result.maintenanceMode) {
          setShowUpdateModal(true);
        }
      } catch (err) {
        logger.warn('Startup checks failed:', err);
        // Don't block app if checks fail
      }
    };

    runStartupChecks();
  }, []);

  // Handle opening the Play Store
  const handleOpenStore = () => {
    const storeUrl = getStoreUrl();
    Linking.openURL(storeUrl).catch((err) => {
      logger.error('Failed to open store:', err);
      if (Platform.OS === 'web') {
        window.open(storeUrl, '_blank');
      }
    });
  };

  // Handle dismissing update modal (only for non-forced updates)
  const handleDismissUpdate = () => {
    setShowUpdateModal(false);
  };

  // Effect 2: Check profile when session is established
  // This runs AFTER session state is updated, ensuring proper sequencing
  useEffect(() => {
    const runProfileCheck = async () => {
      // Skip if no session or already checked
      if (!session?.user) {
        return;
      }

      if (profileCheckedRef.current) {
        logger.debug('Profile already checked for this session');
        setLoading(false);
        setLoadingStatus(null);
        return;
      }

      // Mark as checked to prevent duplicate checks
      profileCheckedRef.current = true;

      logger.debug('Running profile check for session user');
      const result = await checkProfile(session.user);
      logger.debug('Profile check complete:', result);

      if (result === 'error') {
        logger.error('Profile check failed, signing out');
        const alertMsg = 'Unable to verify your account. Please try signing in again.';
        if (Platform.OS === 'web') {
          window.alert(alertMsg);
        } else {
          Alert.alert('Connection Error', alertMsg);
        }
        await supabase.auth.signOut();
        setSession(null);
        profileCheckedRef.current = false;
      } else if (result === 'needs_setup') {
        logger.debug('Profile needs setup, showing modal');
        showProfileSetup(session.user);
      } else {
        // Profile exists, proceed to home
        logger.debug('Profile verified, proceeding to home');
      }

      setLoading(false);
      setLoadingStatus(null);
    };

    runProfileCheck();
  }, [session?.user?.id]); // Only re-run when user ID changes

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
        if (checkError.code === AUTH_ERROR_CODES.PERMISSION_DENIED) {
          // Try a short delay and retry once
          logger.debug('Permission error on profile check, waiting for session to settle...');
          await sleep(AUTH_TIMEOUTS.MOBILE_SESSION_SETTLE);

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
        if (errorCode === AUTH_ERROR_CODES.PERMISSION_DENIED) {
          alertMsg += ' Permission denied - please try signing out and back in.';
        } else if (errorCode === AUTH_ERROR_CODES.DUPLICATE) {
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

  // Determine if we're in initializing state (checking session, not yet ready)
  const isInitializing = loading && !session;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedAlertProvider>
            {session ? <HomeScreen /> : <LoginScreen initializing={isInitializing} loadingStatus={loadingStatus} />}
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

            {/* Update Required Modal - blocks app if force update or maintenance */}
            <UpdateRequiredModal
              visible={showUpdateModal}
              versionInfo={versionCheckResult}
              onUpdate={handleOpenStore}
              onDismiss={versionCheckResult?.forceUpdate || versionCheckResult?.maintenanceMode ? undefined : handleDismissUpdate}
            />
          </ThemedAlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// No App-level styles needed - LoginScreen handles its own loading UI

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
