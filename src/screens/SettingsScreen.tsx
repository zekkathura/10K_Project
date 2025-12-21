import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { ThemedLoader, useThemedAlert } from '../components';
import { supabase } from '../lib/supabase';
import { deleteAccount } from '../lib/database';
import { logger } from '../lib/logger';
import type { Profile } from '../lib/types';
import { ThemeMode, useTheme, useThemedStyles } from '../lib/theme';

// Privacy Policy URL - Update this when you host your privacy policy
const PRIVACY_POLICY_URL = 'https://10kscorekeeper.com/privacy';

interface SettingsScreenProps {
  navigation: { goBack: () => void };
  onSignOut?: () => void;
  context?: 'home' | 'game' | 'stats';
}

export default function SettingsScreen({ navigation, onSignOut, context = 'home' }: SettingsScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { theme, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const alert = useThemedAlert();

  const hasChanges = displayName !== originalDisplayName;
  const styles = useThemedStyles(createStyles);

  // Get app version from Expo Constants
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.extra?.buildNumber || 1;
  const environment = Constants.expoConfig?.extra?.environment || 'production';

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert.show({
          title: 'Error',
          message: 'No user found. Please sign in again.',
          buttons: [{ text: 'OK', onPress: () => onSignOut?.() }],
        });
        return;
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile load timed out')), 10000)
      );

      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise,
      ]) as any;

      if (error) throw error;

      if (!data) {
        alert.show({
          title: 'No Profile',
          message: 'No profile found. Signing out...',
          buttons: [{ text: 'OK', onPress: () => onSignOut?.() }],
        });
        return;
      }

      setProfile(data);
      const name = data.display_name || '';
      setDisplayName(name);
      setOriginalDisplayName(name);
      const storedMode = (data as any).theme_mode as ThemeMode | undefined;
      if (storedMode === 'light' || storedMode === 'dark') {
        setMode(storedMode);
      }
    } catch (error: any) {
      logger.error('Error loading profile:', error);
      alert.show({
        title: 'Error',
        message: 'Failed to load profile. Signing out...',
        buttons: [{ text: 'OK', onPress: () => onSignOut?.() }],
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setDisplayName(originalDisplayName);
  }

  async function handleSave() {
    if (!profile) return;

    if (!displayName.trim()) {
      alert.show({ title: 'Error', message: 'Display name cannot be empty' });
      return;
    }

    try {
      setSaving(true);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      const { error: gamePlayersError } = await supabase
        .from('game_players')
        .update({ player_name: displayName.trim() })
        .eq('user_id', profile.id)
        .eq('is_guest', false);

      if (gamePlayersError) throw gamePlayersError;

      setOriginalDisplayName(displayName.trim());
      alert.show({ title: 'Success', message: 'Display name updated successfully' });
    } catch (error: any) {
      alert.show({ title: 'Error', message: error.message });
    } finally {
      setSaving(false);
    }
  }

  const handleThemeSelect = async (nextMode: ThemeMode) => {
    if (!profile) return;
    const prevMode = mode;
    setMode(nextMode);
    try {
      const { error } = await supabase.from('profiles').update({ theme_mode: nextMode }).eq('id', profile.id);
      if (error) throw error;
    } catch (error: any) {
      setMode(prevMode);
      alert.show({ title: 'Error', message: error.message || 'Failed to save theme preference' });
    }
  };

  const handleDeleteAccount = () => {
    alert.show({
      title: 'Delete Account?',
      message: 'This action cannot be undone. Your game history will be preserved for other players but your account will be permanently deleted.',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
    });
  };

  const confirmDeleteAccount = async () => {
    if (!profile) return;

    setDeleting(true);
    try {
      const result = await deleteAccount(profile.id);

      if (result.activeGames > 0) {
        alert.show({
          title: 'Account Deleted',
          message: `Your account has been deleted. You were removed from ${result.activeGames} active game(s). Your game history has been preserved.`,
          buttons: [{ text: 'OK' }],
        });
      }
      // onSignOut will be triggered by the auth state change from deleteAccount
    } catch (error: any) {
      setDeleting(false);
      alert.show({ title: 'Error', message: error.message || 'Failed to delete account' });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Loading settings..." />
      </View>
    );
  }

  if (deleting) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Deleting account..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.menuLabel}>Settings</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          accessibilityLabel="Close settings"
          accessibilityRole="button"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Appearance Section */}
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.radioGroup}>
            {(['light', 'dark'] as ThemeMode[]).map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => handleThemeSelect(option)}
                accessibilityLabel={option === 'light' ? 'Light mode' : 'Dark mode'}
                accessibilityRole="radio"
                accessibilityState={{ selected: mode === option }}
              >
                <View style={[styles.radioOuter, mode === option && styles.radioOuterSelected]}>
                  {mode === option && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.radioLabel, mode === option && styles.radioLabelSelected]}>
                  {option === 'light' ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailText}>{profile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Display Name</Text>
          <Text style={styles.helperText}>
            This name will be used when you join games
          </Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            onBlur={() => setDisplayName(displayName.trim())}
            placeholder="Enter display name"
            autoCapitalize="words"
            maxLength={50}
            accessibilityLabel="Display name"
            accessibilityHint="Your name shown to other players"
          />

          {hasChanges && (
            <View style={styles.inlineActionBar}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                accessibilityLabel="Cancel changes"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.applyButton, saving && styles.applyButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
                accessibilityLabel="Apply changes"
                accessibilityRole="button"
                accessibilityState={{ disabled: saving }}
              >
                {saving ? (
                  <ThemedLoader mode="inline" color="#fff" size="small" />
                ) : (
                  <Text style={styles.applyButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* About Section */}
        <Text style={styles.sectionHeader}>About</Text>
        <View style={styles.section}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>
              {appVersion} ({buildNumber})
              {environment !== 'production' && ` - ${environment}`}
            </Text>
          </View>
        </View>

        {/* Legal Section */}
        <Text style={styles.sectionHeader}>Legal</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            accessibilityLabel="Privacy Policy"
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Text style={styles.linkArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out / Delete Account */}
        {onSignOut && (
          <View style={styles.section}>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={onSignOut}
                accessibilityLabel="Sign out"
                accessibilityRole="button"
                accessibilityHint="Sign out of your account"
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
                accessibilityLabel="Delete account"
                accessibilityRole="button"
                accessibilityHint="Permanently delete your account"
              >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
              <Text style={styles.deleteWarning}>
                This will permanently delete your account. Your game history will be preserved for other players.
              </Text>
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors }: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    menuLabel: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 },
    closeButton: { paddingHorizontal: 8, paddingVertical: 6 },
    closeButtonText: { fontSize: 26, color: colors.textPrimary, fontWeight: '700' },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 12,
      paddingBottom: 40,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 8,
      marginTop: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    emailText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    helperText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.inputText,
    },
    inlineActionBar: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 12,
      justifyContent: 'flex-end',
    },
    cancelButton: {
      backgroundColor: colors.buttonSecondary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    applyButton: {
      backgroundColor: colors.accent,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    applyButtonDisabled: {
      opacity: 0.6,
    },
    applyButtonText: {
      color: colors.buttonText,
      fontSize: 14,
      fontWeight: '600',
    },
    // Radio button styles
    radioGroup: {
      flexDirection: 'row',
      gap: 24,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterSelected: {
      borderColor: colors.accent,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.accent,
    },
    radioLabel: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    radioLabelSelected: {
      fontWeight: '600',
    },
    // About section
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    aboutLabel: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    aboutValue: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    // Legal section links
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    linkText: {
      fontSize: 16,
      color: colors.accent,
    },
    linkArrow: {
      fontSize: 20,
      color: colors.textSecondary,
    },
    // Danger zone buttons
    signOutButton: {
      backgroundColor: colors.buttonSecondary,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    signOutText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.error,
    },
    deleteButtonText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteWarning: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });
