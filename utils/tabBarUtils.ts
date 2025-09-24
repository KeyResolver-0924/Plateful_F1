import { usePathname } from 'expo-router';

// Pages where tab bar should be hidden
export const HIDDEN_TAB_PAGES = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/otp',
  '/auth/onboarding',
  '/auth/verification-success',
  '/splash',
  '/food/selection',
  '/food/report',
  '/meals/logging',
  '/profile/setup',
  // Hide tab bar for specific (tabs) routes
  '/leaderboard',
  '/tracking',
  '/history',
  // Alternative patterns
  'leaderboard',
  'tracking',
  'history',
  'foodLearn',
];

// Hook to determine if tab bar should be hidden based on current route
export const useTabBarVisibility = () => {
  const pathname = usePathname();
  
  const shouldHideTabBar = HIDDEN_TAB_PAGES.some(page => 
    pathname?.includes(page)
  );
  
  return {
    shouldHideTabBar,
    pathname,
  };
};

// Helper function to get tab bar style based on visibility
export const getTabBarStyle = (shouldHide: boolean = false) => {
  const baseStyle = {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  };

  if (shouldHide) {
    return {
      ...baseStyle,
      display: 'none' as const,
      height: 0,
    };
  }

  return baseStyle;
};

// Alternative approach: Screen-specific tab bar options
export const getScreenOptions = (hideTabBar: boolean = false) => ({
  tabBarStyle: hideTabBar ? { display: 'none' } : undefined,
}); 