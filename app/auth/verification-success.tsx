import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';

const VerificationSuccessScreen = () => {
  const params = useLocalSearchParams();
  const { isSignUp } = params;
  
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);
  

  
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();
    
    // Auto navigate after 3 seconds with consistent absolute paths
    const timer = setTimeout(() => {
      try {
        if (isSignUp === 'true') {
          router.replace('/profile/child-profile');
        } else {
          router.replace('/(tabs)' as any);
        }
      } catch (error) {
        console.error('Auto navigation error:', error);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isSignUp]);
  
  const handleContinue = () => {
    try {
      if (isSignUp === 'true') {
        router.replace('/profile/child-profile');
      } else {
        router.replace('/(tabs)' as any);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={120} color={colors.text.inverse} />
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.successText,
            { opacity: opacityAnim }
          ]}
        >
          {isSignUp === 'true' ? 'Account Created!' : 'Welcome Back!'}
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.subtitleText,
            { opacity: opacityAnim }
          ]}
        >
          {isSignUp === 'true' 
            ? 'Your account has been successfully created' 
            : 'You have successfully signed in'
          }
        </Animated.Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.messageContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          <Text style={styles.messageTitle}>Verification Complete</Text>
          <Text style={styles.messageText}>
            Your phone number has been verified successfully. 
            You can now access all features of PlateFul.
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Button
            title={isSignUp === 'true' ? 'Continue to Profile Setup' : 'Go to Home'}
            onPress={handleContinue}
            style={styles.continueButton}
          />
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              try {
                router.replace('/(tabs)' as any);
              } catch (error) {
                console.error('Skip navigation error:', error);
              }
            }}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: colors.text.inverse,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  continueButton: {
    marginBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

export default VerificationSuccessScreen;