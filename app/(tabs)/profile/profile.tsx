import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInUp
} from 'react-native-reanimated';
import HeaderProfile from '../../../components/common/HeaderProfile';
import { colors } from '../../../constants/colors';
import { useAuthStore } from '../../../stores/authStore';
import { useMealStore } from '../../../stores/mealStore';
import { useUserStore } from '../../../stores/userStore';
import { getAvatarSource } from '../../../utils/avatarUtils';

interface ChildProfile {
  name: string;
  ageRange: string;
  gender: string;
  avatar: any;
  allergies: string[];
  preferences: any;
  gamification: any;
  fruits: string[];
  vegetables: string[];
  proteins: string[];
  height: string;
  weight: string;
}

interface preferencesType {
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  timezone: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: any;
  children: ChildProfile[];
  role: string;
  isVerified: boolean;
  preferences: preferencesType;
}

interface notificationsType {
  email: boolean;
  push: boolean;
  sms: boolean;
}

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<'childProfile' | 'myProfile'>('childProfile');
  const [isEditing, setIsEditing] = useState(false);
  const { childProfile: childProfileStore, getChildById, selectedChildId } = useUserStore();
  const { meals, getMeal } = useMealStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (selectedChildId) {
      getChildById(selectedChildId);
      getMeal(selectedChildId);
    }
  }, [selectedChildId]);

  const childProfile = childProfileStore || {
    name: 'Loading...',
    ageRange: 'Loading...',
    gender: 'Loading...',
    avatar: 'girl',
    allergies: [],
    preferences: {},
    height: "0",
    weight: "0",
    gamification: {},
    fruits: [],
    vegetables: [],
    proteins: [],
  };

  const userProfile = user?.user || {
    name: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    avatar: 'user',
    children: [],
    role: 'Loading...',
    isVerified: false,
    preferences: {
      language: 'en',
      notifications: {
        email: false,
        push: false,
        sms: false,
      },
      timezone: 'UTC',
    },
  };

  const realMeals = meals && meals.length > 0 ? meals[0] : null;
  const [editingChild, setEditingChild] = useState<ChildProfile>({ ...childProfile as ChildProfile });
  const [editingUser, setEditingUser] = useState<UserProfile>({ ...userProfile as UserProfile });

  const handleSaveChildProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Child profile updated successfully!');
  };

  const handleSaveUserProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditingChild({ ...childProfile as ChildProfile });
    setEditingUser({ ...userProfile as UserProfile });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    console.log('handleLogout: >>---->');
    await AsyncStorage.removeItem('auth-token');
    router.replace('/auth/sign-in'); 
  };

  const renderChildProfileTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <Animated.View entering={FadeInUp.springify()}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={getAvatarSource(childProfile)} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{childProfile.name}</Text>
              <Text style={styles.profileSubtext}>{childProfile.ageRange}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editingChild.gender}
                  onChangeText={(text) => setEditingChild({...editingChild, gender: text})}
                />
              ) : (
                <Text style={styles.detailValue}>{childProfile.gender}</Text>
              )}
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Height:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editingChild.height}
                  onChangeText={(text) => setEditingChild({...editingChild, height: text})}
                />
              ) : (
                <Text style={styles.detailValue}>{childProfile.height} cm</Text>
              )}
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editingChild.weight}
                  onChangeText={(text) => setEditingChild({...editingChild, weight: text})}
                />
              ) : (
                <Text style={styles.detailValue}>{childProfile.weight} kg</Text>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies & Preferences</Text>
            <View style={styles.tagsContainer}>
              {childProfile.allergies?.map((allergy, index) => (
                <View key={index} style={[styles.tag, styles.allergyTag]}>
                  <Text style={styles.tagText}>{allergy}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            {realMeals ? (
              Object.entries(realMeals).map(([mealType, mealData]: [string, any]) => (
                <View key={mealType} style={styles.mealSection}>
                  {Array.isArray(mealData.foods) && <Text style={styles.mealTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>}
                  {mealData?.foods && Array.isArray(mealData.foods) && mealData.foods.length > 0 && (
                    <View style={styles.mealItems}>
                      {mealData.foods.map((foodItem: any, foodIndex: number) => (
                        <View key={foodIndex} style={styles.mealItem}>
                          <Text style={styles.foodName}>{foodItem.food}</Text>
                          <Text style={styles.foodAmount}>{foodItem.amount} g</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noMealText}>No meals logged yet</Text>
            )}
          </View>
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChildProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderMyProfileTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <Animated.View entering={FadeInUp.springify()}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={getAvatarSource(userProfile)} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileSubtext}>{userProfile.role} Member</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editingUser.email}
                  onChangeText={(text) => setEditingUser({...editingUser, email: text})}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.detailValue}>{userProfile.email}</Text>
              )}
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editingUser.phone}
                  onChangeText={(text) => setEditingUser({...editingUser, phone: text})}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.detailValue}>{userProfile.phone}</Text>
              )}
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Children:</Text>
              {userProfile.children?.map((data, index) => (
                <Text key={index} style={styles.detailValue}>{data.name}</Text>
              ))}
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Language:</Text>
              <Text style={styles.detailValue}>{userProfile.preferences.language}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notifications:</Text>
              <View style={styles.switchContainer}>
                <TouchableOpacity 
                  style={[
                    styles.switch, 
                    userProfile.preferences.notifications ? styles.switchOn : styles.switchOff
                  ]}
                  onPress={() => setEditingUser({...userProfile as UserProfile, preferences: {...userProfile.preferences as preferencesType, notifications: {...userProfile.preferences.notifications as notificationsType, email: !userProfile.preferences.notifications.email}}})}
                >
                  <View style={[
                    styles.switchThumb, 
                    userProfile.preferences.notifications ? styles.switchThumbOn : styles.switchThumbOff
                  ]} />
                </TouchableOpacity>
                <Text style={styles.switchLabel}>
                  {userProfile.preferences.notifications ? 'On' : 'Off'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-checkmark" size={20} color={colors.text.secondary} />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications" size={20} color={colors.text.secondary} />
              <Text style={styles.settingText}>Notification Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="language" size={20} color={colors.text.secondary} />
              <Text style={styles.settingText}>Language & Region</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle" size={20} color={colors.text.secondary} />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          {isEditing && (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveUserProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <HeaderProfile />
      <View style={styles.contentContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'childProfile' && styles.tabActive]}
            onPress={() => setActiveTab('childProfile')}
          >
            <Text style={[styles.tabText, activeTab === 'childProfile' && styles.tabTextActive]}>
              Child Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myProfile' && styles.tabActive]}
            onPress={() => setActiveTab('myProfile')}
          >
            <Text style={[styles.tabText, activeTab === 'myProfile' && styles.tabTextActive]}>
              My Profile
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'childProfile' && renderChildProfileTab()}
        {activeTab === 'myProfile' && renderMyProfileTab()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  editButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 20,
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '600',
    minWidth: 100,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    marginLeft: 16,
  },
  editInput: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyTag: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  preferenceTag: {
    backgroundColor: colors.info + '20',
    borderWidth: 1,
    borderColor: colors.info,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    marginRight: 12,
  },
  switchOn: {
    backgroundColor: colors.primary,
  },
  switchOff: {
    backgroundColor: colors.text.disabled,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background,
  },
  switchThumbOn: {
    transform: [{ translateX: 20 }],
  },
  switchThumbOff: {
    transform: [{ translateX: 0 }],
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
    marginLeft: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: colors.text.disabled,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  mealSection: {
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  mealItems: {
    marginLeft: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
  foodAmount: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  noMealText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.error + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButtonText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 16,
  },
});

export default ProfileScreen;
