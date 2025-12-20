import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme, useThemedStyles } from '../lib/theme';

interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  show: (config: AlertConfig) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function useThemedAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useThemedAlert must be used within ThemedAlertProvider');
  }
  return context;
}

interface ThemedAlertProviderProps {
  children: ReactNode;
}

export function ThemedAlertProvider({ children }: ThemedAlertProviderProps) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({ title: '' });
  const styles = useThemedStyles(createStyles);

  const show = useCallback((newConfig: AlertConfig) => {
    setConfig(newConfig);
    setVisible(true);
  }, []);

  const handleButtonPress = (button: AlertButton) => {
    setVisible(false);
    // Call onPress after modal closes
    setTimeout(() => {
      button.onPress?.();
    }, 100);
  };

  const handleClose = () => {
    setVisible(false);
  };

  // Default to OK button if none provided
  const buttons = config.buttons || [{ text: 'OK', style: 'default' }];

  return (
    <AlertContext.Provider value={{ show }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>{config.title}</Text>
            {config.message && (
              <Text style={styles.message}>{config.message}</Text>
            )}
            <View style={styles.buttonRow}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === 'cancel' && styles.cancelButton,
                    button.style === 'destructive' && styles.destructiveButton,
                    button.style === 'default' && styles.defaultButton,
                    !button.style && styles.defaultButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  accessibilityLabel={button.text}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === 'cancel' && styles.cancelButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 12,
      width: '85%',
      maxWidth: 340,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
      lineHeight: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginTop: 8,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 80,
    },
    defaultButton: {
      backgroundColor: colors.accent,
    },
    cancelButton: {
      backgroundColor: colors.surfaceSecondary,
    },
    destructiveButton: {
      backgroundColor: colors.error,
    },
    buttonText: {
      color: colors.buttonText,
      fontWeight: '600',
      fontSize: 14,
    },
    cancelButtonText: {
      color: colors.textPrimary,
    },
  });
