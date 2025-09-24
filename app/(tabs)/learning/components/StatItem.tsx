import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../../../constants/colors';

interface StatItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  value: string | number;
  color?: string;
  style?: ViewStyle | ViewStyle[];
}

const StatItem: React.FC<StatItemProps> = ({ iconName, value, color = colors.text.primary, style }) => {
  return (
    <View style={[styles.statItem, style]}>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.statText, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatItem;



