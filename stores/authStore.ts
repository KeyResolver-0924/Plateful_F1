import { create } from 'zustand';
import { apiService, AuthResponse } from '../utils/apiService';
import MessageHandler from '../utils/messageHandler';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  password?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  preferences?: any;
  children?: any[];
  hasCompletedOnboarding?: boolean;
  user?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  isNewUser: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<AuthResponse | undefined>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<AuthResponse | undefined>;
  logout: () => void;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  resendOTP: (phone: string) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setOnboardingComplete: (completed: boolean) => void;
  setNewUser: (isNew: boolean) => void;
  initializeAuth: () => Promise<void>;
  testConnection: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
  isNewUser: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          isNewUser: false, // Existing user signing in
          isLoading: false,
        });
        
        // Show success message
        MessageHandler.showSuccess('Login successful! Welcome back!');
        return response.data;
      } else {
        // Handle error response
        MessageHandler.handleApiResponse(response, {
          title: 'Login',
          errorMessage: 'Login failed. Please check your credentials and try again.'
        });
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      // Handle caught errors
      MessageHandler.handleApiError(error, {
        title: 'Login Error',
        errorMessage: 'Login failed. Please check your connection and try again.'
      });
      
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
    }
  },

  loginWithPhone: async (phone: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement phone login with OTP when backend endpoint is ready
      throw new Error('Phone login not implemented yet');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Phone login failed',
        isLoading: false,
      });
    }
  },
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Name, email, and password are required');
      }

      const response = await apiService.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
      });

      if (response.success && response.data) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          hasCompletedOnboarding: false,
          isNewUser: true, // New user signing up
          isLoading: false,
          error: null,
        });
        
        // Show success message
        MessageHandler.showSuccess('Registration successful! Welcome to Plateful!');
        return response.data;
      } else {
        // Handle error response
        MessageHandler.handleApiResponse(response, {
          title: 'Registration',
          errorMessage: 'Registration failed. Please check your information and try again.'
        });
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      // Handle caught errors
      MessageHandler.handleApiError(error, {
        title: 'Registration Error',
        errorMessage: 'Registration failed. Please check your connection and try again.'
      });
      
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  verifyOTP: async (phone: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement OTP verification when backend endpoint is ready
      throw new Error('OTP verification not implemented yet');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'OTP verification failed',
        isLoading: false,
      });
    }
  },

  resendOTP: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement OTP resend when backend endpoint is ready
      throw new Error('OTP resend not implemented yet');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'OTP resend failed',
        isLoading: false,
      });
    }
  },

  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  setOnboardingComplete: (completed: boolean) => set({ hasCompletedOnboarding: completed }),
  setNewUser: (isNew: boolean) => set({ isNewUser: isNew }),
  
  initializeAuth: async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // If getCurrentUser fails, user is not authenticated
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  testConnection: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔍 Testing backend connection...');
      console.log('📍 API Base URL:', process.env.EXPO_PUBLIC_API_URL || 'https://api.platefull.com');
      
      const response = await apiService.healthCheck();
      console.log('✅ Backend connection successful:', response);
      
      set({
        error: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      
      let errorMessage = 'Backend connection failed';
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = 'CORS Error: Backend server needs CORS configuration. Please ensure your backend allows requests from this origin.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Connection timeout: Backend server may not be running or is not responding.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error: Unable to reach the backend server. Please check if the server is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },
})); 