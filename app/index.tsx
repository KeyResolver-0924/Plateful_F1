import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

const { width } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const { isAuthenticated, isNewUser, initializeAuth } = useAuthStore();
  const [onboardingComplete, setOnboardingComplete] = useState<string | null>(null);
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);
  
  const navigateToApp = async () => {
    // Add a small delay to ensure layout is mounted
    setTimeout(async () => {
      // Check authentication status and route accordingly
      if (isAuthenticated) {
        if (isNewUser) {
          // New user: go to child profile setup
          router.replace('/profile/child-profile');
        } else {
          // Existing user: go to main app
          router.replace('/(tabs)' as any);
        }
      } else {
        const onboardingStatus = await AsyncStorage.getItem('onboardingComplete');
        if (onboardingStatus === 'true') {
          router.replace('/auth/sign-in');
        } else {
          router.replace('/auth/onboarding');
        }
      }
    }, 200);
  };
  
  useEffect(() => {
    // Initialize authentication
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
      mass: 1,
    });
    
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    
    // Text entrance animation
    textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    
    // Loading animation
    loadingOpacity.value = withDelay(2000, withTiming(0, { duration: 500 }, () => {
      runOnJS(navigateToApp)();
    }));
  }, [logoOpacity, logoScale, textOpacity, loadingOpacity, navigateToApp, initializeAuth]);
  
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));
  
  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image 
            source={require('../assets/images/logo/platefull-mascot.png')}
            style={styles.logo}
          />
        </Animated.View>
        
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.appName}>PLATEFUL</Text>
          <Text style={styles.tagline}>Nourishing Little Ones</Text>
        </Animated.View>
        
        <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: colors.text.inverse,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.8,
  },
});

export default SplashScreen; 