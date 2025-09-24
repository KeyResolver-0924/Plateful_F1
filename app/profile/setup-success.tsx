import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

const SetupSuccessScreen = () => {
  const { setOnboardingComplete, setNewUser } = useAuthStore();
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
    
    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      try {
        setOnboardingComplete(true);
        setNewUser(false);
        router.replace('/(tabs)' as any);
      } catch (error) {
        console.error('Auto navigation error:', error);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    try {
      setOnboardingComplete(true);
      setNewUser(false);
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
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
          Profile Setup Complete!
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.subtitleText,
            { opacity: opacityAnim }
          ]}
        >
          Your child&apos;s profile has been successfully created
        </Animated.Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.messageContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
          <Text style={styles.messageTitle}>Ready to Start!</Text>
          <Text style={styles.messageText}>
            Your child&apos;s profile is now ready. You can start tracking meals, 
            exploring nutrition tips, and monitoring your child&apos;s eating habits.
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Button
            title="Start Exploring"
            onPress={handleContinue}
            style={styles.continueButton}
          />
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              try {
                setOnboardingComplete(true);
                setNewUser(false);
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

export default SetupSuccessScreen; 