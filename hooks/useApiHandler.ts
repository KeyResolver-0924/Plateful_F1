import { useCallback, useState } from 'react';
import ApiHandler, { ApiHandlerConfig } from '../utils/apiHandler';
import { ApiResponse } from '../utils/apiService';

export interface UseApiHandlerReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (apiCall: () => Promise<ApiResponse<T>>, config?: ApiHandlerConfig) => Promise<ApiResponse<T> | null>;
  executeSilently: (apiCall: () => Promise<ApiResponse<T>>) => Promise<ApiResponse<T> | null>;
  executeWithConfirmation: (
    apiCall: () => Promise<ApiResponse<T>>,
    confirmationMessage: string,
    confirmationTitle?: string,
    config?: ApiHandlerConfig
  ) => Promise<ApiResponse<T> | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useApiHandler<T = any>(): UseApiHandlerReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    config: ApiHandlerConfig = {}
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await ApiHandler.execute(apiCall, {
        ...config,
        onSuccess: (responseData) => {
          setData(responseData);
          if (config.onSuccess) config.onSuccess(responseData);
        },
        onError: (errorData) => {
          const errorMessage = errorData?.error || errorData?.message || 'An error occurred';
          setError(errorMessage);
          if (config.onError) config.onError(errorData);
        },
        onFinally: () => {
          setLoading(false);
          if (config.onFinally) config.onFinally();
        }
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const executeSilently = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await ApiHandler.executeSilently(
        apiCall,
        (responseData) => {
          setData(responseData);
        },
        (errorData) => {
          const errorMessage = errorData?.error || errorData?.message || 'An error occurred';
          setError(errorMessage);
        }
      );

      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const executeWithConfirmation = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>,
    confirmationMessage: string,
    confirmationTitle?: string,
    config?: ApiHandlerConfig
  ): Promise<ApiResponse<T> | null> => {
    return ApiHandler.executeWithConfirmation(
      apiCall,
      confirmationMessage,
      confirmationTitle,
      {
        ...config,
        onSuccess: (responseData) => {
          setData(responseData);
          if (config?.onSuccess) config.onSuccess(responseData);
        },
        onError: (errorData) => {
          const errorMessage = errorData?.error || errorData?.message || 'An error occurred';
          setError(errorMessage);
          if (config?.onError) config.onError(errorData);
        },
        onFinally: () => {
          setLoading(false);
          if (config?.onFinally) config.onFinally();
        }
      }
    );
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const setDataCallback = useCallback((newData: T | null) => {
    setData(newData);
  }, []);

  const setErrorCallback = useCallback((newError: string | null) => {
    setError(newError);
  }, []);

  const setLoadingCallback = useCallback((newLoading: boolean) => {
    setLoading(newLoading);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    executeSilently,
    executeWithConfirmation,
    reset,
    setData: setDataCallback,
    setError: setErrorCallback,
    setLoading: setLoadingCallback
  };
}

export default useApiHandler;
