import { Level, QuestProgress, Round, SubRound } from '../types/navigation';
import QUIZ_DATA from './quizData';

// Generate 10 questions for each sub-round
const generateSubRoundQuestions = (roundIndex: number, subRoundIndex: number) => {
  const allQuestions = QUIZ_DATA.all;
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const startIndex = ((roundIndex * 5 + subRoundIndex) * 10) % allQuestions.length;
  const selectedQuestions = [];
  
  for (let i = 0; i < 10; i++) {
    const questionIndex = (startIndex + i) % allQuestions.length;
    selectedQuestions.push(shuffled[questionIndex]);
  }
  
  return selectedQuestions;
};

// Create initial quest structure
const createInitialQuestProgress = (): QuestProgress => {
  const levels: Level[] = [];
  
  // Create 3 levels (Easy, Normal, Hard)
  const difficulties: Array<'EASY' | 'NORMAL' | 'HARD'> = ['EASY', 'NORMAL', 'HARD'];
  
  difficulties.forEach((difficulty, levelIndex) => {
    const rounds: Round[] = [];
    
    // Create 10 rounds per level
    for (let roundIndex = 0; roundIndex < 10; roundIndex++) {
      const subRounds: SubRound[] = [];
      
      // Create 5 sub-rounds per round
      for (let subRoundIndex = 0; subRoundIndex < 5; subRoundIndex++) {
        const subRound: SubRound = {
          id: `level_${levelIndex}_round_${roundIndex}_subround_${subRoundIndex}`,
          name: `Sub-Round ${subRoundIndex + 1}`,
          questions: generateSubRoundQuestions(roundIndex, subRoundIndex),
          isCompleted: false,
          isLocked: !(levelIndex === 0 && roundIndex === 0 && subRoundIndex === 0), // Only first sub-round is unlocked
          stars: 0,
          maxStars: 3 // 3 stars max per sub-round
        };
        subRounds.push(subRound);
      }
      
      const round: Round = {
        id: `level_${levelIndex}_round_${roundIndex}`,
        name: `Round ${roundIndex + 1}`,
        subRounds,
        isCompleted: false,
        isLocked: !(levelIndex === 0 && roundIndex === 0), // Only first round is unlocked
        totalStars: 0,
        rewards: {
          stars: 50 + (roundIndex * 10), // Increasing rewards
          badges: [`round_${roundIndex + 1}_badge`],
          prizes: [`prize_${roundIndex + 1}`]
        }
      };
      rounds.push(round);
    }
    
    const level: Level = {
      id: `level_${levelIndex}`,
      name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()} Level`,
      difficulty,
      rounds,
      isCompleted: false,
      isLocked: levelIndex > 0, // Only first level is unlocked
      totalStars: 0,
      totalRewards: {
        stars: 1000 + (levelIndex * 500),
        badges: [`level_${difficulty.toLowerCase()}_master`],
        prizes: [`level_${levelIndex + 1}_trophy`]
      }
    };
    levels.push(level);
  });

  return {
    levels,
    currentLevel: 0,
    currentRound: 0,
    currentSubRound: 0,
    totalStars: 0,
    totalBadges: [],
    totalPrizes: []
  };
};

// Quest progress management functions
export class QuestProgressManager {
  private static readonly STORAGE_KEY = 'quest_progress';
  
  static getInitialProgress(): QuestProgress {
    return createInitialQuestProgress();
  }
  
  static async loadProgress(): Promise<QuestProgress> {
    try {
      // In a real app, you would load from AsyncStorage or similar
      // For now, return initial progress
      return this.getInitialProgress();
    } catch (error) {
      console.error('Failed to load quest progress:', error);
      return this.getInitialProgress();
    }
  }
  
  static async saveProgress(progress: QuestProgress): Promise<void> {
    try {
      // In a real app, you would save to AsyncStorage or similar
      // For now, just log the progress
      console.log('Saving quest progress:', progress);
    } catch (error) {
      console.error('Failed to save quest progress:', error);
    }
  }
  
  static completeSubRound(
    progress: QuestProgress,
    levelIndex: number, 
    roundIndex: number, 
    subRoundIndex: number,
    stars: number
  ): QuestProgress {
    const updatedProgress = { ...progress };
    
    // Mark sub-round as completed
    const subRound = updatedProgress.levels[levelIndex].rounds[roundIndex].subRounds[subRoundIndex];
    subRound.isCompleted = true;
    subRound.stars = Math.max(subRound.stars, stars);
    
    // Unlock next sub-round
    if (subRoundIndex < 4) {
      updatedProgress.levels[levelIndex].rounds[roundIndex].subRounds[subRoundIndex + 1].isLocked = false;
    }
    
    // Check if all sub-rounds in the round are completed
    const allSubRoundsCompleted = updatedProgress.levels[levelIndex].rounds[roundIndex].subRounds
      .every(sr => sr.isCompleted);
    
    if (allSubRoundsCompleted) {
      // Complete the round
      const round = updatedProgress.levels[levelIndex].rounds[roundIndex];
      round.isCompleted = true;
      
      // Calculate total stars for the round
      round.totalStars = round.subRounds.reduce((total, sr) => total + sr.stars, 0);
      updatedProgress.totalStars += round.rewards.stars;
      updatedProgress.totalBadges.push(...round.rewards.badges);
      updatedProgress.totalPrizes.push(...round.rewards.prizes);
      
      // Unlock next round
      if (roundIndex < 9) {
        updatedProgress.levels[levelIndex].rounds[roundIndex + 1].isLocked = false;
        updatedProgress.levels[levelIndex].rounds[roundIndex + 1].subRounds[0].isLocked = false;
      }
      
      // Check if all rounds in the level are completed
      const allRoundsCompleted = updatedProgress.levels[levelIndex].rounds
        .every(r => r.isCompleted);
      
      if (allRoundsCompleted) {
        // Complete the level
        const level = updatedProgress.levels[levelIndex];
        level.isCompleted = true;
        level.totalStars = level.rounds.reduce((total, r) => total + r.totalStars, 0);
        updatedProgress.totalStars += level.totalRewards.stars;
        updatedProgress.totalBadges.push(...level.totalRewards.badges);
        updatedProgress.totalPrizes.push(...level.totalRewards.prizes);
        
        // Unlock next level
        if (levelIndex < 2) {
          updatedProgress.levels[levelIndex + 1].isLocked = false;
          updatedProgress.levels[levelIndex + 1].rounds[0].isLocked = false;
          updatedProgress.levels[levelIndex + 1].rounds[0].subRounds[0].isLocked = false;
        }
      }
    }
    
    return updatedProgress;
  }
  
  static getCurrentSubRound(progress: QuestProgress): { levelIndex: number, roundIndex: number, subRoundIndex: number } | null {
    for (let levelIndex = 0; levelIndex < progress.levels.length; levelIndex++) {
      const level = progress.levels[levelIndex];
      if (level.isLocked) continue;
      
      for (let roundIndex = 0; roundIndex < level.rounds.length; roundIndex++) {
        const round = level.rounds[roundIndex];
        if (round.isLocked) continue;
        
        for (let subRoundIndex = 0; subRoundIndex < round.subRounds.length; subRoundIndex++) {
          const subRound = round.subRounds[subRoundIndex];
          if (!subRound.isLocked && !subRound.isCompleted) {
            return { levelIndex, roundIndex, subRoundIndex };
          }
        }
      }
    }
    
    return null; // All completed or nothing available
  }
}

export default createInitialQuestProgress;
