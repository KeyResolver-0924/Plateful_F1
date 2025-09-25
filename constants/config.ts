export interface AgeRange {
  label: string;
  value: string;
}

export interface DietaryRestriction {
  label: string;
  value: string;
}

export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    standard: string;
    decelerate: string;
    accelerate: string;
  };
}

export interface OtpConfig {
  length: number;
  resendDelay: number;
  expiryTime: number;
}

export interface ImageUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  quality: number;
}

export interface FoodCategories {
  fruits: string;
  vegetables: string;
  proteins: string;
  grains: string;
  dairy: string;
}

export interface Config {
  APP_NAME: string;
  API_BASE_URL: string;
  GOOGLE_IOS_CLIENT_ID: string;
  GOOGLE_ANDROID_CLIENT_ID: string;
  GOOGLE_WEB_CLIENT_ID: string;
  animation: AnimationConfig;
  otp: OtpConfig;
  imageUpload: ImageUploadConfig;
  foodCategories: FoodCategories;
  ageRanges: AgeRange[];
  dietaryRestrictions: DietaryRestriction[];
}

export const config: Config = {
  APP_NAME: 'PlateFul',
  API_BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'  // Use proxy in development
    : 'https://api.platefull.com/api',
  
  // Google OAuth Configuration
  GOOGLE_IOS_CLIENT_ID: 'YOUR_IOS_CLIENT_ID',
  GOOGLE_ANDROID_CLIENT_ID: 'YOUR_ANDROID_CLIENT_ID',
  GOOGLE_WEB_CLIENT_ID: 'YOUR_WEB_CLIENT_ID',
  
  // Animation Configuration
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    easing: {
      standard: 'ease-in-out',
      decelerate: 'ease-out',
      accelerate: 'ease-in'
    }
  },
  
  // OTP Configuration
  otp: {
    length: 4,
    resendDelay: 180, // 3 minutes in seconds
    expiryTime: 300 // 5 minutes in seconds
  },
  
  // Image Upload Configuration
  imageUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    quality: 0.8
  },
  
  // Food Categories
  foodCategories: {
    fruits: 'Fruits',
    vegetables: 'Vegetables',
    proteins: 'Proteins',
    grains: 'Grains',
    dairy: 'Dairy'
  },
  
  // Age Ranges
  ageRanges: [
    { label: '6-9 months', value: '6-9m' },
    { label: '9-12 months', value: '9-12m' },
    { label: '12-18 months', value: '12-18m' },
    { label: '18-24 months', value: '18-24m' },
    { label: '24-30 months', value: '24-30m' },
    { label: '30-36 months', value: '30-36m' },
    { label: '36+ months', value: '36m+' },
  ],
  
  // Dietary Restrictions
  dietaryRestrictions: [
    { label: 'None', value: 'none' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten Free', value: 'gluten_free' },
    { label: 'Dairy Free', value: 'dairy_free' },
    { label: 'Nut Free', value: 'nut_free' },
    { label: 'Egg Free', value: 'egg_free' },
    { label: 'Soy Free', value: 'soy_free' },
    { label: 'Shellfish Free', value: 'shellfish_free' },
    { label: 'Fish Free', value: 'fish_free' },
    { label: 'Pork Free', value: 'pork_free' },
    { label: 'Beef Free', value: 'beef_free' },
    { label: 'Chicken Free', value: 'chicken_free' },
    { label: 'Turkey Free', value: 'turkey_free' },
    { label: 'Lamb Free', value: 'lamb_free' },
    { label: 'Other', value: 'other' }
  ]
};

export default config;
