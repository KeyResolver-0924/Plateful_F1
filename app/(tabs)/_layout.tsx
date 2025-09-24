import { router, Tabs, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Image, Platform } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import { useTabBarVisibility } from '../../utils/tabBarUtils';

interface TabLayoutProps {
  hideTabBar?: boolean;
}

export default function TabLayout({ hideTabBar = false }: TabLayoutProps) {
  const { shouldHideTabBar } = useTabBarVisibility();
  const { isAuthenticated, isNewUser, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/sign-in');
    } else if (!isLoading && isAuthenticated && isNewUser) {
      router.replace('/profile/child-profile');
    }
  }, [isLoading, isAuthenticated, isNewUser]);

  if (isLoading || !isAuthenticated || isNewUser) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Loading' }} />
      </Tabs>
    );
  }

  const getTabBarStyle = () => {
    const baseStyle = Platform.select({
      ios: {
        position: 'absolute' as const,
      },
      default: {},
    });

    const shouldHide = hideTabBar || shouldHideTabBar;
    console.log('Tab bar visibility check:', { shouldHide, shouldHideTabBar, pathname: usePathname() });

    if (shouldHide) {
      return {
        ...baseStyle,
        display: 'none' as const,
        height: 0,
        opacity: 0,
      };
    }
    return {
      ...baseStyle,
      height: 60,
      paddingBottom: 5,
      paddingTop: 5,
    };
  };
  const shouldHide = hideTabBar || shouldHideTabBar;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: shouldHide ? () => null : HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: getTabBarStyle(),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/home.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Child\'s Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/profile.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: 'Learning Modules',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/learning.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reporting"
        options={{
          title: 'Reporting',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/images/tab/report.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}