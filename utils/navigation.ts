import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface NavigationState {
  userToken?: string;
  onboardingComplete?: string;
  userData?: any;
}

export class NavigationService {
  static async checkAuthState(): Promise<NavigationState> {
    try {
      const [userToken, onboardingComplete, userData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('onboardingComplete'),
        AsyncStorage.getItem('userData'),
      ]);

      return {
        userToken: userToken || undefined,
        onboardingComplete: onboardingComplete || undefined,
        userData: userData ? JSON.parse(userData) : null,
      };
    } catch (error) {
      console.error('Error checking auth state:', error);
      return {};
    }
  }

  static async navigateBasedOnAuth(): Promise<void> {
    try {
      const state = await this.checkAuthState();
      
      if (state.userToken) {
        router.replace('/main');
      } else if (state.onboardingComplete === 'true') {
        router.replace('/auth/sign-in');
      } else {
        router.replace('/auth/onboarding');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.replace('/auth/onboarding');
    }
  }

  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('userData'),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  static async saveUserData(userData: any): Promise<void> {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  static async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }
} 