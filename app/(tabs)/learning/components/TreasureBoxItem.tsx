import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Round } from '../types/navigation';

interface TreasureBoxItemProps {
  round: Round;
  levelIndex: number;
  roundIndex: number;
  onPress: (levelIndex: number, roundIndex: number) => void;
}

const TreasureBoxItem: React.FC<TreasureBoxItemProps> = memo(({
  round,
  levelIndex,
  roundIndex,
  onPress
}) => {
  const isCompleted = round.isCompleted;
  const allSubRoundsCompleted = round.subRounds
    .slice(0, 5) // SUB_ROUNDS_PER_ROUND
    .every(sr => sr.isCompleted);
  const isUnlocked = allSubRoundsCompleted;

  const handlePress = () => {
    onPress(levelIndex, roundIndex);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(400).springify()}
      style={styles.pathNodeContainer}
    >
      <View style={[
        styles.connectionLine,
        allSubRoundsCompleted && styles.completedConnectionLine
      ]} />
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={!isUnlocked}
        style={[
          styles.treasureBoxButton,
          isUnlocked && !isCompleted && styles.unlockedTreasureBoxButton,
          isCompleted && styles.completedTreasureBoxButton
        ]}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../../assets/images/characters/box.png')}
          style={[
            styles.treasureBoxImage,
            !isUnlocked && styles.lockedTreasureBoxImage,
            isUnlocked && !isCompleted && styles.unlockedTreasureBoxImage
          ]}
        />
        
        {/* Enhanced glow effect for unlocked treasure box */}
        {isUnlocked && !isCompleted && (
          <Animated.View entering={ZoomIn.delay(300)} style={styles.treasureGlowContainer}>
            <View style={styles.treasureGlow} />
            <View style={styles.treasureGlowPulse} />
          </Animated.View>
        )}
        
        {/* Enhanced completion check */}
        {isCompleted && (
          <Animated.View entering={ZoomIn.delay(300)} style={styles.completionCheck}>
            <Ionicons name="checkmark" size={24} color="white" />
            <View style={styles.completionGlow} />
          </Animated.View>
        )}
        
        {/* Enhanced lock indicator */}
        {!isUnlocked && (
          <View style={styles.treasureBoxLock}>
            <Ionicons name="lock-closed" size={20} color="#666" />
            <View style={styles.lockGlow} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  pathNodeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    top: -35,
    // width: 8,
    height: 35,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  completedConnectionLine: {
    backgroundColor: '#58cc02',
  },
  treasureBoxButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unlockedTreasureBoxButton: {
    transform: [{ scale: 1.05 }],
  },
  completedTreasureBoxButton: {
    opacity: 1,
  },
  lockedTreasureBoxButton: {
    opacity: 0.6,
  },
  treasureBoxImage: {
    width: 80,
    height: 80,
  },
  lockedTreasureBoxImage: {
    opacity: 0.5,
  },
  unlockedTreasureBoxImage: {
    transform: [{ scale: 1.1 }],
  },
  treasureGlowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treasureGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: '#ffd700',
    opacity: 0.3,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 0,
  },
  treasureGlowPulse: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 55,
    backgroundColor: '#ffd700',
    opacity: 0.1,
    transform: [{ scale: 0.9 }],
  },
  completionCheck: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#58cc02',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completionGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 20,
    backgroundColor: '#58cc02',
    opacity: 0.3,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 0,
  },
  treasureBoxLock: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  lockGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 18,
    backgroundColor: '#666',
    opacity: 0.2,
  },
});

export default TreasureBoxItem;
