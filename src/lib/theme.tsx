/**
 * Theme system for 10K Scorekeeper
 * Colors mirror the palette in assets/images/colorPalette.png
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  surfaceSecondary: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Borders & Dividers
  border: string;
  divider: string;

  // Accents & Status
  accent: string;
  accentLight: string;
  error: string;
  errorBackground: string;
  success: string;
  successBackground: string;

  // Interactive elements
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;

  // Input elements
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

// Light Mode Colors (from colorPalette.png)
const lightColors: ThemeColors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F6F7',
  surfaceSecondary: '#D7DFEB',

  // Text
  textPrimary: '#2C303A',
  textSecondary: '#5E6637',
  textTertiary: '#A3A7B1',

  // Borders & Dividers
  border: '#D7DFEB',
  divider: '#D7DFEB',

  // Accents & Status
  accent: '#4A78FF',
  accentLight: '#90A9FF',
  error: '#FF4444',
  errorBackground: '#FFE8E8',
  success: '#4CAF50',
  successBackground: '#E8F5E9',

  // Interactive elements
  buttonPrimary: '#4A78FF',
  buttonSecondary: '#FFFFFF',
  buttonText: '#FFFFFF',

  // Input elements
  inputBackground: '#FFFFFF',
  inputBorder: '#D7DFEB',
  inputText: '#2C303A',
  placeholder: '#A3A7B1',
};

// Dark Mode Colors (from colorPalette.png)
const darkColors: ThemeColors = {
  // Backgrounds
  background: '#0C0F17',
  surface: '#11141F',
  surfaceSecondary: '#24344D',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',  // Gray for secondary info (dates, subtitles)
  textTertiary: '#6B7280',   // Muted gray for hints

  // Borders & Dividers
  border: '#24344D',
  divider: '#24344D',

  // Accents & Status
  accent: '#4A78FF',
  accentLight: '#90A9FF',
  error: '#FF4444',
  errorBackground: '#2c090c',
  success: '#4CAF50',
  successBackground: '#0c2c15',

  // Interactive elements
  buttonPrimary: '#4A78FF',
  buttonSecondary: '#24344D',
  buttonText: '#FFFFFF',

  // Input elements
  inputBackground: '#24344D',
  inputBorder: '#24344D',
  inputText: '#FFFFFF',
  placeholder: '#8C92A3',
};

export const themes: Record<ThemeMode, Theme> = {
  light: {
    mode: 'light',
    colors: lightColors,
  },
  dark: {
    mode: 'dark',
    colors: darkColors,
  },
};

export const defaultTheme: ThemeMode = 'dark';

const STORAGE_KEY = '10k-theme-mode';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: defaultTheme,
  theme: themes[defaultTheme],
  setMode: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    const loadMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setModeState(stored);
        }
      } catch (error) {
        console.warn('Failed to load theme mode', error);
      }
    };
    loadMode();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    try {
      setModeState(nextMode);
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (error) {
      console.warn('Failed to persist theme mode', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, theme: themes[mode], setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const context = useTheme();
  return useMemo(() => factory(context.theme), [context.theme, factory]);
}
