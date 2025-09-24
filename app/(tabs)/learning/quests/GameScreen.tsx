// src/screens/GameScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import QUIZ_DATA from '../data/quizData';
import { RootStackParamList } from '../types/navigation';


type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Category image mapping
const CATEGORY_IMAGES = {
  'Fruits': require('../../../../assets/images/foods/fruits.png'),
  'Vegetables': require('../../../../assets/images/foods/broccoli.png'),
  'Proteins': require('../../../../assets/images/foods/chicken.png'),
  'Grains': require('../../../../assets/images/foods/rice.png'),
  'Dairy': require('../../../../assets/images/foods/milk.png'),
  'Nuts': require('../../../../assets/images/foods/nuts.png'),
  'General Knowledge': require('../../../../assets/images/foods/meal.png'),
  'default': require('../../../../assets/images/foods/meal.png'),
};

const GameScreen = ({ navigation, route }: GameScreenProps) => {
  const { difficulty, questions: subRoundQuestions } = route.params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0); // Legacy state, keeping for compatibility
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [hearts, setHearts] = useState(5);
  const [stars, setStars] = useState(100);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintText, setHintText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // TTS Configuration for children
  const ttsOptions = {
    language: 'en-US',
    pitch: 1.2, // Higher pitch for children
    rate: 0.7, // Slower rate for better comprehension
    voice: 'com.apple.ttsbundle.Samantha-compact', // Child-friendly voice on iOS
  };

  // Fallback TTS options for different platforms
  const getTTSOptions = () => {
    // Try to use platform-specific voices
    if (Platform.OS === 'ios') {
      return {
        ...ttsOptions,
        voice: 'com.apple.ttsbundle.Samantha-compact',
      };
    } else if (Platform.OS === 'android') {
      return {
        ...ttsOptions,
        voice: 'en-us-x-sfg#female_1-local', // Android female voice
      };
    }
    return ttsOptions;
  };

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
    setQuestions(loadedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setHintsUsedCount(0);
    setHearts(5);
    setStars(100);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setHintUsed(false);
    setHintText('');
  }, [difficulty, processQuestions]);

  // TTS Functions
  const speakText = async (text: string, isQuestion: boolean = false) => {
    if (!ttsEnabled) return;
    
    if (isSpeaking) {
      await Speech.stop();
    }
    
    setIsSpeaking(true);
    setCurrentSpeakingText(text);
    
    try {
      // Add context for questions to make them more engaging for children
      let speechText = text;
      if (isQuestion) {
        speechText = `Question: ${text}`;
      }
      
      await Speech.speak(speechText, getTTSOptions());
    } catch (error) {
      console.error('TTS Error:', error);
      // Fallback: try without voice specification
      try {
        await Speech.speak(text, { language: 'en-US', pitch: 1.2, rate: 0.7 });
      } catch (fallbackError) {
        console.error('TTS Fallback Error:', fallbackError);
      }
    } finally {
      setIsSpeaking(false);
      setCurrentSpeakingText('');
    }
  };

  const stopSpeaking = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
      setCurrentSpeakingText('');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setTtsEnabled(!ttsEnabled);
  };

  // Auto-read question when it changes
  useEffect(() => {
    if (ttsEnabled && questions.length > 0 && questions[currentQuestion]) {
      const currentQ = questions[currentQuestion];
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        speakText(currentQ.question, true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, questions, ttsEnabled]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Get category image
  const getCategoryImage = (category: string) => {
    const normalizedCategory = category?.toLowerCase();
    if (normalizedCategory?.includes('fruit')) return CATEGORY_IMAGES['Fruits'];
    if (normalizedCategory?.includes('vegetable') || normalizedCategory?.includes('veggie')) return CATEGORY_IMAGES['Vegetables'];
    if (normalizedCategory?.includes('protein') || normalizedCategory?.includes('meat')) return CATEGORY_IMAGES['Proteins'];
    if (normalizedCategory?.includes('grain') || normalizedCategory?.includes('bread') || normalizedCategory?.includes('rice')) return CATEGORY_IMAGES['Grains'];
    if (normalizedCategory?.includes('dairy') || normalizedCategory?.includes('milk') || normalizedCategory?.includes('cheese')) return CATEGORY_IMAGES['Dairy'];
    if (normalizedCategory?.includes('nut')) return CATEGORY_IMAGES['Nuts'];
    return CATEGORY_IMAGES['default'];
  };

  // Animation for correct/incorrect answers
  const animateFeedback = (isCorrect: boolean) => {
    const toValue = isCorrect ? 1 : 0;
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Shake animation for wrong answer
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct_index;
    
    setSelectedAnswer(answerIndex);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      Vibration.vibrate(100);
      animateFeedback(true);
      
      // Speak success message
      if (ttsEnabled) {
        speakText("Great job! That's correct!");
      }
    } else {
      shake();
      Vibration.vibrate([0, 50, 100, 50]);
      
      // Speak the correct answer
      if (ttsEnabled) {
        const correctAnswer = currentQ.options[currentQ.correct_index];
        speakText(`The correct answer is: ${correctAnswer}`);
      }
    }

    // Move to next question or end sub-round
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setHintUsed(false);
        setHintText('');
      } else {
        // End of sub-round - calculate final results
        handleSubRoundComplete(isCorrect);
      }
    }, 3000); // Longer delay to allow TTS to complete
  };

  const handleSubRoundComplete = (isLastAnswerCorrect: boolean) => {
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
    
    // If failed, decrease hearts
    if (!passed) {
      setHearts(prev => {
        const newHearts = prev - 1;
        if (newHearts <= 0) {
          // No more hearts - show results but indicate cannot retry
          navigation.navigate('Results', {
            score: finalScore,
            totalQuestions: questions.length,
            starsEarned: 0, // No stars if no hearts left
            isSubRoundComplete: false,
            isRoundComplete: false,
            isLevelComplete: false
          });
          return 0;
        }
        // Still have hearts, show failed results
        navigation.navigate('Results', {
          score: finalScore,
          totalQuestions: questions.length,
          starsEarned: 0, // No stars for failing
          isSubRoundComplete: false,
          isRoundComplete: false,
          isLevelComplete: false
        });
        return newHearts;
      });
    } else {
      // Passed - show success results
      navigation.navigate('Results', {
        score: finalScore,
        totalQuestions: questions.length,
        starsEarned,
        isSubRoundComplete: true,
        isRoundComplete: false, // This will be determined by the quest system
        isLevelComplete: false
      });
    }
  };

  const useHint = () => {
    if (hintUsed || stars < 10 || selectedAnswer !== null) return;
    
    setHintUsed(true);
    setHintsUsedCount(prev => prev + 1); // Track hint usage for scoring
    setStars(prev => prev - 10);
    
    const currentQ = questions[currentQuestion];
    const hintOptions = [
      `The answer starts with "${currentQ.correct_answer[0]}"`,
      `The answer is ${currentQ.correct_answer.length} words long`,
      `The answer is about ${currentQ.correct_answer.split(' ')[0]}`,
      `Think about ${currentQ.correct_answer}`
    ];
    
    const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];
    setHintText(randomHint);
    
    // Speak the hint
    if (ttsEnabled) {
      speakText(`Hint: ${randomHint}`);
    }
  };

  const seeCorrectAnswer = () => {
    if (stars < 20 || selectedAnswer !== null) return;
    
    // Cost 20 stars to see the correct answer
    setStars(prev => prev - 20);
    
    // Show the correct answer
    const currentQ = questions[currentQuestion];
    setSelectedAnswer(currentQ.correct_index);
    setShowAnswer(true);
    
    // Speak the correct answer
    if (ttsEnabled) {
      speakText(`The correct answer is: ${currentQ.correct_answer}`);
    }
    
    // This doesn't count as a correct answer and automatically moves to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setHintUsed(false);
        setHintText('');
      } else {
        // End of sub-round
        handleSubRoundComplete(false);
      }
    }, 3000); // Longer delay to allow TTS to complete
  };

  const handleOptionPress = (optionText: string, index: number) => {
    // Read the option when pressed (before selecting)
    if (ttsEnabled) {
      speakText(`Option ${String.fromCharCode(65 + index)}: ${optionText}`);
    }
  };

  const handleQuestionPress = () => {
    // Re-read the question when pressed
    if (questions[currentQuestion] && ttsEnabled) {
      speakText(questions[currentQuestion].question, true);
    }
  };

  const renderQuestion = () => {
    if (questions.length === 0 || !questions[currentQuestion]) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading questions...</Text>
        </View>
      );
    }

    const currentQ = questions[currentQuestion];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = isAnswered && selectedAnswer === currentQ.correct_index;
    const categoryImage = getCategoryImage(currentQ.category);

    return (
      <Animated.View 
        style={[
          styles.questionContainer,
          { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
              <Text style={styles.statText}>×{hearts}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="#FFD93D" />
              <Text style={styles.statText}>{stars}</Text>
            </View>
          </View>
          
          <View style={styles.centerHeaderContainer}>
            <TouchableOpacity
              style={styles.ttsToggleButton}
              onPress={toggleTTS}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={ttsEnabled ? "volume-high" : "volume-mute"} 
                size={24} 
                color={ttsEnabled ? "#4CAF50" : "#FF6B6B"} 
              />
            </TouchableOpacity>
            {isSpeaking && (
              <View style={styles.speakingStatus}>
                <Text style={styles.speakingStatusText}>Speaking...</Text>
              </View>
            )}
          </View>
          
          <View style={styles.rightHeaderContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentQ.category || 'General Knowledge'}</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {currentQuestion + 1}/{questions.length}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.questionContent}>
          <View style={styles.categoryImageContainer}>
            <Image 
              source={categoryImage} 
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.questionTouchable}
            onPress={handleQuestionPress}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText}>{currentQ.question}</Text>
            <View style={styles.questionAudioIndicator}>
              <Ionicons 
                name={isSpeaking && currentSpeakingText === currentQ.question ? "volume-high" : "volume-medium"} 
                size={20} 
                color={isSpeaking && currentSpeakingText === currentQ.question ? "#4CAF50" : "#666"} 
              />
              {isSpeaking && currentSpeakingText === currentQ.question && (
                <View style={styles.speakingPulse} />
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.readQuestionButton}
            onPress={() => speakText(currentQ.question, true)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isSpeaking && currentSpeakingText === currentQ.question ? "volume-high" : "volume-medium"} 
              size={20} 
              color={isSpeaking && currentSpeakingText === currentQ.question ? "#2E7D32" : "#4CAF50"} 
            />
            <Text style={[
              styles.readButtonText,
              { color: isSpeaking && currentSpeakingText === currentQ.question ? "#2E7D32" : "#2E7D32" }
            ]}>
              {isSpeaking && currentSpeakingText === currentQ.question ? "Reading..." : "Read Question"}
            </Text>
            {isSpeaking && currentSpeakingText === currentQ.question && (
              <View style={styles.questionButtonPulse} />
            )}
          </TouchableOpacity>
          
          {hintText ? (
            <View style={styles.hintContainer}>
              <Ionicons name="bulb" size={18} color="#FFD93D" />
              <Text style={styles.hintText}>{hintText}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === currentQ.correct_index;
            let optionStyle: any = styles.option;
            let optionTextStyle: any = styles.optionText;
            
            if (isAnswered) {
              if (isSelected && isCorrectOption) {
                optionStyle = [styles.option, styles.correctOption];
                optionTextStyle = [styles.optionText, styles.correctOptionText];
              } else if (isSelected) {
                optionStyle = [styles.option, styles.wrongOption];
                optionTextStyle = [styles.optionText, styles.wrongOptionText];
              } else if (isCorrectOption) {
                optionStyle = [styles.option, styles.correctOption];
                optionTextStyle = [styles.optionText, styles.correctOptionText];
              }
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={[optionStyle, isAnswered && styles.optionAnswered]}
                onPress={() => handleAnswer(index)}
                onPressIn={() => handleOptionPress(option, index)}
                disabled={isAnswered}
                activeOpacity={0.7}
              >
                <View style={styles.optionIndicator}>
                  {isAnswered && isCorrectOption && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <Ionicons name="close" size={20} color="#F44336" />
                  )}
                  {!isAnswered && (
                    <Text style={styles.optionLetter}>
                      {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                    </Text>
                  )}
                </View>
                <Text style={optionTextStyle}>{option}</Text>
                
                <TouchableOpacity
                  style={styles.readAnswerButton}
                  onPress={() => speakText(`Option ${String.fromCharCode(65 + index)}: ${option}`)}
                  activeOpacity={0.7}
                  disabled={isAnswered}
                >
                  <Ionicons 
                    name={isSpeaking && currentSpeakingText === `Option ${String.fromCharCode(65 + index)}: ${option}` ? "volume-high" : "volume-medium"} 
                    size={16} 
                    color={isAnswered ? "#CCC" : (isSpeaking && currentSpeakingText === `Option ${String.fromCharCode(65 + index)}: ${option}` ? "#2E7D32" : "#4CAF50")} 
                  />
                  {isSpeaking && currentSpeakingText === `Option ${String.fromCharCode(65 + index)}: ${option}` && (
                    <View style={styles.answerSpeakingPulse} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, (hintUsed || stars < 10 || selectedAnswer !== null) && styles.disabledButton]}
            onPress={useHint}
            disabled={hintUsed || stars < 10 || selectedAnswer !== null}
          >
            <Ionicons 
              name="help-circle" 
              size={20} 
              color={hintUsed || stars < 10 || selectedAnswer !== null ? '#CCCCCC' : '#FFD93D'} 
            />
            <Text style={[
              styles.actionButtonText,
              { color: hintUsed || stars < 10 || selectedAnswer !== null ? '#CCCCCC' : '#FFD93D' }
            ]}>
              Hint (10⭐)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, (stars < 20 || selectedAnswer !== null) && styles.disabledButton]}
            onPress={seeCorrectAnswer}
            disabled={stars < 20 || selectedAnswer !== null}
          >
            <Ionicons 
              name="eye" 
              size={20} 
              color={stars < 20 || selectedAnswer !== null ? '#CCCCCC' : '#FF6B35'} 
            />
            <Text style={[
              styles.actionButtonText,
              { color: stars < 20 || selectedAnswer !== null ? '#CCCCCC' : '#FF6B35' }
            ]}>
              See Answer (20⭐)
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      {renderQuestion()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 4,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  centerHeaderContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  ttsToggleButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  speakingStatus: {
    position: 'absolute',
    top: -30, // Adjust as needed
    backgroundColor: '#FFD93D',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD93D',
  },
  speakingStatusText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: 'bold',
  },
  rightHeaderContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  categoryImageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  instructionContainer: {
    backgroundColor: '#E0F2F7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionTouchable: {
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 32,
  },
  questionAudioIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 8,
  },
  speakingPulse: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    opacity: 0.7,
  },
  readQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 16,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  readButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  questionButtonPulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E8F5E9',
    borderRadius: 25,
    opacity: 0.5,
  },
  readButtonsInstruction: {
    backgroundColor: '#E0F2F7',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  readButtonsInstructionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    maxWidth: '90%',
  },
  hintText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#5D4037',
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionsInstruction: {
    backgroundColor: '#E0F2F7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  optionsInstructionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsSubInstructionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  optionAnswered: {
    opacity: 0.8,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  correctOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF5350',
  },
  wrongOptionText: {
    color: '#C62828',
    textDecorationLine: 'line-through',
  },
  optionAudioIndicator: {
    marginLeft: 8,
    opacity: 0.6,
  },
  readAnswerButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F0F8F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  answerSpeakingPulse: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  

});

export default GameScreen;