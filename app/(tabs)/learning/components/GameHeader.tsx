import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GameHeaderProps {
  hearts: number;
  stars: number;
  category: string;
  progress: { current: number; total: number; percentage: number };
  ttsEnabled: boolean;
  isSpeaking: boolean;
  onToggleTTS: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  hearts,
  stars,
  category,
  progress,
  ttsEnabled,
  isSpeaking,
  onToggleTTS,
}) => {
  return (
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
          onPress={onToggleTTS}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
          testID="tts-toggle-button"
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
          <Text style={styles.categoryText}>{category}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress.current}/{progress.total}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${progress.percentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    top: -30,
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
});

export default GameHeader;
