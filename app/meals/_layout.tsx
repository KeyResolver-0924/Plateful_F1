import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function MealsLayout() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Only redirect after a delay to ensure layout is mounted
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace('/auth/sign-in');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  // Don't render anything while checking auth or redirecting
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="logging" options={{ headerShown: false }} />
    </Stack>
  );
} 