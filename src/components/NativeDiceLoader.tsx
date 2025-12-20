/**
 * NativeDiceLoader Component (Native Platforms)
 *
 * 2D dice loader with wobble animation.
 * Dice tilts back and forth with decay, face changes on each cycle.
 * Uses "Wide Wobble" variant: ±18° rotation, 2 oscillations, 1000ms, with decay.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

interface NativeDiceLoaderProps {
  /** Dice size in pixels (default: 60) */
  size?: number;
  /** Total cycle time in ms (default: 1000) */
  speed?: number;
  /** Dice color (default: red) */
  color?: string;
}

const DICE_FACES = [1, 2, 3, 4, 5, 6];

// Wobble configuration - "Wide" variant (#4)
const WOBBLE_CONFIG = {
  rotation: 18,      // Max rotation in degrees
  oscillations: 2,   // Number of back-and-forth wobbles
  decay: true,       // Wobble gets smaller over time
};

const NativeDiceLoader: React.FC<NativeDiceLoaderProps> = ({
  size = 60,
  speed = 1000,
  color = '#DC2626'
}) => {
  const [faceIndex, setFaceIndex] = useState(() => Math.floor(Math.random() * 6));
  const wobbleAnim = useRef(new Animated.Value(0)).current;

  const currentFace = DICE_FACES[faceIndex];

  useEffect(() => {
    const animate = () => {
      // Change face at start of each wobble cycle
      setFaceIndex(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * 6);
        } while (next === prev);
        return next;
      });
      wobbleAnim.setValue(0);

      // Build wobble sequence based on oscillations
      const wobbleDuration = (speed * 0.4) / (WOBBLE_CONFIG.oscillations * 2 + 1);
      const sequence: Animated.CompositeAnimation[] = [];

      for (let i = 0; i < WOBBLE_CONFIG.oscillations; i++) {
        const factor = WOBBLE_CONFIG.decay
          ? (WOBBLE_CONFIG.oscillations - i) / WOBBLE_CONFIG.oscillations
          : 1;
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
    const interval = setInterval(animate, speed);
    return () => clearInterval(interval);
  }, [speed]);

  // Interpolate wobble value to rotation degrees
  const rotate = wobbleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [`-${WOBBLE_CONFIG.rotation}deg`, '0deg', `${WOBBLE_CONFIG.rotation}deg`],
  });

  const borderRadius = size * 0.15;
  const dotSize = size * 0.16;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.dice,
          {
            width: size,
            height: size,
            borderRadius,
            backgroundColor: color,
            transform: [{ rotate }],
          },
        ]}
      >
        <View style={[styles.faceContainer, { width: size, height: size }]}>
          {renderDotsForFace(currentFace, dotSize, size)}
        </View>
      </Animated.View>
    </View>
  );
};

/**
 * Render dots for a dice face with proper positioning
 */
function renderDotsForFace(face: number, dotSize: number, containerSize: number) {
  const margin = containerSize * 0.18;
  const center = containerSize / 2;

  const left = margin;
  const right = containerSize - margin - dotSize;
  const top = margin;
  const bottom = containerSize - margin - dotSize;
  const centerX = center - dotSize / 2;
  const centerY = center - dotSize / 2;
  const middleY = center - dotSize / 2;

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
        <View key="lm" style={[dotStyle, { left: left, top: middleY }]} />,
        <View key="lb" style={[dotStyle, { left: left, top: bottom }]} />,
        <View key="rt" style={[dotStyle, { left: right, top: top }]} />,
        <View key="rm" style={[dotStyle, { left: right, top: middleY }]} />,
        <View key="rb" style={[dotStyle, { left: right, top: bottom }]} />
      );
      break;
  }

  return dots;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  faceContainer: {
    position: 'relative',
  },
});

export default NativeDiceLoader;
