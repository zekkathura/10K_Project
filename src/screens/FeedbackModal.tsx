import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles, useTheme } from '../lib/theme';
import { ThemedLoader, useThemedAlert } from '../components';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

type FeedbackCategory = 'bug' | 'feature' | 'other';

const CATEGORIES: { value: FeedbackCategory; label: string; description: string }[] = [
  { value: 'bug', label: 'Bug Report', description: 'Something isn\'t working correctly' },
  { value: 'feature', label: 'Feature Request', description: 'Suggest a new feature' },
  { value: 'other', label: 'Other', description: 'General feedback or questions' },
];

export default function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const alert = useThemedAlert();

  const [category, setCategory] = useState<FeedbackCategory>('bug');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const maxChars = 1000;
  const remainingChars = maxChars - message.length;

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert.show({ title: 'Error', message: 'Please enter your feedback' });
      return;
    }

    if (message.trim().length < 10) {
      alert.show({ title: 'Error', message: 'Feedback must be at least 10 characters' });
      return;
    }

    try {
      setSubmitting(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert.show({ title: 'Error', message: 'You must be signed in to submit feedback' });
        return;
      }

      // Get user profile for email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logger.error('Error fetching profile:', profileError);
      }

      // Submit feedback
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          email: profile?.email || user.email || 'unknown',
          category,
          message: message.trim(),
        });

      if (error) {
        // Check if rate limited
        if (error.message.includes('violates row-level security policy')) {
          alert.show({
            title: 'Daily Limit Reached',
            message: 'You can submit up to 5 feedback items per day. Please try again tomorrow.',
          });
          return;
        }
        throw error;
      }

      // Success
      alert.show({
        title: 'Feedback Sent!',
        message: 'Thanks for your feedback. We\'ll review it soon!',
      });

      // Reset form and close
      setMessage('');
      setCategory('bug');
      onClose();
    } catch (error: any) {
      logger.error('Error submitting feedback:', error);
      alert.show({
        title: 'Error',
        message: error.message || 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setMessage('');
    setCategory('bug');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.headerTitle}>Send Feedback</Text>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            disabled={submitting}
            accessibilityLabel="Close feedback"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        >
          {/* Category Selection */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  category === cat.value && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat.value)}
                disabled={submitting}
                accessibilityLabel={cat.label}
                accessibilityRole="radio"
                accessibilityState={{ selected: category === cat.value }}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    category === cat.value && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
                <Text
                  style={[
                    styles.categoryDescription,
                    category === cat.value && styles.categoryDescriptionActive,
                  ]}
                >
                  {cat.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>


          {/* Message Input */}
          <Text style={styles.sectionLabel}>Your Feedback</Text>
          <TextInput
            style={styles.textArea}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us what's on your mind..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={maxChars}
            editable={!submitting}
            textAlignVertical="top"
            accessibilityLabel="Feedback message"
            accessibilityHint="Enter your feedback"
          />
          <Text style={styles.charCount}>
            {remainingChars} characters remaining
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting || !message.trim()}
            accessibilityLabel="Submit feedback"
            accessibilityRole="button"
            accessibilityState={{ disabled: submitting || !message.trim() }}
          >
            {submitting ? (
              <ThemedLoader mode="inline" color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
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
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      flex: 1,
    },
    closeButton: {
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    closeButtonText: {
      fontSize: 26,
      color: colors.textPrimary,
      fontWeight: '700',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 12,
      marginTop: 8,
    },
    categoryGrid: {
      gap: 12,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 14,
    },
    categoryButtonActive: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceSecondary,
    },
    categoryLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    categoryLabelActive: {
      color: colors.accent,
    },
    categoryDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    categoryDescriptionActive: {
      color: colors.textPrimary,
    },
    tipBox: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 10,
      padding: 14,
      marginTop: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    tipIcon: {
      fontSize: 20,
      marginRight: 10,
    },
    tipContent: {
      flex: 1,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    tipText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    textArea: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.inputText,
      minHeight: 150,
      maxHeight: 300,
    },
    charCount: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'right',
      marginTop: 6,
      marginBottom: 24,
    },
    submitButton: {
      backgroundColor: colors.accent,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
  });
