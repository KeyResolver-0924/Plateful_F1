import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  runOnJS,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { shadowPresets } from '../../utils/shadowUtils';
import { safeSetItem } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: number;
  character: any;
  title: string;
  description: string;
  characterStyle: { width: number; height: number };
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    character: require('../../assets/images/characters/carrot.png'),
    title: 'Empowering You to Take Control of Your Kids Health',
    description: 'Lorem ipsum dolor sit amet consectetur.\nPorttitor egestas venenatis at nibh urna.',
    characterStyle: { width: 420, height: 420 }
  },
  {
    id: 2,
    character: require('../../assets/images/characters/strawberry.png'),
    title: 'Track Your Child\'s Nutrition Journey',
    description: 'Monitor meals, discover healthy foods, and make nutrition fun for your little ones.',
    characterStyle: { width: 420, height: 420 }
  },
  {
    id: 3,
    character: require('../../assets/images/characters/garlic.png'),
    title: 'Learn & Grow Together',
    description: 'Educational content and gamified experiences to make healthy eating exciting.',
    characterStyle: { width: 410, height: 410 }
  }
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<any>(null);
  
  // Animation values for transitions
  const fadeOpacity = useSharedValue(1);
  const spinnerRotation = useSharedValue(0);
  const contentScale = useSharedValue(1);
  const isHovering = useSharedValue(false);
  
  const animateTransition = (nextIndex: number): void => {
    spinnerRotation.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 100 })
      ),
      -1,
      false
    );
    
    contentScale.value = withTiming(0.8, { duration: 100 }, () => {
      fadeOpacity.value = withTiming(0.2, { duration: 150 }, () => {
        runOnJS(() => {
          scrollRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true
          });
          setCurrentIndex(nextIndex);
          fadeOpacity.value = withTiming(1, { duration: 200 }, () => {
            contentScale.value = withTiming(1, { duration: 150 }, () => {
              runOnJS(() => {
                spinnerRotation.value = 0;
              });
            });
          });
        })();
      });
    });
  };
  const handleNext = async (): Promise<void> => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      animateTransition(nextIndex);
    } else {
      await safeSetItem('onboardingComplete', 'true');
      if (router && router.replace) {
        router.replace('/auth/sign-in');
      } else {
        console.error('Router is not available');
      }
    }
  };

  const handleBack = (): void => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      animateTransition(prevIndex);
    }
  };
  
  const handleSkip = async (): Promise<void> => {
    await safeSetItem('onboardingComplete', 'true');
    if (router && router.replace) {
      router.replace('/auth/sign-in');
    } else {
      console.error('Router is not available');
    }
  };
  
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <Animated.View key={item.id} style={[styles.slide]}>
            <View style={styles.imageContainer}>
              <Image source={item.character} style={[styles.character, item.characterStyle]} />
            </View>
              <View style={styles.pagination}>
                {onboardingData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentIndex && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
              <View style={styles.textContainer}>
                <Animated.Text style={[styles.title]}>
                  {item.title}
                </Animated.Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
          </Animated.View>
        ))}
      </Animated.ScrollView>

      <View style={styles.bottomContainer}>
        {currentIndex > 0 ? (
          // Show both Back and Next buttons
          <View style={styles.buttonRow}>
            <Animated.View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <Text style={styles.backButtonText}>
                  <Ionicons name="arrow-back" size={25} color="white" />
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  <Ionicons name="arrow-forward" size={25} color="white" />
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        ) : (
          // Show only Next button on first screen
          <Animated.View>
            <TouchableOpacity
              style={styles.singleNextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
      {isHovering.value && (
        <Animated.View style={styles.boundarySpinner}>
          <Ionicons name="pulse" size={40} color={colors.primary} />
        </Animated.View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    paddingTop: 170,
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 200,
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width - 64,
    gap: 70,
  },
  buttonContainer: {
    flex: 1,
  },
  singleNextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    width: width - 64, // Full width for single button
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadowPresets.medium,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    flex: 1, // Use flex instead of fixed width when in buttonRow
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadowPresets.medium,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    flex: 1, // Equal width with nextButton
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadowPresets.medium,
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: '600',
  },
  spinner: {
    padding: 2,
  },
  boundarySpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

export default OnboardingScreen; 