import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../../constants/colors';
import authService from '../../utils/authService';

const UserDataDebugScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [storedData, setStoredData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Get data from AuthService
      const currentUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();
      
      // Get all AsyncStorage data
      const allStoredData = await getAllStoredData();
      
      setUserData({
        currentUser,
        isAuthenticated: isAuth
      });
      setStoredData(allStoredData);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const getAllStoredData = async (): Promise<any> => {
    const keys = await AsyncStorage.getAllKeys();
    const data: any = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      try {
        data[key] = JSON.parse(value || '');
      } catch {
        data[key] = value;
      }
    }
    
    return data;
  };

  const clearAllData = async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      await authService.signOut();
      Alert.alert('Success', 'All data cleared! App will restart from splash screen.');
      // Navigate back to index which will redirect to splash
      router.replace('./');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const testSplashNavigation = () => {
    router.replace('./splash');
  };

  const testOnboarding = () => {
    router.replace('/(tabs)/../auth/onboarding' as any);
  };

  const testSignIn = () => {
    router.replace('./(tabs)/../auth/sign-in' as any);
  };

  const testMainApp = () => {
    router.replace('./(tabs)');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Debug & Testing Panel</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation Testing</Text>
        <TouchableOpacity style={styles.button} onPress={testSplashNavigation}>
          <Text style={styles.buttonText}>Go to Splash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testOnboarding}>
          <Text style={styles.buttonText}>Go to Onboarding</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testSignIn}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testMainApp}>
          <Text style={styles.buttonText}>Go to Main App</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current User Data</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(userData, null, 2)}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Stored Data (AsyncStorage)</Text>
        <Text style={styles.dataText}>
          {JSON.stringify(storedData, null, 2)}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={loadUserData}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Data & Restart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 10,
  },
  dataText: {
    fontSize: 12,
    color: colors.text.secondary,
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default UserDataDebugScreen; 