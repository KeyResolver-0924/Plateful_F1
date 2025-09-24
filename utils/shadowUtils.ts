import { Platform } from 'react-native';

export interface ShadowStyle {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

export interface BoxShadowStyle {
  boxShadow?: string;
}

/**
 * Creates cross-platform shadow styles
 * Converts shadow properties to boxShadow for web compatibility
 */
export const createShadowStyle = (shadow: ShadowStyle): ShadowStyle | BoxShadowStyle => {
  if (Platform.OS === 'web') {
    const {
      shadowColor = '#000',
      shadowOffset = { width: 0, height: 2 },
      shadowOpacity = 0.25,
      shadowRadius = 4,
    } = shadow;

    // Convert to CSS boxShadow format
    const boxShadow = `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(${
      shadowColor === '#000' ? '0, 0, 0' : hexToRgb(shadowColor)
    }, ${shadowOpacity})`;

    return { boxShadow };
  }

  // Return original shadow style for native platforms
  return shadow;
};

/**
 * Convert hex color to RGB values
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '0, 0, 0'; // fallback to black
};

/**
 * Common shadow presets
 */
export const shadowPresets = {
  small: createShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }),
  
  medium: createShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  }),
  
  large: createShadowStyle({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }),
  
  primary: createShadowStyle({
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  }),
}; 