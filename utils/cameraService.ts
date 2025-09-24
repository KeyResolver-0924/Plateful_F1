import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export interface CameraService {
  requestPermissions(): Promise<boolean>;
  takePicture(): Promise<string | null>;
  pickFromGallery(): Promise<string | null>;
  isAvailable(): boolean;
}

class RealCameraService implements CameraService {
  private hasPermission: boolean = false;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.warn('Camera permission request failed:', error);
      return false;
    }
  }

  async takePicture(): Promise<string | null> {
    if (!this.hasPermission) {
      const granted = await this.requestPermissions();
      if (!granted) return null;
    }

    // For emulator, we'll fall back to gallery picker
    if (Platform.OS === 'android' && __DEV__) {
      console.log('Camera not available in Android emulator, using gallery picker');
      return this.pickFromGallery();
    }

    // This would be used on real devices
    return null;
  }

  async pickFromGallery(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Gallery permission not granted');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return this.hasPermission;
  }
}

class MockCameraService implements CameraService {
  async requestPermissions(): Promise<boolean> {
    // Mock permissions for development
    return true;
  }

  async takePicture(): Promise<string | null> {
    // Return a mock image for development
    return 'https://via.placeholder.com/400x300/FF9A00/FFFFFF?text=Mock+Food+Image';
  }

  async pickFromGallery(): Promise<string | null> {
    // Return a mock image for development
    return 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mock+Food+Image';
  }

  isAvailable(): boolean {
    return true;
  }
}

// Factory function to create appropriate camera service
export function createCameraService(): CameraService {
  // Use mock service for development on emulator
  if (Platform.OS === 'android' && __DEV__) {
    console.log('Using MockCameraService for Android emulator development');
    return new MockCameraService();
  }
  
  return new RealCameraService();
}

// Export the default camera service
export const cameraService = createCameraService(); 