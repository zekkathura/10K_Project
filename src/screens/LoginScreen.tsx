import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedLoader } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { Theme, useThemedStyles } from '../lib/theme';
import { signInWithGoogle } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { AUTH_STORAGE_KEYS, APP_SCHEME } from '../lib/authConfig';
import { LoadingStatus } from '../App';

// Dice faces for decoration
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

interface LoginScreenProps {
  /** Whether the app is still initializing (checking session) */
  initializing?: boolean;
  /** Current loading status for display */
  loadingStatus?: LoadingStatus;
}

// Get user-friendly loading message
function getLoadingMessage(status: LoadingStatus): string {
  switch (status) {
    case 'initializing':
    case 'checking_session':
      return 'Checking for existing session...';
    case 'verifying_account':
      return 'Verifying account...';
    case 'loading_profile':
      return 'Loading profile...';
    default:
      return 'Loading...';
  }
}

export default function LoginScreen({ initializing = false, loadingStatus = null }: LoginScreenProps) {
  const insets = useSafeAreaInsets();

  // Logo wiggle animation
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous wiggle animation
    const wiggle = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    wiggle.start();
    return () => wiggle.stop();
  }, [wiggleAnim]);

  // Interpolate rotation from -3deg to 3deg
  const rotation = wiggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [displayNameFocused, setDisplayNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ME).then((value) => {
      if (value === 'false') setRememberMe(false);
    });
  }, []);

  const persistRememberMe = async (value: boolean) => {
    setRememberMe(value);
    await AsyncStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ME, value ? 'true' : 'false');
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next);
    setEmail('');
    setDisplayName('');
    setPassword('');
    setConfirmPassword('');
  };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidPassword = (value: string) => {
    const hasMin = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSymbol = /[^A-Za-z0-9]/.test(value);
    return hasMin && hasUpper && hasLower && hasSymbol;
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleGoogleSignIn = async () => {
    // Don't show any loading - just open browser immediately
    try {
      const result = await signInWithGoogle();

      if (!result.success) {
        const errorMsg = typeof result.error === 'string'
          ? result.error
          : 'Failed to sign in with Google';
        showAlert('Error', errorMsg);
        return;
      }

      // Show full-screen loader - onAuthStateChange in App.tsx will handle navigation
      setLoading(true);
      setLoadingMessage('');
      logger.debug('Google sign-in successful, waiting for session...');
      // onAuthStateChange will fire and navigate to HomeScreen
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred');
      logger.error('Google sign-in error', error);
    }
  };

  const handleEmailSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      showAlert('Error', 'Please enter email and password.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showAlert('Error', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setLoadingMessage('Signing in...');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSignUp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedDisplayName = displayName.trim();

    if (!trimmedEmail || !trimmedDisplayName || !password || !confirmPassword) {
      showAlert('Error', 'Please enter all required fields.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showAlert('Error', 'Enter a valid email address.');
      return;
    }
    if (trimmedDisplayName.length < 2) {
      showAlert('Error', 'Display name must be at least 2 characters.');
      return;
    }
    if (!isValidPassword(password)) {
      showAlert('Error', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 symbol.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    setLoadingMessage('Creating account...');
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: APP_SCHEME,
      });
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;

      // Create profile with display_name
      if (data.user) {
        logger.debug('Creating profile for email signup');

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: trimmedEmail,
            display_name: trimmedDisplayName,
          })
          .select('id, display_name')
          .single();

        if (profileError) {
          logger.error('Profile creation error', profileError);
          showAlert('Profile Error', `Profile creation failed (${profileError.code || 'unknown'}). You may need to set your display name in Settings.`);
        } else if (!profileData) {
          // Insert returned no data - verify it was created
          logger.warn('Profile insert returned no data, verifying...');
          const { data: verifyData, error: verifyError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();

          if (verifyError || !verifyData) {
            logger.error('Profile verification failed:', verifyError);
            showAlert('Profile Error', 'Profile creation could not be verified. You may need to set your display name in Settings.');
          } else {
            logger.debug('Profile verified via secondary query');
          }
        } else {
          logger.debug('Profile created successfully for email signup:', profileData.display_name);
        }
      }

      showAlert('Check your email', 'We sent a confirmation link to finish sign-up. Please verify to continue.');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      showAlert('Error', 'Enter your email first.');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showAlert('Error', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: APP_SCHEME,
      });
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });
      if (error) throw error;
      showAlert('Password reset sent', 'Check your email for the reset link.');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (mode === 'signin') {
      handleEmailSignIn();
    } else {
      handleSignUp();
    }
  };

  // Show full-screen loader when returning from OAuth
  if (loading && !loadingMessage) {
    return (
      <View style={styles.fullScreenLoader}>
        <ThemedLoader mode="fullscreen" message="Signing in..." />
      </View>
    );
  }

  // Buttons should be disabled while initializing or during auth operations
  const buttonsDisabled = initializing || loading;

  return (
    <View style={styles.flex}>
      {/* FIXED HEADER - accent bar, logo, tabs */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        {/* Loading banner - shows while initializing */}
        {initializing && loadingStatus && (
          <View style={styles.initBanner}>
            <ActivityIndicator size="small" color="#fff" style={styles.initSpinner} />
            <Text style={styles.initText}>{getLoadingMessage(loadingStatus)}</Text>
          </View>
        )}
        <View style={styles.accentBar} />

        <View style={styles.headerContent}>
          {/* Logo section */}
          <View style={styles.logoSection}>
            <Animated.View style={[styles.logoContainer, { transform: [{ rotate: rotation }] }]}>
              <Image
                source={require('../../assets/images/10k_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>10K Scorekeeper</Text>
              <Text style={styles.subtitle}>Track your dice game victories</Text>
            </View>
          </View>

          {/* Tabs - underline style */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchMode('signin')}
              accessibilityLabel="Sign in tab"
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'signin' }}
            >
              <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                SIGN IN
              </Text>
              <View style={[styles.tabUnderline, mode === 'signin' && styles.tabUnderlineActive]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchMode('signup')}
              accessibilityLabel="Sign up tab"
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === 'signup' }}
            >
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                SIGN UP
              </Text>
              <View style={[styles.tabUnderline, mode === 'signup' && styles.tabUnderlineActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* SCROLLABLE FORM CONTENT */}
      <KeyboardAvoidingView
        style={styles.scrollContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrapper}>
            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputFocused]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="you@example.com"
                placeholderTextColor={styles.inputPlaceholder.color}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                accessibilityLabel="Email address"
                accessibilityHint="Enter your email address"
              />

              {mode === 'signup' && (
                <>
                  <Text style={styles.label}>DISPLAY NAME</Text>
                  <TextInput
                    style={[styles.input, displayNameFocused && styles.inputFocused]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    placeholder="Your name"
                    placeholderTextColor={styles.inputPlaceholder.color}
                    onFocus={() => setDisplayNameFocused(true)}
                    onBlur={() => setDisplayNameFocused(false)}
                    accessibilityLabel="Display name"
                    accessibilityHint="Enter your display name for the app"
                  />
                </>
              )}

              <Text style={styles.label}>PASSWORD</Text>
              <View style={[styles.inputRow, passwordFocused && styles.inputRowFocused]}>
                <TextInput
                  style={styles.inputField}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter password"
                  placeholderTextColor={styles.inputPlaceholder.color}
                  textContentType="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Image
                    source={
                      showPassword
                        ? require('../../assets/images/visiblePassword.png')
                        : require('../../assets/images/HiddenPassword.png')
                    }
                    style={styles.eyeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {mode === 'signup' && (
                <>
                  <Text style={styles.label}>CONFIRM PASSWORD</Text>
                  <View style={[styles.inputRow, confirmPasswordFocused && styles.inputRowFocused]}>
                    <TextInput
                      style={styles.inputField}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="Confirm password"
                      placeholderTextColor={styles.inputPlaceholder.color}
                      textContentType="password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      accessibilityLabel="Confirm password"
                      accessibilityHint="Re-enter your password to confirm"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      accessibilityRole="button"
                    >
                      <Image
                        source={
                          showConfirmPassword
                            ? require('../../assets/images/visiblePassword.png')
                            : require('../../assets/images/HiddenPassword.png')
                        }
                        style={styles.eyeIcon}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {mode === 'signin' && (
                <View style={styles.inlineRow}>
                  <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() => persistRememberMe(!rememberMe)}
                    accessibilityLabel="Remember me"
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: rememberMe }}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Text style={styles.checkboxMark}>✓</Text>}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    accessibilityLabel="Forgot password"
                    accessibilityRole="button"
                    accessibilityHint="Send a password reset email"
                  >
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, buttonsDisabled && styles.primaryButtonDisabled]}
                onPress={onSubmit}
                disabled={buttonsDisabled}
                accessibilityLabel={mode === 'signin' ? 'Log in' : 'Sign up'}
                accessibilityRole="button"
                accessibilityState={{ disabled: buttonsDisabled }}
              >
                {loading && loadingMessage && !loadingMessage.includes('Google') ? (
                  <View style={styles.loadingRow}>
                    <ThemedLoader mode="inline" color={styles.primaryButtonText.color} />
                    <Text style={styles.primaryButtonTextLoading}>{loadingMessage}</Text>
                  </View>
                ) : loading ? (
                  <ThemedLoader mode="inline" color={styles.primaryButtonText.color} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {mode === 'signin' ? 'LOG IN' : 'SIGN UP'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.separatorRow}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, buttonsDisabled && styles.googleButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={buttonsDisabled}
              accessibilityLabel="Continue with Google"
              accessibilityRole="button"
              accessibilityState={{ disabled: buttonsDisabled }}
            >
              <Image
                source={require('../../assets/images/google_logo.png')}
                style={styles.buttonLogo}
                resizeMode="contain"
                accessibilityElementsHidden={true}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FIXED FOOTER - dice decoration + safe area */}
      <View style={styles.fixedFooter}>
        <View style={styles.diceContainer}>
          {DICE_FACES.map((die, i) => (
            <View key={i} style={styles.diceWrapper}>
              <Text style={styles.diceIcon}>{die}</Text>
            </View>
          ))}
        </View>
        {/* Safe area spacer below dice */}
        <View style={[styles.safeAreaSpacer, { height: insets.bottom }]} />
      </View>
    </View>
  );
}

