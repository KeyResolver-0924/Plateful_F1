// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.142.31:5000/api',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    
    // User management
    USERS: {
      PROFILE: '/users/profile',
      AVATAR: '/users/avatar',
    },
    
    // Child management
    CHILDREN: {
      LIST: '/children',
      CREATE: '/children',
      UPDATE: (id: string) => `/children/${id}`,
      DELETE: (id: string) => `/children/${id}`,
    },
    
    // Meal management
    MEALS: {
      LIST: '/meals',
      CREATE: '/meals',
      UPDATE: (id: string) => `/meals/${id}`,
      DELETE: (id: string) => `/meals/${id}`,
    },
    
    // Food management
    FOODS: {
      LIST: '/foods',
      CREATE: '/foods',
      UPDATE: (id: string) => `/foods/${id}`,
      DELETE: (id: string) => `/foods/${id}`,
    },
    
    // Gamification
    GAMIFICATION: {
      BADGES: '/gamification/badges',
      PROGRESS: '/gamification/progress',
      UNLOCK_BADGE: (id: string) => `/gamification/badges/${id}/unlock`,
    },
    
    // Reporting
    REPORTING: {
      REPORTS: '/reporting',
      ANALYTICS: '/reporting/analytics',
    },
    
    // Learning
    LEARNING: {
      CONTENT: '/learning',
      PROGRESS: (id: string) => `/learning/${id}/progress`,
    },
    
    // File upload
    UPLOAD: {
      FILE: '/upload',
    },
    
    // Health check
    HEALTH: '/health',
  },
  
  // Request configuration
  REQUEST: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // Headers
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    AUTHORIZATION: 'Bearer',
  },
  
  // Status codes
  STATUS: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
};

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success messages
export const API_SUCCESS = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logout successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  CHILD_ADDED: 'Child added successfully!',
  CHILD_UPDATED: 'Child updated successfully!',
  CHILD_REMOVED: 'Child removed successfully!',
  MEAL_ADDED: 'Meal added successfully!',
  MEAL_UPDATED: 'Meal updated successfully!',
  MEAL_REMOVED: 'Meal removed successfully!',
  BADGE_UNLOCKED: 'Badge unlocked!',
  FILE_UPLOADED: 'File uploaded successfully!',
}; 