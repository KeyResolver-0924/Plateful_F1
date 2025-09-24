import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { colors } from '../../../../constants/colors';
import { Round } from '../types/navigation';
import SubRoundItem from './SubRoundItem';
import TreasureBoxItem from './TreasureBoxItem';

interface RoundItemProps {
  round: Round;
  levelIndex: number;
  roundIndex: number;
  onSubRoundPress: (levelIndex: number, roundIndex: number, subRoundIndex: number) => void;
  onTreasureBoxPress: (levelIndex: number, roundIndex: number) => void;
  startBubbleAnimation: any;
}

const SUB_ROUNDS_PER_ROUND = 5;

const RoundItem: React.FC<RoundItemProps> = memo(({
  round,
  levelIndex,
  roundIndex,
  onSubRoundPress,
  onTreasureBoxPress,
  startBubbleAnimation
}) => {
  const completedSubRounds = round.subRounds
    .slice(0, SUB_ROUNDS_PER_ROUND)
    .filter(sr => sr.isCompleted).length;

  return (
    <Animated.View
      entering={SlideInRight.delay(roundIndex * 50)}
      style={styles.roundContainer}
    >
      <View style={styles.questPathContainer}>
        <View style={styles.questPath}>
          {round.subRounds.slice(0, SUB_ROUNDS_PER_ROUND).map((subRound, subRoundIndex) => (
            <SubRoundItem
              key={subRound.id}
              subRound={subRound}
              levelIndex={levelIndex}
              roundIndex={roundIndex}
              subRoundIndex={subRoundIndex}
              isFirst={subRoundIndex === 0}
              isCompleted={subRound.isCompleted}
              isLocked={subRound.isLocked}
              isCurrent={!subRound.isCompleted && !subRound.isLocked}
              onPress={onSubRoundPress}
              startBubbleAnimation={startBubbleAnimation}
            />
          ))}
          <TreasureBoxItem
            round={round}
            levelIndex={levelIndex}
            roundIndex={roundIndex}
            onPress={onTreasureBoxPress}
          />
        </View>
        
        {/* Round Info Panel - Right Side */}
        <View style={styles.roundInfoPanel}>
          <View style={styles.roundInfoHeader}>
            <Text style={styles.roundInfoTitle}>{round.name}</Text>
            <Text style={styles.roundInfoProgress}>
              {completedSubRounds}/{SUB_ROUNDS_PER_ROUND}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  roundContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  questPathContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  questPath: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  roundInfoPanel: {
    width: 120,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
  roundInfoHeader: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  roundInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  roundInfoProgress: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default RoundItem;