const createStyles = ({ colors, mode }: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    fullScreenLoader: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fixedHeader: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    initBanner: {
      backgroundColor: colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    initSpinner: {
      marginRight: 8,
    },
    initText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '500',
    },
    headerContent: {
      paddingHorizontal: 32,
      paddingTop: 16,
      paddingBottom: 0,
      maxWidth: 400,
      width: '100%',
      alignSelf: 'center',
    },
    scrollContainer: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      paddingBottom: 12,
    },
    formWrapper: {
      paddingHorizontal: 32,
      paddingTop: 12,
      maxWidth: 400,
      width: '100%',
      alignSelf: 'center',
    },
    accentBar: {
      height: 4,
      backgroundColor: colors.accent,
    },
    logoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },
    logoContainer: {
      width: 56,
      height: 56,
      borderRadius: 10,
      overflow: 'hidden',
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      opacity: 0.7,
    },
    tabContainer: {
      flexDirection: 'row',
      gap: 24,
      marginBottom: 0,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
    },
    tab: {
      paddingBottom: 10,
      marginBottom: -2,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 1,
      opacity: 0.6,
    },
    tabTextActive: {
      color: colors.textPrimary,
      opacity: 1,
    },
    tabUnderline: {
      height: 3,
      backgroundColor: 'transparent',
      marginTop: 10,
      borderRadius: 2,
    },
    tabUnderlineActive: {
      backgroundColor: colors.accent,
    },
    form: {
      gap: 8,
      marginBottom: 14,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      marginBottom: 4,
      marginTop: 2,
    },
    input: {
      width: '100%',
      backgroundColor: colors.inputBackground,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: 10,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.inputText,
      // On web, remove default browser outline - we handle focus styling manually
      ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
    },
    inputFocused: {
      borderColor: colors.accent,
      // Web-specific box shadow for focus ring effect
      ...(Platform.OS === 'web' ? {
        boxShadow: `0 0 0 2px ${colors.accentLight}`,
      } as any : {}),
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      backgroundColor: colors.inputBackground,
      paddingLeft: 16,
      paddingRight: 8,
    },
    inputRowFocused: {
      borderColor: colors.accent,
      // Web-specific box shadow for focus ring effect
      ...(Platform.OS === 'web' ? {
        boxShadow: `0 0 0 2px ${colors.accentLight}`,
      } as any : {}),
    },
    inputField: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 0,
      fontSize: 15,
      color: colors.inputText,
      backgroundColor: 'transparent',
      borderWidth: 0,
      // On web, remove outline from inner input - let parent inputRow show border
      ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
    },
    inputPlaceholder: {
      color: colors.placeholder,
    },
    inlineRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4,
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    checkboxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    checkboxMark: {
      color: colors.buttonText,
      fontSize: 11,
      fontWeight: '700',
    },
    rememberText: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    forgotText: {
      color: colors.accentLight,
      fontSize: 13,
      fontWeight: '500',
    },
    primaryButton: {
      backgroundColor: colors.accent,
      paddingVertical: 12,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 6,
    },
    primaryButtonDisabled: {
      opacity: 0.7,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: 1,
    },
    primaryButtonTextLoading: {
      color: colors.buttonText,
      fontSize: 13,
      fontWeight: '500',
    },
    separatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 14,
    },
    separatorLine: {
      flex: 1,
      height: 2,
      backgroundColor: colors.border,
    },
    separatorText: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      opacity: 0.5,
    },
    buttonLogo: {
      width: 18,
      height: 18,
      marginRight: 10,
    },
    googleButton: {
      backgroundColor: 'transparent',
      paddingVertical: 10,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    googleButtonDisabled: {
      opacity: 0.5,
    },
    googleButtonText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    loadingMessageText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    eyeButton: {
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    eyeIcon: {
      width: 22,
      height: 22,
      opacity: 0.6,
    },
    fixedFooter: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    diceContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      height: 56,
    },
    safeAreaSpacer: {
      backgroundColor: colors.surface,
    },
    diceWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    diceIcon: {
      fontSize: 36,
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : '#1a3a6e',
    },
  });
