import { useCallback, useEffect, useState } from 'react';
import { Vibration } from 'react-native';
import QUIZ_DATA from '../data/quizData';

export interface Question {
  question: string;
  options: string[];
  correct_index: number;
  correct_answer?: string;
  category?: string;
}

interface GameFlowProps {
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  subRoundQuestions?: Question[];
}

export function useGameFlow({ difficulty, subRoundQuestions }: GameFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hearts, setHearts] = useState(5);
  const [stars, setStars] = useState(100);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Normalize questions to ensure they have required properties
  const normalizeQuestions = useCallback((qs: Question[]): Question[] => {
    return qs.map(q => ({
      ...q,
      correct_answer: q.correct_answer ?? q.options[q.correct_index],
      category: q.category ?? 'General Knowledge',
    }));
  }, []);

  // Process questions based on difficulty
  const processQuestions = useCallback(() => {
    // Use specific sub-round questions if provided, otherwise fallback to random
    if (subRoundQuestions && subRoundQuestions.length > 0) {
      return [...subRoundQuestions];
    }
    
    // Fallback: Flatten all categories into one array
    const allQuestions = Object.values(QUIZ_DATA).flat();
    
    // Filter by difficulty if needed, or just shuffle
    let filteredQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    
    // Always 10 questions per sub-round
    const questionCount = 10;
    
    return filteredQuestions.slice(0, questionCount);
  }, [difficulty, subRoundQuestions]);

  // Load questions when component mounts or difficulty changes
  useEffect(() => {
    const loadedQuestions = processQuestions();
    const normalizedQuestions = normalizeQuestions(loadedQuestions);
    setQuestions(normalizedQuestions);
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setHintsUsedCount(0);
    setHearts(5);
    setStars(100);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setHintUsed(false);
    setHintText('');
  }, [difficulty, processQuestions, normalizeQuestions]);

  // Calculate reading time based on text length
  const calculateReadingTime = useCallback((text: string): number => {
    const baseTime = 2000; // Minimum 2 seconds
    const timePerChar = 50; // 50ms per character
    const maxTime = 4500; // Maximum 4.5 seconds
    
    return Math.min(maxTime, Math.max(baseTime, text.length * timePerChar));
  }, []);

  const answerQuestion = useCallback((answerIndex: number) => {
    if (isAnswered) return;
    
    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct_index;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate([0, 50, 100, 50]);
    }

    // Calculate delay based on text length for better UX
    const readingTime = calculateReadingTime(currentQ.question);
    const delay = Math.max(readingTime, 2000); // Minimum 2 seconds

    // Move to next question or end sub-round
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setHintUsed(false);
        setHintText('');
      } else {
        // End of sub-round - calculate final results
        handleSubRoundComplete(isCorrect);
      }
    }, delay);
  }, [isAnswered, questions, currentQuestion, calculateReadingTime]);

  const handleSubRoundComplete = useCallback((isLastAnswerCorrect: boolean) => {
    // Count final correct answers (including the last one if correct)
    const finalCorrectAnswers = correctAnswers + (isLastAnswerCorrect ? 1 : 0);
    
    // Calculate final score: correct answers - hint penalties (1 point per hint used)
    const finalScore = finalCorrectAnswers - hintsUsedCount;
    
    // Determine pass/fail (need > 8 points to pass)
    const passed = finalScore > 8;
    
    // Calculate stars based on final score
    let starsEarned = 0;
    if (finalScore < 5) starsEarned = 0; // Poor...
    else if (finalScore >= 5 && finalScore <= 6) starsEarned = 1; // Try hard!
    else if (finalScore >= 7 && finalScore <= 8) starsEarned = 2; // Good
    else if (finalScore >= 9) starsEarned = 3; // Wonderful!
    
    // Return results for parent component to handle navigation
    return {
      score: finalScore,
      totalQuestions: questions.length,
      starsEarned,
      passed,
      heartsRemaining: hearts,
    };
  }, [correctAnswers, hintsUsedCount, questions.length, hearts]);

  const useHint = useCallback(() => {
    if (hintUsed || stars < 10 || isAnswered) return;
    
    setHintUsed(true);
    setHintsUsedCount(prev => prev + 1); // Track hint usage for scoring
    setStars(prev => prev - 10);
    
    const currentQ = questions[currentQuestion];
    const hintOptions = [
      `The answer starts with "${currentQ.correct_answer?.[0] || 'A'}"`,
      `The answer is ${currentQ.correct_answer?.length || 0} letters long`,
      `The answer is about ${currentQ.correct_answer?.split(' ')[0] || 'food'}`,
      `Think about ${currentQ.correct_answer || 'healthy eating'}`
    ];
    
    const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];
    setHintText(randomHint);
    
    return randomHint;
  }, [hintUsed, stars, isAnswered, questions, currentQuestion]);

  const seeCorrectAnswer = useCallback(() => {
    if (stars < 20 || isAnswered) return;
    
    // Cost 20 stars to see the correct answer
    setStars(prev => prev - 20);
    
    // Show the correct answer
    const currentQ = questions[currentQuestion];
    setSelectedAnswer(currentQ.correct_index);
    setIsAnswered(true);
    
    // This doesn't count as a correct answer and automatically moves to next question
    const readingTime = calculateReadingTime(currentQ.question);
    const delay = Math.max(readingTime, 2000);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setHintUsed(false);
        setHintText('');
      } else {
        // End of sub-round
        handleSubRoundComplete(false);
      }
    }, delay);
  }, [stars, isAnswered, questions, currentQuestion, calculateReadingTime, handleSubRoundComplete]);

  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestion];
  }, [questions, currentQuestion]);

  const getProgress = useCallback(() => {
    return {
      current: currentQuestion + 1,
      total: questions.length,
      percentage: ((currentQuestion + 1) / questions.length) * 100,
    };
  }, [currentQuestion, questions.length]);

  return {
    // State
    currentQuestion,
    questions,
    hearts,
    stars,
    correctAnswers,
    hintsUsedCount,
    hintUsed,
    hintText,
    selectedAnswer,
    isAnswered,
    
    // Actions
    answerQuestion,
    useHint,
    seeCorrectAnswer,
    handleSubRoundComplete,
    
    // Getters
    getCurrentQuestion,
    getProgress,
    
    // Computed
    isLastQuestion: currentQuestion === questions.length - 1,
    canUseHint: !hintUsed && stars >= 10 && !isAnswered,
    canSeeAnswer: stars >= 20 && !isAnswered,
  };
}
