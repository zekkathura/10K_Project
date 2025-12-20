import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, RefreshControl } from 'react-native';
import { ThemedLoader } from '../components';
import { supabase } from '../lib/supabase';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';

interface GameStatsScreenProps {
  navigation: { goBack: () => void };
  onOpenProfile?: () => void;
}

interface GameDetail {
  gameId: string;
  joinCode: string;
  score: number;
  date: string;
}

interface BestTurnDetail {
  gameId: string;
  joinCode: string;
  turnNumber: number;
  score: number;
  date: string;
}

interface UserStats {
  totalGames: number;
  wins: number;
  bestScore: number;
  bestScoreGame: GameDetail | null;
  averageScore: number;
  averageScorePerRound: number;
  bestTurn: number;
  bestTurnDetail: BestTurnDetail | null;
  completedGames: GameDetail[];
  longestBustStreak: number;
}

interface OverallStats {
  totalGames: number;
  averagePlayersPerGame: number;
  averageRoundsPerGame: number;
  highScore: number;
  highScorePlayer: string;
  lowScore: number;
  lowScorePlayer: string;
  averageScorePerRound: number;
  mostActivePlayers: { name: string; games: number; avgScore: number }[];
  longestBustStreak: number;
  longestBustStreakPlayer: string;
}

const formatNumber = (value: number) => {
  if (Number.isNaN(value)) return '0';
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1);
};

const getPlayerLabel = (player: any) => {
  return player?.user?.display_name || player?.player_name || 'Unknown';
};

type PlayerSortMode = 'games' | 'avgScore';
type DetailModal = 'bestScore' | 'bestTurn' | 'avgScore' | null;

