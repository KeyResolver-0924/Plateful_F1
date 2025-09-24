import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
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
// import PhoneInput from '../../components/common/PhoneInput';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

const { width } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  // phoneNumber: string;
}

interface FormErrors {
  name?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  // phoneNumber?: string;
}

const SignUpScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
    // phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  // Simple registration function without Zustand
  const handleRegistration = async (userData: FormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // phone: userData.phoneNumber,
      });
      if(result!=null){
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Phone number validation
    // if (!formData.phoneNumber.trim()) {
    //   newErrors.phoneNumber = 'Phone number is required';
    // } else if (formData.phoneNumber.length < 10) {
    //   newErrors.phoneNumber = 'Please enter a valid phone number';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await handleRegistration(formData);

      if(result?.success){
        // Registration successful, redirect to child profile setup
        router.replace('/profile/child-profile');
      } else {
        throw new Error('Registration failed - no success response');
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      Alert.alert(
        'Registration Failed', 
        `Failed to register: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    try {
      // Implement Google OAuth
      console.log('Google Sign Up');
    } catch (error) {
      console.error('Google sign up error:', error);
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
        <Text style={styles.welcomeText}>Join PLATEFUL</Text>
        <Text style={styles.subtitleText}>Create your account</Text>
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
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>
              Fill in your details to get started
            </Text>
          </View>
          
          <View style={styles.form}>
                       
            <Input
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter your name"
              keyboardType="default"
              icon={<Ionicons name="person-outline" />}
              error={errors.name}
            />

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

            <Input
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              placeholder="Confirm your password"
              keyboardType="default"
              secureTextEntry={true}
              icon={<Ionicons name="lock-closed-outline" />}
              error={errors.confirmPassword}
            />
            
            {/* <PhoneInput
              value={formData.phoneNumber}
              onChangeText={(text: string) => updateFormData('phoneNumber', text)}
              placeholder="Enter your phone number"
              error={errors.phoneNumber}
              style={{}}
              containerStyle={{}}
            /> */}
            
            
            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
            />
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../../assets/images/icons/google.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>By creating an account, you agree to our Terms of Service and Privacy Policy</Text>
            </View>
            
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
                <Text style={styles.signInLink}>Sign In</Text>
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
    marginBottom: 10,
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
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  backToSignInButton: {
    marginTop: 12,
    marginBottom: 12,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  signInLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignUpScreen;