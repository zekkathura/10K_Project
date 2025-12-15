import React, { useState, useRef } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Image, Text, Modal } from 'react-native';
import { signOut } from '../lib/auth';
import GamesListScreen from './GamesListScreen';
import GameScreen from './GameScreen';
import SettingsScreen from './SettingsScreen';
import GameStatsScreen from './GameStatsScreen';
import RulesScreen from './RulesScreen';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';

type NavTab = 'home' | 'game' | 'play' | 'stats' | 'rules';
const PLAY_COLOR = '#FF7A00';

export default function HomeScreen() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showGameStats, setShowGameStats] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isViewingGame, setIsViewingGame] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [playTrigger, setPlayTrigger] = useState(0);
  const [reloadGamesTrigger, setReloadGamesTrigger] = useState(0);
  const gameScreenRef = useRef<any>(null);
  const styles = useThemedStyles(createStyles);
  const { mode } = useTheme();

  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleGameSelect = (gameId: string, navigate: boolean = true) => {
    setSelectedGameId(gameId);
    if (navigate) {
      setIsViewingGame(true);
      setCurrentTab('game');
    }
  };

  const handleBackToList = () => {
    setIsViewingGame(false);
    setCurrentTab('home');
  };

  const handleGameRemoved = () => {
    setSelectedGameId(null);
    setIsViewingGame(false);
    setCurrentTab('home');
    setReloadGamesTrigger((n) => n + 1);
  };

  const handleOpenProfile = () => {
    setShowProfileSettings(true);
    setIsViewingGame(false);
    setCurrentTab('home');
  };

  const handleCloseProfile = () => {
    setShowProfileSettings(false);
    setCurrentTab('home');
  };

  const handleCloseStats = () => {
    setShowGameStats(false);
    setIsViewingGame(false);
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
    setIsViewingGame(false);
    setCurrentTab('home');
  };

  const handleNavigateGame = () => {
    if (!selectedGameId) {
      Alert.alert('Select a game', 'Pick a game from Home to view it here.');
      return;
    }
    setShowProfileSettings(false);
    setShowGameStats(false);
    setIsViewingGame(true);
    setCurrentTab('game');
  };

  const handleNavigateStats = () => {
    setShowProfileSettings(false);
    setShowRules(false);
    setShowGameStats(true);
    setIsViewingGame(false);
    setCurrentTab('stats');
  };

  const handleNavigateYou = () => {
    setShowGameStats(false);
    setShowRules(true);
    setShowProfileSettings(false);
    setIsViewingGame(false);
    setCurrentTab('rules');
  };

  const handleNavigatePlay = () => {
    setShowProfileSettings(false);
    setShowGameStats(false);
    setIsViewingGame(false);
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
      <View style={styles.topHeader}>
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

      <View style={styles.contentWrapper}>
        {showGameStats ? (
          <GameStatsScreen
            navigation={{ goBack: handleCloseStats }}
            onOpenProfile={handleOpenProfile}
          />
        ) : showRules ? (
          <RulesScreen />
        ) : isViewingGame && selectedGameId ? (
          <GameScreen
            ref={gameScreenRef}
            gameId={selectedGameId}
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

      <View style={styles.navWrapper}>
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
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    contentWrapper: { flex: 1, paddingBottom: 90 },
    topHeader: {
      height: 54,
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
  });
