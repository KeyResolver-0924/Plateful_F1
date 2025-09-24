export interface ColorScheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  error: string;
  warning: string;
  success: string;
  info: string;
  border: string;
  divider: string;
  shadow: {
    light: string;
    medium: string;
    dark: string;
  };
  food: {
    carrot: string;
    strawberry: string;
    garlic: string;
    apple: string;
    banana: string;
    orange: string;
    grapes: string;
    watermelon: string;
    broccoli: string;
    peas: string;
  };
  gradient: {
    primary: string[];
    secondary: string[];
    sunset: string[];
    fresh: string[];
  };
}

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// App-specific colors for consistency - FIXED STRUCTURE
export const colors = {
  primary: '#F8930F',
  primaryDark: '#F8930F',
  secondary: '#FF6B6B',
  secondaryDark: '#E55555',
  accent: '#FFE66D',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  whiteGrey: '#E7E7E6',
  goldB: '#E5A339',
  goldW: '#FFB380',
  
  background: '#FFFFFF',
  surface: '#F5F5F5',
  background2: '#FFF5EC',
  
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    green: '#3B9F21',
  },
  
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.2)'
  },
  
  food: {
    carrot: '#FF6B35',
    strawberry: '#FF1744',
    garlic: '#F5DEB3',
    apple: '#DC143C',
    banana: '#FFE135',
    orange: '#FFA500',
    grapes: '#6B46C1',
    watermelon: '#FC5C65',
    broccoli: '#228B22',
    peas: '#3CB371'
  },
  
  gamification: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    xp: '#9B59B6',
    streak: '#E74C3C',
  },
  
  gradients: {
    primary: ['#4ECDC4', '#F8930F'] as const,
    secondary: ['#FF6B6B', '#E55555'] as const,
    accent: ['#FFE66D', '#F4D03F'] as const,
    success: ['#4CAF50', '#45A049'] as const,
    food: ['#FF8A80', '#FF5722'] as const,
  },
}; 
