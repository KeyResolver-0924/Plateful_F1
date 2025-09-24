import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../../../constants/colors';
import LockedModal from '../components/LockedModal';
import RewardModal from '../components/RewardModal';
import RoundHeader from '../components/RoundHeader';
import RoundItem from '../components/RoundItem';
import RoundsListModal from '../components/RoundsListModal';
import { useQuest } from '../context/QuestContext';
import { useFloatAnimation } from '../hooks/useFloatAnimation';
import { useGameSession } from '../hooks/useGameSession';
import GameScreen from '../quests/GameScreen';
import ResultsScreen from '../quests/ResultsScreen';

interface RoundScreenProps {
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  onBack: () => void;
  onStartQuest?: (levelIndex: number, roundIndex: number, subRoundIndex: number) => void;
}

interface Rewards {
  stars: number;
  badges: string[];
  prizes: string[];
}

const RoundScreen: React.FC<RoundScreenProps> = ({ difficulty, onBack, onStartQuest }) => {
  const { questProgress, isLoading, completeSubRound } = useQuest();
  const { 
    isPlaying, 
    isShowingResults, 
    currentParams, 
    currentResults, 
    startGame, 
    completeGame, 
    closeGame 
  } = useGameSession();
  
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [currentRewards, setCurrentRewards] = useState<Rewards | null>(null);
  const [currentVisibleRound, setCurrentVisibleRound] = useState<number>(1);
  const [showRoundsList, setShowRoundsList] = useState<boolean>(false);
  const [showLockedModal, setShowLockedModal] = useState<boolean>(false);
  const [lockedModalInfo, setLockedModalInfo] = useState<{ title: string; message: string } | null>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const roundPositions = useRef<{ [key: number]: number }>({});

  // Animation values
  const startBubbleAnimation = useFloatAnimation();

  const handleSubRoundPress = useCallback((levelIndex: number, roundIndex: number, subRoundIndex: number) => {
    if (!questProgress) return;
    
    const subRound = questProgress.levels[levelIndex]?.rounds[roundIndex]?.subRounds[subRoundIndex];
    if (!subRound || subRound.isLocked) {
      setLockedModalInfo({ title: 'Locked', message: 'Complete previous quests to unlock this one!' });
      setShowLockedModal(true);
      return;
    }

    // Start game directly with specific sub-round data
    startGame({
      difficulty,
      levelIndex,
      roundIndex,
      subRoundIndex
    });
  }, [questProgress, difficulty, startGame]);

  const handleBoxPress = useCallback((levelIndex: number, roundIndex: number) => {
    if (!questProgress) return;
    
    const round = questProgress.levels[levelIndex]?.rounds[roundIndex];
    if (!round) return;

    const allSubRoundsCompleted = round.subRounds
      .slice(0, 5) // SUB_ROUNDS_PER_ROUND
      .every(sr => sr.isCompleted);

    if (!allSubRoundsCompleted) {
      const completedSubRounds = round.subRounds.slice(0, 4).filter(sr => sr.isCompleted).length;
      setLockedModalInfo({ 
        title: 'Treasure Locked', 
        message: `Complete all 4 sub-rounds to unlock this treasure box!\nProgress: ${completedSubRounds}/4` 
      });
      setShowLockedModal(true);
      return;
    }

    if (round.isCompleted) {
      setCurrentRewards(round.rewards);
      setShowRewardModal(true);
    } else {
      const rewards: Rewards = {
        stars: 50 + (roundIndex * 10),
        badges: [`Round ${roundIndex + 1} Master`],
        prizes: [`Special prize for completing round ${roundIndex + 1}!`]
      };
      
      setCurrentRewards(rewards);
      setShowRewardModal(true);
    }
  }, [questProgress]);

  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const headerHeight = 200; // Approximate header height
    
    // Find which round is currently visible
    let visibleRound = 1;
    for (const [roundIndex, position] of Object.entries(roundPositions.current)) {
      if (scrollY + headerHeight >= position) {
        visibleRound = parseInt(roundIndex) + 1;
      } else {
        break;
      }
    }
    
    if (visibleRound !== currentVisibleRound) {
      setCurrentVisibleRound(visibleRound);
    }
  }, [currentVisibleRound]);

  const onRoundLayout = useCallback((roundIndex: number, event: any) => {
    const { y } = event.nativeEvent.layout;
    roundPositions.current[roundIndex] = y;
  }, []);

  const handleGameComplete = useCallback((score: number, totalQuestions: number, starsEarned: number) => {
    completeGame({ score, totalQuestions, starsEarned });
  }, [completeGame]);

  const handleResultsComplete = useCallback(async () => {
    // Complete the sub-round in the quest system
    if (currentParams && currentResults) {
      const { levelIndex, roundIndex, subRoundIndex } = currentParams;
      const starsEarned = Math.min(3, Math.max(1, Math.floor((currentResults.score / currentResults.totalQuestions) * 3)));
      
      // Mark sub-round as completed using quest context
      try {
        await completeSubRound(levelIndex, roundIndex, subRoundIndex, starsEarned);
      } catch (error) {
        console.error('Failed to complete sub-round:', error);
      }
    }
    
    closeGame();
  }, [currentParams, currentResults, completeSubRound, closeGame]);

  const handleRoundSelect = useCallback((roundIndex: number) => {
    const y = roundPositions.current[roundIndex] ?? 0;
    scrollViewRef.current?.scrollTo({ y: Math.max(0, y - 160), animated: true });
  }, []);

  if (isLoading || !questProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading quests...</Text>
      </View>
    );
  }

  const levelIndex = difficulty === 'EASY' ? 0 : difficulty === 'NORMAL' ? 1 : 2;
  const level = questProgress.levels[levelIndex];

  if (!level) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Level not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RoundHeader
        currentVisibleRound={currentVisibleRound}
        levelName={level.name || difficulty}
        totalStars={level.totalStars}
        completedRounds={level.rounds.filter(r => r.isCompleted).length}
        totalRounds={level.rounds.length}
        onBack={onBack}
      />
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* All Rounds Vertically */}
        {!level.isLocked && level.rounds.map((round, roundIndex) => (
          <View 
            key={`round-wrapper-${round.id}`} 
            style={styles.roundWrapper}
            onLayout={(event) => onRoundLayout(roundIndex, event)}
          >
            <RoundItem
              round={round}
              levelIndex={levelIndex}
              roundIndex={roundIndex}
              onSubRoundPress={handleSubRoundPress}
              onTreasureBoxPress={handleBoxPress}
              startBubbleAnimation={startBubbleAnimation}
            />
          </View>
        ))}
      </ScrollView>

      {/* Modals */}
      <RewardModal
        visible={showRewardModal}
        rewards={currentRewards}
        onClose={() => setShowRewardModal(false)}
      />
      
      <LockedModal
        visible={showLockedModal}
        title={lockedModalInfo?.title || 'Locked'}
        message={lockedModalInfo?.message || 'Complete previous quests to unlock this!'}
        onClose={() => setShowLockedModal(false)}
      />
      
      <RoundsListModal
        visible={showRoundsList}
        rounds={level.rounds}
        roundPositions={roundPositions.current}
        onClose={() => setShowRoundsList(false)}
        onRoundSelect={handleRoundSelect}
      />
      
      {/* Game Screen Modal */}
      <Modal
        visible={isPlaying}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeGame}
      >
        {currentParams && (
          <>
            <GameScreen
              navigation={{
                navigate: (screen: any, params?: any) => {
                  if (screen === 'Results' && params) {
                    handleGameComplete(params.score, params.totalQuestions, params.starsEarned);
                  }
                },
              } as any}
              route={{
                params: {
                  difficulty: currentParams.difficulty,
                  level: currentParams.levelIndex,
                  round: currentParams.roundIndex,
                  subRound: currentParams.subRoundIndex,
                  questions: questProgress?.levels[currentParams.levelIndex]?.rounds[currentParams.roundIndex]?.subRounds[currentParams.subRoundIndex]?.questions
                }
              } as any}
            />
            <TouchableOpacity
              style={styles.closeQuestButton}
              onPress={closeGame}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </Modal>

      {/* Results Screen Modal */}
      <Modal
        visible={isShowingResults}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleResultsComplete}
      >
        {currentResults && (
          <>
            <ResultsScreen
              navigation={{
                navigate: (screen: any, params?: any) => {
                  handleResultsComplete();
                },
                goBack: () => handleResultsComplete(),
              } as any}
              route={{
                params: currentResults
              } as any}
            />
            <TouchableOpacity
              style={styles.closeQuestButton}
              onPress={handleResultsComplete}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  roundWrapper: {
    marginBottom: 10,
  },
  closeQuestButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
});

export default RoundScreen;
