import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import StatusBar from '../../components/common/StatusBar';
import { colors } from '../../constants/colors';
import { formatPhoneNumber } from '../../utils/phoneFormatter';

const { width } = Dimensions.get('window');

interface OtpScreenParams {
  phoneNumber?: string;
  email?: string;
  isSignUp?: string;
}

// Type assertion for router params
type RouterParams = Record<string, string | number | (string | number)[] | null | undefined>;

const OtpScreen: React.FC = () => {
  const params = useLocalSearchParams() as OtpScreenParams;
  const { phoneNumber, email, isSignUp } = params;
  
  const [phoneOtp, setPhoneOtp] = useState<string[]>(['', '', '', '']);
  // const [emailOtp, setEmailOtp] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  
  const phoneInputRefs = useRef<(TextInput | null)[]>([]);
  // const emailInputRefs = useRef<(TextInput | null)[]>([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePhoneOtpChange = (text: string, index: number) => {
    const newOtp = [...phoneOtp];
    newOtp[index] = text;
    setPhoneOtp(newOtp);
    
    if (text && index < 3) {
      phoneInputRefs.current[index + 1]?.focus();
    }
  };
  
  // const handleEmailOtpChange = (text: string, index: number) => {
  //   const newOtp = [...emailOtp];
  //   newOtp[index] = text;
  //   setEmailOtp(newOtp);
    
  //   if (text && index < 3) {
  //     emailInputRefs.current[index + 1]?.focus();
  //   }
  // };
  
  const handlePhoneKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !phoneOtp[index] && index > 0) {
      phoneInputRefs.current[index - 1]?.focus();
    }
  };
  
  // const handleEmailKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
  //   if (e.nativeEvent.key === 'Backspace' && !emailOtp[index] && index > 0) {
  //     emailInputRefs.current[index - 1]?.focus();
  //   }
  // };
  
  const handleVerifyOTP = async () => {
    const phoneOtpString = phoneOtp.join('');
    
    if (phoneOtpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit phone OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call for OTP verification
      console.log('Verifying phone OTP:', phoneOtpString);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to verification success with consistent absolute path
      router.push({
        pathname: '/auth/verification-success',
        params: { isSignUp: isSignUp === 'true' ? 'true' : 'false' }
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimer(30);
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        {/* <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            try {
              router.back();
            } catch (error) {
              console.error('Back navigation error:', error);
              // Fallback to sign-up if back fails
              router.push('/auth/sign-up');
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
        </TouchableOpacity> */}
        
        <Image 
          source={require('../../assets/images/logo/platefull-mascot.png')}
          style={styles.mascot}
        />
        <Text style={styles.welcomeText}>Verify Your Account</Text>
        <Text style={styles.subtitleText}>Enter the codes sent to</Text>
        <Text style={styles.phoneNumber}>
          {phoneNumber ? formatPhoneNumber(phoneNumber) : 'your phone number'}
        </Text>
        {/* <Text style={styles.emailText}>{email}</Text> */}
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
            <Text style={styles.formTitle}>Enter OTP Codes</Text>
            <Text style={styles.formSubtitle}>
              We&apos;ve sent verification codes to your phone
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Phone Verification Code (4 digits)</Text>
              <View style={styles.otpContainer}>
                {phoneOtp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref: TextInput | null) => { phoneInputRefs.current[index] = ref; }}
                    value={digit}
                    onChangeText={(text: string) => handlePhoneOtpChange(text, index)}
                    onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handlePhoneKeyPress(e, index)}
                    placeholder="0"
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.otpInput, { textAlign: 'center', fontSize: 24, fontWeight: 'bold' }]}
                    placeholderTextColor={colors.text.disabled}
                  />
                ))}
              </View>
            </View>
            
            {/* <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Email Verification Code (6 digits)</Text>
              <View style={styles.otpContainer}>
                {emailOtp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref: TextInput | null) => { emailInputRefs.current[index] = ref; }}
                    value={digit}
                    onChangeText={(text: string) => handleEmailOtpChange(text, index)}
                    onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleEmailKeyPress(e, index)}
                    placeholder="0"
                    keyboardType="numeric"
                    maxLength={1}
                    style={[styles.otpInput, { textAlign: 'center', fontSize: 24, fontWeight: 'bold' }]}
                    placeholderTextColor={colors.text.disabled}
                  />
                ))}
              </View>
            </View> */}
            
            <Button
              title="Verify OTP"
              onPress={handleVerifyOTP}
              loading={loading}
              style={styles.verifyButton}
            />
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>Resend in {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
                  <Text style={styles.resendLink}>
                    {resendLoading ? 'Sending...' : 'Resend'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Wrong phone number? </Text>
              <TouchableOpacity onPress={() => {
                try {
                  router.back();
                } catch (error) {
                  console.error('Back navigation error:', error);
                  // Fallback to sign-up if back fails
                  router.push('/auth/sign-up');
                }
              }}>
                <Text style={styles.linkText}>Change it</Text>
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
  phoneNumber: {
    // fontSize: 14,
    color: colors.text.inverse,
    textAlign: 'center',
    // marginBottom: 32,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.9,
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 32,
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
    flex: 1,
  },
  otpSection: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 8,
    color: colors.text.primary,
  },
  verifyButton: {
    marginTop: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  timerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  resendLink: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
});

export default OtpScreen;