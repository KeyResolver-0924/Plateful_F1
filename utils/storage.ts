import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  multiGet(keys: string[]): Promise<Array<[string, string | null]>>;
  multiSet(keyValuePairs: Array<[string, string]>): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
  clear(): Promise<void>;
}

class WebStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.error('WebStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('WebStorage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('WebStorage removeItem error:', error);
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      const results: Array<[string, string | null]> = [];
      for (const key of keys) {
        const value = await this.getItem(key);
        results.push([key, value]);
      }
      return results;
    } catch (error) {
      console.error('WebStorage multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      for (const [key, value] of keyValuePairs) {
        await this.setItem(key, value);
      }
    } catch (error) {
      console.error('WebStorage multiSet error:', error);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      for (const key of keys) {
        await this.removeItem(key);
      }
    } catch (error) {
      console.error('WebStorage multiRemove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('WebStorage clear error:', error);
    }
  }
}

class MobileStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('MobileStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('MobileStorage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('MobileStorage removeItem error:', error);
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      const results = await AsyncStorage.multiGet(keys);
      return results as Array<[string, string | null]>;
    } catch (error) {
      console.error('MobileStorage multiGet error:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('MobileStorage multiSet error:', error);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('MobileStorage multiRemove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('MobileStorage clear error:', error);
    }
  }
}

// Create platform-specific storage instance
const createStorage = (): StorageInterface => {
  if (Platform.OS === 'web') {
    console.log('Storage: Using WebStorage for web platform');
    return new WebStorage();
  } else {
    console.log('Storage: Using MobileStorage for mobile platform');
    return new MobileStorage();
  }
};

// Export singleton storage instance
export const storage = createStorage();

// Utility functions with error handling
export const safeGetItem = async (key: string): Promise<string | null> => {
  try {
    const value = await storage.getItem(key);
    console.log(`Storage: Retrieved ${key}:`, value ? 'found' : 'not found');
    return value;
  } catch (error) {
    console.error(`Storage: Error retrieving ${key}:`, error);
    return null;
  }
};

export const safeSetItem = async (key: string, value: string): Promise<boolean> => {
  try {
    await storage.setItem(key, value);
    console.log(`Storage: Stored ${key}:`, value ? 'success' : 'empty value');
    return true;
  } catch (error) {
    console.error(`Storage: Error storing ${key}:`, error);
    return false;
  }
};

export const safeRemoveItem = async (key: string): Promise<boolean> => {
  try {
    await storage.removeItem(key);
    console.log(`Storage: Removed ${key}`);
    return true;
  } catch (error) {
    console.error(`Storage: Error removing ${key}:`, error);
    return false;
  }
};

export const safeMultiGet = async (keys: string[]): Promise<Array<[string, string | null]>> => {
  try {
    const results = await storage.multiGet(keys);
    console.log(`Storage: Retrieved multiple keys:`, keys, 'results:', results.length);
    return results;
  } catch (error) {
    console.error(`Storage: Error retrieving multiple keys:`, error);
    return keys.map(key => [key, null]);
  }
};

export default storage; 