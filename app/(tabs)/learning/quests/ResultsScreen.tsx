// src/screens/ResultsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    SafeAreaView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../types/navigation';

type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, 'Results'>;

const ResultsScreen = ({ navigation, route }: ResultsScreenProps) => {
  const { score, totalQuestions, starsEarned } = route.params;
  const percentage = Math.round((score / totalQuestions) * 100);

  const shareResults = async () => {
    try {
      const passStatus = score > 8 ? "PASSED" : "FAILED";
      await Share.share({
        message: `I ${passStatus} the Healthy Food Quiz with ${score}/10 points and earned ${starsEarned} stars! ${score > 8 ? '🎉' : '💪'} Can you beat my score? 🍎🥦 #HealthyFoodQuiz`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getResultMessage = () => {
    // New scoring system based on actual score (not percentage)
    if (score >= 9) return "Wonderful! 🎉";
    if (score >= 7) return "Good Job! 👍";
    if (score >= 5) return "Try Hard! 😊";
    return "Poor... Keep Practicing! 💪";
  };

  const getPassFailMessage = () => {
    return score > 8 ? "PASSED ✅" : "FAILED ❌";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Quiz Complete!</Text>
        
        <View style={styles.resultCard}>
          <Text style={styles.passFailText}>{getPassFailMessage()}</Text>
          <Text style={styles.scoreText}>
            {score}<Text style={styles.totalText}>/10</Text>
          </Text>
          <Text style={styles.message}>{getResultMessage()}</Text>
          
          <View style={styles.starsContainer}>
            {[...Array(3)].map((_, i) => (
              <Ionicons 
                key={i} 
                name="star" 
                size={32} 
                color={i < starsEarned ? '#FFD700' : '#e0e0e0'} 
                style={styles.starIcon}
              />
            ))}
          </View>
          
          <Text style={styles.starsEarned}>+{starsEarned} Stars</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={shareResults}
          >
            <Ionicons name="share" size={20} color="#3498db" />
            <Text style={[styles.buttonText, { color: '#3498db' }]}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={() => navigation.goBack && navigation.goBack()}
          >
            <Ionicons name="home" size={20} color="white" />
            <Text style={[styles.buttonText, { color: 'white' }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
  },
  passFailText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalText: {
    fontSize: 36,
    color: '#95a5a6',
  },
  percentage: {
    fontSize: 24,
    color: '#7f8c8d',
    marginTop: -10,
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  starsEarned: {
    fontSize: 18,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 350,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  playAgainButton: {
    backgroundColor: '#3498db',
    marginLeft: 10,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;