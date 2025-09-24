import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../constants/colors';
import { NavigationService } from '../utils/navigation';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  email?: string;
  phoneNumber?: string;
}

const MainScreen: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(50);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  
  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const startAnimations = useCallback(() => {
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    headerTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
    
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    contentTranslateY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));
    
    cardScale.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 100 }));
    cardOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
  }, [headerOpacity, headerTranslateY, contentOpacity, contentTranslateY, cardScale, cardOpacity]);
  
  useEffect(() => {
    loadUserData();
    startAnimations();
  }, [startAnimations]);
  
  const handleLogout = async () => {
    try {
      await NavigationService.clearAuthData();
      router.replace('./auth/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleSectionPress = (section: string) => {
    router.push(`/${section}` as any);
  };
  
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));
  
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }]
  }));
  
  const sections = [
    {
      id: 'food',
      title: 'Food Tracking',
      subtitle: 'Log meals & nutrition',
      icon: 'restaurant-outline',
      color: colors.primary,
      gradient: colors.gradients.primary as [string, string]
    },
    {
      id: 'meals',
      title: 'Meal History',
      subtitle: 'View past meals',
      icon: 'calendar-outline',
      color: colors.secondary,
      gradient: colors.gradients.secondary as [string, string]
    },
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Manage account',
      icon: 'person-outline',
      color: colors.warning,
      gradient: colors.gradients.success as [string, string]
    }
  ];
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.loadingGradient}
        >
          <Image 
            source={require('../assets/images/logo/platefull-mascot.png')}
            style={styles.loadingLogo}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Animated.View style={[styles.headerContent, headerAnimatedStyle]}>
          <View style={styles.userInfo}>
            <Image 
              source={require('../assets/images/avatars/user.jpg')}
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>
                Welcome back, {userData?.name || 'User'}!
              </Text>
              <Text style={styles.subtitleText}>
                Let&apos;s track your nutrition journey
              </Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.contentWrapper, contentAnimatedStyle]}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.cardsGrid}>
              {sections.map((section, index) => (
                <Animated.View
                  key={section.id}
                  style={[
                    styles.card,
                    cardAnimatedStyle,
                    { animationDelay: index * 100 }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.cardTouchable}
                    onPress={() => handleSectionPress(section.id)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={section.gradient}
                      style={styles.cardGradient}
                    >
                      <Ionicons 
                        name={section.icon as any} 
                        size={32} 
                        color={colors.text.inverse} 
                      />
                      <Text style={styles.cardTitle}>{section.title}</Text>
                      <Text style={styles.cardSubtitle}>{section.subtitle}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
          
          {/* Progress Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Meals Logged</Text>
                <Text style={styles.progressValue}>3/5</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Calories</Text>
                <Text style={styles.progressValue}>1,200/2,000</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressLabel}>Water</Text>
                <Text style={styles.progressValue}>6/8 cups</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 72) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default MainScreen; 