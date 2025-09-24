/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme as _useColorScheme } from 'react-native';
import { colors } from '../constants/colors';

// The useColorScheme value is not properly typed, so we cast it to a ColorSchemeName.
export function useColorScheme(): NonNullable<ReturnType<typeof _useColorScheme>> {
  return _useColorScheme() as NonNullable<ReturnType<typeof _useColorScheme>>;
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof colors
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  const colorValue = colors[colorName];
  
  // Handle nested color objects
  if (typeof colorValue === 'object' && colorValue !== null) {
    // For text colors, return primary by default
    if (colorName === 'text') {
      return (colorValue as any).primary;
    }
    // For shadow colors, return light by default
    if (colorName === 'shadow') {
      return (colorValue as any).light;
    }
    // For other nested objects, return the first string value
    const firstValue = Object.values(colorValue)[0];
    if (typeof firstValue === 'string') {
      return firstValue;
    }
  }
  
  // Return as string for simple color values
  return colorValue as string;
}
