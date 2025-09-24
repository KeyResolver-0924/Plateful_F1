import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import MessageHandler from '../../utils/messageHandler';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  password?: string;
  email?: string;
}

const SignInScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
  
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await login(formData.email, formData.password);
      
      // Only navigate if login was successful (result is not null/undefined)
      if (result && result.user && result.token) {
        await AsyncStorage.setItem('userToken', 'dummy-token');
        await AsyncStorage.setItem('userData', JSON.stringify({
          name: 'User',
          email: formData.email
        }));
        
        // Show success message and navigate
        MessageHandler.showSuccess('Welcome back!', 'Login Successful', () => {
          router.replace('/(tabs)' as any);
        });
        return { success: true };
      } else {
        // Login failed - stay on sign-in page and show error
        setErrors({ email: 'Invalid email or password. Please try again.' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ email: 'Invalid email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      console.log('Google Sign In');
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };
  
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Welcome to PLATEFUL</Text>
        <Text style={styles.subtitleText}>Let&apos;s get started.</Text>
      </LinearGradient>
      
      <KeyboardAvoidingView 
        style={styles.formContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Welcome Back!</Text>
            <Text style={styles.formSubtitle}>
              Sign in with your phone number
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              icon={<Ionicons name="mail-outline" />}
              error={errors.email}
            />

            <Input
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="Enter your password"
              keyboardType="default"
              secureTextEntry={true}
              icon={<Ionicons name="lock-closed-outline" />}
              error={errors.password}
            />
            
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              style={styles.signInButton}
            />
            
            {/* <Button
              title="Create New Account"
              onPress={() => router.push('/auth/sign-up')}
              variant="outline"
              style={styles.signUpButton}
            /> */}
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../../assets/images/icons/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Log in with Google</Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>By continuing, you agree to our Terms of Service and Privacy Policy</Text>
            </View>
            
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 50,
    alignItems: 'center',
  },
  mascot: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  form: {
    width: '100%',
    gap: 6,
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  signUpButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignInScreen;