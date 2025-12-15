import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { ThemedLoader } from '../components';
import { supabase } from '../lib/supabase';
import { getMyGames, joinGameByCode, getJoinableGamesWithFriends } from '../lib/database';
import { Game } from '../lib/types';
import CreateGameScreen from './CreateGameScreen';
import { Theme, useThemedStyles } from '../lib/theme';

interface GamesListScreenProps {
  onGameSelect: (gameId: string, navigate?: boolean) => void;
  onOpenProfile: () => void;
  selectedGameId: string | null;
  createGameTrigger?: number;
  reloadTrigger?: number;
}

export default function GamesListScreen({
  onGameSelect,
  onOpenProfile,
  selectedGameId,
  createGameTrigger = 0,
  reloadTrigger = 0,
}: GamesListScreenProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [joinableGames, setJoinableGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateScreen, setShowCreateScreen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const styles = useThemedStyles(createStyles);
  const activeGames = useMemo(() => {
    const filtered = games
      .filter((game) => game.status === 'active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (!selectedGameId) return filtered;

    const selectedIndex = filtered.findIndex((game) => game.id === selectedGameId);
    if (selectedIndex > 0) {
      const [selected] = filtered.splice(selectedIndex, 1);
      filtered.unshift(selected);
    }
    return filtered;
  }, [games, selectedGameId]);

  const completedGames = useMemo(() => {
    return games
      .filter((game) => game.status === 'ended')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [games]);

  const sortedJoinableGames = useMemo(() => {
    return [...joinableGames].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [joinableGames]);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (createGameTrigger > 0) {
      setShowCreateScreen(true);
    }
  }, [createGameTrigger]);

  useEffect(() => {
    if (reloadTrigger > 0) {
      loadGames();
    }
  }, [reloadTrigger]);

  const loadGames = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      setUserDisplayName(profile?.display_name || user.email || 'Player');

      const myGames = await getMyGames(user.id);
      const scopedGames = myGames.filter((g: any) =>
        (g.game_players || []).some((gp: any) => gp.user_id === user.id),
      );

      // Enrich games with player count and winner info
      const gamesWithPlayerCount = await Promise.all(
        scopedGames.map(async (game) => {
          const { count } = await supabase
            .from('game_players')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', game.id);

          // For completed games, fetch winner name
          let winnerName = null;
          if (game.status === 'ended' && game.winning_player_id) {
            const { data: winnerData } = await supabase
              .from('game_players')
              .select('player_name')
              .eq('id', game.winning_player_id)
              .single();
            winnerName = winnerData?.player_name || null;
          }

          return {
            ...game,
            player_count: count || 0,
            winner_name: winnerName,
          };
        })
      );

      setGames(gamesWithPlayerCount);

      // Auto-select the first active game if none is selected
      if (!selectedGameId) {
        const firstActive = gamesWithPlayerCount.find((game) => game.status === 'active');
        if (firstActive) {
          onGameSelect(firstActive.id, false);
        }
      }

      // Load joinable games with friends
      const friendGames = await getJoinableGamesWithFriends(user.id);
      setJoinableGames(friendGames);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameCreated = (gameId: string) => {
    setShowCreateScreen(false);
    loadGames();
    onGameSelect(gameId);
  };

  const handleJoinFriendGame = async (game: any) => {
    try {
      const { gameId } = await joinGameByCode(
        game.join_code,
        userId,
        userDisplayName
      );

      loadGames();
      onGameSelect(gameId);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to join game');
    }
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter a join code');
      return;
    }

    try {
      const { gameId } = await joinGameByCode(
        joinCode.trim().toUpperCase(),
        userId,
        userDisplayName
      );

      setShowJoinModal(false);
      setJoinCode('');
      loadGames();
      onGameSelect(gameId);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to join game. Please check the code and try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedLoader text="Loading games..." />
      </View>
    );
  }

  if (showCreateScreen) {
    return (
      <CreateGameScreen
        onCancel={() => setShowCreateScreen(false)}
        onGameCreated={handleGameCreated}
        currentUserId={userId}
        currentUserName={userDisplayName}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.joinButton]}
          onPress={() => setShowJoinModal(true)}
        >
          <Text style={styles.actionButtonText} numberOfLines={1} adjustsFontSizeToFit={true}>Join Game</Text>
        </TouchableOpacity>
      </View>

      {/* Active Games Section */}
      <Text style={styles.sectionTitle}>My Active Games ({activeGames.length})</Text>
      <FlatList
        data={activeGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const createdDate = new Date(item.created_at).toLocaleDateString();
          const isSelected = selectedGameId === item.id;
          return (
            <TouchableOpacity
              style={[styles.gameCard, isSelected && styles.selectedCard]}
              onPress={() => onGameSelect(item.id)}
            >
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>
                  <Text style={styles.gameNameLabel}>Game code: </Text>
                  <Text style={styles.gameCode}>{item.join_code || '------'}</Text>
                </Text>
                {isSelected && <Text style={styles.selectedBadge}>Selected</Text>}
                <View style={styles.gameDetails}>
                  <Text style={styles.gameDetailText}>📅 {createdDate}</Text>
                  <Text style={styles.gameDetailText}>👥 {(item as any).player_count || 0} players</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No active games. Create or join one!</Text>
        }
        style={styles.gamesList}
      />

      {/* Active Friend Games Section */}
      <Text style={styles.sectionTitle}>Live Matches with Recent Players ({sortedJoinableGames.length})</Text>
      <FlatList
        data={sortedJoinableGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.gameCard, styles.joinableGameCard]}
            onPress={() => handleJoinFriendGame(item)}
          >
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>
                  <Text style={styles.gameNameLabel}>Game code: </Text>
                  <Text style={styles.gameCode}>{item.join_code}</Text>
                </Text>
              <View style={styles.gameDetails}>
                <Text style={styles.gameDetailText}>Creator: {item.creator_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        style={styles.gamesListSmall}
        ListEmptyComponent={
          <Text style={styles.emptyTextSmall}>None available</Text>
        }
      />

      {/* Completed Games Section */}
      <Text style={styles.sectionTitle}>My Completed Games ({completedGames.length})</Text>
      <FlatList
        data={completedGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const createdDate = new Date(item.created_at).toLocaleDateString();
          const winnerName = (item as any).winner_name;
          return (
            <TouchableOpacity
              style={[styles.gameCard, styles.completedCard]}
              onPress={() => onGameSelect(item.id)}
            >
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>
                  <Text style={styles.gameNameLabel}>Game code: </Text>
                  <Text style={styles.gameCode}>{item.join_code}</Text>
                </Text>
                <View style={styles.gameDetails}>
                  <Text style={styles.gameDetailText}>📅 {createdDate}</Text>
                  <Text style={styles.gameDetailText}>👥 {(item as any).player_count || 0} players</Text>
                  {winnerName && (
                    <Text style={styles.gameDetailText}>🏆 {winnerName}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No completed games yet</Text>
        }
        style={styles.gamesListCompact}
      />

      {/* Join Game Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Game</Text>
            <Text style={styles.modalHelperText}>
              Enter the game code to join an existing game
            </Text>

            <TextInput
              style={styles.input}
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="Enter game code"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
            />

            <TouchableOpacity
              style={styles.modalJoinButton}
              onPress={handleJoinByCode}
            >
              <Text style={styles.modalJoinButtonText}>Join Game</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setShowJoinModal(false);
                setJoinCode('');
              }}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    header: {},
    headerLogo: {},
    headerSpacer: {},
    profileButton: {},
    profileButtonText: {},
    buttonRow: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    createButton: {
      backgroundColor: colors.accent,
    },
    joinButton: {
      backgroundColor: colors.success,
    },
    actionButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 6,
      marginLeft: 6,
    },
    gamesList: {
      flexGrow: 0,
      flexShrink: 0,
      minHeight: 160,
      maxHeight: 180,
      marginBottom: 14,
      paddingLeft: 6,
    },
    gamesListSmall: {
      flexGrow: 0,
      flexShrink: 0,
      minHeight: 60,
      maxHeight: 90,
      marginBottom: 14,
      paddingLeft: 6,
    },
    gamesListCompact: {
      flexGrow: 1,
      flexShrink: 1,
      marginBottom: 14,
      paddingLeft: 6,
    },
    gameCard: {
      backgroundColor: colors.surface,
      padding: 8,
      paddingVertical: 6,
      borderRadius: 8,
      marginBottom: 4,
      position: 'relative',
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    joinableGameCard: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 2,
      borderColor: colors.success,
    },
    selectedCard: {
      borderColor: colors.success,
      borderWidth: 2,
      backgroundColor: 'rgba(76, 175, 80, 0.18)', // light green highlight for selection
    },
    selectedBadge: {
      position: 'absolute',
      right: 0,
      top: 0,
      color: colors.textPrimary,
      fontWeight: '700',
      fontSize: 12,
    },
    completedCard: {
      backgroundColor: colors.surfaceSecondary,
      opacity: 0.9,
    },
    gameInfo: {
      flex: 1,
    },
    gameName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    gameNameLabel: {
      fontWeight: '600',
    },
    gameCode: {
      fontWeight: '400',
      color: colors.textPrimary,
    },
    gameDetails: {
      flexDirection: 'row',
      gap: 15,
    },
    gameDetailText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    emptyText: {
      textAlign: 'left',
      color: colors.textSecondary,
      marginTop: 16,
      marginLeft: 6,
      fontSize: 16,
    },
    emptyTextSmall: {
      textAlign: 'left',
      color: colors.textSecondary,
      marginTop: 8,
      marginLeft: 6,
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      width: '85%',
      maxWidth: 400,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    modalHelperText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.inputText,
      marginBottom: 16,
    },
    modalJoinButton: {
      backgroundColor: colors.success,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 10,
    },
    modalJoinButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    modalCancelButton: {
      backgroundColor: colors.buttonSecondary,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCancelButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
