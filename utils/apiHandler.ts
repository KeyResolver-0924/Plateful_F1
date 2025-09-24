import { ApiResponse } from './apiService';
import MessageHandler, { MessageConfig } from './messageHandler';

export interface ApiHandlerConfig extends MessageConfig {
  showLoading?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

export class ApiHandler {
  /**
   * Execute an API call with automatic message handling
   */
  static async execute<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    config: ApiHandlerConfig = {}
  ): Promise<ApiResponse<T> | null> {
    const {
      showSuccess = true,
      showError = true,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      onFinally
    } = config;

    try {
      const response = await apiCall();
      
      if (response.success) {
        // Success case
        if (showSuccess) {
          const message = successMessage || response.message || 'Operation completed successfully!';
          MessageHandler.showSuccess(message, 'Success', () => {
            if (onSuccess) onSuccess(response.data);
          });
        } else if (onSuccess) {
          onSuccess(response.data);
        }
        
        if (onFinally) onFinally();
        return response;
      } else {
        // Error case
        if (showError) {
          const message = errorMessage || response.error || response.message || 'An error occurred';
          MessageHandler.showError(message, 'Error', () => {
            if (onError) onError(response);
          });
        } else if (onError) {
          onError(response);
        }
        
        if (onFinally) onFinally();
        return response;
      }
    } catch (error) {
      // Handle caught errors
      if (showError) {
        const message = errorMessage || 
          (error instanceof Error ? error.message : 'An unexpected error occurred');
        
        MessageHandler.showError(message, 'Error', () => {
          if (onError) onError(error);
        });
      } else if (onError) {
        onError(error);
      }
      
      if (onFinally) onFinally();
      return null;
    }
  }

  /**
   * Execute an API call with custom success/error handling
   */
  static async executeWithCustomHandling<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    successHandler: (data: T) => void,
    errorHandler: (error: any) => void,
    config: Omit<ApiHandlerConfig, 'onSuccess' | 'onError'> = {}
  ): Promise<ApiResponse<T> | null> {
    return this.execute(apiCall, {
      ...config,
      onSuccess: successHandler,
      onError: errorHandler
    });
  }

  /**
   * Execute an API call silently (no messages)
   */
  static async executeSilently<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void
  ): Promise<ApiResponse<T> | null> {
    return this.execute(apiCall, {
      showSuccess: false,
      showError: false,
      onSuccess,
      onError
    });
  }

  /**
   * Execute an API call with confirmation before proceeding
   */
  static async executeWithConfirmation<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    confirmationMessage: string,
    confirmationTitle: string = 'Confirm',
    config: ApiHandlerConfig = {}
  ): Promise<ApiResponse<T> | null> {
    return new Promise((resolve) => {
      MessageHandler.showConfirmation(
        confirmationMessage,
        confirmationTitle,
        async () => {
          const result = await this.execute(apiCall, config);
          resolve(result);
        },
        () => {
          resolve(null);
        }
      );
    });
  }
}

// Export default instance for convenience
export default ApiHandler;
