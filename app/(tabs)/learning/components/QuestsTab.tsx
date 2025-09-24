import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { colors } from '../../../../constants/colors';
import LevelSelectScreen from '../screens/LevelSelectScreen';
import RoundScreen from '../screens/RoundScreen';

interface QuestsTabProps {
  onStartQuest?: (levelIndex: number, roundIndex: number, subRoundIndex: number) => void;
}

type Screen = 'level-select' | 'rounds';

const QuestsTab: React.FC<QuestsTabProps> = ({ onStartQuest }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('level-select');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'NORMAL' | 'HARD' | null>(null);

  const handleLevelSelect = (difficulty: 'EASY' | 'NORMAL' | 'HARD') => {
    setSelectedDifficulty(difficulty);
    setCurrentScreen('rounds');
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen('level-select');
    setSelectedDifficulty(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'level-select' && (
        <LevelSelectScreen onLevelSelect={handleLevelSelect} />
      )}
      
      {currentScreen === 'rounds' && selectedDifficulty && (
        <RoundScreen 
          difficulty={selectedDifficulty}
          onBack={handleBackToLevelSelect}
          onStartQuest={onStartQuest}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default QuestsTab;