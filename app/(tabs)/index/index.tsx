import Ionicons from '@expo/vector-icons/build/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import HeaderProfile from '../../../components/common/HeaderProfile';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  childName: string;
  avatar: ImageSourcePropType;
  childAge: string;
  streak: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface TodayStats {
  mealsLogged: number;
  foodsIntroduced: number;
  caloriesConsumed: number;
  targetCalories: number;
}

const HomeScreen: React.FC = () => {

  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState<UserData>({
    name: 'Laurentia Claris',
    childName: 'Emma',
    avatar: require('../../../assets/images/avatars/boy.png'),
    childAge: '2',
    streak: 7,
    level: 3,
    xp: 1250,
    nextLevelXp: 2000
  });

  return (
    <View style={styles.container}>
      <HeaderProfile/>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeMessage}>Welcome how are we doing today?</Text>

        <View style={styles.rankContainer}>
          <View style={styles.rankNumberContainer}>
            <Text style={styles.rankNumber}>#{userData.level}</Text>
          </View>
          <Text style={styles.rankText}>You are doing better than 60% of other Children's!</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchPlaceholder}
            placeholder="Search here"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity 
            style={styles.menuItem1}
            onPress={() => router.push('./tracking')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Image source={require('../../../assets/images/characters/fruits.png')} style={styles.menuIcon} />
            </View>
            <Text style={styles.menuTitle}>What Are We Eating?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem2}
            onPress={() => router.push('./foodLearn')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Image source={require('../../../assets/images/characters/splash-icon.png')} style={styles.menuIcon} />
            </View>
            <Text style={styles.menuTitle}>Lets Learn</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem3}
            onPress={() => router.push('./history')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Image source={require('../../../assets/images/characters/meal.png')} style={styles.menuIcon} />
            </View>
            <Text style={styles.menuTitle}>Time To Eat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem4}
            onPress={() => router.push('./leaderboard')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Image source={require('../../../assets/images/characters/zicon (4).png')} style={styles.menuIcon} />
            </View>
            <Text style={styles.menuTitle}>Ours Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8930F',
  },
  headerStats: {
    width: 50,
    height: 50,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  welcomeMessage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  rankContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFB380',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
    rankNumberContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#FF9B57',
    borderRadius: 10,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rankText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 17,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#999',
  },
  searchPlaceholder: {
    fontSize: 18,
    color: '#999',
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem1: {
    width: '48%',
    backgroundColor: '#F6D4B133',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItem2: {
    width: '48%',
    backgroundColor: '#E6BE3D33',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItem3: {
    width: '48%',
    backgroundColor: '#338ADC33',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItem4: {
    width: '48%',
    backgroundColor: '#FF626B33',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuIcon: {
    marginTop: 40,
    width: 110,
    height: 110,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default HomeScreen; 