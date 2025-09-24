import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '../../../../constants/colors';

interface ActionButtonProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  color?: string; // label/icon color when enabled
  backgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  iconName,
  onPress,
  disabled = false,
  color = '#333333',
  backgroundColor = '#F5F5F5',
  style,
}) => {
  const effectiveColor = disabled ? '#CCCCCC' : color;

  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor, opacity: disabled ? 0.5 : 1 }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Ionicons name={iconName} size={20} color={effectiveColor} />
      <Text style={[styles.actionButtonText, { color: effectiveColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default ActionButton;



