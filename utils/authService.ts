import { Platform } from 'react-native';
import { safeGetItem, safeRemoveItem, safeSetItem } from './storage';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface SignInResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

interface SignUpResult {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Sign in user with email and password
  async signInUser(email: string, password: string): Promise<SignInResult> {
    try {
      console.log('AuthService: Attempting sign in for:', email, 'on platform:', Platform.OS);
      
      // Simulate API call - replace with your actual authentication logic
      await new Promise(resolve => setTimeout(resolve, Platform.OS === 'web' ? 800 : 1000));
      
      // For demo purposes, accept any email/password combination
      // In production, validate against your backend
      if (email && password && password.length >= 6) {
        const user: User = {
          id: '1',
          email: email,
          name: email.split('@')[0], // Use email prefix as name
        };
        
        const token = 'demo_token_' + Date.now();
        
        // Store user data and token using web-compatible storage
        const storeSuccess = await Promise.all([
          safeSetItem('userToken', token),
          safeSetItem('userEmail', email),
          safeSetItem('userName', user.name),
          safeSetItem('userId', user.id)
        ]);
        
        if (storeSuccess.every(success => success)) {
          console.log('AuthService: Sign in successful, token stored');
          return {
            success: true,
            user,
            token,
            message: 'Sign in successful'
          };
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      console.error('AuthService: Sign in error:', error);
      return {
        success: false,
        message: error?.message || 'Sign in failed'
      };
    }
  }

  // Sign up new user
  async signUpUser(email: string, password: string, name: string): Promise<SignUpResult> {
    try {
      console.log('AuthService: Attempting sign up for:', email, 'on platform:', Platform.OS);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, Platform.OS === 'web' ? 800 : 1000));
      
      // For demo purposes, accept any valid input
      if (email && password && password.length >= 6 && name) {
        const user: User = {
          id: 'new_' + Date.now(),
          email: email,
          name: name,
        };
        
        const token = 'demo_token_' + Date.now();
        
        // Store user data and token using web-compatible storage
        const storeSuccess = await Promise.all([
          safeSetItem('userToken', token),
          safeSetItem('userEmail', email),
          safeSetItem('userName', name),
          safeSetItem('userId', user.id)
        ]);
        
        if (storeSuccess.every(success => success)) {
          console.log('AuthService: Sign up successful, token stored');
          return {
            success: true,
            user,
            token,
            message: 'Account created successfully'
          };
        } else {
          throw new Error('Failed to store authentication data');
        }
      } else {
        throw new Error('Please fill in all required fields');
      }
    } catch (error: any) {
      console.error('AuthService: Sign up error:', error);
      return {
        success: false,
        message: error?.message || 'Sign up failed'
      };
    }
  }

  // Get current user from storage
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await safeGetItem('userToken');
      if (!token) {
        return null;
      }

      const [email, name, id] = await Promise.all([
        safeGetItem('userEmail'),
        safeGetItem('userName'),
        safeGetItem('userId')
      ]);

      if (email && name && id) {
        return {
          id,
          email,
          name
        };
      }

      return null;
    } catch (error) {
      console.error('AuthService: Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await safeGetItem('userToken');
      return !!token;
    } catch (error) {
      console.error('AuthService: Check authentication error:', error);
      return false;
    }
  }

  // Sign out user
  async signOut(): Promise<boolean> {
    try {
      console.log('AuthService: Signing out user');
      
      // Remove all auth-related data using web-compatible storage
      const removeSuccess = await Promise.all([
        safeRemoveItem('userToken'),
        safeRemoveItem('userEmail'),
        safeRemoveItem('userName'),
        safeRemoveItem('userId')
      ]);

      const success = removeSuccess.every(success => success);
      console.log('AuthService: Sign out', success ? 'successful' : 'failed');
      return success;
    } catch (error) {
      console.error('AuthService: Sign out error:', error);
      return false;
    }
  }

  // Update user profile
  async updateProfile(name: string): Promise<boolean> {
    try {
      const success = await safeSetItem('userName', name);
      console.log('AuthService: Profile update', success ? 'successful' : 'failed');
      return success;
    } catch (error) {
      console.error('AuthService: Update profile error:', error);
      return false;
    }
  }
}

// Export singleton instance
const authService = AuthService.getInstance();
export default authService; 