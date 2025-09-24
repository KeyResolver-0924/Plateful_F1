export type RootStackParamList = {
  Game: { 
    difficulty: 'EASY' | 'NORMAL' | 'HARD';
    level?: number;
    round?: number;
    subRound?: number;
    questions?: Question[];
  };
  Results: {
    score: number;
    totalQuestions: number;
    starsEarned: number;
    level?: number;
    round?: number;
    subRound?: number;
    isSubRoundComplete?: boolean;
    isRoundComplete?: boolean;
    isLevelComplete?: boolean;
  };
};

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  correct_index: number;
  category: string;
  difficulty?: Difficulty;
  explanation?: string;
}

export interface SubRound {
  id: string;
  name: string;
  questions: Question[];
  isCompleted: boolean;
  isLocked: boolean;
  stars: number;
  maxStars: number;
}

export interface Round {
  id: string;
  name: string;
  subRounds: SubRound[];
  isCompleted: boolean;
  isLocked: boolean;
  totalStars: number;
  rewards: {
    stars: number;
    badges: string[];
    prizes: string[];
  };
}

export interface Level {
  id: string;
  name: string;
  difficulty: Difficulty;
  rounds: Round[];
  isCompleted: boolean;
  isLocked: boolean;
  totalStars: number;
  totalRewards: {
    stars: number;
    badges: string[];
    prizes: string[];
  };
}

export interface QuestProgress {
  levels: Level[];
  currentLevel: number;
  currentRound: number;
  currentSubRound: number;
  totalStars: number;
  totalBadges: string[];
  totalPrizes: string[];
}
