import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ThemedLoader } from '../components';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';

interface ExtraRule {
  id: string;
  rule_number: number;
  text: string;
  proposer: string | null;
  approved_by: string | null;
  revoked_by: string | null;
  rule_date: string | null;
}

type RulesTab = 'normal' | 'extra';

export default function RulesScreen() {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<RulesTab>('normal');
  const [extraRules, setExtraRules] = useState<ExtraRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'extra' && extraRules.length === 0) {
      loadExtraRules();
    }
  }, [activeTab]);

  const loadExtraRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('extra_rules')
        .select('*')
        .order('rule_number', { ascending: true });

      if (fetchError) {
        console.error('Error fetching extra rules:', fetchError);
        setError('Failed to load extra rules');
        return;
      }

      setExtraRules(data || []);
    } catch (err) {
      console.error('Error loading extra rules:', err);
      setError('Failed to load extra rules');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const renderNormalRules = () => (
    <View style={styles.section}>
      <Text style={styles.subheader}>Win condition</Text>
      <Text style={styles.body}>
        Highest score wins after a player ends a turn above 10,000 with all six dice scoring and chooses not to reroll.
      </Text>

      <Text style={styles.subheader}>Choosing turn order</Text>
      <Text style={styles.body}>Each player rolls 1 die; highest goes first. Reroll ties. Play proceeds left.</Text>

      <Text style={styles.subheader}>Standard round</Text>
      <Text style={styles.body}>
        Roll 6 dice; bank scoring dice (banked dice don't combine with later rolls), reroll the rest. If nothing scores,
        you bust (turn = 0). If all 6 score, bank them and reroll all 6, adding on. Bank 500+ once to get on the board;
        afterward you may bank any score. A turn ends when you stop or bust.
      </Text>

      <Text style={styles.subheader}>Scoring</Text>
      <Text style={styles.body}>
        Scoring for dice rolled in a single hand. Combos don't combine with dice previously banked for points.
      </Text>
      <Image source={require('../../assets/images/rules.jpg')} style={styles.image} resizeMode="contain" />

      <Text style={styles.subheader}>Example round</Text>
      <Text style={styles.body}>
        {'Rolled 1,1,5,2,3,4\n'}
        {'→ Score: 1 (100), 1 (100), 5 (50); 2,3,4 = 0\n'}
        {'→ Bank 1 (100), reroll 5,2,3,4\n'}
        {'Rolled 3,3,3,4,2\n'}
        {'→ Bank triple 3s (300); reroll 4,2\n'}
        {'Rolled 1,5\n'}
        {'→ Bank 1 (100) and 5 (50). Turn = 550 if you stop\n'}
        {'Alternatively, reroll all 6 and continue\n'}
        {'→ Choose to reroll all 6 dice\n'}
        {'Rolled 1,1,1,2,6,6\n'}
        {'→ Bank triple 1s (1000); Turn score 1550 if you stop;  reroll 2,6,6\n'}
        {'→ Rolled 3,2,6\n'}
        {"→ No die scores; bust and lose this round's points\n"}
      </Text>

      <Text style={styles.subheader}>End game</Text>
      <Text style={styles.body}>
        {'First player to do all of the following triggers end game condition. \n'}
        {'→ Close above 10,000 points\n'}
        {'→ All 6 die are scoring die\n'}
        {'→ Choose not to reroll\n'}
        {'Everyone else gets one last turn. Highest closing score that meets the below condition wins.\n'}
      </Text>
    </View>
  );

  const renderExtraRules = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ThemedLoader text="Loading extra rules..." />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadExtraRules}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (extraRules.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No extra rules found.</Text>
        </View>
      );
    }

    return (
      <View style={styles.extraRulesContainer}>
        <Text style={styles.extraRulesIntro}>
          House rules created by our group. Revoked rules are shown with strikethrough.
        </Text>
        {extraRules.map((rule) => {
          const isRevoked = !!rule.revoked_by;
          return (
            <View
              key={rule.id}
              style={[styles.ruleCard, isRevoked && styles.ruleCardRevoked]}
            >
              <View style={styles.ruleHeader}>
                <Text style={[styles.ruleNumber, isRevoked && styles.revokedText]}>
                  #{rule.rule_number}
                </Text>
                {isRevoked && (
                  <View style={styles.revokedBadge}>
                    <Text style={styles.revokedBadgeText}>REVOKED</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.ruleText, isRevoked && styles.revokedText]}>
                {rule.text}
              </Text>
              <View style={styles.ruleMeta}>
                <Text style={styles.ruleMetaText}>
                  Proposed by: {rule.proposer || 'Unknown'}
                </Text>
                <Text style={styles.ruleMetaText}>
                  Approved by: {rule.approved_by || 'Unknown'}
                </Text>
                <Text style={styles.ruleMetaText}>
                  Date: {formatDate(rule.rule_date) || 'Unknown'}
                </Text>
                {rule.revoked_by && (
                  <Text style={styles.ruleMetaTextRevoked}>
                    Revoked by: {rule.revoked_by}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'normal' && styles.tabActive]}
          onPress={() => setActiveTab('normal')}
        >
          <Text style={[styles.tabText, activeTab === 'normal' && styles.tabTextActive]}>
            Normal Rules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'extra' && styles.tabActive]}
          onPress={() => setActiveTab('extra')}
        >
          <Text style={[styles.tabText, activeTab === 'extra' && styles.tabTextActive]}>
            Extra Rules
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        {activeTab === 'normal' ? renderNormalRules() : renderExtraRules()}
      </ScrollView>
    </View>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },

    // Tab Bar
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    tab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.accent,
    },
    tabText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.accent,
    },

    // Normal Rules
    section: { marginBottom: 20 },
    subheader: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 12, marginBottom: 4 },
    image: { width: '100%', height: 240, marginTop: 12, marginBottom: 8 },
    body: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },

    // Extra Rules
    extraRulesContainer: {
      gap: 12,
    },
    extraRulesIntro: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    ruleCard: {
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ruleCardRevoked: {
      backgroundColor: colors.surfaceSecondary,
      opacity: 0.7,
    },
    ruleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 10,
    },
    ruleNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.accent,
    },
    revokedBadge: {
      backgroundColor: colors.error,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    revokedBadgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '700',
    },
    ruleText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: 10,
    },
    revokedText: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    ruleMeta: {
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 8,
      gap: 4,
    },
    ruleMetaText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    ruleMetaTextRevoked: {
      fontSize: 12,
      color: colors.error,
    },

    // Loading/Error/Empty states
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textSecondary,
    },
    errorContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      color: colors.error,
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.buttonText,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
