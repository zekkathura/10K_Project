/**
 * Expo App Configuration
 *
 * This dynamic config supports multiple environments:
 * - development: Local dev with 10k-dev Supabase
 * - preview: Testing builds (internal testing)
 * - production: Google Play / App Store releases
 *
 * Environment is set via EAS Build or APP_ENV variable.
 */

const IS_DEV = process.env.APP_ENV === 'development';
const IS_PREVIEW = process.env.APP_ENV === 'preview';
const IS_PROD = process.env.APP_ENV === 'production' || (!IS_DEV && !IS_PREVIEW);

// App version - update this for each release
const APP_VERSION = '1.0.0';
const BUILD_NUMBER = 1;

// Package identifiers
const getPackageName = () => {
  if (IS_DEV) return 'com.tenk.scorekeeper.dev';
  if (IS_PREVIEW) return 'com.tenk.scorekeeper.preview';
  return 'com.tenk.scorekeeper';
};

const getAppName = () => {
  if (IS_DEV) return '10K Scorekeeper (Dev)';
  if (IS_PREVIEW) return '10K Scorekeeper (Preview)';
  return '10K Scorekeeper';
};

export default {
  expo: {
    name: getAppName(),
    slug: '10k-scorekeeper',
    scheme: 'com.10kscorekeeper',
    version: APP_VERSION,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1a1a2e',
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: getPackageName(),
      buildNumber: String(BUILD_NUMBER),
      infoPlist: {
        NSCameraUsageDescription: 'This app does not use the camera.',
        NSPhotoLibraryUsageDescription: 'This app does not access photos.',
      },
    },

    android: {
      package: getPackageName(),
      versionCode: BUILD_NUMBER,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1a1a2e',
      },
      edgeToEdgeEnabled: true,
      permissions: [],
    },

    web: {
      favicon: './assets/images/10k_logo.png',
      bundler: 'metro',
    },

    plugins: [
      'expo-web-browser',
    ],

    extra: {
      // App metadata
      appVersion: APP_VERSION,
      buildNumber: BUILD_NUMBER,
      environment: IS_DEV ? 'development' : IS_PREVIEW ? 'preview' : 'production',

      // Feature flags
      deepLinkingEnabled: true,

      // EAS configuration
      eas: {
        projectId: '7c831de5-bad2-4eae-981c-fac6679def24',
      },
    },

    owner: 'tuesdaylabs',
  },
};
