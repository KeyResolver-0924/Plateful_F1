import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import useApiHandler from '../../hooks/useApiHandler';
import { apiService } from '../../utils/apiService';
import MessageHandler from '../../utils/messageHandler';

const MessageExample: React.FC = () => {
  const { execute, loading, error, data } = useApiHandler();

  // Example 1: Simple message display
  const showSimpleMessages = () => {
    MessageHandler.showSuccess('This is a success message!');
    
    setTimeout(() => {
      MessageHandler.showError('This is an error message!');
    }, 1000);
    
    setTimeout(() => {
      MessageHandler.showInfo('This is an info message!');
    }, 2000);
  };

  // Example 2: Confirmation dialog
  const showConfirmation = () => {
    MessageHandler.showConfirmation(
      'Are you sure you want to delete this item?',
      'Confirm Delete',
      () => {
        MessageHandler.showSuccess('Item deleted successfully!');
      },
      () => {
        MessageHandler.showInfo('Deletion cancelled');
      }
    );
  };

  // Example 3: API call with automatic message handling
  const handleApiCall = async () => {
    await execute(
      () => apiService.healthCheck(),
      {
        successMessage: 'API is working perfectly!',
        errorMessage: 'API is not responding',
        onSuccess: (data) => {
          console.log('Success data:', data);
        },
        onError: (error) => {
          console.log('Error data:', error);
        }
      }
    );
  };

  // Example 4: Silent API call (no messages)
  const handleSilentApiCall = async () => {
    await execute(
      () => apiService.healthCheck(),
      {
        showSuccess: false,
        showError: false,
        onSuccess: (data) => {
          MessageHandler.showSuccess('Silent call succeeded!');
        },
        onError: (error) => {
          MessageHandler.showError('Silent call failed!');
        }
      }
    );
  };

  // Example 5: API call with confirmation
  const handleApiCallWithConfirmation = async () => {
    await execute(
      () => apiService.healthCheck(),
      {
        successMessage: 'Confirmed API call succeeded!',
        errorMessage: 'Confirmed API call failed!',
        onSuccess: (data) => {
          console.log('Confirmed success:', data);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message Handling Examples</Text>
      
      <TouchableOpacity style={styles.button} onPress={showSimpleMessages}>
        <Text style={styles.buttonText}>Show Simple Messages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={showConfirmation}>
        <Text style={styles.buttonText}>Show Confirmation</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleApiCall}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'API Call with Messages'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSilentApiCall}
      >
        <Text style={styles.buttonText}>Silent API Call</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleApiCallWithConfirmation}
      >
        <Text style={styles.buttonText}>API Call with Confirmation</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Data: {JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  dataContainer: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  dataText: {
    color: '#2e7d32',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default MessageExample;
