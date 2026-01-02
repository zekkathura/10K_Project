/**
 * Network Status Hook
 *
 * Provides real-time network connectivity status for the app.
 * Used to detect offline state and block app usage when disconnected.
 */

import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { logger } from './logger';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
}

/**
 * Hook to monitor network connectivity
 * Returns current network status and a function to manually refresh
 */
export function useNetwork() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true, // Assume connected initially
    isInternetReachable: true,
    type: 'unknown',
  });

  const handleNetworkChange = useCallback((state: NetInfoState) => {
    const isConnected = state.isConnected ?? false;
    const isInternetReachable = state.isInternetReachable ?? isConnected;

    setNetworkStatus({
      isConnected,
      isInternetReachable,
      type: state.type,
    });

    // Only log when offline (user doesn't care about connected status)
    if (!isConnected || isInternetReachable === false) {
      logger.warn('Network status changed:', {
        isConnected,
        isInternetReachable,
        type: state.type,
      });
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      handleNetworkChange(state);
    } catch (err) {
      logger.warn('Failed to fetch network status:', err);
    }
  }, [handleNetworkChange]);

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, [handleNetworkChange]);

  // For determining if app should be blocked:
  // - isConnected: device has network interface active
  // - isInternetReachable: can actually reach the internet (may be null during check)
  // We consider offline if either is definitively false
  const isOffline = networkStatus.isConnected === false ||
                    networkStatus.isInternetReachable === false;

  return {
    ...networkStatus,
    isOffline,
    refresh,
  };
}

/**
 * Simple check if device is currently offline
 * Use this for one-time checks (e.g., before making a request)
 */
export async function checkIsOffline(): Promise<boolean> {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === false || state.isInternetReachable === false;
  } catch {
    // If we can't check, assume online
    return false;
  }
}
