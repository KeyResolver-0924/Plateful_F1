import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameFooterProps {
  hintText: string;
  canUseHint: boolean;
  canSeeAnswer: boolean;
  onUseHint: () => void;
  onSeeAnswer: () => void;
}

const GameFooter: React.FC<GameFooterProps> = ({
  hintText,
  canUseHint,
  canSeeAnswer,
  onUseHint,
  onSeeAnswer,
}) => {
  return (
    <View style={styles.footer}>
      {hintText ? (
        <View style={styles.hintContainer}>
          <Ionicons name="bulb" size={18} color="#FFD93D" />
          <Text style={styles.hintText}>{hintText}</Text>
        </View>
      ) : null}
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, !canUseHint && styles.disabledButton]}
          onPress={onUseHint}
          disabled={!canUseHint}
          accessibilityRole="button"
          accessibilityLabel="Use hint for 10 stars"
          testID="hint-button"
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={canUseHint ? '#FFD93D' : '#CCCCCC'} 
          />
          <Text style={[
            styles.actionButtonText,
            { color: canUseHint ? '#FFD93D' : '#CCCCCC' }
          ]}>
            Hint (10⭐)
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, !canSeeAnswer && styles.disabledButton]}
          onPress={onSeeAnswer}
          disabled={!canSeeAnswer}
          accessibilityRole="button"
          accessibilityLabel="See correct answer for 20 stars"
          testID="see-answer-button"
        >
          <Ionicons 
            name="eye" 
            size={20} 
            color={canSeeAnswer ? '#FF6B35' : '#CCCCCC'} 
          />
          <Text style={[
            styles.actionButtonText,
            { color: canSeeAnswer ? '#FF6B35' : '#CCCCCC' }
          ]}>
            See Answer (20⭐)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  hintText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#5D4037',
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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

export default GameFooter;
