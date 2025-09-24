import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StarsRowProps {
  filled: number; // number of filled stars
  total?: number; // default 3
  size?: number; // icon size
}

const StarsRow: React.FC<StarsRowProps> = ({ filled, total = 3, size = 32 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={i < filled ? '#FFD700' : '#e0e0e0'}
          style={styles.starIcon}
        />)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  starIcon: {
    marginHorizontal: 2,
  },
});

export default StarsRow;



