import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { ThemedLoader, useThemedAlert } from '../components';
import { supabase } from '../lib/supabase';
import { createGame } from '../lib/database';
import { validatePlayerName } from '../lib/validation';
import { logger } from '../lib/logger';
import { Profile } from '../lib/types';
import { Theme, useTheme } from '../lib/theme';

interface CreateGameScreenProps {
  onCancel: () => void;
  onGameCreated: (gameId: string) => void;
  currentUserId: string;
  currentUserName: string;
}

export default function CreateGameScreen({
  onCancel,
  onGameCreated,
  currentUserId,
  currentUserName,
}: CreateGameScreenProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const alert = useThemedAlert();
  const [availablePlayers, setAvailablePlayers] = useState<Profile[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set([currentUserId])
  );
  const [guestName, setGuestName] = useState('');
  const [guestPlayers, setGuestPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [currentUserId]);

  const loadUsers = async () => {
    try {
      // Collect all game ids the user is in (active or historical)
      const { data: myGames, error: myGamesError } = await supabase
        .from('game_players')
        .select('game_id')
        .eq('user_id', currentUserId);
      if (myGamesError) throw myGamesError;

      const myGameIds = Array.from(new Set((myGames || []).map((gp) => gp.game_id)));

      let coplayerIds: string[] = [];
      if (myGameIds.length > 0) {
        const { data: coPlayers, error: coPlayersError } = await supabase
          .from('game_players')
          .select('user_id, game:games!game_players_game_id_fkey(status)')
          .in('game_id', myGameIds)
          .not('user_id', 'is', null)
          .neq('user_id', currentUserId);
        if (coPlayersError) throw coPlayersError;
        coplayerIds = (coPlayers || []).map((p: any) => p.user_id as string);
      }

      const uniqueIds = Array.from(new Set([...coplayerIds, currentUserId]));

      if (uniqueIds.length === 0) {
        setAvailablePlayers([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', uniqueIds)
        .order('display_name');

      if (profilesError) throw profilesError;

      const deduped = (profiles || []).filter(
        (profile, index, arr) => arr.findIndex((p) => p.id === profile.id) === index
      );

      const sorted = deduped.sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return (a.display_name || '').localeCompare(b.display_name || '');
      });

      setAvailablePlayers(sorted.filter((p) => p.id !== currentUserId));
    } catch (error) {
      logger.error('Error loading users:', error);
      alert.show({ title: 'Error', message: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (userId === currentUserId) {
      alert.show({ title: 'Notice', message: 'You are always included in the game' });
      return;
    }
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const addGuestPlayer = () => {
    const validation = validatePlayerName(guestName);
    if (!validation.isValid) {
      alert.show({ title: 'Error', message: validation.error || 'Invalid guest name' });
      return;
    }
    setGuestPlayers([...guestPlayers, validation.sanitized!]);
    setGuestName('');
  };

  const removeGuestPlayer = (index: number) => {
    setGuestPlayers(guestPlayers.filter((_, i) => i !== index));
  };

  const handleCreateGame = async () => {
    logger.debug('Creating game with players:', selectedUserIds.size, 'registered,', guestPlayers.length, 'guests');

    if (selectedUserIds.size === 0 && guestPlayers.length === 0) {
      alert.show({ title: 'Error', message: 'Add at least one player' });
      return;
    }

    setCreating(true);
    try {
      // Create the game
      const game = await createGame(currentUserId);
      logger.debug('Game created:', game.id);

      // Add all selected registered users as players
      let displayOrder = 0;
      for (const userId of Array.from(selectedUserIds)) {
        const user =
          availablePlayers.find((u) => u.id === userId) ||
          (userId === currentUserId ? { display_name: currentUserName } as Profile : undefined);

        const { error } = await supabase.from('game_players').insert({
          game_id: game.id,
          user_id: userId,
          player_name: user?.display_name || 'Player',
          is_guest: false,
          display_order: displayOrder++,
        });

        if (error) {
          logger.error('Error adding registered player:', error);
          throw error;
        }
      }

      // Add all guest players
      for (const guestName of guestPlayers) {
        const { error } = await supabase.from('game_players').insert({
          game_id: game.id,
          user_id: null,
          player_name: guestName,
          is_guest: true,
          display_order: displayOrder++,
        });

        if (error) {
          logger.error('Error adding guest player:', error);
          throw error;
        }
      }

      logger.debug('Game creation complete:', game.id);
      onGameCreated(game.id);
    } catch (error: any) {
      logger.error('Error creating game:', error);
      alert.show({ title: 'Error', message: error.message || 'Failed to create game' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedLoader text="Loading players..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Game</Text>
        <TouchableOpacity
          onPress={onCancel}
          accessibilityLabel="Cancel game creation"
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Select From Previous Players</Text>

      <FlatList
        data={availablePlayers.filter((user) => user.id !== currentUserId)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedUserIds.has(item.id);
          const isCurrentUser = item.id === currentUserId;
          const displayName = item.display_name || 'Player';
          return (
            <TouchableOpacity
              style={[
                styles.userRow,
                isSelected && styles.userRowSelected,
                isCurrentUser && styles.userRowCurrent,
              ]}
              onPress={() => toggleUser(item.id)}
              accessibilityLabel={`${displayName}${isCurrentUser ? ', you' : ''}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityHint={isSelected ? 'Tap to remove from game' : 'Tap to add to game'}
            >
              <View>
                <Text style={styles.userName}>
                  {displayName}
                  {isCurrentUser && ' (You)'}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No previous players found</Text>
        }
      />

      <View style={styles.guestSection}>
        <Text style={styles.sectionTitle}>Add Guest Players</Text>
        <View style={styles.guestInputRow}>
          <TextInput
            style={styles.guestInput}
            placeholder="Guest name"
            placeholderTextColor={theme.colors.textSecondary}
            value={guestName}
            onChangeText={setGuestName}
            onSubmitEditing={addGuestPlayer}
            accessibilityLabel="Guest player name"
            accessibilityHint="Enter a name for a guest player"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addGuestPlayer}
            accessibilityLabel="Add guest player"
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {guestPlayers.map((name, index) => (
          <View key={index} style={styles.guestRow}>
            <Text style={styles.guestName}>{name} (Guest)</Text>
            <TouchableOpacity
              onPress={() => removeGuestPlayer(index)}
              accessibilityLabel={`Remove ${name}`}
              accessibilityRole="button"
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.createButton, creating && styles.createButtonDisabled]}
        onPress={handleCreateGame}
        disabled={creating}
        accessibilityLabel={`Start game with ${selectedUserIds.size + guestPlayers.length} players`}
        accessibilityRole="button"
        accessibilityState={{ disabled: creating }}
      >
        {creating ? (
          <ThemedLoader mode="inline" color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>
            Start Game ({selectedUserIds.size + guestPlayers.length} players)
          </Text>
        )}
      </TouchableOpacity>
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    cancelText: {
      color: '#ff4444',
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 10,
    },
    userRow: {
      backgroundColor: colors.surface,
      padding: 15,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    userRowSelected: {
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.accent,
      borderWidth: 2,
    },
    userRowCurrent: {
      borderColor: colors.accent,
      borderWidth: 2,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
    },
    checkboxSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    checkmark: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    guestSection: {
      marginTop: 20,
      marginBottom: 20,
    },
    guestInputRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 10,
    },
    guestInput: {
      flex: 1,
      backgroundColor: colors.inputBackground,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      color: colors.inputText,
    },
    addButton: {
      backgroundColor: colors.accent,
      borderRadius: 8,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    addButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    guestRow: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    guestName: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    removeText: {
      color: '#ff4444',
      fontSize: 14,
    },
    createButton: {
      backgroundColor: colors.accent,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    createButtonDisabled: {
      opacity: 0.5,
    },
    createButtonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 16,
      marginVertical: 20,
    },
  });
