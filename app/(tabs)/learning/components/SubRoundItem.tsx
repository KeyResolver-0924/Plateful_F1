import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn, useAnimatedStyle } from 'react-native-reanimated';
import { SubRound } from '../types/navigation';

interface SubRoundItemProps {
  subRound: SubRound;
  levelIndex: number;
  roundIndex: number;
  subRoundIndex: number;
  isFirst?: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  onPress: (levelIndex: number, roundIndex: number, subRoundIndex: number) => void;
  startBubbleAnimation: Animated.SharedValue<number>;
}

const SubRoundItem: React.FC<SubRoundItemProps> = memo(({
  subRound,
  levelIndex,
  roundIndex,
  subRoundIndex,
  isFirst = false,
  isCompleted,
  isLocked,
  isCurrent,
  onPress,
  startBubbleAnimation
}) => {
  const offsetStyle = subRoundIndex % 2 === 0 ? styles.offsetRight : styles.offsetLeft;
  
  const animatedStartLabelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: startBubbleAnimation.value }]
  }));

  const handlePress = () => {
    onPress(levelIndex, roundIndex, subRoundIndex);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(subRoundIndex * 100).springify()}
      style={[styles.pathNodeContainer, offsetStyle]}
    >
      {!isFirst && (
        <View style={[
          styles.connectionLine,
          (isCompleted || isCurrent) && styles.completedConnectionLine
        ]} />
      )}
      
      {isFirst && isCurrent && (
        <Animated.View entering={FadeInUp.delay(200)} style={[styles.startLabel, animatedStartLabelStyle]}>
          <Text style={styles.startText}>START</Text>
        </Animated.View>
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={isLocked}
        style={[
          styles.subRoundButton,
          isCurrent && styles.currentSubRoundButton,
          isCompleted && styles.completedSubRoundButton
        ]}
        activeOpacity={0.8}
      >
        {/* Enhanced progress ring for active sub-round */}
        {isCurrent && (
          <Animated.View entering={ZoomIn.delay(300)} style={styles.progressRingContainer}>
            <View style={styles.progressRing} />
            <View style={styles.progressRingGlow} />
          </Animated.View>
        )}
        
        <Image
          source={
            isCompleted 
              ? require('../../../../assets/images/characters/complet_sub_round.png')
              : isCurrent
              ? require('../../../../assets/images/characters/complet_sub_round.png')
              : require('../../../../assets/images/characters/sub_round.png')
          }
          style={[
            styles.subRoundImage,
            isLocked && styles.lockedSubRoundImage,
            isCurrent && styles.currentSubRoundImage,
            isCompleted && styles.completedSubRoundImage
          ]}
        />
        
        {/* Enhanced current indicator with pulsing animation */}
        {isCurrent && (
          <Animated.View entering={ZoomIn.delay(300)} style={styles.currentIndicator}>
            <View style={styles.currentDot} />
            <View style={styles.currentPulse} />
          </Animated.View>
        )}
        
        {/* Enhanced completion check with celebration effect */}
        {isCompleted && (
          <Animated.View entering={ZoomIn.delay(300)} style={styles.completionCheck}>
            <Ionicons name="checkmark" size={24} color="white" />
            <View style={styles.completionGlow} />
          </Animated.View>
        )}
        
        {/* Lock indicator for locked sub-rounds */}
        {isLocked && (
          <View style={styles.subRoundLock}>
            <Ionicons name="lock-closed" size={20} color="#666" />
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
  offsetRight: {
    alignSelf: 'flex-end',
    right: 40,
  },
  offsetLeft: {
    alignSelf: 'flex-start',
    left: 40,
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
  startLabel: {
    backgroundColor: '#58cc02',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  startText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subRoundButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  currentSubRoundButton: {
    transform: [{ scale: 1.05 }],
  },
  completedSubRoundButton: {
    transform: [{ scale: 1.02 }],
  },
  progressRingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 6,
    borderColor: '#58cc02',
    opacity: 0.9,
  },
  progressRingGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#58cc02',
    opacity: 0.2,
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 0,
  },
  subRoundImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  lockedSubRoundImage: {
    opacity: 0.4,
  },
  currentSubRoundImage: {
    transform: [{ scale: 1.1 }],
  },
  completedSubRoundImage: {
    transform: [{ scale: 1.05 }],
  },
  currentIndicator: {
    position: 'absolute',
    bottom: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#58cc02',
    shadowColor: '#58cc02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  currentPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#58cc02',
    opacity: 0.3,
    transform: [{ scale: 0.8 }],
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
  subRoundLock: {
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
});

export default SubRoundItem;
