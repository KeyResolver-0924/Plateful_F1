import { create } from 'zustand';
import { apiService } from '../utils/apiService';
import MessageHandler from '../utils/messageHandler';

export interface ChildProfile {
  id: string;
  name: string;
  ageRange: string;
  gender: string;
  avatar?: string;
  height?: string;
  weight?: string;
  gamification?: any;
  allergies?: string[];
  vegetables?: string[];
  fruits?: string[];
  proteins?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  preferences?: any;
  children?: ChildProfile[];
}

export interface UserState {
  profile: UserProfile | null;
  selectedChildId: string | null;
  childProfile: ChildProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserActions {
  // Profile management
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  
  // Child profile management
  addChild: (childData: Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateChild: (childId: string, childData: Partial<ChildProfile>) => Promise<void>;
  removeChild: (childId: string) => Promise<void>;
  selectChild: (childId: string) => void;
  getSelectedChild: () => ChildProfile | null;
  getChildById: (childId: string) => Promise<ChildProfile>;
  // Preferences
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>;
  
  // State management
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Initialize from storage
  initializeUser: () => Promise<void>;
}

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  profile: null,
  childProfile: null,
  selectedChildId: null,
  isLoading: false,
  error: null,

  // Profile management
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateProfile(profileData);
      
      if (response.success && response.data) {
        set({ profile: response.data, isLoading: false });
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
      });
    }
  },

  updateAvatar: async (avatarUrl) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateAvatar(avatarUrl);
      
      if (response.success && response.data) {
        set({ profile: response.data, isLoading: false });
      } else {
        throw new Error(response.error || 'Failed to update avatar');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update avatar',
        isLoading: false,
      });
    }
  },

  // Child profile management
  addChild: async (childData) => {
    console.log('Child data3:', childData);
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.addChild(childData);
      
      if (response.success && response.data) {
        // Refresh the profile to get updated children
        const profileResponse = await apiService.getCurrentUser();
        if (profileResponse.success && profileResponse.data) {
          set({ 
            profile: profileResponse.data,
            selectedChildId: response.data.id,
            isLoading: false 
          });
        }
        
        // Show success message
        MessageHandler.showSuccess('Child profile created successfully!');
      } else {
        // Handle error response
        MessageHandler.handleApiResponse(response, {
          title: 'Add Child',
          errorMessage: 'Failed to create child profile. Please try again.'
        });
        throw new Error(response.error || 'Failed to add child');
      }
    } catch (error) {
      // Handle caught errors
      MessageHandler.handleApiError(error, {
        title: 'Add Child Error',
        errorMessage: 'Failed to create child profile. Please check your connection and try again.'
      });
      
      set({
        error: error instanceof Error ? error.message : 'Failed to add child',
        isLoading: false,
      });
    }
  },

  getChildById: async (childId: string) => {
    const response = await apiService.getChildById(childId);
    set({childProfile: response.data});
    return response.data;
  },

  updateChild: async (childId, childData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateChild(childId, childData);
      
      if (response.success && response.data) {
        // Refresh the profile to get updated children
        const profileResponse = await apiService.getCurrentUser();
        if (profileResponse.success && profileResponse.data) {
          set({ profile: profileResponse.data, isLoading: false });
        }
      } else {
        throw new Error(response.error || 'Failed to update child');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update child',
        isLoading: false,
      });
    }
  },

  removeChild: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.removeChild(childId);
      
      if (response.success) {
        // Refresh the profile to get updated children
        const profileResponse = await apiService.getCurrentUser();
        if (profileResponse.success && profileResponse.data) {
          const updatedProfile = profileResponse.data;
          const updatedChildren = updatedProfile.children || [];
          
          // If the removed child was selected, select the first available child or null
          let newSelectedChildId = get().selectedChildId;
          if (newSelectedChildId === childId) {
            newSelectedChildId = updatedChildren.length > 0 ? updatedChildren[0].id : null;
          }
          
          set({ 
            profile: updatedProfile, 
            selectedChildId: newSelectedChildId,
            isLoading: false 
          });
        }
      } else {
        throw new Error(response.error || 'Failed to remove child');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove child',
        isLoading: false,
      });
    }
  },

  selectChild: (childId) => {
    set({ selectedChildId: childId });
  },

  getSelectedChild: () => {
    const { profile, selectedChildId } = get();
    if (!profile || !selectedChildId || !profile.children) return null;
    return profile.children.find(child => child.id === selectedChildId) || null;
  },

  // Preferences
  updatePreferences: async (preferences) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.updateProfile({ preferences });
      
      if (response.success && response.data) {
        set({ profile: response.data, isLoading: false });
      } else {
        throw new Error(response.error || 'Failed to update preferences');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update preferences',
        isLoading: false,
      });
    }
  },

  // State management
  setProfile: (profile) => {
    set({ profile });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Initialize from storage
  initializeUser: async () => {
    const { profile } = get();
    if (profile && profile.children && profile.children.length > 0 && !get().selectedChildId) {
      set({ selectedChildId: profile.children[0].id });
    }
  },
})); 