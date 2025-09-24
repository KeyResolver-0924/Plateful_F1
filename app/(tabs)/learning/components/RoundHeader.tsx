import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface RoundHeaderProps {
  currentVisibleRound: number;
  levelName: string;
  totalStars: number;
  completedRounds: number;
  totalRounds: number;
  onBack: () => void;
}

const RoundHeader: React.FC<RoundHeaderProps> = ({
  currentVisibleRound,
  levelName,
  totalStars,
  completedRounds,
  totalRounds,
  onBack
}) => {
  const getHeaderColor = (roundNumber: number): string => {
    return roundNumber % 2 === 1 ? '#58cc02' : '#a262ff';
  };

  return (
    <Animated.View 
      entering={FadeInDown} 
      style={[styles.header, { backgroundColor: getHeaderColor(currentVisibleRound) }]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.sectionTitle}>
             ROUND {currentVisibleRound}
          </Text>
          <Text style={styles.headerTitle}>
            {levelName + ' Rounds'}
          </Text>
        </View>
      </View>
      
      <View style={styles.totalStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>{totalStars}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.progressText}>
            {completedRounds}/{totalRounds}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#58cc02',
    borderRadius: 25,
    marginBottom: 5,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTop: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 8,
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  totalStats: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default RoundHeader;
