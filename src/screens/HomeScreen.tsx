import React, { useState, useRef, useEffect } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Image, Text, Modal, Platform, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from '../lib/auth';
import GamesListScreen from './GamesListScreen';
import GameScreen from './GameScreen';
import SettingsScreen from './SettingsScreen';
import GameStatsScreen from './GameStatsScreen';
import RulesScreen from './RulesScreen';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';

type NavTab = 'home' | 'game' | 'play' | 'stats' | 'rules';
const PLAY_COLOR = '#FF7A00';

// Navigation bar height (play button 60 + padding 6 + label ~16 = ~82)
const NAV_BAR_HEIGHT = 82;

// Platform-aware alert helper
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function HomeScreen() {
  // selectedGameId: Always an active game - the one highlighted in the list and accessible via Game tab
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  // viewingGameId: The game currently displayed on GameScreen (can be active or completed)
  const [viewingGameId, setViewingGameId] = useState<string | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [playTrigger, setPlayTrigger] = useState(0);
  const [reloadGamesTrigger, setReloadGamesTrigger] = useState(0);
  const [showNoGameAlert, setShowNoGameAlert] = useState(false);
  const gameScreenRef = useRef<any>(null);
  const styles = useThemedStyles(createStyles);
  const { mode } = useTheme();
  const insets = useSafeAreaInsets();

  // Handle Android hardware back button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If settings modal is open, close it
      if (showProfileSettings) {
        setShowProfileSettings(false);
        return true; // Handled
      }

      // If on any tab other than home, go to home
      if (currentTab !== 'home') {
        setCurrentTab('home');
        setViewingGameId(null); // Clear any viewed game
        return true; // Handled
      }

      // On home tab - let default behavior (close app) happen
      return false;
    });

    return () => backHandler.remove();
  }, [currentTab, showProfileSettings]);

  // Derived state: are we viewing a game?
  const isViewingGame = viewingGameId !== null;

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      showAlert('Error', 'Failed to sign out');
    }
  };

  const handleGameSelect = (gameId: string, navigate: boolean = true, status: 'active' | 'ended' = 'active') => {
    // Only update selectedGameId for active games - it always represents the "current" active game
    if (status === 'active') {
      setSelectedGameId(gameId);
    }
    // viewingGameId tracks what's currently displayed on GameScreen (active or completed)
    if (navigate) {
      setViewingGameId(gameId);
      setCurrentTab('game');
    }
  };

  const handleBackToList = () => {
    // Just clear the viewing state - selectedGameId remains unchanged
    setViewingGameId(null);
    setCurrentTab('home');
  };

  const handleGameRemoved = () => {
    setSelectedGameId(null);
    setViewingGameId(null);
    setCurrentTab('home');
    setReloadGamesTrigger((n) => n + 1);
  };

  const handleOpenProfile = () => {
    setShowProfileSettings(true);
    setViewingGameId(null);
    setCurrentTab('home');
  };

  const handleCloseProfile = () => {
    setShowProfileSettings(false);
    setCurrentTab('home');
  };

  const handleCloseStats = () => {
    setShowGameStats(false);
    setViewingGameId(null);
    setCurrentTab('home');
  };

  const handleCloseRules = () => {
    setShowRules(false);
    setCurrentTab('home');
  };

  const handleNavigateHome = () => {
    setShowProfileSettings(false);
    setShowGameStats(false);
    setShowRules(false);
    setViewingGameId(null);
    setCurrentTab('home');
  };

  const handleNavigateGame = () => {
    // Game tab always goes to the selected active game
    if (!selectedGameId) {
      // No active game selected - show themed alert modal
      setShowProfileSettings(false);
      setShowGameStats(false);
      setShowRules(false);
      setViewingGameId(null);
      setCurrentTab('home');
      setShowNoGameAlert(true);
      return;
    }
    setShowProfileSettings(false);
    setShowGameStats(false);
    setShowRules(false);
    setViewingGameId(selectedGameId);
    setCurrentTab('game');
  };

  const handleNavigateStats = () => {
    setShowProfileSettings(false);
    setShowRules(false);
    setShowGameStats(true);
    setViewingGameId(null);
    setCurrentTab('stats');
  };

  const handleNavigateYou = () => {
    setShowGameStats(false);
    setShowRules(true);
    setShowProfileSettings(false);
    setViewingGameId(null);
    setCurrentTab('rules');
  };

  const handleNavigatePlay = () => {
    setShowProfileSettings(false);
    setShowGameStats(false);
    setViewingGameId(null);
    setCurrentTab('play');
    setPlayTrigger((n) => n + 1);
  };

  const handleHeaderMenuPress = () => {
    if (isViewingGame && gameScreenRef.current) {
      gameScreenRef.current.openMenu();
    } else {
      // When not in a game, header action opens profile/settings
      handleOpenProfile();
    }
  };

  const activeTab: NavTab = currentTab;

  const NavButton = ({
    label,
    source,
    active,
    onPress,
    variant,
    styleOverride,
  }: {
    label: string;
    source: any;
    active: boolean;
    onPress: () => void;
    variant?: 'play';
    styleOverride?: any;
  }) => {
    if (variant === 'play') {
      return (
        <TouchableOpacity
          style={styles.playButtonWrapper}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityLabel={`${label} tab`}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
        >
          <View style={[styles.playButton, active && styles.playButtonActive]}>
            <Image
              source={require('../../assets/images/play.png')}
              style={styles.playIconImage}
              resizeMode="contain"
              accessibilityElementsHidden={true}
            />
          </View>
          <Text style={[styles.navLabelPlay, active && styles.navLabelPlayActive]}>{label}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.navButton}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityLabel={`${label} tab`}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
      >
        <Image
          source={source}
          style={[styles.navIcon, styleOverride, mode === 'dark' && styles.navIconTint]}
          resizeMode="contain"
          accessibilityElementsHidden={true}
        />
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: insets.top }]}>
        <View style={styles.topHeaderSpacer} />
        <Image
          source={require('../../assets/images/10k_horizontal_logo.png')}
          style={styles.topHeaderLogo}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={handleHeaderMenuPress}
          style={styles.topHeaderAction}
          accessibilityLabel={isViewingGame ? 'Game menu' : 'Settings'}
          accessibilityRole="button"
          accessibilityHint={isViewingGame ? 'Open game settings menu' : 'Open app settings'}
        >
          {isViewingGame ? (
            <Image
              source={require('../../assets/images/Settings_InGame.png')}
              style={[styles.topHeaderIcon, mode === 'dark' && styles.topHeaderIconTint]}
              resizeMode="contain"
              accessibilityElementsHidden={true}
            />
          ) : (
            <Image
              source={require('../../assets/images/settingHorizontal.png')}
              style={[styles.topHeaderIcon, mode === 'dark' && styles.topHeaderIconTint]}
              resizeMode="contain"
              accessibilityElementsHidden={true}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.contentWrapper, { paddingBottom: NAV_BAR_HEIGHT + insets.bottom }]}>
        {showGameStats ? (
          <GameStatsScreen
            navigation={{ goBack: handleCloseStats }}
            onOpenProfile={handleOpenProfile}
          />
        ) : showRules ? (
          <RulesScreen />
        ) : viewingGameId ? (
          <GameScreen
            ref={gameScreenRef}
            gameId={viewingGameId}
            onBack={handleBackToList}
            onGameRemoved={handleGameRemoved}
          />
        ) : (
          <GamesListScreen
            onGameSelect={handleGameSelect}
            onOpenProfile={handleOpenProfile}
            selectedGameId={selectedGameId}
            createGameTrigger={playTrigger}
            reloadTrigger={reloadGamesTrigger}
          />
        )}
      </View>

      <View style={[styles.navWrapper, { paddingBottom: insets.bottom }]}>
        <NavButton
          label="Home"
          source={require('../../assets/images/homescreen.png')}
          active={activeTab === 'home'}
          onPress={handleNavigateHome}
        />
        <NavButton
          label="Game"
          source={require('../../assets/images/singleDice.png')}
          active={activeTab === 'game'}
          onPress={handleNavigateGame}
          styleOverride={styles.navIconGame}
        />
        <NavButton
          label="Play"
          source={null}
          active={activeTab === 'play'}
          onPress={handleNavigatePlay}
          variant="play"
        />
        <NavButton
          label="Stats"
          source={require('../../assets/images/stats.png')}
          active={activeTab === 'stats'}
          onPress={handleNavigateStats}
        />
        <NavButton
          label="Rules"
          source={require('../../assets/images/rules_logo.png')}
          active={activeTab === 'rules'}
          onPress={handleNavigateYou}
        />
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showProfileSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseProfile}
      >
        <SettingsScreen
          navigation={{ goBack: handleCloseProfile }}
          onSignOut={handleSignOut}
          context={activeTab}
        />
      </Modal>

      {/* No Game Selected Alert Modal */}
      <Modal
        visible={showNoGameAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoGameAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.alertTitle}>No Game Selected</Text>
            <Text style={styles.alertMessage}>
              Tap Play to start a new game, or use Join Game to enter a friend's game code.
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setShowNoGameAlert(false)}
              accessibilityRole="button"
              accessibilityLabel="Got it"
            >
              <Text style={styles.alertButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    contentWrapper: { flex: 1 }, // paddingBottom applied dynamically via NAV_BAR_HEIGHT + insets.bottom
    topHeader: {
      minHeight: 54,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    topHeaderLogo: { height: 36, flex: 1 },
    topHeaderSpacer: { width: 28 },
    topHeaderAction: { paddingHorizontal: 8, paddingVertical: 6 },
    topHeaderIcon: { width: 24, height: 24 },
    topHeaderIconTint: { tintColor: colors.textPrimary },
    navWrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 3,
      paddingVertical: 6,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    navButton: {
      flex: 1,
      marginHorizontal: 6,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    navIcon: { width: 35, height: 35, marginBottom: 4 },
    navIconGame: { width: 42, height: 42 },
    navIconTint: { tintColor: colors.textPrimary },
    navLabel: { color: colors.textSecondary, fontWeight: '700', fontSize: 12 },
    navLabelActive: { color: PLAY_COLOR },
    playButtonWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      backgroundColor: colors.surfaceSecondary,
    },
    playButtonActive: { backgroundColor: colors.accentLight },
    playIconImage: { width: 62, height: 62 },
    navLabelPlay: { color: colors.textPrimary, fontWeight: '700', fontSize: 12, marginTop: 2 },
    navLabelPlayActive: { color: PLAY_COLOR },
    // Themed Alert Modal styles
    alertOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    alertContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    alertTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
      textAlign: 'center',
    },
    alertMessage: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'left',
      marginBottom: 20,
      lineHeight: 22,
      alignSelf: 'stretch',
    },
    alertButton: {
      backgroundColor: colors.buttonPrimary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      minWidth: 120,
    },
    alertButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
