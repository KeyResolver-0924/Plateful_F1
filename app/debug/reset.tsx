import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';

const DebugResetScreen: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [storageData, setStorageData] = useState<{ [key: string]: string | null }>({});

  const loadStorageData = async () => {
    try {
      const keys = ['userToken', 'onboardingComplete', 'userData', 'authState'];
      const values = await AsyncStorage.multiGet(keys);
      const data: { [key: string]: string | null } = {};
      values.forEach(([key, value]) => {
        data[key] = value;
      });
      setStorageData(data);
    } catch (error) {
      console.error('Error loading storage data:', error);
    }
  };

  React.useEffect(() => {
    loadStorageData();
  }, []);

  const handleClearStorage = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all stored data including authentication tokens. The app will restart to onboarding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: performReset
        }
      ]
    );
  };

  const handleClearSpecific = (key: string) => {
    Alert.alert(
      'Clear Specific Data',
      `Clear ${key}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearSpecificKey(key)
        }
      ]
    );
  };

  const clearSpecificKey = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
      await loadStorageData(); // Refresh display
      Alert.alert('Success', `${key} cleared successfully`);
    } catch (error) {
      console.error('Error clearing specific key:', error);
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const performReset = async () => {
    setIsResetting(true);
    try {
      console.log('Debug: Clearing all AsyncStorage data');
      await AsyncStorage.clear();
      
      // Small delay to ensure storage is cleared
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to root to restart the app flow
      router.replace('./');
      
      Alert.alert('Success', 'App data cleared. Restarting app flow...');
    } catch (error) {
      console.error('Error clearing storage:', error);
      Alert.alert('Error', 'Failed to clear storage');
    } finally {
      setIsResetting(false);
    }
  };

  const handleNavigateHome = () => {
    router.replace('./');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Debug Reset</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Storage Data</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadStorageData}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(storageData).map(([key, value]) => (
          <View key={key} style={styles.storageItem}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageKey}>{key}</Text>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => handleClearSpecific(key)}
              >
                <Ionicons name="trash" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
            <Text style={styles.storageValue}>
              {value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'null'}
            </Text>
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.clearAllButton]}
            onPress={handleClearStorage}
            disabled={isResetting}
          >
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.actionButtonText}>
              {isResetting ? 'Clearing...' : 'Clear All Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.homeButton]}
            onPress={handleNavigateHome}
          >
            <Ionicons name="home" size={24} color="white" />
            <Text style={styles.actionButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Debug Information</Text>
          <Text style={styles.infoText}>
            Use this screen to reset app state when experiencing navigation issues or white screens.
          </Text>
          <Text style={styles.infoText}>
            • "Clear All Data" will reset the entire app to first-time user state
          </Text>
          <Text style={styles.infoText}>
            • Individual items can be cleared using the trash icon
          </Text>
          <Text style={styles.infoText}>
            • "Go to Home" will restart the navigation flow
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  refreshText: {
    marginLeft: 5,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  storageItem: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageKey: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  clearButton: {
    padding: 5,
  },
  storageValue: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: 'monospace',
  },
  actions: {
    marginTop: 30,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  clearAllButton: {
    backgroundColor: colors.error,
  },
  homeButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 5,
  },
});

export default DebugResetScreen; 