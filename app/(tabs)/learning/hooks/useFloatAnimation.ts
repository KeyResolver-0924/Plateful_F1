import { useEffect } from 'react';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export function useFloatAnimation(distance = 6, duration = 900) {
  const value = useSharedValue(0);
  
  useEffect(() => {
    value.value = withRepeat(
      withSequence(
        withTiming(-distance, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      true
    );
  }, [distance, duration]);
  
  return value;
}
