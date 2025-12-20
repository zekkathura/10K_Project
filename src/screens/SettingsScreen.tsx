import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedLoader } from '../components';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import { ThemeMode, useTheme, useThemedStyles } from '../lib/theme';

interface SettingsScreenProps {
  navigation: { goBack: () => void };
  onSignOut?: () => void;
  context?: 'home' | 'game' | 'stats'; // Where the settings screen was opened from
}

export default function SettingsScreen({ navigation, onSignOut, context = 'home' }: SettingsScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [themeSaving, setThemeSaving] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { theme, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();

  // Track if display name has been changed
  const hasChanges = displayName !== originalDisplayName;

  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'No user found. Please sign in again.');
        onSignOut?.();
        return;
      }

      // Add timeout to prevent hanging
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
        Alert.alert('No Profile', 'No profile found. Signing out...');
        onSignOut?.();
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
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile. Signing out...');
      onSignOut?.();
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
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    try {
      setSaving(true);

      // Update the profile display name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Also update all game_players records for this user to use the new display name
      const { error: gamePlayersError } = await supabase
        .from('game_players')
        .update({ player_name: displayName.trim() })
        .eq('user_id', profile.id)
        .eq('is_guest', false); // Only update non-guest players

      if (gamePlayersError) throw gamePlayersError;

      setOriginalDisplayName(displayName.trim());
      Alert.alert('Success', 'Display name updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Loading settings..." />
      </View>
    );
  }

  const handleThemeSelect = async (nextMode: ThemeMode) => {
    if (!profile || themeSaving) return;
    const prevMode = mode;
    setMode(nextMode);
    setIsThemeMenuOpen(false);
    setThemeSaving(true);
    try {
      const { error } = await supabase.from('profiles').update({ theme_mode: nextMode }).eq('id', profile.id);
      if (error) throw error;
    } catch (error: any) {
      setMode(prevMode);
      Alert.alert('Error', error.message || 'Failed to save theme preference');
    } finally {
      setThemeSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.menuLabel}>Menu</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          accessibilityLabel="Close settings"
          accessibilityRole="button"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionHeader}>General</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.themeRow}
            onPress={() => setIsThemeMenuOpen((open) => !open)}
            activeOpacity={0.8}
            accessibilityLabel={`Theme: ${mode === 'light' ? 'Light mode' : 'Dark mode'}`}
            accessibilityRole="button"
            accessibilityHint="Tap to change theme"
            accessibilityState={{ expanded: isThemeMenuOpen }}
          >
            <View>
              <Text style={styles.label}>Theme</Text>
              <Text style={styles.subLabel}>{mode === 'light' ? 'Light mode' : 'Dark mode'}</Text>
            </View>
            <Text style={styles.chevron}>&gt;</Text>
          </TouchableOpacity>

          {isThemeMenuOpen && (
            <View style={styles.dropdown} accessibilityRole="menu">
              {(mode === 'dark' ? (['dark', 'light'] as ThemeMode[]) : (['light', 'dark'] as ThemeMode[])).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownOption,
                    mode === option && styles.dropdownOptionActive,
                  ]}
                  onPress={() => handleThemeSelect(option)}
                  accessibilityLabel={option === 'light' ? 'Light mode' : 'Dark mode'}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: mode === option }}
                >
                  <View style={styles.dropdownRow}>
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        mode === option && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {option === 'light' ? 'Light mode' : 'Dark mode'}
                    </Text>
                    {mode === option && <Text style={styles.selectedBadge}>Selected</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionHeader}>Settings &amp; Support</Text>

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

        {onSignOut && (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={onSignOut}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
            accessibilityHint="Sign out of your account"
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
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
    content: {
      padding: 12,
    },
    sectionHeader: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 10,
    },
    subLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
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
    signOutButton: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#ff4444',
    },
    signOutText: {
      color: '#ff4444',
      fontSize: 16,
      fontWeight: '600',
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chevron: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    dropdown: {
      marginTop: 10,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    dropdownOption: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    dropdownOptionActive: {
      backgroundColor: colors.surface,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
    },
    dropdownOptionText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    dropdownOptionTextActive: {
      color: colors.textPrimary,
      fontWeight: '700',
    },
    dropdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    selectedBadge: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
  });
