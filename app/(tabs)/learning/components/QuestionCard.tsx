import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import getFoodImageSource from '../../../../utils/imageUtils';

interface QuestionCardProps {
  question: string;
  category: string;
  isSpeaking: boolean;
  currentSpeakingText: string;
  onQuestionPress: () => void;
  onReadQuestion: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  category,
  isSpeaking,
  currentSpeakingText,
  onQuestionPress,
  onReadQuestion,
}) => {
  // Get corresponding food item image directly from utils
  const getCategoryImage = (category: string) => getFoodImageSource(category);

  const categoryImage = getCategoryImage(category);
  const isCurrentlySpeaking = isSpeaking && currentSpeakingText === question;

  return (
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
        onPress={onQuestionPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Re-read question"
        testID="question-touchable"
      >
        <Text style={styles.questionText}>{question}</Text>
        <View style={styles.questionAudioIndicator}>
          <Ionicons 
            name={isCurrentlySpeaking ? "volume-high" : "volume-medium"} 
            size={20} 
            color={isCurrentlySpeaking ? "#4CAF50" : "#666"} 
          />
          {isCurrentlySpeaking && (
            <View style={styles.speakingPulse} />
          )}
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.readQuestionButton}
        onPress={onReadQuestion}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Read question aloud"
        testID="read-question-button"
      >
        <Ionicons 
          name={isCurrentlySpeaking ? "volume-high" : "volume-medium"} 
          size={20} 
          color={isCurrentlySpeaking ? "#2E7D32" : "#2E7D32"} 
        />
        <Text style={[
          styles.readButtonText,
          { color: isCurrentlySpeaking ? "#2E7D32" : "#2E7D32" }
        ]}>
          {isCurrentlySpeaking ? "Reading..." : "Read Question"}
        </Text>
        {isCurrentlySpeaking && (
          <View style={styles.questionButtonPulse} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default QuestionCard;
