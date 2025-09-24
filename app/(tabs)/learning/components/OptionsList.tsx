import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OptionsListProps {
  options: string[];
  correctIndex: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isSpeaking: boolean;
  currentSpeakingText: string;
  onAnswerSelect: (index: number) => void;
  onOptionPress: (optionText: string, index: number) => void;
  onReadOption: (optionText: string, index: number) => void;
}

const OptionsList: React.FC<OptionsListProps> = ({
  options,
  correctIndex,
  selectedAnswer,
  isAnswered,
  isSpeaking,
  currentSpeakingText,
  onAnswerSelect,
  onOptionPress,
  onReadOption,
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrectOption = index === correctIndex;
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
        
        const isCurrentlySpeaking = isSpeaking && currentSpeakingText === `Option ${String.fromCharCode(65 + index)}: ${option}`;
        
        return (
          <TouchableOpacity
            key={index}
            style={[optionStyle, isAnswered && styles.optionAnswered]}
            onPress={() => onAnswerSelect(index)}
            onPressIn={() => onOptionPress(option, index)}
            disabled={isAnswered}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Option ${String.fromCharCode(65 + index)}: ${option}`}
            testID={`option-${index}`}
          >
            <View style={styles.optionIndicator}>
              {isAnswered && isCorrectOption && (
                <Ionicons name="checkmark" size={20} color="#4CAF50" />
              )}
              {isAnswered && isSelected && !isCorrectOption && (
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
              onPress={() => onReadOption(option, index)}
              activeOpacity={0.7}
              disabled={isAnswered}
              accessibilityRole="button"
              accessibilityLabel={`Read option ${String.fromCharCode(65 + index)}`}
              testID={`read-option-${index}`}
            >
              <Ionicons 
                name={isCurrentlySpeaking ? "volume-high" : "volume-medium"} 
                size={16} 
                color={isAnswered ? "#CCC" : (isCurrentlySpeaking ? "#2E7D32" : "#4CAF50")} 
              />
              {isCurrentlySpeaking && (
                <View style={styles.answerSpeakingPulse} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 24,
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
});

export default OptionsList;
