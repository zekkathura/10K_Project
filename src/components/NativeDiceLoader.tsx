/**
 * NativeDiceLoader Component (Native Platforms)
 *
 * A 2D animated dice loader for iOS/Android that shows a tumbling dice
 * with changing faces. Uses React Native Animated API for smooth performance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

interface NativeDiceLoaderProps {
  /** Dice size in pixels (default: 60) */
  size?: number;
  /** Animation duration per face in ms (default: 400) */
  speed?: number;
  /** Dice color (default: red) */
  color?: string;
}

const NativeDiceLoader: React.FC<NativeDiceLoaderProps> = ({
  size = 60,
  speed = 400,
  color = '#DC2626'
}) => {
  const [currentFace, setCurrentFace] = useState(() => Math.floor(Math.random() * 6) + 1);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Dot patterns for each face (positions in 3x3 grid)
  const dotPatterns: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  useEffect(() => {
    const animate = () => {
      // Reset animation values
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);

      // Animate: scale down, rotate, change face, scale up
      Animated.sequence([
        // Scale down and start rotation
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: speed * 0.3,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0.5,
            duration: speed * 0.3,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        // Continue rotation and scale back up
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: speed * 0.4,
            easing: Easing.out(Easing.bounce),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: speed * 0.4,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Change face mid-animation
      setTimeout(() => {
        setCurrentFace(prev => {
          let next;
          do {
            next = Math.floor(Math.random() * 6) + 1;
          } while (next === prev);
          return next;
        });
      }, speed * 0.35);
    };

    animate();
    const interval = setInterval(animate, speed);
    return () => clearInterval(interval);
  }, [speed]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  const dotSize = size * 0.18;
  const padding = size * 0.15;
  const gap = size * 0.05;
  const borderRadius = size * 0.15;

  const renderDots = () => {
    const visibleDots = dotPatterns[currentFace] || [];
    const cellSize = (size - padding * 2 - gap * 2) / 3;

    return (
      <View style={[styles.dotsContainer, { padding, gap }]}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((position) => {
          const isVisible = visibleDots.includes(position);
          return (
            <View
              key={position}
              style={[
                styles.dotCell,
                { width: cellSize, height: cellSize },
              ]}
            >
              {isVisible && (
                <View
                  style={[
                    styles.dot,
                    {
                      width: dotSize,
                      height: dotSize,
                      borderRadius: dotSize / 2,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

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
            transform: [
              { rotate: rotation },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {renderDots()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dotsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dotCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
});

export default NativeDiceLoader;
