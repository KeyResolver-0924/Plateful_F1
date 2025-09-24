import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';
import { useQuest } from '../context/QuestContext';

const { width } = Dimensions.get('window');

interface LevelSelectScreenProps {
  onLevelSelect: (difficulty: 'EASY' | 'NORMAL' | 'HARD') => void;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ onLevelSelect }) => {
  const { questProgress } = useQuest();

  const difficulties: Array<{ 
    key: 'EASY' | 'NORMAL' | 'HARD'; 
    name: string; 
    description: string; 
    color: string; 
    icon: string 
  }> = [
    { 
      key: 'EASY', 
      name: 'Easy', 
      description: 'Start your journey with basic questions', 
      color: '#4CAF50',
      icon: 'leaf'
    },
    { 
      key: 'NORMAL', 
      name: 'Normal', 
      description: 'Medium difficulty for growing minds', 
      color: '#FF9800',
      icon: 'flash'
    },
    { 
      key: 'HARD', 
      name: 'Insane', 
      description: 'Ultimate challenge for food masters', 
      color: '#F44336',
      icon: 'flame'
    }
  ];

  const handleDifficultyPress = (difficulty: 'EASY' | 'NORMAL' | 'HARD') => {
    if (!isDifficultyUnlocked(difficulty)) {
      Alert.alert('Locked', 'Complete the previous difficulty to unlock this one!');
      return;
    }
    onLevelSelect(difficulty);
  };

  const isDifficultyUnlocked = (difficulty: 'EASY' | 'NORMAL' | 'HARD'): boolean => {
    if (!questProgress) return false;
    
    if (difficulty === 'EASY') return true;
    if (difficulty === 'NORMAL') {
      const easyLevel = questProgress.levels[0];
      return easyLevel && easyLevel.isCompleted;
    }
    if (difficulty === 'HARD') {
      const normalLevel = questProgress.levels[1];
      return normalLevel && normalLevel.isCompleted;
    }
    return false;
  };

  const getDifficultyProgress = (difficulty: 'EASY' | 'NORMAL' | 'HARD'): { completed: number; total: number } => {
    if (!questProgress) return { completed: 0, total: 10 };
    
    const levelIndex = difficulty === 'EASY' ? 0 : difficulty === 'NORMAL' ? 1 : 2;
    const level = questProgress.levels[levelIndex];
    
    if (!level) return { completed: 0, total: 10 };
    
    const completedRounds = level.rounds.filter(r => r.isCompleted).length;
    return { completed: completedRounds, total: level.rounds.length };
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown} style={styles.header}>
        <Text style={styles.title}>Choose Your Difficulty</Text>
        <Text style={styles.subtitle}>Select a difficulty level to start your food quest!</Text>
      </Animated.View>

      <View style={styles.difficultyButtons}>
        {difficulties.map((difficulty, index) => {
          const isUnlocked = isDifficultyUnlocked(difficulty.key);
          const progress = getDifficultyProgress(difficulty.key);
          
          return (
            <Animated.View
              key={difficulty.key}
              entering={FadeInUp.delay(index * 100).springify()}
              style={styles.difficultyButtonContainer}
            >
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  { borderColor: difficulty.color },
                  isUnlocked ? { backgroundColor: `${difficulty.color}15` } : styles.lockedDifficultyButton
                ]}
                onPress={() => handleDifficultyPress(difficulty.key)}
                disabled={!isUnlocked}
                activeOpacity={0.8}
              >
                <View style={styles.difficultyIconContainer}>
                  <View style={[
                    styles.difficultyIcon,
                    { backgroundColor: isUnlocked ? difficulty.color : '#ccc' }
                  ]}>
                    <Ionicons 
                      name={difficulty.icon as any} 
                      size={32} 
                      color="white"
                    />
                  </View>
                  {!isUnlocked && (
                    <View style={styles.difficultyLockIcon}>
                      <Ionicons name="lock-closed" size={20} color="#666" />
                    </View>
                  )}
                </View>

                <View style={styles.difficultyInfo}>
                  <Text style={[
                    styles.difficultyName,
                    !isUnlocked && styles.lockedDifficultyText
                  ]}>
                    {difficulty.name}
                  </Text>
                  <Text style={[
                    styles.difficultyDescription,
                    !isUnlocked && styles.lockedDifficultyText
                  ]}>
                    {difficulty.description}
                  </Text>
                  {isUnlocked && (
                    <View style={styles.difficultyProgress}>
                      <Text style={styles.progressText}>
                        Progress: {progress.completed}/{progress.total} rounds
                      </Text>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill,
                            { 
                              width: `${(progress.completed / progress.total) * 100}%`,
                              backgroundColor: difficulty.color
                            }
                          ]}
                        />
                      </View>
                    </View>
                  )}
                </View>

                {isUnlocked && (
                  <Ionicons name="chevron-forward" size={24} color={difficulty.color} />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  difficultyButtons: {
    gap: 20,
  },
  difficultyButtonContainer: {
    marginBottom: 10,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedDifficultyButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    opacity: 0.7,
  },
  difficultyIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  difficultyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyLockIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  difficultyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  lockedDifficultyText: {
    color: '#999',
  },
  difficultyProgress: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default LevelSelectScreen;
