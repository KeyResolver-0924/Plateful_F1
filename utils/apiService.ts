import { config } from '../constants/config';
import { useAuthStore } from '../stores/authStore';
import { useFoodStore } from '../stores/foodStore';
import { useGamificationStore } from '../stores/gamificationStore';
import { useLearningStore } from '../stores/learningStore';
import { useMealStore } from '../stores/mealStore';
import { useReportingStore } from '../stores/reportingStore';
import { useUserStore } from '../stores/userStore';
import { storage } from './storage';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || config.API_BASE_URL;
const API_TIMEOUT = 10000; // 10 seconds

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    avatar?: string;
    preferences?: any;
    children?: any[];
  };
  token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: string;
  preferences?: any;
  children?: any[];
}

// API Service Class
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await storage.getItem('auth-token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  private async setAuthToken(token: string): Promise<void> {
    try {
      await storage.setItem('auth-token', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Remove auth token from storage
  private async removeAuthToken(): Promise<void> {
    try {
      await storage.removeItem('auth-token');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Helper function to store data in appropriate store based on endpoint
  private storeDataInStore<T>(endpoint: string, data: T): void {
    try {
      if (endpoint.startsWith('/auth/')) {
        // Auth-related data
        if (endpoint === '/auth/login' || endpoint === '/auth/register') {
          const authStore = useAuthStore.getState();
          if (data && typeof data === 'object' && 'user' in data && 'token' in data) {
            authStore.setUser((data as any).user);
            authStore.setToken((data as any).token);
          }
        } else if (endpoint === '/auth/me') {
          const userStore = useUserStore.getState();
          userStore.setProfile(data as any);
        }
      } else if (endpoint.startsWith('/users/')) {
        // User profile data
        const userStore = useUserStore.getState();
        if (endpoint === '/users/profile' || endpoint === '/users/avatar') {
          userStore.setProfile(data as any);
        }
      } else if (endpoint.startsWith('/children')) {
        // Child profile data
        const userStore = useUserStore.getState();
        // If server returned full children list
        if (Array.isArray(data) && userStore.profile) {
          userStore.setProfile({ ...userStore.profile, children: data });
        }
        // If server returned a single child object (e.g., after POST /children)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const currentProfile = userStore.profile;
          const child: any = data;
          if (currentProfile && child && child.id) {
            const currentChildren = currentProfile.children || [];
            const mergedChildren = [
              ...currentChildren.filter((c: any) => c.id !== child.id),
              child,
            ];
            userStore.setProfile({ ...currentProfile, children: mergedChildren });
            userStore.selectChild(child.id);
          }
        }
      } else if (endpoint.startsWith('/meals')) {
        // Meal data
        const mealStore = useMealStore.getState();
        if (Array.isArray(data)) {
          mealStore.setMeals(data as any);
        } else if (data && typeof data === 'object') {
          // For single meal, we'll just update the meals array
          // The actual addMeal logic should be handled in the component
          console.log('Single meal data received:', data);
        }
      } else if (endpoint.startsWith('/foods')) {
        // Food data
        const foodStore = useFoodStore.getState();
        if (Array.isArray(data)) {
          foodStore.setFoods(data as any);
        }
      } else if (endpoint.startsWith('/gamification/')) {
        // Gamification data
        const gamificationStore = useGamificationStore.getState();
        if (endpoint.includes('/badges')) {
          gamificationStore.setBadges(data as any);
        } else if (endpoint.includes('/progress')) {
          // Handle progress data - update relevant gamification state
          if (data && typeof data === 'object') {
            const progressData = data as any;
            if (progressData.totalPoints !== undefined) {
              gamificationStore.setTotalPoints(progressData.totalPoints);
            }
            if (progressData.currentStreak !== undefined) {
              gamificationStore.setCurrentStreak(progressData.currentStreak);
            }
            if (progressData.level !== undefined) {
              gamificationStore.setLevel(progressData.level);
            }
          }
        }
      } else if (endpoint.startsWith('/reporting')) {
        // Reporting data
        const reportingStore = useReportingStore.getState();
        if (Array.isArray(data)) {
          reportingStore.setReports(data);
        }
      } else if (endpoint.startsWith('/learning')) {
        // Learning data
        const learningStore = useLearningStore.getState();
        if (Array.isArray(data)) {
          learningStore.setContent(data);
        }
      }
    } catch (error) {
      console.error('Error storing data in store:', error);
    }
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getAuthToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      console.log('🌐 Making API request to:', url);
      console.log('📤 Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body ? JSON.parse(config.body as string) : undefined
      });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('❌ API request failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        
        // Create a proper error response object
        const errorResponse: ApiResponse = {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
          message: data.message || `HTTP ${response.status}: ${response.statusText}`,
          data: data.data
        };
        
        throw errorResponse;
      }

      // Store data in appropriate store if request was successful
      if (data && response.ok) {
        this.storeDataInStore(endpoint, data);
      }

      return data;
    } catch (error) {
      console.error('❌ API request error:', {
        url,
        error: error instanceof Error ? error.message : error,
        baseURL: this.baseURL,
        endpoint
      });
      
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError: ApiResponse = {
          success: false,
          error: 'Request timeout. Please check your connection and try again.',
          message: 'Request timeout. Please check your connection and try again.'
        };
        throw timeoutError;
      }
      
      // If error is already an ApiResponse, throw it as is
      if (error && typeof error === 'object' && 'success' in error) {
        throw error;
      }
      
      // Convert other errors to ApiResponse format
      const genericError: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
      
      throw genericError;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    console.log('userData: >>--->', userData);
    
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/me');
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  // User profile methods
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateAvatar(avatarUrl: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/users/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar: avatarUrl }),
    });
  }

  // Child profile methods
  async getChildren(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/children');
  }

  async addChild(childData: any): Promise<ApiResponse<any>> {
    console.log('childData: >>--->', childData);
    return this.request<any>('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }

  async getChildById(childId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/children/${childId}`, {
      method: 'GET',
    });
  }

  async updateChild(childId: string, childData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    });
  }

  async removeChild(childId: string): Promise<ApiResponse> {
    return this.request(`/children/${childId}`, {
      method: 'DELETE',
    });
  }

  // Meal methods
  async getMeals(childId: string): Promise<ApiResponse<any[]>> {
    return this.request<any>(`/meals/${childId}`, {
      method: 'GET',
    });
  }

  async addMeal(mealData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/meals', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  async recordMeal(mealData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/meals/history', {
      method: 'POST',
      body: JSON.stringify(mealData),
    });
  }

  async getMealHistoryByIdToday(childId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/meals/history/${childId}`, {
      method: 'GET',
    });
  }

  async updateMeal(mealId: string, mealData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/meals/${mealId}`, {
      method: 'PUT',
      body: JSON.stringify(mealData),
    });
  }

  async removeMeal(mealId: string): Promise<ApiResponse> {
    return this.request(`/meals/${mealId}`, {
      method: 'DELETE',
    });
  }

  // Food methods
  async getFoods(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/foods${queryParams}`);
  }

  // Gamification methods
  async getBadges(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/gamification/badges');
  }

  async unlockBadge(badgeId: string): Promise<ApiResponse> {
    return this.request(`/gamification/badges/${badgeId}/unlock`, {
      method: 'POST',
    });
  }

  async getProgress(): Promise<ApiResponse<any>> {
    return this.request<any>('/gamification/progress');
  }

  // Reporting methods
  async getReports(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/reporting${queryParams}`);
  }

  // Learning methods
  async getLearningContent(filters?: any): Promise<ApiResponse<any[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request<any[]>(`/learning${queryParams}`);
  }

  async updateLearningProgress(contentId: string, progress: number): Promise<ApiResponse> {
    return this.request(`/learning/${contentId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  // File upload
  async uploadFile(file: any, type: 'avatar' | 'meal' | 'food'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }
}

// Create and export singleton instance
export const apiService = new ApiService(API_BASE_URL, API_TIMEOUT);