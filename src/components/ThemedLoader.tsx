/**
 * ThemedLoader Component
 *
 * Cross-platform loading indicator that uses:
 * - 3D tumbling dice animation on web (DiceLoader)
 * - Standard ActivityIndicator on native (iOS/Android)
 *
 * Supports two modes:
 * - "fullPage": Centered dice with "Loading..." text (for screen loading states)
 * - "inline": Smaller spinner for buttons and inline use
 */

import React from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme';
import DiceLoader from './DiceLoader';

interface ThemedLoaderProps {
  /**
   * Loading mode:
   * - "fullPage": Large centered loader with text (default)
   * - "inline": Small spinner for buttons/inline use
   */
  mode?: 'fullPage' | 'inline';

  /** Size for inline mode (default: 'small') */
  size?: 'small' | 'large';

  /** Custom color override (defaults to theme accent) */
  color?: string;

  /** Custom loading text for fullPage mode (default: "Loading...") */
  text?: string;

  /** Hide the loading text in fullPage mode */
  hideText?: boolean;
}

const ThemedLoader: React.FC<ThemedLoaderProps> = ({
  mode = 'fullPage',
  size = 'small',
  color,
  text = 'Loading...',
  hideText = false,
}) => {
  const { theme } = useTheme();
  const loaderColor = color || theme.colors.accent;

  // Inline mode - simple spinner for buttons
  if (mode === 'inline') {
    return (
      <ActivityIndicator
        size={size}
        color={loaderColor}
      />
    );
  }

  // Full page mode - dice on web, spinner on native
  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      {isWeb ? (
        <DiceLoader size={70} />
      ) : (
        <ActivityIndicator size="large" color={loaderColor} />
      )}
      {!hideText && (
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ThemedLoader;
