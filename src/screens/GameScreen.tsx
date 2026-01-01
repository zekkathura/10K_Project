import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedLoader, useThemedAlert } from '../components';
import { supabase } from '../lib/supabase';
import {
  getGamePlayers,
  getGameTurns,
  addTurn,
  updateTurn,
  deleteRound,
  deleteTurn,
  removePlayer,
  addGuestPlayer,
  deleteGame,
  finishGame,
  reopenGame,
  updatePlayerName,
  updatePlayerOrder,
  updateGameRounds,
} from '../lib/database';
import { GamePlayer, Turn, Game } from '../lib/types';
import { Theme, useTheme } from '../lib/theme';
import { logger } from '../lib/logger';
import GameSettingsModal from './GameSettingsModal';
import { RealtimeChannel } from '@supabase/supabase-js';

interface GameScreenProps {
  gameId: string;
  onBack: () => void;
  onGameRemoved?: () => void;
}

type CellAction = 'score' | 'edit' | 'delete';

const DEFAULT_ROWS = 10;
const MIN_ROUNDS = 5;
const MAX_ROUNDS = 30;

// Cache game data at module level to persist across navigations (keyed by gameId)
interface GameCache {
  players: GamePlayer[];
  turns: Turn[];
  game: Game | null;
  totalRows: number;
  userId: string | null;
}
const gameCache = new Map<string, GameCache>();

function getCachedGame(gameId: string): GameCache | null {
  return gameCache.get(gameId) || null;
}

function setCachedGame(gameId: string, data: GameCache): void {
  gameCache.set(gameId, data);
}

function getDisplayName(player: GamePlayer) {
  return player.player_name || 'Player';
}

