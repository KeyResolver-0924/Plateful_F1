import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';

export default function ProfileLayout() {
  const { isAuthenticated, isNewUser, isLoading, initializeAuth } = useAuthStore();

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
      <Stack.Screen name="child-profile" options={{ headerShown: false }} />
      <Stack.Screen name="setup" options={{ headerShown: false }} />
      <Stack.Screen name="setup-success" options={{ headerShown: false }} />
    </Stack>
  );
} 