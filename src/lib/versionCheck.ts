/**
 * Version Check Utility
 *
 * Checks if the current app version meets minimum requirements.
 * Used to prompt users to update when breaking changes are deployed.
 */

import { Platform } from 'react-native';
import { supabase } from './supabase';
import { logger } from './logger';
import Constants from 'expo-constants';

// Store URLs - update APP_STORE_ID once iOS app is published
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.tenk.scorekeeper';
const APP_STORE_ID = 'YOUR_APP_STORE_ID'; // TODO: Update after iOS App Store submission
const APP_STORE_URL = `https://apps.apple.com/app/id${APP_STORE_ID}`;

export interface VersionCheckResult {
  needsUpdate: boolean;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  minVersion?: string;
  currentVersion: string;
}

/**
 * Get the current app version from Expo Constants
 */
export function getCurrentVersion(): string {
  // From app.config.js extra or manifest
  return Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0';
}

/**
 * Compare two semantic versions
 * Returns: negative if v1 < v2, positive if v1 > v2, 0 if equal
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 !== p2) {
      return p1 - p2;
    }
  }
  return 0;
}

/**
 * Fetch app configuration from Supabase
 */
async function fetchAppConfig(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('key, value');

    if (error) {
      logger.warn('Failed to fetch app config:', error.message);
      return {};
    }

    const config: Record<string, string> = {};
    for (const row of data || []) {
      config[row.key] = row.value;
    }
    return config;
  } catch (err) {
    logger.warn('Error fetching app config:', err);
    return {};
  }
}

/**
 * Check if the app needs to be updated
 *
 * Call this on app startup to determine if:
 * - User needs to update (soft prompt)
 * - User must update (force update)
 * - App is in maintenance mode
 */
export async function checkAppVersion(): Promise<VersionCheckResult> {
  const currentVersion = getCurrentVersion();
  const result: VersionCheckResult = {
    needsUpdate: false,
    forceUpdate: false,
    maintenanceMode: false,
    currentVersion,
  };

  try {
    const config = await fetchAppConfig();

    // Check maintenance mode first
    if (config.maintenance_mode === 'true') {
      result.maintenanceMode = true;
      result.maintenanceMessage = config.maintenance_message;
      return result;
    }

    // Check version requirements
    const minVersion = config.min_app_version;
    if (minVersion) {
      result.minVersion = minVersion;
      const comparison = compareVersions(currentVersion, minVersion);

      if (comparison < 0) {
        result.needsUpdate = true;
        result.forceUpdate = config.force_update === 'true';
        logger.info(`App version ${currentVersion} is below minimum ${minVersion}`);
      }
    }
  } catch (err) {
    // If we can't check version, don't block the user
    logger.warn('Version check failed, allowing app to continue');
  }

  return result;
}

/**
 * Get the appropriate app store URL based on platform
 * - iOS: Apple App Store
 * - Android: Google Play Store
 * - Web: Falls back to Google Play (most common mobile platform)
 */
export function getStoreUrl(): string {
  if (Platform.OS === 'ios') {
    return APP_STORE_URL;
  }
  return GOOGLE_PLAY_URL;
}
