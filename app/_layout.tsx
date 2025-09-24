import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../components/AuthProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontTimeout, setFontTimeout] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Prevent the splash screen from auto-hiding
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Set a timeout for font loading to prevent hanging
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFontTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, []);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded || error || fontTimeout) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, fontTimeout]);

  // Continue if fonts are loaded, there's an error, or timeout reached
  if (!loaded && !error && !fontTimeout) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="food" options={{ headerShown: false }} />
          <Stack.Screen name="meals" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
