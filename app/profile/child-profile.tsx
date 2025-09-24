import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import type { ChildProfile as StoreChildProfile } from '../../stores/userStore';
import { useUserStore } from '../../stores/userStore';
import { getAvatarSource } from '../../utils/avatarUtils';

const { width } = Dimensions.get('window');

const ChildProfileScreen = () => {
  const params = useLocalSearchParams();
  const isFromHeader = params.fromHeader === 'true';

  const { profile } = useUserStore();
  const childProfiles = (
    (profile as any)?.data?.user?.children ?? profile?.children ?? []
  ) as StoreChildProfile[];

  const handleAddChild = () => {
    router.replace('/profile/setup');
  };
  
  useEffect(() => {
    console.log('childProfiles: >>--->', childProfiles);
  }, []);

  // const handleEditChild = (childId: string) => {
  //   router.replace({
  //     pathname: '/profile/setup',
  //     params: { childId }
  //   });
  // };

  const { setOnboardingComplete, setNewUser } = useAuthStore();
  
  const handleNext = () => {
    // Mark onboarding as complete and user as no longer new
    setOnboardingComplete(true);
    setNewUser(false);
    router.replace('/(tabs)' as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFUL!</Text>
        <Text style={styles.subtitleText}>Let's get started.</Text>
      </LinearGradient>
      
      <View style={styles.contentContainer}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>Child's Profile</Text>
          <Text style={styles.subtitle}>Let's Explore About Your Child's Meal!</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {childProfiles.length > 0 && (
            <View style={styles.profileGrid}>
              {childProfiles.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childCard}
                  // onPress={() => handleEditChild(child.id)}
                >
                  <View style={styles.avatarContainer}>
                    {(child as any).avatar ? (
                      <Image source={getAvatarSource(child)} style={styles.avatar} />
                    ) : (
                      <Image source={getAvatarSource("boy")} style={styles.avatar} />
                    )}
                  </View>
                  <Text style={styles.childName}>{child.name}</Text>
                  {child.ageRange && <Text style={styles.childAge}>Age: {child.ageRange}</Text>}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
              style={styles.addChildCard}
              onPress={handleAddChild}
              >
              <View style={styles.addButton}>
                <Ionicons name="add" size={40} color={colors.text.inverse} />
              </View>
              <Text style={styles.addChildText}>Add New Child's Profile</Text>
            </TouchableOpacity>
            </View>
          )}
            {childProfiles.length === 0 && (
              <TouchableOpacity
                style={styles.addChildCard}
                onPress={handleAddChild}
              >
                <View style={styles.addButton}>
                  <Ionicons name="add" size={40} color={colors.text.inverse} />
                </View>
                <Text style={styles.addChildText}>Add New Child's Profile</Text>
              </TouchableOpacity>
            )}

        </ScrollView>
        
        {!isFromHeader && (
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.previousText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <Text style={styles.previousText}>Skip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 50,
    alignItems: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 24,
  },
  contentHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  childCard: {
    width: (width - 72) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  addChildCard: {
    width: (width - 72) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    resizeMode: 'cover',
  },
  uploadContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  childAge: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  addChildText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previousText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default ChildProfileScreen; 