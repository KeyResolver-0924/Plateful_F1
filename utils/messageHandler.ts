import { Alert } from 'react-native';
import { ApiResponse } from './apiService';

export interface MessageConfig {
  title?: string;
  showSuccess?: boolean;
  showError?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export class MessageHandler {
  /**
   * Handle API response and show appropriate alerts
   */
  static handleApiResponse<T>(
    response: ApiResponse<T>,
    config: MessageConfig = {}
  ): boolean {
    const {
      title = 'Response',
      showSuccess = true,
      showError = true,
      successMessage,
      errorMessage,
      onSuccess,
      onError
    } = config;

    if (response.success) {
      // Success case
      if (showSuccess) {
        const message = successMessage || response.message || 'Operation completed successfully!';
        Alert.alert(
          'Success',
          message,
          [
            {
              text: 'OK',
              onPress: onSuccess
            }
          ]
        );
      } else if (onSuccess) {
        onSuccess();
      }
      return true;
    } else {
      // Error case
      if (showError) {
        const message = errorMessage || response.error || response.message || 'An error occurred';
        Alert.alert(
          'Error',
          message,
          [
            {
              text: 'OK',
              onPress: onError
            }
          ]
        );
      } else if (onError) {
        onError();
      }
      return false;
    }
  }

  /**
   * Handle API errors (caught exceptions)
   */
  static handleApiError(
    error: any,
    config: MessageConfig = {}
  ): void {
    const {
      title = 'Error',
      showError = true,
      errorMessage,
      onError
    } = config;

    if (showError) {
      const message = errorMessage || 
        (error instanceof Error ? error.message : 'An unexpected error occurred');
      
      Alert.alert(
        title,
        message,
        [
          {
            text: 'OK',
            onPress: onError
          }
        ]
      );
    } else if (onError) {
      onError();
    }
  }

  /**
   * Show success message
   */
  static showSuccess(
    message: string,
    title: string = 'Success',
    onPress?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress
        }
      ]
    );
  }

  /**
   * Show error message
   */
  static showError(
    message: string,
    title: string = 'Error',
    onPress?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress
        }
      ]
    );
  }

  /**
   * Show confirmation dialog
   */
  static showConfirmation(
    message: string,
    title: string = 'Confirm',
    onConfirm?: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel
        },
        {
          text: 'Confirm',
          onPress: onConfirm
        }
      ]
    );
  }

  /**
   * Show info message
   */
  static showInfo(
    message: string,
    title: string = 'Information',
    onPress?: () => void
  ): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress
        }
      ]
    );
  }
}

// Export default instance for convenience
export default MessageHandler;
