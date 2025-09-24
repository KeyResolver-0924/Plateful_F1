import { useState } from 'react';

interface GameParams {
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  levelIndex: number;
  roundIndex: number;
  subRoundIndex: number;
}

interface GameResults {
  score: number;
  totalQuestions: number;
  starsEarned: number;
}

type GameState = 'idle' | 'playing' | 'results';

interface GameSession {
  state: GameState;
  params?: GameParams;
  results?: GameResults;
}

export function useGameSession() {
  const [gameSession, setGameSession] = useState<GameSession>({ state: 'idle' });

  const startGame = (params: GameParams) => {
    setGameSession({ state: 'playing', params });
  };

  const completeGame = (results: GameResults) => {
    setGameSession(prev => ({ ...prev, state: 'results', results }));
  };

  const closeGame = () => {
    setGameSession({ state: 'idle' });
  };

  const isPlaying = gameSession.state === 'playing';
  const isShowingResults = gameSession.state === 'results';
  const currentParams = gameSession.params;
  const currentResults = gameSession.results;

  return {
    gameSession,
    isPlaying,
    isShowingResults,
    currentParams,
    currentResults,
    startGame,
    completeGame,
    closeGame,
  };
}
