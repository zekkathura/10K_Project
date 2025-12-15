import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemedLoader } from '../components';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';
import { Theme, useThemedStyles } from '../lib/theme';

interface ProfileSettingsScreenProps {
  navigation: { goBack: () => void };
  onSignOut?: () => void;
}

export default function ProfileSettingsScreen({ navigation, onSignOut }: ProfileSettingsScreenProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'No user found');
        navigation.goBack();
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setDisplayName(data.display_name || '');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!profile) return;

    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', profile.id);

      if (error) throw error;

      Alert.alert('Success', 'Display name updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Loading profile..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      <View style={styles.content}>
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
            placeholder="Enter display name"
            autoCapitalize="words"
            maxLength={50}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ThemedLoader mode="inline" color={styles.saveButtonText.color} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {onSignOut && (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={onSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingTop: 50,
      paddingBottom: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    backButton: {
      marginBottom: 10,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.accent,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    content: {
      padding: 20,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
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
    saveButton: {
      backgroundColor: colors.accent,
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: colors.buttonText,
      fontSize: 16,
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
  });
