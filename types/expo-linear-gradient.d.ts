declare module 'expo-linear-gradient' {
  import { ViewProps } from 'react-native';
  
  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    locations?: number[] | null;
    start?: { x: number; y: number } | [number, number] | null;
    end?: { x: number; y: number } | [number, number] | null;
  }
  
  export const LinearGradient: React.ComponentType<LinearGradientProps>;
  export default LinearGradient;
}