import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/colors';
import { useAuthStore } from '../stores/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isLayoutReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  isLayoutReady: false,
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    // Initialize authentication
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // Mark layout as ready after a delay
    const timer = setTimeout(() => {
      setIsLayoutReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only handle navigation after layout is ready and auth check is complete
    if (isLayoutReady && !isLoading) {
      if (!isAuthenticated) {
        // Small delay to ensure navigation is safe
        setTimeout(() => {
          router.replace('/auth/sign-in');
        }, 100);
      }
    }
  }, [isAuthenticated, isLoading, isLayoutReady]);

  const value = {
    isAuthenticated,
    isLoading,
    isLayoutReady,
  };

  // Show loading while initializing
  if (isLoading || !isLayoutReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 