export default function GameStatsScreen({ navigation, onOpenProfile }: GameStatsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerSortMode, setPlayerSortMode] = useState<PlayerSortMode>('games');
  const [activeModal, setActiveModal] = useState<DetailModal>(null);
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();

  const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtext ? <Text style={styles.statSubtext}>{subtext}</Text> : null}
    </View>
  );

  const HighlightStatCard = ({ label, value, subtext, variant = 'accent' }: {
    label: string;
    value: string | number;
    subtext?: string;
    variant?: 'accent' | 'success' | 'warning';
  }) => (
    <View style={[styles.statCard, styles.highlightStatCard, styles[`highlight${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles]]}>
      <Text style={[styles.statValue, styles.highlightStatValue]}>{value}</Text>
      <Text style={[styles.statLabel, styles.highlightStatLabel]}>{label}</Text>
      {subtext ? <Text style={[styles.statSubtext, styles.highlightStatSubtext]}>{subtext}</Text> : null}
    </View>
  );

  const ClickableStatCard = ({
    label,
    value,
    subtext,
    onPress,
    disabled,
    highlight
  }: {
    label: string;
    value: string | number;
    subtext?: string;
    onPress: () => void;
    disabled?: boolean;
    highlight?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.statCard,
        styles.clickableStatCard,
        highlight && styles.highlightStatCard,
        highlight && styles.highlightAccent,
        disabled && styles.clickableStatCardDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.statCardHeader}>
        <Text style={[styles.statValue, highlight && styles.highlightStatValue]}>{value}</Text>
        {!disabled && <Text style={[styles.clickableIndicator, highlight && styles.highlightClickableIndicator]}>View ›</Text>}
      </View>
      <Text style={[styles.statLabel, highlight && styles.highlightStatLabel]}>{label}</Text>
      {subtext ? <Text style={[styles.statSubtext, highlight && styles.highlightStatSubtext]}>{subtext}</Text> : null}
    </TouchableOpacity>
  );

  // Sort players based on selected mode
  const sortedPlayers = useMemo(() => {
    if (!overallStats?.mostActivePlayers) return [];
    const players = [...overallStats.mostActivePlayers];
    if (playerSortMode === 'avgScore') {
      return players.sort((a, b) => b.avgScore - a.avgScore);
    }
    return players.sort((a, b) => b.games - a.games);
  }, [overallStats?.mostActivePlayers, playerSortMode]);

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, []);

  const loadStats = async () => {
    if (!refreshing) {
      setLoading(true);
    }
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
      // Note: Must specify FK explicitly due to multiple relationships between game_players and games
      const { data: myGamePlayers } = await supabase
        .from('game_players')
        .select(`
          id,
          game_id,
          total_score,
          game:games!game_players_game_id_fkey(id, status, created_at, finished_at, join_code)
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

      // All turns for the current user (across games) - include turn info for best turn detail and bust streaks
      const { data: myTurns } = playerIds.length > 0
        ? await supabase
            .from('turns')
            .select(`
              score,
              is_bust,
              player_id,
              turn_number,
              game_id
            `)
            .in('player_id', playerIds)
            .order('game_id')
            .order('turn_number')
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

      // Find best score and its game details
      let bestScore = 0;
      let bestScoreGame: GameDetail | null = null;
      userEntries.forEach(entry => {
        if ((entry.total_score || 0) > bestScore) {
          bestScore = entry.total_score || 0;
          if (entry.game) {
            bestScoreGame = {
              gameId: entry.game.id,
              joinCode: entry.game.join_code || '------',
              score: entry.total_score || 0,
              date: new Date(entry.game.created_at).toLocaleDateString(),
            };
          }
        }
      });

      const averageScore = completedGames > 0
        ? userEntries
            .filter(entry => entry.game?.status === 'ended')
            .reduce((sum, entry) => sum + (entry.total_score || 0), 0) / completedGames
        : 0;

      // Find best turn and its details
      let bestTurn = 0;
      let bestTurnPlayerId: string | null = null;
      let bestTurnRound = 0;
      (myTurns || [])
        .filter(turn => !turn.is_bust)
        .forEach(turn => {
          if ((turn.score || 0) > bestTurn) {
            bestTurn = turn.score || 0;
            bestTurnPlayerId = turn.player_id;
            bestTurnRound = turn.turn_number || 0;
          }
        });

      // Get game details for best turn
      let bestTurnDetail: BestTurnDetail | null = null;
      if (bestTurnPlayerId) {
        // Find the game_player entry to get game details
        const bestTurnEntry = userEntries.find(e => e.id === bestTurnPlayerId);
        if (bestTurnEntry?.game) {
          bestTurnDetail = {
            gameId: bestTurnEntry.game.id,
            joinCode: bestTurnEntry.game.join_code || '------',
            turnNumber: bestTurnRound,
            score: bestTurn,
            date: new Date(bestTurnEntry.game.created_at).toLocaleDateString(),
          };
        }
      }

      // Build completed games list for avg score popup
      const completedGamesList: GameDetail[] = userEntries
        .filter(entry => entry.game?.status === 'ended')
        .map(entry => ({
          gameId: entry.game?.id || entry.game_id,
          joinCode: entry.game?.join_code || '------',
          score: entry.total_score || 0,
          date: new Date(entry.game?.created_at || '').toLocaleDateString(),
        }))
        .sort((a, b) => b.score - a.score);

      // Calculate average score per turn (busts count as 0)
      const totalTurns = myTurns?.length || 0;
      const totalTurnScoreSum = (myTurns || []).reduce((sum, turn) => {
        // Bust turns count as 0, non-bust turns use their score
        return sum + (turn.is_bust ? 0 : (turn.score || 0));
      }, 0);
      const averageScorePerRound = totalTurns > 0 ? totalTurnScoreSum / totalTurns : 0;

      // Calculate longest bust streak (within a single game)
      let longestBustStreak = 0;
      if (myTurns && myTurns.length > 0) {
        // Group turns by game_id
        const turnsByGame: Record<string, any[]> = {};
        myTurns.forEach(turn => {
          if (!turnsByGame[turn.game_id]) {
            turnsByGame[turn.game_id] = [];
          }
          turnsByGame[turn.game_id].push(turn);
        });

        // Find longest bust streak in each game
        Object.values(turnsByGame).forEach(gameTurns => {
          // Sort by turn_number to ensure correct order
          gameTurns.sort((a, b) => (a.turn_number || 0) - (b.turn_number || 0));
          let currentStreak = 0;
          gameTurns.forEach(turn => {
            if (turn.is_bust) {
              currentStreak++;
              longestBustStreak = Math.max(longestBustStreak, currentStreak);
            } else {
              currentStreak = 0;
            }
          });
        });
      }

      setUserStats({
        totalGames,
        wins,
        bestScore,
        bestScoreGame,
        averageScore,
        averageScorePerRound,
        bestTurn,
        bestTurnDetail,
        completedGames: completedGamesList,
        longestBustStreak,
      });

      // Overall stats across all players/games
      const { data: allGames } = await supabase
        .from('games')
        .select('id, status, total_rounds');

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

      // Get all turns for average rounds per game, average score per round, and bust streaks
      const { data: allTurns } = await supabase
        .from('turns')
        .select('id, game_id, player_id, turn_number, score, is_bust')
        .order('game_id')
        .order('player_id')
        .order('turn_number');

      const gamesList = allGames || [];
      const playersList = allGamePlayers || [];
      const turnsList = allTurns || [];
      const endedGameSet = new Set(gamesList.filter(game => game.status === 'ended').map(game => game.id));

      const totalGamesTracked = gamesList.length;
      const averagePlayersPerGame = totalGamesTracked > 0 ? playersList.length / totalGamesTracked : 0;

      // Calculate average rounds per game from total_rounds field (the actual game rounds, not turn entries)
      const gamesWithRounds = gamesList.filter(g => g.total_rounds && g.total_rounds > 0);
      const totalRoundsSum = gamesWithRounds.reduce((sum, g) => sum + (g.total_rounds || 0), 0);
      const averageRoundsPerGame = gamesWithRounds.length > 0 ? totalRoundsSum / gamesWithRounds.length : 0;

      // Calculate average score per turn across all players (busts count as 0)
      const allTurnScores = turnsList.reduce((sum, turn) => {
        // Bust turns count as 0, non-bust turns use their score
        return sum + (turn.is_bust ? 0 : (turn.score || 0));
      }, 0);
      const overallAvgScorePerRound = turnsList.length > 0 ? allTurnScores / turnsList.length : 0;

      // Find high score (from completed games)
      const highScoreEntry = playersList
        .filter(player => endedGameSet.has(player.game_id))
        .reduce((top, player) => {
          if (!top || (player.total_score || 0) > (top.total_score || 0)) {
            return player;
          }
          return top;
        }, null as any);

      // Find low score (from completed games, must have a score > 0)
      const lowScoreEntry = playersList
        .filter(player => endedGameSet.has(player.game_id) && (player.total_score || 0) > 0)
        .reduce((lowest, player) => {
          if (!lowest || (player.total_score || 0) < (lowest.total_score || Infinity)) {
            return player;
          }
          return lowest;
        }, null as any);

      // Track player activity with total scores for average calculation
      const playerActivity: Record<string, { name: string; games: number; totalScore: number }> = {};
      playersList.forEach((player) => {
        const key = player.user_id || `guest-${player.player_name}`;
        const displayName = getPlayerLabel(player);
        if (!playerActivity[key]) {
          playerActivity[key] = { name: displayName, games: 0, totalScore: 0 };
        }
        playerActivity[key].games += 1;
        // Only count scores from completed games
        if (endedGameSet.has(player.game_id)) {
          playerActivity[key].totalScore += player.total_score || 0;
        }
      });

      const mostActivePlayers = Object.values(playerActivity)
        .sort((a, b) => b.games - a.games)
        .slice(0, 20)
        .map(p => ({
          name: p.name,
          games: p.games,
          avgScore: p.games > 0 ? Math.round(p.totalScore / p.games) : 0,
        }));

      // Calculate overall longest bust streak (across all players, within single games)
      let overallLongestBustStreak = 0;
      let overallLongestBustStreakPlayerId: string | null = null;
      if (turnsList.length > 0) {
        // Group turns by game_id + player_id (each player's turns in each game)
        const turnsByGamePlayer: Record<string, any[]> = {};
        turnsList.forEach(turn => {
          const key = `${turn.game_id}-${turn.player_id}`;
          if (!turnsByGamePlayer[key]) {
            turnsByGamePlayer[key] = [];
          }
          turnsByGamePlayer[key].push(turn);
        });

        // Find longest bust streak across all game-player combinations
        Object.entries(turnsByGamePlayer).forEach(([key, playerTurns]) => {
          playerTurns.sort((a, b) => (a.turn_number || 0) - (b.turn_number || 0));
          let currentStreak = 0;
          playerTurns.forEach(turn => {
            if (turn.is_bust) {
              currentStreak++;
              if (currentStreak > overallLongestBustStreak) {
                overallLongestBustStreak = currentStreak;
                overallLongestBustStreakPlayerId = turn.player_id;
              }
            } else {
              currentStreak = 0;
            }
          });
        });
      }

      // Look up the player name for longest bust streak
      const bustStreakPlayer = overallLongestBustStreakPlayerId
        ? playersList.find(p => p.id === overallLongestBustStreakPlayerId)
        : null;
      const bustStreakPlayerName = bustStreakPlayer ? getPlayerLabel(bustStreakPlayer) : '—';

      setOverallStats({
        totalGames: totalGamesTracked,
        averagePlayersPerGame,
        averageRoundsPerGame,
        highScore: highScoreEntry?.total_score || 0,
        highScorePlayer: highScoreEntry ? getPlayerLabel(highScoreEntry) : '—',
        lowScore: lowScoreEntry?.total_score || 0,
        lowScorePlayer: lowScoreEntry ? getPlayerLabel(lowScoreEntry) : '—',
        averageScorePerRound: overallAvgScorePerRound,
        mostActivePlayers,
        longestBustStreak: overallLongestBustStreak,
        longestBustStreakPlayer: bustStreakPlayerName,
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
        <ThemedLoader text="Crunching the numbers..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Stats</Text>
          {userStats ? (
            <View style={styles.masonryContainer}>
              <View style={styles.masonryColumn}>
                <HighlightStatCard
                  label="Wins"
                  value={userStats.totalGames > 0 ? `${userStats.wins}` : '0'}
                  subtext={userStats.totalGames > 0 ? `${Math.round((userStats.wins / userStats.totalGames) * 100)}% win rate` : undefined}
                  variant="success"
                />
                <ClickableStatCard
                  label="Best Score"
                  value={userStats.bestScore}
                  onPress={() => setActiveModal('bestScore')}
                  disabled={!userStats.bestScoreGame}
                  highlight
                />
                <StatCard label="Avg. Score/Round" value={Math.round(userStats.averageScorePerRound)} />
              </View>
              <View style={styles.masonryColumn}>
                <StatCard label="Games Played" value={userStats.totalGames} />
                <ClickableStatCard
                  label="Avg. Score"
                  value={Math.round(userStats.averageScore)}
                  onPress={() => setActiveModal('avgScore')}
                  disabled={userStats.completedGames.length === 0}
                />
                <ClickableStatCard
                  label="Best Turn"
                  value={userStats.bestTurn}
                  onPress={() => setActiveModal('bestTurn')}
                  disabled={!userStats.bestTurnDetail}
                />
                <StatCard label="Bust Streak" value={userStats.longestBustStreak} subtext="Longest" />
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No personal stats yet.</Text>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Overall</Text>
          {overallStats ? (
            <>
              <View style={styles.masonryContainer}>
                <View style={styles.masonryColumn}>
                  <HighlightStatCard
                    label="High Score"
                    value={overallStats.highScore}
                    subtext={`By ${overallStats.highScorePlayer}`}
                    variant="accent"
                  />
                  <StatCard label="Total Games" value={overallStats.totalGames} />
                  <StatCard
                    label="Avg Rounds/Game"
                    value={Math.round(overallStats.averageRoundsPerGame)}
                  />
                </View>
                <View style={styles.masonryColumn}>
                  <StatCard
                    label="Avg Players/Game"
                    value={formatNumber(overallStats.averagePlayersPerGame)}
                  />
                  <StatCard
                    label="Avg Turn Score"
                    value={Math.round(overallStats.averageScorePerRound)}
                  />
                  <StatCard
                    label="Bust Streak"
                    value={overallStats.longestBustStreak}
                    subtext={overallStats.longestBustStreak > 0 ? `By ${overallStats.longestBustStreakPlayer}` : undefined}
                  />
                </View>
              </View>

              <View style={styles.listCard}>
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Leaderboard</Text>
                  <View style={styles.sortToggle}>
                    <TouchableOpacity
                      style={[styles.sortButton, playerSortMode === 'games' && styles.sortButtonActive]}
                      onPress={() => setPlayerSortMode('games')}
                    >
                      <Text style={[styles.sortButtonText, playerSortMode === 'games' && styles.sortButtonTextActive]}>
                        By Games
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.sortButton, playerSortMode === 'avgScore' && styles.sortButtonActive]}
                      onPress={() => setPlayerSortMode('avgScore')}
                    >
                      <Text style={[styles.sortButtonText, playerSortMode === 'avgScore' && styles.sortButtonTextActive]}>
                        By Score
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              {sortedPlayers.length === 0 ? (
                <Text style={styles.emptyText}>No data yet.</Text>
              ) : (
                <ScrollView style={styles.playersList} nestedScrollEnabled>
                  {sortedPlayers.map((player, index) => (
                    <View key={player.name + index} style={styles.listRow}>
                      <Text style={styles.listRank}>{index + 1}</Text>
                      <View style={styles.listContent}>
                        <Text style={styles.listName}>{player.name}</Text>
                        <Text style={styles.listSubtext}>{player.games} games</Text>
                      </View>
                      <Text style={styles.listAvgScore}>{player.avgScore}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>Overall stats will show up once games are played.</Text>
        )}
        </View>
      </ScrollView>

      {/* Best Score Detail Modal */}
      <Modal
        visible={activeModal === 'bestScore'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Best Score</Text>
            {userStats?.bestScoreGame && (
              <View style={styles.modalGameCard}>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Game Code:</Text>
                  <Text style={styles.modalGameValue}>{userStats.bestScoreGame.joinCode}</Text>
                </View>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Score:</Text>
                  <Text style={styles.modalGameValueHighlight}>{userStats.bestScoreGame.score}</Text>
                </View>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Date:</Text>
                  <Text style={styles.modalGameValue}>{userStats.bestScoreGame.date}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Best Turn Detail Modal */}
      <Modal
        visible={activeModal === 'bestTurn'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Best Turn</Text>
            {userStats?.bestTurnDetail && (
              <View style={styles.modalGameCard}>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Score:</Text>
                  <Text style={styles.modalGameValueHighlight}>{userStats.bestTurnDetail.score}</Text>
                </View>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Round:</Text>
                  <Text style={styles.modalGameValue}>{userStats.bestTurnDetail.turnNumber}</Text>
                </View>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Game Code:</Text>
                  <Text style={styles.modalGameValue}>{userStats.bestTurnDetail.joinCode}</Text>
                </View>
                <View style={styles.modalGameRow}>
                  <Text style={styles.modalGameLabel}>Date:</Text>
                  <Text style={styles.modalGameValue}>{userStats.bestTurnDetail.date}</Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avg Score Games List Modal */}
      <Modal
        visible={activeModal === 'avgScore'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Completed Games</Text>
            <Text style={styles.modalSubtitle}>
              Average: {Math.round(userStats?.averageScore || 0)} points across {userStats?.completedGames.length || 0} games
            </Text>
            <ScrollView style={styles.modalGamesList}>
              {userStats?.completedGames.map((game, index) => (
                <View key={game.gameId + index} style={styles.modalGamesListRow}>
                  <View style={styles.modalGamesListInfo}>
                    <Text style={styles.modalGamesListCode}>{game.joinCode}</Text>
                    <Text style={styles.modalGamesListDate}>{game.date}</Text>
                  </View>
                  <Text style={styles.modalGamesListScore}>{game.score}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
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
      paddingHorizontal: 20,
      paddingTop: 0,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    sectionContainer: {
      marginBottom: 8,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
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
    masonryContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    masonryColumn: {
      flex: 1,
      gap: 12,
    },
    statCard: {
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
    // Highlight stat card styles
    highlightStatCard: {
      borderWidth: 2,
    },
    highlightAccent: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    highlightSuccess: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    highlightWarning: {
      backgroundColor: colors.warning || colors.accent,
      borderColor: colors.warning || colors.accent,
    },
    highlightStatValue: {
      color: colors.buttonText,
      fontSize: 26,
    },
    highlightStatLabel: {
      color: colors.buttonText,
      opacity: 0.9,
    },
    highlightStatSubtext: {
      color: colors.buttonText,
      opacity: 0.8,
    },
    highlightClickableIndicator: {
      color: colors.buttonText,
      opacity: 0.8,
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
    listHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    sortToggle: {
      flexDirection: 'row',
      gap: 8,
    },
    sortButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.surfaceSecondary,
    },
    sortButtonActive: {
      backgroundColor: colors.accent,
    },
    sortButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    sortButtonTextActive: {
      color: colors.buttonText,
    },
    playersList: {
      maxHeight: 300,
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
    listAvgScore: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      minWidth: 50,
      textAlign: 'right',
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
    // Clickable stat card styles
    clickableStatCard: {
      borderColor: colors.accent,
      borderWidth: 1.5,
    },
    clickableStatCardDisabled: {
      borderColor: colors.border,
      borderWidth: 1,
      opacity: 0.7,
    },
    statCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    clickableIndicator: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.accent,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 340,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalContentLarge: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      maxHeight: '70%',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalGameCard: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
    },
    modalGameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    modalGameLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    modalGameValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    modalGameValueHighlight: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.accent,
    },
    modalGamesList: {
      maxHeight: 300,
      marginBottom: 16,
    },
    modalGamesListRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    modalGamesListInfo: {
      flex: 1,
    },
    modalGamesListCode: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    modalGamesListDate: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modalGamesListScore: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.accent,
      minWidth: 60,
      textAlign: 'right',
    },
    modalCloseButton: {
      backgroundColor: colors.buttonSecondary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalCloseButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
