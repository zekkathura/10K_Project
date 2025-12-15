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
} from 'react-native';
import { ThemedLoader } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { Theme, useThemedStyles } from '../lib/theme';
import { signInWithGoogle } from '../lib/auth';
import { supabase } from '../lib/supabase';

const REMEMBER_ME_KEY = '10k-remember-me';

// Dice faces for decoration
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function LoginScreen() {
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
    AsyncStorage.getItem(REMEMBER_ME_KEY).then((value) => {
      if (value === 'false') setRememberMe(false);
    });
  }, []);

  const persistRememberMe = async (value: boolean) => {
    setRememberMe(value);
    await AsyncStorage.setItem(REMEMBER_ME_KEY, value ? 'true' : 'false');
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
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        showAlert('Error', 'Failed to sign in with Google');
        return;
      }

      // After successful Google sign-in, ensure profile exists
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        // If no profile, create one
        if (!profile) {
          const displayName = user.user_metadata?.full_name ||
                             user.user_metadata?.name ||
                             user.email?.split('@')[0] ||
                             'User';

          console.log('Creating profile with:', {
            id: user.id,
            email: user.email,
            display_name: displayName,
          });

          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email!,
              display_name: displayName,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            console.error('Error details:', JSON.stringify(profileError, null, 2));
            showAlert('Profile Error', `Failed to create profile: ${profileError.message}`);
          } else {
            console.log('Profile created successfully');
          }
        }
      }
    } catch (error) {
      showAlert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
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
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: 'com.10kscorekeeper',
        useProxy: true,
      });
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;

      // Create profile with display_name
      if (data.user) {
        console.log('Creating profile for email signup:', {
          id: data.user.id,
          email: trimmedEmail,
          display_name: trimmedDisplayName,
        });

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: trimmedEmail,
            display_name: trimmedDisplayName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          console.error('Error details:', JSON.stringify(profileError, null, 2));
          showAlert('Profile Error', `Profile creation failed: ${profileError.message}. You may need to set your display name in Settings.`);
        } else {
          console.log('Profile created successfully for email signup');
        }
      }

      showAlert('Check your email', 'We sent a confirmation link to finish sign-up. Please verify to continue.');
    } catch (error: any) {
      showAlert('Error', error.message || 'Failed to sign up.');
    } finally {
      setLoading(false);
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
        scheme: 'com.10kscorekeeper',
        useProxy: true,
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Top accent bar */}
          <View style={styles.accentBar} />

          <View style={styles.content}>
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
              >
                <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                  SIGN IN
                </Text>
                <View style={[styles.tabUnderline, mode === 'signin' && styles.tabUnderlineActive]} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => switchMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  SIGN UP
                </Text>
                <View style={[styles.tabUnderline, mode === 'signup' && styles.tabUnderlineActive]} />
              </TouchableOpacity>
            </View>

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
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
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
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  <TouchableOpacity style={styles.rememberRow} onPress={() => persistRememberMe(!rememberMe)}>
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Text style={styles.checkboxMark}>✓</Text>}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={onSubmit}
                disabled={loading}
              >
                {loading ? (
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

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
              {loading ? (
                <ThemedLoader mode="inline" color={styles.googleButtonText.color} />
              ) : (
                <>
                  <Image
                    source={require('../../assets/images/google_logo.png')}
                    style={styles.buttonLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Spacer to push dice to bottom */}
          <View style={styles.spacer} />

          {/* Bottom dice decoration */}
          <View style={styles.diceContainer}>
            {DICE_FACES.map((die, i) => (
              <View key={i} style={styles.diceWrapper}>
                <Text style={styles.diceIcon}>{die}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = ({ colors, mode }: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    scroll: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    accentBar: {
      height: 4,
      backgroundColor: colors.accent,
    },
    content: {
      paddingHorizontal: 32,
      paddingTop: 40,
      paddingBottom: 20,
      maxWidth: 400,
      width: '100%',
      alignSelf: 'center',
      zIndex: 2,
    },
    spacer: {
      flex: 1,
      minHeight: 40,
      zIndex: 0,
    },
    logoSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 28,
    },
    logoContainer: {
      width: 64,
      height: 64,
      borderRadius: 12,
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
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
      opacity: 0.7,
    },
    tabContainer: {
      flexDirection: 'row',
      gap: 24,
      marginBottom: 24,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
    },
    tab: {
      paddingBottom: 12,
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
      gap: 12,
      marginBottom: 20,
    },
    label: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1,
      marginBottom: 6,
      marginTop: 4,
    },
    input: {
      width: '100%',
      backgroundColor: colors.inputBackground,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 4,
      paddingVertical: 14,
      paddingHorizontal: 16,
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
      paddingVertical: 14,
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
      paddingVertical: 16,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 8,
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
    separatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
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
      paddingVertical: 14,
      borderRadius: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    googleButtonText: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
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
    diceContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'stretch',
      gap: 8,
      height: 72,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    diceWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    diceIcon: {
      fontSize: 44,
      color: mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : '#1a3a6e',
    },
  });
