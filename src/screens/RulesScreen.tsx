import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Theme, useThemedStyles } from '../lib/theme';

export default function RulesScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Rules</Text>

      <View style={styles.section}>
        <Text style={styles.subheader}>Win condition</Text>
        <Text style={styles.body}>
          Highest score wins after a player ends a turn above 10,000 with all six dice scoring and chooses not to reroll.
        </Text>

        <Text style={styles.subheader}>Choosing turn order</Text>
        <Text style={styles.body}>Each player rolls 1 die; highest goes first. Reroll ties. Play proceeds left.</Text>

        <Text style={styles.subheader}>Standard round</Text>
        <Text style={styles.body}>
          Roll 6 dice; bank scoring dice (banked dice don’t combine with later rolls), reroll the rest. If nothing scores,
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
          {'→ No die scores; bust and lose this round’s points\n'}
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


    </ScrollView>
  );
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16 },
    title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
    subheader: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8, marginBottom: 4 },
    image: { width: '100%', height: 240, marginTop: 12, marginBottom: 8 },
    body: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  });
