import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export function useAnimations() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animation for correct/incorrect answers
  const animateFeedback = useCallback((isCorrect: boolean) => {
    const toValue = isCorrect ? 1 : 0;
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  // Shake animation for wrong answer
  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  // Reset animations
  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(1);
    shakeAnim.setValue(0);
  }, [fadeAnim, shakeAnim]);

  return {
    fadeAnim,
    shakeAnim,
    animateFeedback,
    shake,
    resetAnimations,
  };
}
