import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
  width?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, width = 100 }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>{current}/{total}</Text>
      <View style={[styles.progressBar, { width }]}> 
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
});

export default ProgressBar;



