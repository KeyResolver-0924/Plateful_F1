import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  icon?: React.ReactElement<{ size?: number; color?: string }>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  maxLength?: number;
  editable?: boolean;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  icon,
  keyboardType = 'default',
  maxLength,
  editable = true,
  style,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const focusAnimation = useSharedValue(0);
  
  const handleFocus = () => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      focusAnimation.value = withTiming(0, { duration: 200 });
    }
  };
  
  const labelAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      focusAnimation.value,
      [0, 1],
      [18, -8]
    );
    const scale = interpolate(
      focusAnimation.value,
      [0, 1],
      [1, 0.8]
    );
    
    return {
      transform: [
        { translateY },
        { scale }
      ]
    };
  });
  
  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
         error ? colors.error : isFocused ? colors.primary :  colors.border,
        { duration: 200 }
      ),
      borderWidth: withTiming(isFocused ? 2 : 1, { duration: 200 }),
      borderRadius: withTiming(isFocused ? 12 : 12, { duration: 200 }),
      borderStyle: withTiming(isFocused ? 'solid' : 'solid', { duration: 200 }),
    };
  });
  
  useEffect(() => {
    if (value) {
      focusAnimation.value = withTiming(1, { duration: 200 });
    }
  }, [value, focusAnimation]);
  
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <Animated.View style={[styles.inputContainer, borderAnimatedStyle]}>
          {icon && (
            <View style={styles.iconContainer}>
              {React.cloneElement(icon, {
                size: 20,
                color: isFocused ? colors.primary : colors.text.secondary
              } as any)}
            </View>
          )}
          
          <View style={styles.inputWrapper}>
             {label && (
              <Animated.Text style={[styles.label, labelAnimatedStyle, {
                color: isFocused ? colors.primary : colors.text.secondary
              }]}>
                {label}
              </Animated.Text>
            )} 
            
            <TextInput
              ref={inputRef}
              style={[styles.input, style]}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.text.disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry && !showPassword}
              keyboardType={keyboardType}
              maxLength={maxLength}
              editable={editable}
              {...props}
            />
          </View>
          
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )} 
        </Animated.View>
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};    

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    fontSize: 16,
    color: colors.text.secondary,
    backgroundColor: colors.background,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
    outlineColor: 'transparent',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default Input; 