const GameScreen = forwardRef(({ gameId, onBack, onGameRemoved }: GameScreenProps, ref) => {
  // Initialize from cache if available for this game
  const cached = getCachedGame(gameId);
  const [players, setPlayers] = useState<GamePlayer[]>(cached?.players || []);
  const [turns, setTurns] = useState<Turn[]>(cached?.turns || []);
  const [game, setGame] = useState<Game | null>(cached?.game || null);
  const [loading, setLoading] = useState(cached === null); // Only show loading if no cache
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null);
  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [isBust, setIsBust] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [totalRows, setTotalRows] = useState(cached?.totalRows ?? DEFAULT_ROWS);
  const [fontScale, setFontScale] = useState(1);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamePlayer, setRenamePlayer] = useState<GamePlayer | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(cached?.userId || null);
  const [loadedOnce, setLoadedOnce] = useState(cached !== null); // Already loaded if cached
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);
  const broadcastChannelRef = useRef<RealtimeChannel | null>(null);

  const { theme } = useTheme();
  const alert = useThemedAlert();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;

  useImperativeHandle(ref, () => ({
    openMenu: () => setShowSettingsModal(true),
  }));

  useEffect(() => {
    // Only reset to default if no cache exists for this game
    if (!getCachedGame(gameId)) {
      setTotalRows(DEFAULT_ROWS);
    }
    loadAll();
  }, [gameId]);

  useEffect(() => {
    const available = screenWidth - 20;
    const baseRound = 60;
    const basePlayer = 85;
    const baseWidth = baseRound + players.length * basePlayer;
    if (players.length === 0) {
      setFontScale(1);
      return;
    }
    const minScale = 0.6;
    const computed = Math.min(1, Math.max(minScale, available / baseWidth));
    setFontScale(computed);
  }, [players.length, screenWidth]);

  const loadAll = async () => {
    try {
      // Only show loading spinner if we don't have cached data
      if (!getCachedGame(gameId)) {
        setLoading(true);
      }
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id || null;
      setUserId(currentUserId);
      const [gamePlayers, gameTurns, gameData] = await Promise.all([
        getGamePlayers(gameId),
        getGameTurns(gameId),
        supabase.from('games').select('*').eq('id', gameId).single(),
      ]);
      setPlayers(gamePlayers);
      setTurns(gameTurns);
      let currentTotalRows = DEFAULT_ROWS;
      if (gameData.data) {
        setGame(gameData.data as Game);
        if (typeof (gameData.data as any).total_rounds === 'number') {
          currentTotalRows = (gameData.data as any).total_rounds;
          setTotalRows(currentTotalRows);
        }
      }
      setLoadedOnce(true);

      // Update cache with fresh data
      setCachedGame(gameId, {
        players: gamePlayers,
        turns: gameTurns,
        game: gameData.data as Game | null,
        totalRows: currentTotalRows,
        userId: currentUserId,
      });
    } catch (error) {
      logger.error('Error loading game data', error);
      alert.show({ title: 'Error', message: 'Failed to load game data' });
    } finally {
      setLoading(false);
    }
  };

  const pushGameRefresh = async (reason: string, extra?: { totalRows?: number }): Promise<boolean> => {
    const channel = broadcastChannelRef.current;
    if (!channel) return false;
    try {
      const status = await channel.send({ type: 'broadcast', event: 'game_refresh', payload: { reason, ...extra } });
      if (status === 'ok') return true;
      const fallback = await channel.httpSend('game_refresh', { reason, ...extra });
      if (!fallback.success) {
        logger.warn('Realtime game refresh httpSend failed', fallback);
        return false;
      }
      return true;
    } catch (err) {
      logger.warn('Failed to broadcast game refresh', err);
      return false;
    }
  };

  const rounds = (() => {
    const existing = Array.from(new Set(turns.map((t) => t.turn_number))).sort((a, b) => a - b);
    const last = existing.length > 0 ? existing[existing.length - 1] : 0;
    const target = Math.max(totalRows, last);
    return Array.from({ length: target }, (_, i) => i + 1);
  })();

  const scoreMap = new Map<string, Map<number, Turn>>();
  turns.forEach((t) => {
    if (!scoreMap.has(t.player_id)) scoreMap.set(t.player_id, new Map());
    scoreMap.get(t.player_id)!.set(t.turn_number, t);
  });

  // If current user is no longer in the player list, leave the game
  useEffect(() => {
    if (!userId || !loadedOnce) return;
    if (players.length === 0) return;
    const stillInGame = players.some((p) => p.user_id === userId);
    if (!stillInGame) {
      alert.show({ title: 'You have left the game' });
      onGameRemoved?.();
      onBack();
    }
  }, [players, userId, loadedOnce, onBack, onGameRemoved]);

  const baseRoundColWidth = 60;
  const basePlayerColWidth = 85;
  const baseTableWidth = baseRoundColWidth + players.length * basePlayerColWidth;
  const availableWidth = screenWidth - 20;
  const fitFactor = Math.min(1, availableWidth / (baseTableWidth || availableWidth));
  const roundColWidth = baseRoundColWidth * fitFactor;
  const playerColWidth = basePlayerColWidth * fitFactor;
  const tableWidth = baseTableWidth * fitFactor;
  const containerWidth = availableWidth;
  const adjustedFontScale = fontScale; // let text keep growing; widths shrink to fit
  const cellPadding = Math.max(4, Math.round(8 * fitFactor));
  const modalContentWidth = Math.min(screenWidth * 0.85, 420); // matches modal maxWidth
  const modalInnerPadding = 40; // paddingHorizontal * 2 (20 each side in modalContent)

  // Quick score button sizing - responsive to modal width
  // 5 buttons + 4 gaps (6px each) = 24px of gaps
  const QUICK_BUTTON_COUNT = 5;
  const QUICK_BUTTON_GAP = 6;
  const quickButtonAvailableWidth = modalContentWidth - modalInnerPadding;
  const quickButtonWidth = Math.floor(
    (quickButtonAvailableWidth - (QUICK_BUTTON_COUNT - 1) * QUICK_BUTTON_GAP) / QUICK_BUTTON_COUNT
  );
  // Clamp to reasonable bounds (min 48px for touch target, max 72px to prevent oversized buttons)
  const clampedQuickButtonWidth = Math.max(48, Math.min(72, quickButtonWidth));
  const previewAvailableWidth = Math.max(200, modalContentWidth - modalInnerPadding);
  const previewFitFactor = Math.min(1, previewAvailableWidth / (baseTableWidth || previewAvailableWidth));
  const previewRoundColWidth = baseRoundColWidth * previewFitFactor;
  const previewPlayerColWidth = basePlayerColWidth * previewFitFactor;
  const previewTableWidth = baseTableWidth * previewFitFactor;

  const styles = React.useMemo(
    () => createStyles(theme, adjustedFontScale, roundColWidth, playerColWidth, cellPadding),
    [theme, adjustedFontScale, roundColWidth, playerColWidth, cellPadding],
  );

  const totals = players.reduce<Record<string, number>>((acc, p) => {
    const playerTurns = scoreMap.get(p.id);
    const sum =
      playerTurns?.values
        ? Array.from(playerTurns.values()).reduce((s, t) => (t.is_bust ? s : s + t.score), 0)
        : 0;
    acc[p.id] = sum;
    return acc;
  }, {});

  const previewRounds = rounds.filter((r) => players.some((p) => scoreMap.get(p.id)?.has(r)));
  const eligibleWinners = players.filter((p) => (totals[p.id] ?? 0) >= 10000);
  const parsedScoreInput = parseInt(scoreInput, 10);
  const hasScoreInput = scoreInput.trim().length > 0 && !isNaN(parsedScoreInput);
  const isValidScore = !hasScoreInput || parsedScoreInput % 50 === 0;
  const applyHasChange = selectedTurn
    ? (hasScoreInput && parsedScoreInput !== selectedTurn.score) || isBust !== selectedTurn.is_bust
    : hasScoreInput;

  const openCell = (player: GamePlayer, round: number, action: CellAction) => {
    const turn = scoreMap.get(player.id)?.get(round);
    if (action === 'delete' && turn) {
      alert.show({
        title: 'Delete score',
        message: 'Remove this score?',
        buttons: [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteTurn(turn.id, turn.player_id, turn.score, turn.is_bust);
                await loadAll();
                pushGameRefresh('score_change');
              } catch (err) {
                logger.error('Failed to delete score', err);
                alert.show({ title: 'Error', message: 'Failed to delete score' });
              }
            },
          },
        ],
      });
      return;
    }

    setSelectedPlayer(player);
    setSelectedTurn(turn || null);
    setSelectedRound(round);
    setIsBust(turn?.is_bust || false);
    setScoreInput(turn ? `${turn.score}` : '');
    setAttemptedSubmit(false);
    setShowScoreModal(true);
  };

  const saveScore = async (override?: { score?: string; bust?: boolean }) => {
    if (!selectedPlayer || selectedRound == null) return;
    const scoreStr = override?.score ?? scoreInput;
    const parsed = parseInt(scoreStr, 10);
    const hasValidScore = !isNaN(parsed) && parsed >= 0;
    const value = hasValidScore ? parsed : 0;
    // Score of 0 is always a bust
    const bustFlag = (override?.bust ?? isBust) || value === 0;

    // If clearing an existing turn (empty input, not bust), delete the turn
    if (selectedTurn && !bustFlag && scoreStr.trim() === '') {
      try {
        await deleteTurn(selectedTurn.id, selectedTurn.player_id, selectedTurn.score, selectedTurn.is_bust);
        setShowScoreModal(false);
        setSelectedPlayer(null);
        setSelectedTurn(null);
        setScoreInput('');
        setSelectedRound(null);
        setIsBust(false);
        await loadAll();
        pushGameRefresh('score_change');
      } catch (err) {
        logger.error('Failed to reset score', err);
        alert.show({ title: 'Error', message: 'Failed to reset score' });
      }
      return;
    }

    try {
      if (selectedTurn) {
        await updateTurn(
          selectedTurn.id,
          selectedPlayer.id,
          selectedTurn.score,
          bustFlag ? value : value,
          bustFlag,
          selectedTurn.is_bust,
        );
      } else {
        await addTurn(gameId, selectedPlayer.id, bustFlag ? value : value, bustFlag, true, undefined, selectedRound);
      }
      setShowScoreModal(false);
      setSelectedPlayer(null);
      setSelectedTurn(null);
      setScoreInput('');
      setSelectedRound(null);
      setIsBust(false);
      await loadAll();
      pushGameRefresh('score_change');
    } catch (err) {
      logger.error('Failed to save score', err);
      alert.show({ title: 'Error', message: 'Failed to save score' });
    }
  };

  const deleteWholeRound = (round: number) => {
    alert.show({
      title: 'Delete round',
      message: 'Remove all scores for this round?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRound(gameId, round);
              await loadAll();
              pushGameRefresh('score_change');
            } catch (err) {
              logger.error('Failed to delete round', err);
              alert.show({ title: 'Error', message: 'Failed to delete round' });
            }
          },
        },
      ],
    });
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await removePlayer(playerId);
      await loadAll();
      pushGameRefresh('player_change');
    } catch (error) {
      logger.error('Error removing player', error);
      alert.show({ title: 'Error', message: 'Failed to remove player' });
    }
  };

  const handleReorderPlayers = async (ordered: GamePlayer[]) => {
    try {
      await updatePlayerOrder(gameId, ordered.map((p) => p.id));
      await loadAll();
      pushGameRefresh('player_change');
    } catch (error) {
      logger.error('Error updating player order', error);
      alert.show({ title: 'Error', message: 'Failed to update player order' });
    }
  };

  const handleApplyRounds = async (target: number): Promise<boolean> => {
    if (target > MAX_ROUNDS) {
      alert.show({ title: 'Max rounds reached', message: `You can have at most ${MAX_ROUNDS} rounds.` });
      return false;
    }
    if (target < MIN_ROUNDS) {
      alert.show({ title: 'Min rounds reached', message: `You must keep at least ${MIN_ROUNDS} rounds.` });
      return false;
    }

    const clamped = Math.round(target);

    // If shrinking, block when rounds to be removed contain any turns.
    if (clamped < totalRows) {
      const trimmedRounds = turns
        .map((t) => Number(t.turn_number))
        .filter((n) => !Number.isNaN(n) && n > clamped);

      if (trimmedRounds.length > 0) {
        const affectedRounds = Array.from(new Set(trimmedRounds)).sort((a, b) => a - b);
        const start = affectedRounds[0];
        const end = affectedRounds[affectedRounds.length - 1];
        const rangeText = start === end ? `round ${start}` : `rounds ${start}-${end}`;
        const message = `Cannot remove rounds. Non-empty scores found in ${rangeText}. Please clear these scores before reducing rounds.`;
        alert.show({ title: 'Cannot remove rounds', message });
        return false;
      }
    }

    try {
      await updateGameRounds(gameId, clamped);
      setTotalRows(clamped);
    } catch (err) {
      logger.error('Failed to update rounds', err);
      alert.show({ title: 'Error', message: 'Could not update rounds. Please try again.' });
      return false;
    }

    const broadcasted = await pushGameRefresh('rows_change', { totalRows: clamped });
    return broadcasted;
  };

  const handleFontChange = (scale: number) => {
    const clamped = Math.min(1.4, Math.max(0.6, scale));
    setFontScale(clamped);
  };

  const handleAddPlayer = async (playerName: string) => {
    const trimmed = playerName.trim();
    if (!trimmed) return;
    try {
      await addGuestPlayer(gameId, trimmed);
      await loadAll();
      pushGameRefresh('player_change');
    } catch (error: any) {
      logger.error('Error adding player', error);
      alert.show({ title: 'Error', message: error.message || 'Failed to add player' });
    }
  };

  const openRenameGuest = (player: GamePlayer) => {
    if (!player.is_guest) return;
    setRenamePlayer(player);
    setRenameInput(player.player_name || '');
    setShowRenameModal(true);
  };

  const handleRenameGuest = async () => {
    if (!renamePlayer) return;
    const trimmed = renameInput.trim();
    if (!trimmed) {
      alert.show({ title: 'Name required', message: 'Please enter a name.' });
      return;
    }
    try {
      await updatePlayerName(renamePlayer.id, trimmed);
      await loadAll();
      setShowRenameModal(false);
      setRenamePlayer(null);
      setRenameInput('');
      pushGameRefresh('player_change');
    } catch (error) {
      logger.error('Error renaming player', error);
      alert.show({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to rename player' });
    }
  };

  // Realtime: data changes (players/turns) and broadcast pings to keep all open screens in sync.
  useEffect(() => {
    let dataChannel: RealtimeChannel | null = null;
    let broadcastChannel: RealtimeChannel | null = null;

    const subscribe = async () => {
      try {
        dataChannel = supabase
          .channel(`game-${gameId}-data`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'game_players',
              filter: `game_id=eq.${gameId}`,
            },
            () => {
              loadAll();
            },
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'games',
              filter: `id=eq.${gameId}`,
            },
            () => {
              loadAll();
            },
          )
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'turns',
              filter: `game_id=eq.${gameId}`,
            },
            () => {
              loadAll();
            },
          );
        realtimeChannelRef.current = dataChannel;
        dataChannel.subscribe((status) => {
          if (status !== 'SUBSCRIBED' && status !== 'CLOSED') {
            logger.warn('Realtime data subscribe status:', status);
          }
        });

        broadcastChannel = supabase
          .channel(`game-${gameId}-broadcast`, { config: { broadcast: { self: true, ack: true } } })
          .on('broadcast', { event: 'game_refresh' }, ({ payload }) => {
            const nextRows = payload?.totalRows;
            if (typeof nextRows === 'number') {
              const clamped = Math.min(30, Math.max(5, nextRows));
              setTotalRows(clamped);
            }
            loadAll();
          });
        broadcastChannelRef.current = broadcastChannel;
        broadcastChannel.subscribe((status) => {
          if (status !== 'SUBSCRIBED' && status !== 'CLOSED') {
            logger.warn('Realtime broadcast subscribe status:', status);
          }
        });
      } catch (err) {
        logger.warn('Realtime subscribe failed', err);
      }
    };

    subscribe();
    return () => {
      const cleanupChannel = async (channel: RealtimeChannel | null, label: string) => {
        if (!channel) return;
        try {
          await channel.unsubscribe();
        } catch (err) {
          logger.warn(`Realtime unsubscribe failed (${label})`, err);
        }
        try {
          supabase.removeChannel(channel);
        } catch (err) {
          logger.warn(`Realtime removeChannel failed (${label})`, err);
        }
      };

      cleanupChannel(dataChannel, 'data');
      cleanupChannel(broadcastChannel, 'broadcast');
      realtimeChannelRef.current = null;
      broadcastChannelRef.current = null;
    };
  }, [gameId]);

  const handleDeleteGame = async () => {
    logger.debug('Delete game clicked for gameId:', gameId);
    try {
      await deleteGame(gameId);
      pushGameRefresh('game_deleted');
      setShowSettingsModal(false);
      alert.show({ title: 'Game deleted', message: 'This game has been removed.' });
      onGameRemoved?.();
      onBack();
    } catch (error) {
      logger.error('Error deleting game', error);
      alert.show({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to delete game' });
    }
  };

  const handleReopenGame = async () => {
    try {
      await reopenGame(gameId);
      await loadAll();
      setShowSettingsModal(false);
      alert.show({ title: 'Game Re-opened', message: 'You can now make changes and finish the game again.' });
    } catch (error) {
      logger.error('Error reopening game', error);
      const message = error instanceof Error ? error.message : 'Failed to re-open game';
      alert.show({ title: 'Error', message });
    }
  };

  const requestFinishGame = () => {
    setShowSettingsModal(false);
    setShowFinishConfirm(true);
  };

  useEffect(() => {
    if (showFinishConfirm) {
      const firstEligible = eligibleWinners[0];
      setSelectedWinnerId(firstEligible ? firstEligible.id : null);
    }
  }, [showFinishConfirm]);

  const cleanupMissingScores = async () => {
    const freshPlayers = await getGamePlayers(gameId);
    const freshTurns = await getGameTurns(gameId);
    const roundNumbers = Array.from(new Set(freshTurns.map((t) => t.turn_number))).sort((a, b) => a - b);

    for (const round of roundNumbers) {
      const turnsForRound = freshTurns.filter((t) => t.turn_number === round);
      if (turnsForRound.length === 0) continue;

      const isRoundEmpty = freshPlayers.every((p) => !turnsForRound.some((t) => t.player_id === p.id));
      if (isRoundEmpty) {
        await deleteRound(gameId, round);
        continue;
      }

      for (const player of freshPlayers) {
        const existingTurn = turnsForRound.find((t) => t.player_id === player.id);
        if (!existingTurn) {
          await addTurn(gameId, player.id, 0, true, true, undefined, round);
        }
      }
    }
  };

  const handleFinishGame = async () => {
    logger.debug('Finish game clicked for gameId:', gameId);
    if (eligibleWinners.length === 0) {
      alert.show({ title: 'No winner', message: 'No player has reached 10,000 points yet.' });
      return;
    }
    if (!selectedWinnerId) {
      alert.show({ title: 'Select winner', message: 'Please select the winning player.' });
      return;
    }
    setFinishing(true);
    try {
      await cleanupMissingScores();
      const winningScore = totals[selectedWinnerId] ?? 0;
      await finishGame(gameId, selectedWinnerId, winningScore);
      pushGameRefresh('game_finished');
      setShowFinishConfirm(false);
      alert.show({ title: 'Game finished', message: 'This game has been marked complete.' });
      onGameRemoved?.();
      onBack();
    } catch (error) {
      logger.error('Error finishing game', error);
      alert.show({ title: 'Error', message: error instanceof Error ? error.message : 'Failed to finish game' });
    } finally {
      setFinishing(false);
    }
  };

  const renderCell = (player: GamePlayer, round: number) => {
    const turn = scoreMap.get(player.id)?.get(round);
    const isGameActive = game?.status === 'active';

    if (!turn) {
      return (
        <TouchableOpacity
          key={`${player.id}-${round}`}
          style={[styles.cell, styles.playerCell]}
          onPress={() => openCell(player, round, 'score')}
          disabled={!isGameActive}
          accessibilityLabel={`${getDisplayName(player)}, round ${round}, no score`}
          accessibilityRole="button"
          accessibilityHint="Tap to add score"
          accessibilityState={{ disabled: !isGameActive }}
        >
          <Text style={styles.cellText}>-</Text>
        </TouchableOpacity>
      );
    }

    // Score of 0 or is_bust flag both mean bust
    if (turn.is_bust || turn.score === 0) {
      return (
        <TouchableOpacity
          key={`${player.id}-${round}`}
          style={[styles.cell, styles.playerCell]}
          onPress={() => openCell(player, round, 'edit')}
          onLongPress={() => openCell(player, round, 'delete')}
          disabled={!isGameActive}
          accessibilityLabel={`${getDisplayName(player)}, round ${round}, bust ${turn.score}`}
          accessibilityRole="button"
          accessibilityHint="Tap to edit, long press to delete"
          accessibilityState={{ disabled: !isGameActive }}
        >
          <Text style={[styles.cellText, styles.bustText, styles.strikethrough]}>{turn.score}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={`${player.id}-${round}`}
        style={[styles.cell, styles.playerCell]}
        onPress={() => openCell(player, round, 'edit')}
        onLongPress={() => openCell(player, round, 'delete')}
        disabled={!isGameActive}
        accessibilityLabel={`${getDisplayName(player)}, round ${round}, score ${turn.score}`}
        accessibilityRole="button"
        accessibilityHint="Tap to edit, long press to delete"
        accessibilityState={{ disabled: !isGameActive }}
      >
        <Text style={styles.cellText}>{turn.score}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Loading game..." />
      </View>
    );
  }

  // Find winner name if game is complete
  const winnerPlayer = game?.status === 'ended' && game?.winning_player_id
    ? players.find(p => p.id === game.winning_player_id)
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerLabel}>
          Game code: <Text style={styles.headerValue}>{game?.join_code || '------'}</Text>
        </Text>
      </View>

      {/* Winner Banner for Completed Games */}
      {winnerPlayer && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerText}>
            🏆 Winner: {getDisplayName(winnerPlayer)}
            {game?.winning_score && ` (${game.winning_score} pts)`}
          </Text>
        </View>
      )}

      <View style={[styles.tableContainer, { paddingBottom: Math.max(16, insets.bottom + 8) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              width: containerWidth,
              alignItems: tableWidth < containerWidth ? 'center' : 'flex-start',
              flex: 1,
            }}
          >
            <View style={[styles.tableSurface, { width: tableWidth, flex: 1 }]}>
              <View style={[styles.tableRow, styles.headerRow]}>
                <View style={[styles.cell, styles.roundCell, styles.headerCell, { width: roundColWidth }]}>
                  <Text style={styles.headerText}>Round</Text>
                </View>
                {players.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.cell, styles.playerCell, styles.headerCell, { width: playerColWidth }]}
                    activeOpacity={p.is_guest && game?.status === 'active' ? 0.7 : 1}
                    onPress={() => openRenameGuest(p)}
                    disabled={!p.is_guest || game?.status !== 'active'}
                    accessibilityLabel={`Player ${getDisplayName(p)}${p.is_guest ? ', guest, tap to rename' : ''}`}
                    accessibilityRole="button"
                    accessibilityHint={p.is_guest ? 'Tap to rename guest' : ''}
                  >
                    <Text style={p.is_guest ? styles.guestHeaderText : styles.headerText} numberOfLines={2}>
                      {getDisplayName(p)}
                    </Text>
                    {p.is_guest && game?.status === 'active' && (
                      <Text style={styles.guestEditHint}>tap to edit</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView
                style={styles.bodyScroll}
                contentContainerStyle={{ width: tableWidth, flexGrow: 1 }}
                showsVerticalScrollIndicator
              >
                {rounds.map((round) => (
                  <View key={round} style={styles.tableRow}>
                    <TouchableOpacity
                      style={[styles.cell, styles.roundCell, { width: roundColWidth }]}
                      onPress={() => deleteWholeRound(round)}
                      accessibilityLabel={`Round ${round}`}
                      accessibilityRole="button"
                      accessibilityHint="Tap to delete entire round"
                    >
                      <Text style={styles.roundText}>{round}</Text>
                    </TouchableOpacity>
                    {players.map((p) => renderCell(p, round))}
                  </View>
                ))}
              </ScrollView>

              <View style={[styles.tableRow, styles.totalRow]}>
                <View style={[styles.cell, styles.roundCell, { width: roundColWidth }]}>
                  <Text style={styles.totalText}>Total</Text>
                </View>
                {players.map((p) => (
                  <View key={p.id} style={[styles.cell, styles.playerCell, { width: playerColWidth }]}>
                    <Text style={styles.totalText}>{totals[p.id] ?? 0}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal visible={showScoreModal} transparent animationType="fade" onRequestClose={() => setShowScoreModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {selectedTurn ? 'Edit Score' : 'Add Score'}{' '}
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  setShowScoreModal(false);
                  setSelectedPlayer(null);
                  setSelectedTurn(null);
                  setScoreInput('');
                  setSelectedRound(null);
                  setIsBust(false);
                }}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeX}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
                 {'Player: '}
                 {selectedPlayer ? ` ${getDisplayName(selectedPlayer)}` : ''}
              </Text>
            <Text style={styles.modalSubtitle}>
              Round {selectedRound} | Current total: {totals[selectedPlayer?.id ?? ''] ?? 0}
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.inputInner,
                  isBust && styles.inputBust,
                ]}
                placeholder="Score"
                keyboardType="numeric"
                value={scoreInput}
                maxLength={5}
                onChangeText={(text) => {
                  const digitsOnly = text.replace(/[^0-9]/g, '');
                  setAttemptedSubmit(false);
                  if (isBust) {
                    const nextVal = digitsOnly.slice(-1);
                    setScoreInput(nextVal);
                    setIsBust(false);
                  } else {
                    setScoreInput(digitsOnly);
                  }
                }}
                accessibilityLabel="Score input"
                accessibilityHint="Enter score value, must be multiple of 50"
              />
              <View style={styles.inputErrorContainer}>
                {Number(scoreInput || '0') > 20000 ? (
                  <Text style={styles.inputErrorText}>Max{'\n'}20,000</Text>
                ) : attemptedSubmit && hasScoreInput && !isValidScore ? (
                  <Text style={styles.inputErrorText}>Must be{'\n'}multiple of 50</Text>
                ) : null}
              </View>
            </View>

            {/* Quick add buttons */}
            <View style={styles.quickScoreRow} accessibilityRole="toolbar">
              {[50, 100, 250, 500, 1000].map((amount) => (
                <TouchableOpacity
                  key={`add-${amount}`}
                  style={[styles.quickScoreButton, { width: clampedQuickButtonWidth }]}
                  onPress={() => {
                    const current = parseInt(scoreInput || '0', 10) || 0;
                    const newScore = Math.min(current + amount, 20000);
                    setScoreInput(String(newScore));
                    setIsBust(false);
                  }}
                  accessibilityLabel={`Add ${amount}`}
                  accessibilityRole="button"
                >
                  <Text
                    style={styles.quickScoreTextAdd}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    maxFontSizeMultiplier={1.2}
                  >
                    +{amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick subtract buttons */}
            <View style={styles.quickScoreRow} accessibilityRole="toolbar">
              {[50, 100, 250, 500, 1000].map((amount) => (
                <TouchableOpacity
                  key={`sub-${amount}`}
                  style={[styles.quickScoreButton, { width: clampedQuickButtonWidth }]}
                  onPress={() => {
                    const current = parseInt(scoreInput || '0', 10) || 0;
                    const newScore = Math.max(current - amount, 0);
                    setScoreInput(String(newScore));
                    setIsBust(false);
                  }}
                  accessibilityLabel={`Subtract ${amount}`}
                  accessibilityRole="button"
                >
                  <Text
                    style={styles.quickScoreTextSub}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    maxFontSizeMultiplier={1.2}
                  >
                    -{amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.resetButton]}
                onPress={() => {
                  if (selectedTurn) {
                    deleteTurn(selectedTurn.id, selectedTurn.player_id, selectedTurn.score, selectedTurn.is_bust)
                      .then(loadAll)
                      .catch((err) => {
                        logger.error('Failed to reset score', err);
                        alert.show({ title: 'Error', message: 'Failed to reset score' });
                      });
                  }
                  setShowScoreModal(false);
                  setSelectedPlayer(null);
                  setSelectedTurn(null);
                  setScoreInput('');
                  setSelectedRound(null);
                  setIsBust(false);
                }}
                accessibilityLabel="Reset score"
                accessibilityRole="button"
              >
                <Text style={styles.modalButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.bustButton]}
                onPress={() => {
                  // If currently showing as bust (via toggle) and no score entered, toggle off
                  if (isBust && scoreInput.trim() === '') {
                    setIsBust(false);
                    return;
                  }

                  // Save score as bust - preserves the accumulated points they lost
                  const scoreValue = scoreInput.trim().length === 0 ? '0' : scoreInput;
                  saveScore({ score: scoreValue, bust: true });
                }}
                accessibilityLabel="Mark as bust"
                accessibilityRole="button"
              >
                <Text style={styles.modalButtonText}>Bust</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  (!applyHasChange || (hasScoreInput && parsedScoreInput > 20000)) && styles.saveButtonDisabled,
                ]}
                onPress={() => {
                  setAttemptedSubmit(true);
                  if (!isValidScore) return;
                  saveScore();
                }}
                disabled={!applyHasChange || (hasScoreInput && parsedScoreInput > 20000)}
                accessibilityLabel="Apply score"
                accessibilityRole="button"
                accessibilityState={{ disabled: !applyHasChange || (hasScoreInput && parsedScoreInput > 20000) }}
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showRenameModal} transparent animationType="fade" onRequestClose={() => setShowRenameModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Rename guest</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowRenameModal(false);
                  setRenamePlayer(null);
                  setRenameInput('');
                }}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeX}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 16 }} />
            <TextInput
              style={styles.input}
              placeholder="Guest name"
              value={renameInput}
              onChangeText={setRenameInput}
              accessibilityLabel="Guest name"
              accessibilityHint="Enter new name for guest player"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleRenameGuest}
                accessibilityLabel="Apply name change"
                accessibilityRole="button"
              >
                <Text style={styles.modalButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <GameSettingsModal
        visible={showSettingsModal}
        players={players}
        onClose={() => setShowSettingsModal(false)}
        recentPlayers={[]}
        onAddPlayer={handleAddPlayer}
        onRemovePlayer={(id) => handleRemovePlayer(id)}
        onReorderSave={handleReorderPlayers}
        totalRows={totalRows}
        onApplyRounds={handleApplyRounds}
        fontScale={fontScale}
        onFontChange={handleFontChange}
        onDeleteGame={handleDeleteGame}
        onFinishGame={requestFinishGame}
        gameStatus={game?.status || 'active'}
        onReopenGame={handleReopenGame}
      />

      <Modal visible={showFinishConfirm} transparent animationType="fade" onRequestClose={() => setShowFinishConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Verify scores</Text>
              <TouchableOpacity
                onPress={() => setShowFinishConfirm(false)}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.closeX}>X</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Empty rounds will be removed. Any remaining dashes will be marked as busts.</Text>
              {previewRounds.length === 0 ? (
                <Text style={styles.modalSubtitle}>No scores yet to verify.</Text>
              ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <View style={[styles.tableSurface, { width: previewTableWidth }]}>
                    <View style={[styles.tableRow, styles.headerRow]}>
                      <View style={[styles.cell, styles.roundCell, styles.headerCell, { width: previewRoundColWidth }]}>
                        <Text style={styles.headerText}>Round</Text>
                      </View>
                      {players.map((p) => (
                        <View
                          key={`preview-h-${p.id}`}
                          style={[styles.cell, styles.playerCell, styles.headerCell, { width: previewPlayerColWidth }]}
                        >
                          <Text style={styles.headerText} numberOfLines={1}>
                            {getDisplayName(p)}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <ScrollView style={styles.previewBodyScroll} contentContainerStyle={{ width: previewTableWidth }}>
                      {previewRounds.map((round) => (
                        <View key={`preview-${round}`} style={styles.tableRow}>
                          <View style={[styles.cell, styles.roundCell, { width: previewRoundColWidth }]}>
                            <Text style={styles.roundText}>{round}</Text>
                          </View>
                          {players.map((p) => {
                            const t = scoreMap.get(p.id)?.get(round);
                            if (!t) {
                              return (
                                <View
                                  key={`preview-${p.id}-${round}`}
                                  style={[styles.cell, styles.playerCell, { width: previewPlayerColWidth }]}
                                >
                                  <Text style={styles.cellText}>-</Text>
                                </View>
                              );
                            }
                            const isBustDisplay = t.is_bust || t.score === 0;
                            return (
                              <View
                                key={`preview-${p.id}-${round}`}
                                style={[styles.cell, styles.playerCell, { width: previewPlayerColWidth }]}
                              >
                                <Text
                                  style={[
                                    styles.cellText,
                                    isBustDisplay && styles.bustText,
                                    isBustDisplay && styles.strikethrough,
                                  ]}
                                >
                                  {t.score}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      ))}
                    </ScrollView>
                    <View style={[styles.tableRow, styles.totalRow]}>
                      <View style={[styles.cell, styles.roundCell, { width: previewRoundColWidth }]}>
                        <Text style={styles.totalText}>Total</Text>
                      </View>
                      {players.map((p) => (
                        <View
                          key={`preview-total-${p.id}`}
                          style={[styles.cell, styles.playerCell, { width: previewPlayerColWidth }]}
                        >
                          <Text style={styles.totalText}>{totals[p.id] ?? 0}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
            )}
            <View style={styles.winnerSection}>
              <Text style={styles.winnerHeader}>Select winner (must be 10,000+)</Text>
              {eligibleWinners.length === 0 ? (
                <Text style={styles.mutedText}>No players above 10,000 yet.</Text>
              ) : (
                eligibleWinners.map((p) => {
                  const selected = selectedWinnerId === p.id;
                  return (
                    <TouchableOpacity
                      key={`winner-${p.id}`}
                      style={[styles.winnerOption, selected && styles.winnerOptionSelected]}
                      onPress={() => setSelectedWinnerId(selected ? null : p.id)}
                      accessibilityLabel={`${getDisplayName(p)}, ${totals[p.id]} points`}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.winnerName, selected && styles.winnerNameSelected]}>
                        {getDisplayName(p)} ({totals[p.id]})
                      </Text>
                      {selected && (
                        <Text style={styles.winnerSelectedLabel}>selected</Text>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.saveButton,
                  (!selectedWinnerId || finishing) && styles.saveButtonDisabled,
                ]}
                onPress={handleFinishGame}
                disabled={finishing || !selectedWinnerId}
                accessibilityLabel={finishing ? 'Finishing game' : 'Confirm and finish game'}
                accessibilityRole="button"
                accessibilityState={{ disabled: finishing || !selectedWinnerId }}
              >
                <Text style={styles.modalButtonText}>{finishing ? 'Finishing...' : 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
});

export default GameScreen;

const createStyles = (theme: Theme, scale: number, roundWidth: number, playerWidth: number, cellPadding: number) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 10, paddingTop: 0 },
    headerBar: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerLabel: { fontSize: 18, color: colors.textPrimary, fontWeight: '600' },
    headerValue: { color: colors.accent, fontWeight: '700' },
    winnerBanner: {
      backgroundColor: colors.accent,
      padding: 12,
      marginBottom: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    winnerText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.buttonText,
    },
    tableContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 4,
      paddingBottom: 16,
    },
    tableSurface: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.divider },
    headerRow: { backgroundColor: colors.surfaceSecondary },
    headerCell: { backgroundColor: colors.surfaceSecondary },
    cell: {
      padding: cellPadding,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: colors.divider,
      minHeight: 40,
      backgroundColor: colors.surface,
    },
    roundCell: { width: roundWidth },
    playerCell: { width: playerWidth },
    headerText: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 * scale },
    guestHeaderText: {
      color: colors.textPrimary,
      fontWeight: '700',
      fontSize: 14 * scale,
      fontStyle: 'italic',
    },
    guestEditHint: {
      color: colors.textSecondary,
      fontSize: 10 * scale,
      marginTop: 2,
    },
    roundText: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 * scale },
    cellText: { color: colors.textPrimary, fontSize: 14 * scale },
    bustText: { color: colors.error, fontSize: 14 * scale },
    strikethrough: { textDecorationLine: 'line-through' },
    totalRow: {
      backgroundColor: colors.surfaceSecondary,
      borderTopWidth: 2,
      borderTopColor: colors.accent,
      position: 'relative',
    },
    totalText: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 * scale },
    bodyScroll: { flex: 1 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 12,
      width: '85%',
      maxWidth: 420,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
    modalSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 8,
      padding: 10,
      color: colors.inputText,
      backgroundColor: colors.inputBackground,
      marginBottom: 12,
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
    modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 8 },
    quickScoreRow: {
      flexDirection: 'row',
      justifyContent: 'center', // Center the row of buttons
      flexWrap: 'nowrap', // Prevent wrapping - buttons will shrink via adjustsFontSizeToFit
      gap: 6,
      marginTop: 10,
    },
    quickScoreButton: {
      // Width is set dynamically via inline style (clampedQuickButtonWidth)
      // Removed flex: 1 to use calculated width instead
      minHeight: 40, // Ensure minimum touch target
      paddingVertical: 10,
      paddingHorizontal: 6,
      borderRadius: 6,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickScoreTextAdd: {
      color: colors.success,
      fontWeight: '700',
      fontSize: 13,
      textAlign: 'center',
    },
    quickScoreTextSub: {
      color: colors.error,
      fontWeight: '700',
      fontSize: 13,
      textAlign: 'center',
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButton: { backgroundColor: colors.success },
    saveButtonDisabled: { backgroundColor: colors.success, opacity: 0.5 },
    bustButton: { backgroundColor: colors.error },
    resetButton: { backgroundColor: colors.surfaceSecondary },
    cancelButton: { backgroundColor: colors.surfaceSecondary },
    modalButtonText: { color: colors.buttonText, fontWeight: '600' },
    inputBust: { color: colors.error, textDecorationLine: 'line-through' },
    inputErrorContainer: {
      position: 'absolute',
      right: 8,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    inputErrorText: {
      color: colors.error,
      fontSize: 11,
      textAlign: 'right',
      lineHeight: 14,
    },
    inputRow: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colors.inputBackground,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.inputBorder,
    },
    inputInner: {
      flex: 1,
      color: colors.inputText,
      fontSize: 16,
      borderWidth: 0,
      backgroundColor: 'transparent',
      paddingVertical: 6,
      paddingRight: 90,
      // @ts-ignore - web-specific outline removal
      outlineStyle: 'none',
      outlineWidth: 0,
    } as any,
    inputRight: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -10 }],
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    errorText: { color: colors.error, fontWeight: '700', flexWrap: 'nowrap' },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    closeX: { fontSize: 20, color: colors.textPrimary, fontWeight: '800' },
    previewScroll: { maxHeight: 320, marginTop: 8, marginBottom: 12 },
    previewBodyScroll: { maxHeight: 260 },
    winnerSection: { marginTop: 8, marginBottom: 12, gap: 8 },
    winnerHeader: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
    winnerOption: {
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surfaceSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    winnerOptionSelected: { borderColor: colors.accent, backgroundColor: colors.surface },
    winnerName: { color: colors.textPrimary, fontWeight: '600' },
    winnerNameSelected: { color: colors.accent },
    winnerSelectedLabel: { color: colors.accent, fontWeight: '600', fontSize: 12 },
    mutedText: { color: colors.textSecondary },
  });
};
