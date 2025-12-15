/**
 * DiceLoader Component (Web Only)
 *
 * A 3D tumbling dice loading animation that cycles through 5 different
 * roll patterns randomly. Follows standard dice orientation rules where
 * opposite faces sum to 7.
 *
 * Note: This component uses CSS 3D transforms which only work on web.
 * For native platforms, use ThemedLoader which provides a fallback.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';

interface DiceLoaderProps {
  /** Dice size in pixels (default: 60) */
  size?: number;
  /** Full cycle duration in seconds (default: 4) */
  speed?: number;
  /** Dice color (default: theme accent blue) */
  color?: string;
}

interface Rotation {
  x: number;
  y: number;
}

interface Pattern {
  rotations: Rotation[];
}

const DiceLoader: React.FC<DiceLoaderProps> = ({
  size = 60,
  speed = 1.5,
  color = '#DC2626'
}) => {
  // Randomize starting pattern and step on mount
  const [currentPattern, setCurrentPattern] = useState(() => Math.floor(Math.random() * 5));
  const [rotation, setRotation] = useState<Rotation>({ x: 0, y: 0 });
  const stepRef = useRef(Math.floor(Math.random() * 6));

  // 5 different roll patterns - all follow real dice physics
  // Each pattern visits all 6 faces in different orders
  const patterns: Pattern[] = [
    { // Forward Spiral: 2 -> 1 -> 4 -> 6 -> 3 -> 5
      rotations: [
        { x: 0, y: 0 },
        { x: -90, y: 0 },
        { x: -90, y: -90 },
        { x: -180, y: -90 },
        { x: -180, y: 0 },
        { x: -270, y: 0 },
      ]
    },
    { // Side Sweep: 2 -> 3 -> 1 -> 4 -> 6 -> 5
      rotations: [
        { x: 0, y: 0 },
        { x: 0, y: 90 },
        { x: -90, y: 90 },
        { x: -90, y: 180 },
        { x: -180, y: 180 },
        { x: -180, y: 270 },
      ]
    },
    { // Zigzag: 2 -> 4 -> 1 -> 3 -> 6 -> 5
      rotations: [
        { x: 0, y: 0 },
        { x: 0, y: -90 },
        { x: -90, y: -90 },
        { x: -90, y: 0 },
        { x: -180, y: 0 },
        { x: -270, y: 0 },
      ]
    },
    { // Reverse Spiral: 2 -> 6 -> 3 -> 1 -> 4 -> 5
      rotations: [
        { x: 0, y: 0 },
        { x: 90, y: 0 },
        { x: 90, y: 90 },
        { x: 0, y: 90 },
        { x: 0, y: 180 },
        { x: -90, y: 180 },
      ]
    },
    { // Tumble Mix: 2 -> 3 -> 6 -> 4 -> 1 -> 5
      rotations: [
        { x: 0, y: 0 },
        { x: 0, y: 90 },
        { x: 90, y: 90 },
        { x: 90, y: 0 },
        { x: 0, y: 0 },
        { x: -90, y: 0 },
      ]
    }
  ];

  useEffect(() => {
    const stepDuration = (speed * 1000) / 6;

    const animate = () => {
      const pattern = patterns[currentPattern];
      const rot = pattern.rotations[stepRef.current];
      setRotation(rot);

      stepRef.current++;

      if (stepRef.current >= pattern.rotations.length) {
        stepRef.current = 0;
        // Pick a random different pattern
        let next: number;
        do {
          next = Math.floor(Math.random() * patterns.length);
        } while (next === currentPattern && patterns.length > 1);
        setCurrentPattern(next);
      }
    };

    animate();
    const interval = setInterval(animate, stepDuration);
    return () => clearInterval(interval);
  }, [currentPattern, speed]);

  // Only render on web - native platforms should use ThemedLoader fallback
  if (Platform.OS !== 'web') {
    return null;
  }

  const halfSize = size / 2;
  const dotSize = size * 0.12;
  const padding = size * 0.17;
  const gap = size * 0.06;
  const borderRadius = size * 0.15;

  // Dot patterns for each face (1-9 positions in 3x3 grid)
  const dotPatterns: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  // Face transforms for standard die orientation
  const faceTransforms: Record<number, string> = {
    1: `rotateX(90deg) translateZ(${halfSize}px)`,
    2: `rotateY(0deg) translateZ(${halfSize}px)`,
    3: `rotateY(-90deg) translateZ(${halfSize}px)`,
    4: `rotateY(90deg) translateZ(${halfSize}px)`,
    5: `rotateY(180deg) translateZ(${halfSize}px)`,
    6: `rotateX(-90deg) translateZ(${halfSize}px)`,
  };

  const renderFace = (faceNum: number) => {
    const visibleDots = dotPatterns[faceNum];
    // Web-specific styles cast as any for CSS 3D properties
    const faceStyle: any = {
      position: 'absolute',
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%)`,
      borderRadius: borderRadius,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      padding: padding,
      gap: gap,
      boxShadow: `inset 0 0 ${size * 0.25}px rgba(0,0,0,0.2)`,
      transform: faceTransforms[faceNum],
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformOrigin: 'center center',
    };

    return (
      <View key={faceNum} style={faceStyle}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((dotNum) => {
          const dotStyle: any = {
            width: '100%',
            height: '100%',
            background: visibleDots.includes(dotNum) ? 'white' : 'transparent',
            borderRadius: '50%',
            boxShadow: visibleDots.includes(dotNum) ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
          };
          return <View key={dotNum} style={dotStyle} />;
        })}
      </View>
    );
  };

  // Web-specific container styles cast as any
  const containerStyle: any = {
    perspective: size * 5,
    perspectiveOrigin: 'center center',
    width: size,
    height: size,
  };

  const diceStyle: any = {
    width: size,
    height: size,
    position: 'relative',
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
    transition: `transform ${speed / 6}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
  };

  return (
    <View style={containerStyle}>
      <View style={diceStyle}>
        {[1, 2, 3, 4, 5, 6].map(renderFace)}
      </View>
    </View>
  );
};

/**
 * Darken or lighten a hex color
 */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default DiceLoader;
