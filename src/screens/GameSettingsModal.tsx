import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GamePlayer } from '../lib/types';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';
import { logger } from '../lib/logger';

interface GameSettingsModalProps {
  visible: boolean;
  players: GamePlayer[];
  onClose: () => void;
  onAddPlayer: (playerName: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onReorderSave: (players: GamePlayer[]) => Promise<void> | void;
  totalRows: number;
  onApplyRounds: (next: number) => Promise<boolean> | boolean;
  recentPlayers?: GamePlayer[];
  fontScale: number;
  onFontChange: (scale: number) => void;
  onDeleteGame: () => void;
  onFinishGame: () => void;
  alertFn?: typeof Alert.alert;
  gameStatus?: 'active' | 'ended' | 'complete';
  onReopenGame?: () => void;
}

export default function GameSettingsModal({
  visible,
  players,
  onClose,
  onAddPlayer,
  onRemovePlayer,
  onReorderSave,
  totalRows,
  onApplyRounds,
  recentPlayers = [],
  fontScale,
  onFontChange,
  onDeleteGame,
  onFinishGame,
  alertFn,
  gameStatus = 'active',
  onReopenGame,
}: GameSettingsModalProps) {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const showAlert = alertFn || Alert.alert;
  const [mode, setMode] = useState<'menu' | 'reorder' | 'remove' | 'add'>('menu');
  const [order, setOrder] = useState<GamePlayer[]>(players);
  const [selectedRemoveIds, setSelectedRemoveIds] = useState<string[]>([]);
  const [selectedRecentId, setSelectedRecentId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [draftRounds, setDraftRounds] = useState(totalRows);
  const [draftFont, setDraftFont] = useState(fontScale);

  useEffect(() => {
    if (visible) {
      setMode('menu');
      setOrder(players);
      setSelectedRemoveIds([]);
      setSelectedRecentId(null);
      setGuestName('');
      setDraftRounds(totalRows);
      setDraftFont(fontScale);
    }
  }, [visible, players, totalRows, fontScale]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  };

  const moveDown = (idx: number) => {
    if (idx === order.length - 1) return;
    const next = [...order];
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    setOrder(next);
  };

  const saveReorder = async () => {
    await onReorderSave(order);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[
        styles.overlay,
        {
          paddingTop: Math.max(20, insets.top + 10),
          paddingBottom: Math.max(30, insets.bottom + 20),
          paddingLeft: Math.max(20, insets.left),
          paddingRight: Math.max(20, insets.right),
        }
      ]}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Game Settings</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.headerClose}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Text style={styles.headerCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <ScrollView
            style={styles.cardContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
          {mode === 'menu' && gameStatus === 'active' && (
            <>
              <Text style={styles.groupLabel}>Player settings</Text>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  setMode('add');
                  setSelectedRecentId(null);
                  setGuestName('');
                }}
                accessibilityLabel="Add player"
                accessibilityRole="button"
              >
                <Text style={styles.rowText}>Add player</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  setMode('remove');
                  setSelectedRemoveIds([]);
                }}
                accessibilityLabel="Remove player"
                accessibilityRole="button"
              >
                <Text style={styles.rowText}>Remove player</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  setMode('reorder');
                  setOrder(players);
                }}
                accessibilityLabel="Change player order"
                accessibilityRole="button"
              >
                <Text style={styles.rowText}>Change player order</Text>
              </TouchableOpacity>

              <Text style={[styles.groupLabel, { marginTop: 8 }]}>Game settings</Text>
              <View style={[styles.row, styles.rowsControl]}>
                <Text
                  style={styles.rowText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  maxFontSizeMultiplier={1.2}
                >
                  Rounds: {draftRounds}
                </Text>
                <View style={styles.rowsButtons}>
                  <TouchableOpacity
                    style={[styles.arrow, draftRounds <= 5 && styles.arrowDisabled]}
                    onPress={() => setDraftRounds(Math.max(5, draftRounds - 5))}
                    disabled={draftRounds <= 5}
                    accessibilityLabel="Decrease rounds"
                    accessibilityRole="button"
                  >
                    <Text style={styles.arrowText} maxFontSizeMultiplier={1.2}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.arrow, draftRounds >= 30 && styles.arrowDisabled]}
                    onPress={() => setDraftRounds(Math.min(30, draftRounds + 5))}
                    disabled={draftRounds >= 30}
                    accessibilityLabel="Increase rounds"
                    accessibilityRole="button"
                  >
                    <Text style={styles.arrowText} maxFontSizeMultiplier={1.2}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.applyButton, draftRounds === totalRows && styles.applyButtonDisabled]}
                    onPress={async () => {
                      const applied = await onApplyRounds(draftRounds);
                      if (applied) onClose();
                    }}
                    disabled={draftRounds === totalRows}
                    accessibilityLabel="Apply rounds"
                    accessibilityRole="button"
                  >
                    <Text
                      style={[styles.applyText, draftRounds === totalRows && styles.applyTextDisabled]}
                      maxFontSizeMultiplier={1.2}
                    >
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.row, styles.rowsControl]}>
                <Text
                  style={styles.rowText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  maxFontSizeMultiplier={1.2}
                >
                  Font size: {Math.round(14 * draftFont)}
                </Text>
                <View style={styles.rowsButtons}>
                  <TouchableOpacity
                    style={[styles.arrow, draftFont <= 0.6 && styles.arrowDisabled]}
                    onPress={() => setDraftFont(Math.max(0.6, parseFloat((draftFont - 0.1).toFixed(2))))}
                    disabled={draftFont <= 0.6}
                    accessibilityLabel="Decrease font size"
                    accessibilityRole="button"
                  >
                    <Text style={styles.arrowText} maxFontSizeMultiplier={1.2}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.arrow, draftFont >= 2 && styles.arrowDisabled]}
                    onPress={() => setDraftFont(Math.min(2, parseFloat((draftFont + 0.1).toFixed(2))))}
                    disabled={draftFont >= 2}
                    accessibilityLabel="Increase font size"
                    accessibilityRole="button"
                  >
                    <Text style={styles.arrowText} maxFontSizeMultiplier={1.2}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.applyButton, Math.abs(draftFont - fontScale) < 0.001 && styles.applyButtonDisabled]}
                    onPress={() => {
                      onFontChange(draftFont);
                      onClose();
                    }}
                    disabled={Math.abs(draftFont - fontScale) < 0.001}
                    accessibilityLabel="Apply font size"
                    accessibilityRole="button"
                  >
                    <Text
                      style={[styles.applyText, Math.abs(draftFont - fontScale) < 0.001 && styles.applyTextDisabled]}
                      maxFontSizeMultiplier={1.2}
                    >
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.row, styles.actionRow, styles.deleteRow]}
                onPress={() =>
                  Platform.OS === 'web'
                    ? (() => {
                        logger.debug('Delete Game clicked (web)');
                        if (window.confirm('Are you sure you want to delete this game?')) {
                          onDeleteGame();
                        }
                      })()
                    : showAlert('Delete game', 'Are you sure you want to delete this game?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => { logger.debug('Delete Game confirmed'); onDeleteGame(); } },
                      ])
                }
              >
                <Text style={[styles.rowText, styles.deleteText]}>Delete Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.row, styles.actionRow, styles.finishRow]}
                onPress={onFinishGame}
              >
                <Text style={[styles.rowText, styles.finishText]}>Finish Game</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === 'menu' && (gameStatus === 'ended' || gameStatus === 'complete') && (
            <>
              <Text style={styles.groupLabel}>Completed game options</Text>
              {onReopenGame && (
                <TouchableOpacity
                  style={[styles.row, styles.actionRow, styles.finishRow]}
                  onPress={onReopenGame}
                >
                  <Text style={[styles.rowText, styles.finishText]}>Re-open Game</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.row, styles.actionRow, styles.deleteRow]}
                onPress={() =>
                  Platform.OS === 'web'
                    ? (() => {
                        logger.debug('Delete Game clicked (web)');
                        if (window.confirm('Are you sure you want to delete this game?')) {
                          onDeleteGame();
                        }
                      })()
                    : showAlert('Delete game', 'Are you sure you want to delete this game?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => { logger.debug('Delete Game confirmed'); onDeleteGame(); } },
                      ])
                }
              >
                <Text style={[styles.rowText, styles.deleteText]}>Delete Game</Text>
              </TouchableOpacity>
            </>
          )}

          {mode === 'reorder' && (
            <>
              <Text style={styles.subheader}>Tap arrows to reorder players</Text>
              <View style={styles.divider} />
              <ScrollView style={styles.list}>
                {order.map((p, idx) => (
                  <View key={p.id} style={styles.reorderRow}>
                    <Text style={styles.reorderName}>{p.player_name || 'Player'}</Text>
                    <View style={styles.reorderButtons}>
                      <TouchableOpacity
                        style={[styles.arrow, idx === 0 && styles.arrowDisabled]}
                        onPress={() => moveUp(idx)}
                        disabled={idx === 0}
                        accessibilityLabel="Move up"
                        accessibilityRole="button"
                      >
                        <Text style={styles.arrowText}>↑</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.arrow, idx === order.length - 1 && styles.arrowDisabled]}
                        onPress={() => moveDown(idx)}
                        disabled={idx === order.length - 1}
                        accessibilityLabel="Move down"
                        accessibilityRole="button"
                      >
                        <Text style={styles.arrowText}>↓</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setMode('menu')}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveReorder}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {mode === 'remove' && (
            <>
              <Text style={styles.subheader}>Select a player to remove</Text>
              <View style={styles.divider} />
              <ScrollView style={styles.list}>
                {players.map((p) => {
                  const selected = selectedRemoveIds.includes(p.id);
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.removeRow, selected && styles.removeRowSelected]}
                      onPress={() =>
                        setSelectedRemoveIds((prev) =>
                          prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id],
                        )
                      }
                    >
                      <Text style={[styles.reorderName, selected && styles.removeSelectedText]}>
                        {p.player_name || 'Player'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setMode('menu')}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, selectedRemoveIds.length === 0 && styles.arrowDisabled]}
                  onPress={() => {
                    if (selectedRemoveIds.length === 0) return;
                    selectedRemoveIds.forEach(onRemovePlayer);
                    setSelectedRemoveIds([]);
                    setMode('menu');
                    onClose();
                  }}
                  disabled={selectedRemoveIds.length === 0}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {mode === 'add' && (
            <>
              <Text style={styles.subheader}>Select from recent players</Text>
              <View style={styles.divider} />
              <ScrollView style={[styles.list, styles.sectionSpacing]}>
                {recentPlayers.length === 0 && (
                  <Text style={[styles.mutedText, styles.sectionSpacing]}>No recent players found.</Text>
                )}
                {recentPlayers.map((p) => {
                  const alreadyPlaying = players.some((pl) => pl.player_name === p.player_name);
                  const selected = selectedRecentId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.removeRow,
                        alreadyPlaying && styles.disabledRow,
                        selected && styles.removeRowSelected,
                      ]}
                      disabled={alreadyPlaying}
                      onPress={() => setSelectedRecentId(p.id)}
                    >
                      <Text
                        style={[
                          styles.reorderName,
                          alreadyPlaying && styles.mutedText,
                          selected && styles.removeSelectedText,
                        ]}
                      >
                        {p.player_name || 'Player'}
                      </Text>
                      {alreadyPlaying && <Text style={styles.mutedText}>Already playing</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.subheader, { marginTop: 12 }]}>Players already playing</Text>
              <View style={styles.divider} />
              <ScrollView style={[styles.list, styles.sectionSpacing]} nestedScrollEnabled>
                {players.map((p) => (
                  <View key={p.id} style={styles.plainRow}>
                    <Text style={styles.mutedSmall}>{p.player_name || 'Player'}</Text>
                  </View>
                ))}
              </ScrollView>

              <Text style={[styles.subheader, { marginTop: 12 }]}>Add Guest</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Guest name"
                placeholderTextColor={theme.colors.textSecondary}
                value={guestName}
                onChangeText={(text) => {
                  setGuestName(text);
                  setSelectedRecentId(null);
                }}
              />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => {
                    setMode('menu');
                    setSelectedRecentId(null);
                    setGuestName('');
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    !selectedRecentId && !guestName.trim() && styles.arrowDisabled,
                  ]}
                  disabled={!selectedRecentId && !guestName.trim()}
                  onPress={() => {
                    const picked =
                      selectedRecentId &&
                      recentPlayers.find((p) => p.id === selectedRecentId && !players.some((pl) => pl.id === p.id));
                    const trimmedGuest = guestName.trim();
                    if (picked) {
                      onAddPlayer(picked.player_name || 'Player');
                    } else if (trimmedGuest) {
                      onAddPlayer(trimmedGuest);
                    } else {
                      return;
                    }
                    setSelectedRecentId(null);
                    setGuestName('');
                    setMode('menu');
                    onClose();
                  }}
                >
                  <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      // Base padding - will be overridden by dynamic safe area insets
      padding: 20,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      width: '100%',
      maxWidth: 420,
      maxHeight: '100%', // Respects the safe area padding from overlay
      padding: 20,
      paddingBottom: 24, // Extra bottom padding for gesture area
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flexGrow: 0, // Don't expand beyond content
      flexShrink: 1, // Allow shrinking if needed
    },
    header: {
      paddingBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
    headerClose: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    headerCloseText: { fontSize: 20, color: colors.textPrimary, fontWeight: '800' },
    subheader: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 10, marginTop: 4 },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: 10 },
    row: {
      paddingVertical: 14,
      paddingHorizontal: 10,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 10,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rowText: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: 16,
      flexShrink: 1, // Allow text to shrink if needed
      marginRight: 12, // Space between label and buttons
    },
    button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
    closeButton: { backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border },
    saveButton: { backgroundColor: colors.accent },
    buttonText: { color: colors.buttonText, fontWeight: '600', fontSize: 15 },
    list: { maxHeight: 320 },
    reorderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    reorderName: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
    reorderButtons: { flexDirection: 'row', gap: 8 },
    arrow: {
      width: 36, // Fixed width - consistent touch target
      height: 36, // Fixed height - matches applyButton
      borderRadius: 18, // Half of width/height for circle
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0, // Never shrink
    },
    arrowDisabled: { opacity: 0.35 },
    arrowText: {
      color: colors.accent,
      fontWeight: '700',
      fontSize: 18,
      lineHeight: 18,
      textAlign: 'center',
      textAlignVertical: 'center',
      includeFontPadding: false,
    },
    actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 12 },
    removeRow: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
      backgroundColor: colors.surfaceSecondary,
    },
    removeRowSelected: { borderColor: colors.accent, backgroundColor: colors.surface },
    removeSelectedText: { color: colors.accent },
    rowsControl: {
      alignItems: 'center',
      flexWrap: 'nowrap', // Never wrap - keep all controls on one line
    },
    rowsButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8, // Consistent gap between buttons
      flexShrink: 0, // Don't shrink the button container
    },
    applyButton: {
      width: 52, // Fixed width for consistency
      height: 36, // Fixed height - matches arrow buttons
      borderRadius: 8,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    applyButtonDisabled: {
      backgroundColor: colors.accent,
      opacity: 0.35,
    },
    applyText: {
      color: colors.buttonText,
      fontWeight: '600',
      fontSize: 13,
      textAlign: 'center',
    },
    applyTextDisabled: {
      opacity: 1, // Text opacity handled by button container
    },
    disabledRow: { opacity: 0.5 },
    mutedText: { color: colors.textSecondary },
    mutedSmall: { color: colors.textSecondary, fontSize: 14 },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      color: colors.inputText,
      backgroundColor: colors.inputBackground,
      marginTop: 8,
      marginBottom: 8,
    },
    sectionSpacing: { marginBottom: 12 },
    plainRow: { paddingVertical: 6 },
    groupLabel: { color: colors.textSecondary, fontWeight: '700', fontSize: 13, marginBottom: 8, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    actionRow: {
      borderWidth: 2,
      borderRadius: 10,
      paddingVertical: 16,
      paddingHorizontal: 14,
      marginBottom: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteRow: {
      backgroundColor: colors.errorBackground,
      borderColor: colors.error,
    },
    finishRow: {
      backgroundColor: colors.successBackground,
      borderColor: colors.success,
    },
    deleteText: { color: colors.error, fontWeight: '700' },
    finishText: { color: colors.success, fontWeight: '700' },
  });
