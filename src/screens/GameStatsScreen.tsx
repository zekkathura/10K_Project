import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../lib/supabase';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';

interface GameStatsScreenProps {
  navigation: { goBack: () => void };
  onOpenProfile?: () => void;
}

interface UserStats {
  totalGames: number;
  activeGames: number;
  completedGames: number;
  wins: number;
  averageScore: number;
  bestScore: number;
  averageTurnsPerGame: number;
  bestTurn: number;
}

interface OverallStats {
  totalGames: number;
  activeGames: number;
  completedGames: number;
  totalPlayers: number;
  averagePlayersPerGame: number;
  topScore: number;
  topScorePlayer: string;
  mostActivePlayers: { name: string; games: number }[];
}

const formatNumber = (value: number) => {
  if (Number.isNaN(value)) return '0';
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
};

const getPlayerLabel = (player: any) => {
  return player?.user?.display_name || player?.player_name || 'Unknown';
};

export default function GameStatsScreen({ navigation, onOpenProfile }: GameStatsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtext ? <Text style={styles.statSubtext}>{subtext}</Text> : null}
    </View>
  );

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        setError('Unable to load user.');
        setLoading(false);
        return;
      }

      // Pull the user's games and related data
      const { data: myGamePlayers } = await supabase
        .from('game_players')
        .select(`
          id,
          game_id,
          total_score,
          game:games(status, created_at, finished_at)
        `)
        .eq('user_id', userId);

      const userEntries = myGamePlayers || [];
      const totalGames = userEntries.length;
      const activeGames = userEntries.filter(entry => entry.game?.status === 'active').length;
      const completedGames = userEntries.filter(entry => entry.game?.status === 'ended').length;
      const endedGameIds = userEntries.filter(entry => entry.game?.status === 'ended').map(entry => entry.game_id);
      const playerIds = userEntries.map(entry => entry.id);

      // All players for ended games (used to figure out wins)
      const { data: endedGamePlayers } = endedGameIds.length > 0
        ? await supabase
            .from('game_players')
            .select('game_id, total_score')
            .in('game_id', endedGameIds)
        : { data: [] as any[] };

      // All turns for the current user (across games)
      const { data: myTurns } = playerIds.length > 0
        ? await supabase
            .from('turns')
            .select('score, is_bust, player_id')
            .in('player_id', playerIds)
        : { data: [] as any[] };

      // Compute wins by checking for highest score per completed game
      let wins = 0;
      if (endedGamePlayers && endedGamePlayers.length > 0) {
        const grouped: Record<string, number> = {};
        endedGamePlayers.forEach((player) => {
          if (!grouped[player.game_id]) {
            grouped[player.game_id] = player.total_score || 0;
          } else {
            grouped[player.game_id] = Math.max(grouped[player.game_id], player.total_score || 0);
          }
        });

        userEntries.forEach((entry) => {
          if (entry.game?.status === 'ended') {
            const topScore = grouped[entry.game_id] || 0;
            if ((entry.total_score || 0) >= topScore && topScore > 0) {
              wins += 1;
            }
          }
        });
      }

      const bestScore = userEntries.reduce((max, entry) => Math.max(max, entry.total_score || 0), 0);
      const averageScore = completedGames > 0
        ? userEntries
            .filter(entry => entry.game?.status === 'ended')
            .reduce((sum, entry) => sum + (entry.total_score || 0), 0) / completedGames
        : 0;

      const bestTurn = (myTurns || [])
        .filter(turn => !turn.is_bust)
        .reduce((max, turn) => Math.max(max, turn.score || 0), 0);

      const averageTurnsPerGame = totalGames > 0 ? (myTurns?.length || 0) / totalGames : 0;

      setUserStats({
        totalGames,
        activeGames,
        completedGames,
        wins,
        averageScore,
        bestScore,
        averageTurnsPerGame,
        bestTurn,
      });

      // Overall stats across all players/games
      const { data: allGames } = await supabase
        .from('games')
        .select('id, status');

      const { data: allGamePlayers } = await supabase
        .from('game_players')
        .select(`
          id,
          game_id,
          user_id,
          player_name,
          total_score,
          user:profiles(display_name)
        `);

      const gamesList = allGames || [];
      const playersList = allGamePlayers || [];
      const endedGameSet = new Set(gamesList.filter(game => game.status === 'ended').map(game => game.id));

      const totalGamesTracked = gamesList.length;
      const activeGamesTracked = gamesList.filter(game => game.status === 'active').length;
      const completedGamesTracked = gamesList.filter(game => game.status === 'ended').length;
      const totalPlayers = playersList.length;
      const averagePlayersPerGame = totalGamesTracked > 0 ? totalPlayers / totalGamesTracked : 0;

      const topScoreEntry = playersList
        .filter(player => endedGameSet.has(player.game_id))
        .reduce((top, player) => {
          if (!top || (player.total_score || 0) > (top.total_score || 0)) {
            return player;
          }
          return top;
        }, null as any);

      const playerActivity: Record<string, { name: string; games: number }> = {};
      playersList.forEach((player) => {
        const key = player.user_id || `guest-${player.player_name}`;
        const displayName = getPlayerLabel(player);
        if (!playerActivity[key]) {
          playerActivity[key] = { name: displayName, games: 0 };
        }
        playerActivity[key].games += 1;
      });

      const mostActivePlayers = Object.values(playerActivity)
        .sort((a, b) => b.games - a.games)
        .slice(0, 3);

      setOverallStats({
        totalGames: totalGamesTracked,
        activeGames: activeGamesTracked,
        completedGames: completedGamesTracked,
        totalPlayers,
        averagePlayersPerGame,
        topScore: topScoreEntry?.total_score || 0,
        topScorePlayer: topScoreEntry ? getPlayerLabel(topScoreEntry) : '—',
        mostActivePlayers,
      });
    } catch (err) {
      console.error('Error loading stats', err);
      setError('Failed to load game stats.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Crunching the numbers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>My Stats</Text>
        {userStats ? (
          <View style={styles.cardGrid}>
            <StatCard label="Games Played" value={userStats.totalGames} />
            <StatCard label="Active Games" value={userStats.activeGames} />
            <StatCard label="Completed Games" value={userStats.completedGames} />
            <StatCard label="Wins" value={userStats.wins} />
            <StatCard label="Best Score" value={userStats.bestScore} />
            <StatCard label="Avg. Score" value={formatNumber(userStats.averageScore)} />
            <StatCard label="Avg. Turns/Game" value={formatNumber(userStats.averageTurnsPerGame)} />
            <StatCard label="Best Turn" value={userStats.bestTurn} subtext="Highest single non-bust turn" />
          </View>
        ) : (
          <Text style={styles.emptyText}>No personal stats yet.</Text>
        )}

        <Text style={styles.sectionTitle}>Overall</Text>
        {overallStats ? (
          <>
            <View style={styles.cardGrid}>
              <StatCard label="Total Games" value={overallStats.totalGames} />
              <StatCard label="Active Games" value={overallStats.activeGames} />
              <StatCard label="Completed" value={overallStats.completedGames} />
              <StatCard
                label="Avg Players/Game"
                value={formatNumber(overallStats.averagePlayersPerGame)}
              />
              <StatCard label="Total Players" value={overallStats.totalPlayers} />
              <StatCard
                label="Top Score"
                value={overallStats.topScore}
                subtext={`By ${overallStats.topScorePlayer}`}
              />
            </View>

            <View style={styles.listCard}>
              <Text style={styles.listTitle}>Most Active Players</Text>
              {overallStats.mostActivePlayers.length === 0 ? (
                <Text style={styles.emptyText}>No data yet.</Text>
              ) : (
                overallStats.mostActivePlayers.map((player, index) => (
                  <View key={player.name + index} style={styles.listRow}>
                    <Text style={styles.listRank}>{index + 1}</Text>
                    <View style={styles.listContent}>
                      <Text style={styles.listName}>{player.name}</Text>
                      <Text style={styles.listSubtext}>{player.games} games</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Overall stats will show up once games are played.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 0,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 10,
      marginBottom: 10,
    },
    cardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      backgroundColor: colors.surface,
      width: '48%',
      borderRadius: 10,
      padding: 14,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    statLabel: {
      marginTop: 4,
      fontSize: 14,
      color: colors.textSecondary,
    },
    statSubtext: {
      marginTop: 6,
      fontSize: 12,
      color: colors.textTertiary,
    },
    listCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 14,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 10,
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    listRank: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.accent,
      width: 24,
    },
    listContent: {
      marginLeft: 10,
      flex: 1,
    },
    listName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    listSubtext: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginVertical: 12,
      fontSize: 14,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary,
      fontSize: 15,
    },
    errorText: {
      color: colors.error,
      marginBottom: 8,
      fontSize: 14,
      textAlign: 'center',
    },
  });
