import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { avatarMap, getAvatarSource } from '../../utils/avatarUtils';

interface ChildData {
  id: string; // Changed from _id to id to match your usage
  name: string;
  avatar: ImageSourcePropType;
  ageRange: string;
  streak: number;
  level: number;
  vegetables?: any;
  proteins?: any;
  preferences?: any;
  parent?: any;
  isActive?: boolean;
  gender?: string;
  gamification?: any;
  fruits?: any;
  createdAt?: any;
  allergies?: any;
}

interface UserData {
  // name: string;
  children: ChildData[];
  // selectedChildId: string;
}

const HeaderProfile: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [avatarLoadErrors, setAvatarLoadErrors] = useState<Set<string>>(new Set());
  const { profile, selectedChildId, selectChild } = useUserStore();
  const childProfile = (profile as any)?.data?.user?.children || profile?.children;


  
  // Default fallback data when no backend data is available
  const defaultChildren = [
    {
      id: '1',
      name: 'Add child',
      avatar: 'boy', // Use string reference instead of require
      ageRange: '',
      streak: 0,
      level: 1,
      vegetables: [],
      proteins: [],
      preferences: {},
      isActive: true,
      gender: 'Unknown',
      gamification: { streak: 0, level: 1 },
      fruits: [],
      allergies: []
    },
  ];
  
  const [userData, setUserData] = useState({
    children: defaultChildren
  });



  useEffect(()=>{
    if (childProfile && Array.isArray(childProfile) && childProfile.length > 0) {
      // Transform API data to match UserData structure
      const transformedChildren = childProfile.map(child => ({
        id: child._id || child.id || 'unknown', // Use _id from API or fallback to id
        name: child.name || 'Unknown Child',
        avatar: child.avatar || 'boy', // Keep the original avatar value (filename or predefined option)
        ageRange: child.ageRange || 'Unknown',
        streak: child.gamification?.streak || 0,
        level: child.gamification?.level || 1,
        vegetables: child.vegetables || [],
        proteins: child.proteins || [],
        preferences: child.preferences || {},
        parent: child.parent,
        isActive: child.isActive !== undefined ? child.isActive : true,
        gender: child.gender || 'Unknown',
        gamification: child.gamification || { streak: 0, level: 1 },
        fruits: child.fruits || [],
        createdAt: child.createdAt,
        allergies: child.allergies || []
      }));
      
      setUserData(prev => ({
        ...prev,
        children: transformedChildren
      }));
      
      // Set selected child to first available child if none is selected
      if (transformedChildren.length > 0 && !selectedChildId) {
        selectChild(transformedChildren[0].id);
      }
    } else {
      // If no backend data, use default data
      setUserData(prev => ({
        ...prev,
        children: defaultChildren
      }));
      if (!selectedChildId) {
        console.log('Setting default selected child: 1');
        selectChild('1');
      }
    }
  },[childProfile, selectedChildId, selectChild])

  // Debug logging
  useEffect(() => {
    console.log('HeaderProfile - selectedChildId from store:', selectedChildId);
    console.log('HeaderProfile - current selectedChildId:', selectedChild);
    console.log('HeaderProfile - avatar load errors:', Array.from(avatarLoadErrors));
  }, [selectedChildId, userData.children, avatarLoadErrors]);

  // Ensure we always have a valid selected child
  const selectedChild = userData.children.find(child => child.id === selectedChildId) || userData.children[0];

  // Safety check - if no children exist, show loading or error state
  if (!selectedChild || userData.children.length === 0) {
    return (
      <View style={styles.headerProfile}>
        <View style={styles.profileInfo}>
          <View style={styles.profileAvatar}>
            <Image source={avatarMap.boy} style={styles.avatarImage} />
          </View>
          <View>
            <Text style={styles.profileName}>Loading...</Text>
            <Text style={styles.profileStatus}>
              <Image source={require('../../assets/images/icons/premium.svg')} style={styles.premiumIcon} />
              Premium
            </Text>
          </View>
        </View>
        <View style={styles.chargeIconContainer}>
          <Image source={require('../../assets/images/icons/charge.svg')} style={styles.chargeIcon} />
        </View>
      </View>
    );
  }

  const handleChildSelect = (childId: string) => {
    selectChild(childId); // Use the store's selectChild function
    setIsDropdownVisible(false);
    console.log('selectedChild: >>--->',getAvatarSource(selectedChild, avatarLoadErrors));
  };

  const handleAddNewChild = () => {
    setIsDropdownVisible(false);
    router.push('/profile/child-profile?fromHeader=true');
  };

  return (
    <View style={styles.headerProfile}>
      <View style={styles.profileInfo}>
        <TouchableOpacity 
          style={styles.profileAvatar}
          onPress={() => setIsDropdownVisible(true)}
        >
          <Image 
            source={getAvatarSource(selectedChild, avatarLoadErrors)} 
            style={styles.avatarImage}
            onError={() => {
              console.log('Failed to load avatar:', selectedChild.avatar);
              setAvatarLoadErrors(prev => new Set(prev).add(selectedChild.id));
            }}
            defaultSource={avatarMap.boy}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.profileName}>{selectedChild.name}</Text>
          <Text style={styles.profileStatus}>
            <Image source={require('../../assets/images/icons/premium.svg')} style={styles.premiumIcon} />
            Premium
          </Text>
        </View>
      </View>
      <View style={styles.chargeIconContainer}>
        <Image source={require('../../assets/images/icons/charge.svg')} style={styles.chargeIcon} />
      </View>

      {/* Child Selection Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.dropdownScroll}>
              {userData.children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.childOption,
                    child.id === selectedChildId && styles.selectedChildOption
                  ]}
                  onPress={() => handleChildSelect(child.id)}
                >
                  <Image 
                    source={getAvatarSource(child, avatarLoadErrors)} 
                    style={styles.childAvatar}
                    onError={() => {
                      console.log('Failed to load dropdown avatar:', child.avatar);
                      setAvatarLoadErrors(prev => new Set(prev).add(child.id));
                    }}
                    defaultSource={avatarMap.boy}
                  />
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childAge}>{child.ageRange} years old</Text>
                  </View>
                  {child.id === selectedChildId && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              {/* Add New Child Option */}
              <TouchableOpacity
                style={styles.addChildOption}
                onPress={handleAddNewChild}
              >
                <View style={styles.addChildAvatar}>
                  <Text style={styles.addChildIcon}>+</Text>
                </View>
                <View style={styles.childInfo}>
                  <Text style={styles.addChildText}>Add New Child</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  profileStatus: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  premiumIcon: {
    width: 19,
    height: 19,
    marginRight: 5,
    marginTop: 5,
    marginBottom: -5,
  },
  chargeIconContainer: {
    width: 110,
    height: 38,
    justifyContent: 'center',
  },
  chargeIcon: {
    width: 110,
    height: 38,
    justifyContent: 'center',
  },
  // Dropdown styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    width: '50%',
    borderRadius: 12,
    maxHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  childOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedChildOption: {
    backgroundColor: '#f8f9fa',
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  childAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addChildOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  addChildAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addChildIcon: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  addChildText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});

export default HeaderProfile; 