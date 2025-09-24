import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { QuestProgressManager } from '../data/questProgress';
import { QuestProgress } from '../types/navigation';

interface QuestContextType {
  questProgress: QuestProgress | null;
  completeSubRound: (levelIndex: number, roundIndex: number, subRoundIndex: number, stars: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  saveProgress: () => Promise<void>;
  isLoading: boolean;
}

interface QuestState {
  questProgress: QuestProgress | null;
  isLoading: boolean;
}

type QuestAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: QuestProgress }
  | { type: 'COMPLETE_SUB_ROUND'; payload: { levelIndex: number; roundIndex: number; subRoundIndex: number; stars: number } }
  | { type: 'RESET_PROGRESS' };

const initialState: QuestState = {
  questProgress: null,
  isLoading: true
};

const questReducer = (state: QuestState, action: QuestAction): QuestState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PROGRESS':
      return { ...state, questProgress: action.payload, isLoading: false };
    
    case 'COMPLETE_SUB_ROUND':
      if (!state.questProgress) return state;
      const updatedProgress = QuestProgressManager.completeSubRound(
        state.questProgress,
        action.payload.levelIndex,
        action.payload.roundIndex,
        action.payload.subRoundIndex,
        action.payload.stars
      );
      return { ...state, questProgress: updatedProgress };
    
    case 'RESET_PROGRESS':
      return { ...state, questProgress: QuestProgressManager.getInitialProgress() };
    
    default:
      return state;
  }
};

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(questReducer, initialState);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const progress = await QuestProgressManager.loadProgress();
      dispatch({ type: 'SET_PROGRESS', payload: progress });
    } catch (error) {
      console.error('Failed to load quest progress:', error);
      dispatch({ type: 'SET_PROGRESS', payload: QuestProgressManager.getInitialProgress() });
    }
  };

  const completeSubRound = async (levelIndex: number, roundIndex: number, subRoundIndex: number, stars: number) => {
    dispatch({ 
      type: 'COMPLETE_SUB_ROUND', 
      payload: { levelIndex, roundIndex, subRoundIndex, stars } 
    });
    
    // Save progress after completion
    if (state.questProgress) {
      try {
        const updatedProgress = QuestProgressManager.completeSubRound(
            state.questProgress,
          levelIndex,
          roundIndex,
          subRoundIndex,
          stars
        );
        await QuestProgressManager.saveProgress(updatedProgress);
      } catch (error) {
        console.error('Failed to save quest progress:', error);
      }
    }
  };

  const resetProgress = async () => {
    dispatch({ type: 'RESET_PROGRESS' });
    try {
      const initialProgress = QuestProgressManager.getInitialProgress();
      await QuestProgressManager.saveProgress(initialProgress);
    } catch (error) {
      console.error('Failed to reset quest progress:', error);
    }
  };

  const saveProgress = async () => {
    if (state.questProgress) {
      try {
        await QuestProgressManager.saveProgress(state.questProgress);
      } catch (error) {
        console.error('Failed to save quest progress:', error);
      }
    }
  };

  const contextValue: QuestContextType = {
    questProgress: state.questProgress,
    completeSubRound,
    resetProgress,
    saveProgress,
    isLoading: state.isLoading
  };

  return (
    <QuestContext.Provider value={contextValue}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuest = (): QuestContextType => {
  const context = useContext(QuestContext);
  if (context === undefined) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};
