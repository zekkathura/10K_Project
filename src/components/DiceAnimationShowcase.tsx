/**
 * DiceAnimationShowcase - DEV ONLY
 * Shows 8 wobble variants for comparison.
 * Remove before production.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, ScrollView } from 'react-native';

const DICE_FACES = [1, 2, 3, 4, 5, 6];
const SIZE = 50;
const COLOR = '#DC2626';

// Shared dot rendering
function renderDotsForFace(face: number, dotSize: number, containerSize: number) {
  const margin = containerSize * 0.18;
  const center = containerSize / 2;
  const left = margin;
  const right = containerSize - margin - dotSize;
  const top = margin;
  const bottom = containerSize - margin - dotSize;
  const centerX = center - dotSize / 2;
  const centerY = center - dotSize / 2;

  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: 'white',
    position: 'absolute' as const,
  };

  const dots: React.ReactNode[] = [];

  switch (face) {
    case 1:
      dots.push(<View key="c" style={[dotStyle, { left: centerX, top: centerY }]} />);
      break;
    case 2:
      dots.push(
        <View key="tr" style={[dotStyle, { left: right, top: top }]} />,
        <View key="bl" style={[dotStyle, { left: left, top: bottom }]} />
      );
      break;
    case 3:
      dots.push(
        <View key="tr" style={[dotStyle, { left: right, top: top }]} />,
        <View key="c" style={[dotStyle, { left: centerX, top: centerY }]} />,
        <View key="bl" style={[dotStyle, { left: left, top: bottom }]} />
      );
      break;
    case 4:
      dots.push(
        <View key="tl" style={[dotStyle, { left: left, top: top }]} />,
        <View key="tr" style={[dotStyle, { left: right, top: top }]} />,
        <View key="bl" style={[dotStyle, { left: left, top: bottom }]} />,
        <View key="br" style={[dotStyle, { left: right, top: bottom }]} />
      );
      break;
    case 5:
      dots.push(
        <View key="tl" style={[dotStyle, { left: left, top: top }]} />,
        <View key="tr" style={[dotStyle, { left: right, top: top }]} />,
        <View key="c" style={[dotStyle, { left: centerX, top: centerY }]} />,
        <View key="bl" style={[dotStyle, { left: left, top: bottom }]} />,
        <View key="br" style={[dotStyle, { left: right, top: bottom }]} />
      );
      break;
    case 6:
      dots.push(
        <View key="lt" style={[dotStyle, { left: left, top: top }]} />,
        <View key="lm" style={[dotStyle, { left: left, top: centerY }]} />,
        <View key="lb" style={[dotStyle, { left: left, top: bottom }]} />,
        <View key="rt" style={[dotStyle, { left: right, top: top }]} />,
        <View key="rm" style={[dotStyle, { left: right, top: centerY }]} />,
        <View key="rb" style={[dotStyle, { left: right, top: bottom }]} />
      );
      break;
  }
  return dots;
}

// ============ CONFIGURABLE WOBBLE ============
interface WobbleConfig {
  rotation: number;      // Max rotation in degrees
  oscillations: number;  // Number of back-and-forth wobbles
  speed: number;         // Total cycle time in ms
  decay: boolean;        // Whether wobble decays (gets smaller)
}

const WobbleDice: React.FC<{ config: WobbleConfig }> = ({ config }) => {
  const [faceIndex, setFaceIndex] = useState(() => Math.floor(Math.random() * 6));
  const wobbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      setFaceIndex(prev => {
        let next;
        do { next = Math.floor(Math.random() * 6); } while (next === prev);
        return next;
      });
      wobbleAnim.setValue(0);

      // Build wobble sequence based on oscillations
      const wobbleDuration = (config.speed * 0.4) / (config.oscillations * 2 + 1);
      const sequence: Animated.CompositeAnimation[] = [];

      for (let i = 0; i < config.oscillations; i++) {
        const factor = config.decay ? (config.oscillations - i) / config.oscillations : 1;
        sequence.push(
          Animated.timing(wobbleAnim, {
            toValue: factor,
            duration: wobbleDuration,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(wobbleAnim, {
            toValue: -factor,
            duration: wobbleDuration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          })
        );
      }
      // Return to center
      sequence.push(
        Animated.timing(wobbleAnim, {
          toValue: 0,
          duration: wobbleDuration,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      );

      Animated.sequence(sequence).start();
    };
    animate();
    const interval = setInterval(animate, config.speed);
    return () => clearInterval(interval);
  }, [config]);

  const rotate = wobbleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [`-${config.rotation}deg`, '0deg', `${config.rotation}deg`],
  });

  return (
    <Animated.View style={[styles.dice, { transform: [{ rotate }] }]}>
      <View style={styles.faceContainer}>
        {renderDotsForFace(DICE_FACES[faceIndex], SIZE * 0.16, SIZE)}
      </View>
    </Animated.View>
  );
};

// ============ 8 WOBBLE VARIANTS ============
const WOBBLE_VARIANTS: { name: string; desc: string; config: WobbleConfig }[] = [
  {
    name: '1. Gentle',
    desc: '±8° slow',
    config: { rotation: 8, oscillations: 2, speed: 1200, decay: true },
  },
  {
    name: '2. Standard',
    desc: '±12° medium',
    config: { rotation: 12, oscillations: 2, speed: 1000, decay: true },
  },
  {
    name: '3. Snappy',
    desc: '±12° fast',
    config: { rotation: 12, oscillations: 2, speed: 700, decay: true },
  },
  {
    name: '4. Wide',
    desc: '±18° medium',
    config: { rotation: 18, oscillations: 2, speed: 1000, decay: true },
  },
  {
    name: '5. Dramatic',
    desc: '±25° slow',
    config: { rotation: 25, oscillations: 2, speed: 1200, decay: true },
  },
  {
    name: '6. Quick Shake',
    desc: '±10° 3x fast',
    config: { rotation: 10, oscillations: 3, speed: 800, decay: true },
  },
  {
    name: '7. Nervous',
    desc: '±6° 4x rapid',
    config: { rotation: 6, oscillations: 4, speed: 600, decay: false },
  },
  {
    name: '8. Big Swing',
    desc: '±20° no decay',
    config: { rotation: 20, oscillations: 2, speed: 900, decay: false },
  },
];

// ============ MAIN SHOWCASE ============
const DiceAnimationShowcase: React.FC<{ textColor?: string }> = ({ textColor = '#333' }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: textColor }]}>Wobble Variants</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>Pick your favorite tilt style</Text>

      <View style={styles.row}>
        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[0].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[0].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[0].desc}</Text>
        </View>

        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[1].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[1].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[1].desc}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[2].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[2].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[2].desc}</Text>
        </View>

        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[3].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[3].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[3].desc}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[4].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[4].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[4].desc}</Text>
        </View>

        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[5].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[5].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[5].desc}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[6].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[6].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[6].desc}</Text>
        </View>

        <View style={styles.item}>
          <View style={styles.diceWrapper}>
            <WobbleDice config={WOBBLE_VARIANTS[7].config} />
          </View>
          <Text style={[styles.label, { color: textColor }]}>{WOBBLE_VARIANTS[7].name}</Text>
          <Text style={[styles.desc, { color: textColor }]}>{WOBBLE_VARIANTS[7].desc}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 20,
    width: 100,
  },
  diceWrapper: {
    width: SIZE + 20,
    height: SIZE + 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE * 0.15,
    backgroundColor: COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  faceContainer: {
    width: SIZE,
    height: SIZE,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  desc: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
});

export default DiceAnimationShowcase;
