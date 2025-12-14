import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { Theme, useThemedStyles } from '../lib/theme';
import { signInWithGoogle } from '../lib/auth';
import { supabase } from '../lib/supabase';

const REMEMBER_ME_KEY = '10k-remember-me';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          <Image
            source={require('../../assets/images/10k_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>10K Scorekeeper</Text>

          <View style={styles.modeRow}>
            <TouchableOpacity onPress={() => switchMode('signin')}>
              <Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => switchMode('signup')}>
              <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor={styles.inputPlaceholder.color}
            />

            {mode === 'signup' && (
              <>
                <Text style={[styles.label, styles.passwordLabel]}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder="Your name"
                  placeholderTextColor={styles.inputPlaceholder.color}
                />
              </>
            )}

            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <View style={styles.inputRow}>
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
                <Text style={[styles.label, styles.passwordLabel]}>Confirm Password</Text>
                <View style={styles.inputRow}>
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
                <ActivityIndicator color={styles.primaryButtonText.color} />
              ) : (
                <Text style={styles.primaryButtonText}>{mode === 'signin' ? 'Log in' : 'Sign up'}</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Or connect with</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={styles.googleButtonText.color} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    container: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
      paddingTop: 32,
      paddingBottom: 24,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 12,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.textPrimary,
    },
    modeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
      paddingHorizontal: 6,
    },
    modeText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '600',
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    modeTextActive: {
      color: colors.accent,
      fontWeight: '700',
      borderBottomColor: colors.accent,
    },
    form: {
      width: '100%',
      gap: 8,
      marginBottom: 16,
    },
    label: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    passwordLabel: {
      marginTop: 4,
    },
    input: {
      width: '100%',
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      fontSize: 16,
      color: colors.inputText,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      paddingLeft: 12,
      paddingRight: 8,
    },
    inputField: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 0,
      fontSize: 16,
      color: colors.inputText,
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
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    checkboxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    checkboxMark: {
      color: colors.buttonText,
      fontSize: 12,
      fontWeight: '700',
    },
    rememberText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    forgotText: {
      color: colors.accent,
      fontSize: 13,
      fontWeight: '600',
    },
    primaryButton: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 8,
    },
    primaryButtonDisabled: {
      opacity: 0.7,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '700',
    },
    separatorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
      marginTop: 8,
      width: '100%',
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    separatorText: {
      color: colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    buttonLogo: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    googleButton: {
      backgroundColor: colors.surface,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 250,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    googleButtonText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    eyeButton: {
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    eyeIcon: {
      width: 22,
      height: 22,
    },
  });
