import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { lightTheme } from '../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  duration?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = lightTheme.colors.primary,
  backgroundColor = lightTheme.colors.surface,
  height = 8,
  animated = true,
  duration = 1000,
}) => {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedWidth.value = withTiming(
        Math.max(0, Math.min(100, progress)),
        {
          duration,
          easing: Easing.out(Easing.cubic),
        }
      );
    } else {
      animatedWidth.value = Math.max(0, Math.min(100, progress));
    }
  }, [progress, animated, duration, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor, height }]}>
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: color,
            height,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 50,
  },
});
