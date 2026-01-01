/**
 * ScreenContainer - Standardized layout wrapper for screens
 *
 * Provides consistent safe area handling and layout structure.
 * Use this for screens rendered within HomeScreen's content area.
 *
 * The container assumes:
 * - Parent (HomeScreen) handles top header and bottom nav
 * - This component handles the scrollable content area
 * - Safe areas are already handled by parent for top/bottom chrome
 *
 * For full-screen modals (like SettingsScreen), use useSafeAreaInsets() directly.
 */
import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Use ScrollView wrapper (default: true) */
  scrollable?: boolean;
  /** Additional padding at bottom for content (default: 0) */
  contentPaddingBottom?: number;
  /** Custom style for the container */
  style?: ViewStyle;
  /** Custom style for the scroll content */
  contentStyle?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

export function ScreenContainer({
  children,
  scrollable = true,
  contentPaddingBottom = 0,
  style,
  contentStyle,
  testID,
}: ScreenContainerProps) {
  const { theme } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background },
    style,
  ];

  if (!scrollable) {
    return (
      <View style={containerStyle} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: contentPaddingBottom },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
      testID={testID}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default ScreenContainer;
