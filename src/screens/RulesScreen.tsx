import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedLoader } from '../components';
import { Theme, useThemedStyles, useTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
type SectionKey = 'scoring' | 'winCondition' | 'turnOrder' | 'standardRound' | 'example';

// Scoring data for native table
const SCORING_DATA = {
  singles: [
    { dice: '1', points: '100' },
    { dice: '5', points: '50' },
  ],
  triples: [
    { dice: '1-1-1', points: '1,000' },
    { dice: '2-2-2', points: '200' },
    { dice: '3-3-3', points: '300' },
    { dice: '4-4-4', points: '400' },
    { dice: '5-5-5', points: '500' },
    { dice: '6-6-6', points: '600' },
  ],
  special: [
    { combo: 'Straight (1-2-3-4-5-6)', points: '1,500' },
    { combo: 'Three Pairs', points: '1,500' },
    { combo: 'Four of a Kind', points: '2× Triple' },
    { combo: 'Five of a Kind', points: '4× Triple' },
    { combo: 'Six of a Kind', points: '8× Triple' },
  ],
};

export default function RulesScreen() {
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<RulesTab>('normal');
  const [extraRules, setExtraRules] = useState<ExtraRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set(['scoring']));

  const toggleSection = (section: SectionKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const CollapsibleSection = ({
    sectionKey,
    title,
    icon,
    children
  }: {
    sectionKey: SectionKey;
    title: string;
    icon: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(sectionKey);
    return (
      <View style={styles.collapsibleCard}>
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => toggleSection(sectionKey)}
          activeOpacity={0.7}
        >
          <View style={styles.collapsibleTitleRow}>
            <Text style={styles.sectionIcon}>{icon}</Text>
            <Text style={styles.collapsibleTitle}>{title}</Text>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.collapsibleContent}>
            {children}
          </View>
        )}
      </View>
    );
  };

  const ScoringTable = () => (
    <View style={styles.scoringContainer}>
      {/* Singles */}
      <View style={styles.scoringSection}>
        <Text style={styles.scoringCategoryTitle}>Single Dice</Text>
        <View style={styles.scoringGrid}>
          {SCORING_DATA.singles.map((item, idx) => (
            <View key={idx} style={styles.scoringRow}>
              <Text style={styles.scoringDice}>{item.dice}</Text>
              <Text style={styles.scoringPoints}>{item.points}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Triples */}
      <View style={styles.scoringSection}>
        <Text style={styles.scoringCategoryTitle}>Three of a Kind</Text>
        <View style={styles.scoringGrid}>
          {SCORING_DATA.triples.map((item, idx) => (
            <View key={idx} style={styles.scoringRow}>
              <Text style={styles.scoringDice}>{item.dice}</Text>
              <Text style={styles.scoringPoints}>{item.points}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Special Combos */}
      <View style={styles.scoringSection}>
        <Text style={styles.scoringCategoryTitle}>Special Combos</Text>
        <View style={styles.scoringGridWide}>
          {SCORING_DATA.special.map((item, idx) => (
            <View key={idx} style={styles.scoringRowWide}>
              <Text style={styles.scoringCombo}>{item.combo}</Text>
              <Text style={styles.scoringPoints}>{item.points}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const ExampleStep = ({ step, roll, action, result }: { step: number; roll: string; action: string; result: string }) => (
    <View style={styles.exampleStep}>
      <View style={styles.exampleStepHeader}>
        <View style={styles.exampleStepNumber}>
          <Text style={styles.exampleStepNumberText}>{step}</Text>
        </View>
        <Text style={styles.exampleRoll}>Rolled: {roll}</Text>
      </View>
      <Text style={styles.exampleAction}>{action}</Text>
      <Text style={styles.exampleResult}>{result}</Text>
    </View>
  );

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
        logger.error('Error fetching extra rules:', fetchError);
        setError('Failed to load extra rules');
        return;
      }

      setExtraRules(data || []);
    } catch (err) {
      logger.error('Error loading extra rules:', err);
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
      {/* Scoring - Most accessed, expanded by default */}
      <CollapsibleSection sectionKey="scoring" title="Scoring" icon="🎯">
        <Text style={styles.body}>
          Points for dice rolled in a single hand. Combos don't combine with previously banked dice.
        </Text>
        <ScoringTable />
      </CollapsibleSection>

      {/* Winning the Game (combines Win Condition + End Game) */}
      <CollapsibleSection sectionKey="winCondition" title="Winning the Game" icon="🏆">
        <Text style={styles.body}>To win, you must meet all three conditions on a single turn:</Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Score above 10,000 total points</Text>
          <Text style={styles.bulletItem}>• All 6 dice are scoring dice</Text>
          <Text style={styles.bulletItem}>• Choose to stop (not reroll)</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Final Round</Text>
          <Text style={styles.tipText}>The first player to qualify triggers the final round. Everyone else gets one last turn to meet the conditions and beat the score.</Text>
        </View>
      </CollapsibleSection>

      {/* Turn Order */}
      <CollapsibleSection sectionKey="turnOrder" title="Turn Order" icon="🔄">
        <Text style={styles.body}>
          Each player rolls 1 die; highest goes first. Reroll ties. Play proceeds to the left.
        </Text>
      </CollapsibleSection>

      {/* Standard Round */}
      <CollapsibleSection sectionKey="standardRound" title="How to Play a Round" icon="🎲">
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Roll all 6 dice</Text>
          <Text style={styles.bulletItem}>• Bank scoring dice (banked dice can't combine with later rolls)</Text>
          <Text style={styles.bulletItem}>• Reroll remaining dice, or stop and keep your points</Text>
          <Text style={styles.bulletItem}>• If nothing scores, you <Text style={styles.boldText}>bust</Text> (lose all points this turn)</Text>
          <Text style={styles.bulletItem}>• If all 6 dice score, bank them and reroll all 6, adding to your total</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Getting on the Board</Text>
          <Text style={styles.tipText}>You must bank 500+ points in a single turn to get on the board. After that, you can bank any amount.</Text>
        </View>
      </CollapsibleSection>

      {/* Example Round */}
      <CollapsibleSection sectionKey="example" title="Example Round" icon="📝">
        <ExampleStep
          step={1}
          roll="1, 1, 5, 2, 3, 4"
          action="Bank one 1 (100 pts), reroll the 5, 2, 3, 4"
          result="Running total: 100"
        />
        <ExampleStep
          step={2}
          roll="3, 3, 3, 4, 2"
          action="Bank triple 3s (300 pts), reroll 4, 2"
          result="Running total: 400"
        />
        <ExampleStep
          step={3}
          roll="1, 5"
          action="Bank 1 (100) and 5 (50). All 6 dice scored!"
          result="Running total: 550 — Can stop here OR reroll all 6"
        />
        <ExampleStep
          step={4}
          roll="1, 1, 1, 2, 6, 6"
          action="Bank triple 1s (1,000 pts), reroll 2, 6, 6"
          result="Running total: 1,550"
        />
        <View style={styles.exampleBust}>
          <View style={styles.exampleStepHeader}>
            <View style={[styles.exampleStepNumber, styles.bustStepNumber]}>
              <Text style={styles.exampleStepNumberText}>5</Text>
            </View>
            <Text style={styles.exampleRoll}>Rolled: 3, 2, 6</Text>
          </View>
          <Text style={styles.bustText}>💥 BUST! No scoring dice — lose all 1,550 points</Text>
        </View>
      </CollapsibleSection>

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

    // Calculate stats
    const activeCount = extraRules.filter(r => !r.revoked_by).length;
    const revokedCount = extraRules.filter(r => !!r.revoked_by).length;

    return (
      <View style={styles.extraRulesContainer}>
        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <Text style={styles.statsSummaryText}>
            {activeCount} active{revokedCount > 0 ? ` • ${revokedCount} revoked` : ''}
          </Text>
        </View>

        {/* Rules List */}
        {extraRules.map((rule) => {
          const isRevoked = !!rule.revoked_by;
          // Build metadata line with context
          const metaParts: string[] = [];
          if (rule.proposer) {
            metaParts.push(`Proposed by ${rule.proposer}`);
          }
          if (rule.approved_by) {
            metaParts.push(`approved by ${rule.approved_by}`);
          }
          if (rule.rule_date) {
            metaParts.push(formatDate(rule.rule_date) || '');
          }
          const metaLine = metaParts.length > 0 ? metaParts.join(' • ') : 'No details available';

          return (
            <View
              key={rule.id}
              style={[styles.ruleCard, isRevoked && styles.ruleCardRevoked]}
            >
              <View style={styles.ruleHeader}>
                <Text style={styles.ruleIcon}>📜</Text>
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
                <Text style={styles.ruleMetaText}>{metaLine}</Text>
                {rule.revoked_by && (
                  <Text style={styles.ruleMetaTextRevoked}>
                    Revoked by {rule.revoked_by}
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
    section: { marginBottom: 20, gap: 12 },
    subheader: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 12, marginBottom: 4 },
    body: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
    boldText: { fontWeight: '700', color: colors.textPrimary },

    // Collapsible Sections
    collapsibleCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    collapsibleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 14,
      backgroundColor: colors.surface,
    },
    collapsibleTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    sectionIcon: {
      fontSize: 20,
    },
    collapsibleTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    expandIcon: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.accent,
      width: 24,
      textAlign: 'center',
    },
    collapsibleContent: {
      padding: 14,
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },

    // Scoring Table
    scoringContainer: {
      marginTop: 12,
      gap: 16,
    },
    scoringSection: {
      gap: 8,
    },
    scoringCategoryTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    scoringGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    scoringRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      minWidth: 90,
      justifyContent: 'space-between',
    },
    scoringGridWide: {
      gap: 6,
    },
    scoringRowWide: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      justifyContent: 'space-between',
    },
    scoringDice: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    scoringCombo: {
      fontSize: 14,
      color: colors.textPrimary,
      flex: 1,
    },
    scoringPoints: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.accent,
      minWidth: 50,
      textAlign: 'right',
    },

    // Bullet Lists
    bulletList: {
      marginTop: 8,
      gap: 6,
    },
    bulletItem: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      paddingLeft: 4,
    },

    // Tip Box
    tipBox: {
      marginTop: 12,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
    },
    tipTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    tipText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    // Example Steps
    exampleStep: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
    },
    exampleStepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 8,
    },
    exampleStepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exampleStepNumberText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.buttonText,
    },
    exampleRoll: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    exampleAction: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    exampleResult: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.success,
    },
    exampleBust: {
      backgroundColor: colors.error + '20',
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.error,
    },
    bustStepNumber: {
      backgroundColor: colors.error,
    },
    bustText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.error,
    },

    // Extra Rules
    extraRulesContainer: {
      gap: 12,
    },
    statsSummary: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 14,
      alignItems: 'center',
    },
    statsSummaryText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    ruleIcon: {
      fontSize: 18,
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
      flex: 1,
      justifyContent: 'center',
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
