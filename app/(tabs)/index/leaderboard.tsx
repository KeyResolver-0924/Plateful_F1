import { useMealStore } from '@/stores/mealStore';
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp
} from 'react-native-reanimated';
import { colors } from '../../../constants/colors';
import { getFoodImageSource } from '../../../utils/imageUtils';

interface MealItemType {
  foodName: string;
  plan: number;
  eaten: number;
  percentage: number;
  _id: string;
}

interface MealMealsType {
  foods: MealItemType[];
  totalTime: number;
  mealPercentage: number;
  totalPlan: number;
  totalEaten: number;
}

interface MealHistoryType {
  _id: string;
  childId: string;
  parentId: string;
  date: string;
  dailyPercentage: number;
  dailyTotalPlan: number;
  dailyTotalEaten: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  breakfast: MealMealsType;
  lunch: MealMealsType;
  dinner: MealMealsType;
  snack: MealMealsType;
}

const LeaderboardScreen = () => {
  const { selectedChildId } = useUserStore();
  const {getMealHistoryByIdToday, mealHistory} = useMealStore();
  
  useEffect(() => {
    if (selectedChildId) {
      getMealHistoryByIdToday(selectedChildId);
    }
  }, [selectedChildId]);
  
  const displayMealHistory = mealHistory && mealHistory.length > 0 ? mealHistory : [];
  
  const weeklyNutrients = displayMealHistory.length > 0 ? {
    Breakfast: displayMealHistory[0].breakfast.mealPercentage || 0,
    Lunch: displayMealHistory[0].lunch.mealPercentage || 0,
    Dinner: displayMealHistory[0].dinner.mealPercentage || 0,
    Snack: displayMealHistory[0].snack.mealPercentage || 0,
    change: '+3% From Last Month'
  } : {
    Breakfast: 0,
    Lunch: 0,
    Dinner: 0,
    Snack: 0,
    change: '+3% From Last Month'
  };

  const todayProgress = displayMealHistory.length > 0 ? {
    completed: displayMealHistory[0].dailyPercentage || 0,
    remaining: 100 - (displayMealHistory[0].dailyPercentage || 0)
  } : {
    completed: 0,
    remaining: 100
  };

  const NutrientChart = () => {
    const segments = [
      { percentage: weeklyNutrients.Breakfast, color: '#4CAF50', label: 'Breakfast' },
      { percentage: weeklyNutrients.Lunch, color: '#FF9800', label: 'Lunch' },
      { percentage: weeklyNutrients.Dinner, color: '#2196F3', label: 'Dinner' },
      { percentage: weeklyNutrients.Snack, color: '#2196F3', label: 'Snack' }
    ];
    return (
      <View style={styles.chartContainer}>
        <View style={styles.pieChart}>
          <View style={styles.chartCenter}>
            <Image source={require('../../../assets/images/characters/marketing.png')} style={{width: 150, height: 150}}/>
          </View>
        </View>
        <View style={styles.chartLegend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
              <Text style={styles.legendLabel}>{segment.label}</Text>
              <Text style={styles.legendValue}>{segment.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MealCard = ({ meal, index }: { meal: MealHistoryType, index: number }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
    const getFoodImage = (foodName: string) => {
      return getFoodImageSource(foodName);
    };
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={styles.mealCard}
      >
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Meal History</Text>
          <Text style={styles.mealDateTime}>{formatDate(meal.date)}</Text>
        </View>       
        <View style={styles.mealItems}>
          {/* Breakfast */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Breakfast</Text>
              <Text style={styles.mealSectionPercentage}>{meal.breakfast.mealPercentage}%</Text>
            </View>
            {meal.breakfast.foods.map((food, foodIdx) => (
              <View key={foodIdx} style={styles.foodItem}>
                <View style={styles.foodItemContent}>
                  <Image source={getFoodImage(food.foodName)} style={styles.foodIcon} />
                  <View style={styles.foodTextContainer}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                    <Text style={styles.foodDetails}>
                      {food.eaten}g / {food.plan}g ({food.percentage}%)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Lunch */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Lunch</Text>
              <Text style={styles.mealSectionPercentage}>{meal.lunch.mealPercentage}%</Text>
            </View>
            {meal.lunch.foods.map((food, foodIdx) => (
              <View key={foodIdx} style={styles.foodItem}>
                <View style={styles.foodItemContent}>
                  <Image source={getFoodImage(food.foodName)} style={styles.foodIcon} />
                  <View style={styles.foodTextContainer}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                    <Text style={styles.foodDetails}>
                      {food.eaten}g / {food.plan}g ({food.percentage}%)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Dinner */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Dinner</Text>
              <Text style={styles.mealSectionPercentage}>{meal.dinner.mealPercentage}%</Text>
            </View>
            {meal.dinner.foods.map((food, foodIdx) => (
              <View key={foodIdx} style={styles.foodItem}>
                <View style={styles.foodItemContent}>
                  <Image source={getFoodImage(food.foodName)} style={styles.foodIcon} />
                  <View style={styles.foodTextContainer}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                    <Text style={styles.foodDetails}>
                      {food.eaten}g / {food.plan}g ({food.percentage}%)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Snack */}
          <View style={styles.mealSection}>
            <View style={styles.mealSectionHeader}>
              <Text style={styles.mealSectionTitle}>Snack</Text>
              <Text style={styles.mealSectionPercentage}>{meal.snack.mealPercentage}%</Text>
            </View>
            {meal.snack.foods.map((food, foodIdx) => (
              <View key={foodIdx} style={styles.foodItem}>
                <View style={styles.foodItemContent}>
                  <Image source={getFoodImage(food.foodName)} style={styles.foodIcon} />
                  <View style={styles.foodTextContainer}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                    <Text style={styles.foodDetails}>
                      {food.eaten}g / {food.plan}g ({food.percentage}%)
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mealFooter}>
          <Text style={styles.dailyTotal}>Daily Total: {meal.dailyPercentage}%</Text>
          <Text style={styles.mealId}>ID: {meal._id}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Chart</Text>
      </View>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text.secondary} />
            <Text style={styles.searchPlaceholder}>Search here</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Meal History</Text>
        {/* Weekly Nutrient Chart */}
        <Animated.View
          entering={FadeIn.springify()}
          style={styles.nutrientCard}
        >
          <View style={styles.nutrientHeader}>
            <Text style={styles.nutrientTitle}>Today's Nutrient</Text>
            <Text style={styles.nutrientChange}>{weeklyNutrients.change}</Text>
          </View>
          <NutrientChart />
        </Animated.View>
        {/* Today Progress */}
        <Animated.View
          entering={FadeIn.delay(200).springify()}
          style={styles.progressCard}
        >
          <View style={styles.progressHeader}>
            <Image source={require('../../../assets/images/icons/Bookmark.png')} style={{width: 30, height: 30}}/>
            <Text style={styles.progressTitle}>Total Nutrient</Text>
            <Text style={styles.progressPercentage}>{todayProgress.completed}%</Text>
          </View>          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${todayProgress.completed}%` }]} />
          </View>    
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel1}>Completed</Text>
            <Text style={styles.progressLabel2}>Remaining</Text>
          </View>
        </Animated.View>
        {/* Achievement */}
        <Animated.View
          entering={FadeIn.delay(300).springify()}
          style={styles.achievementCard}
        >
          <Image source={require('../../../assets/images/icons/Bookmark.png')} style={{width: 30, height: 30}}/>
          <Text style={styles.achievementText}>
            Produce weekly Variety{'\n'}
            <Text style={styles.achievementSubtext}>you've earned a new reward</Text>
          </Text>
        </Animated.View>
        {/* Meal History */}
        {displayMealHistory.length > 0 ? (
          displayMealHistory.map((meal: MealHistoryType, index: number) => (
            <MealCard key={meal._id} meal={meal} index={index} />
          ))
        ) : (
          <Animated.View
            entering={FadeIn.delay(400).springify()}
            style={styles.emptyStateCard}
          >
            <Text style={styles.emptyStateText}>No meal history available</Text>
            <Text style={styles.emptyStateSubtext}>Complete some meals to see your history here</Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 20,
  },
  nutrientCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  nutrientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  nutrientTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nutrientChange: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieChart: {
    width: 150,
    height: 150,
    position: 'relative',
    marginRight: 20,
  },
  chartCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    zIndex: 1,
  },
  chartLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel1: {
    position: 'absolute',
    left : 20,
    top : -20,
    fontSize: 8,
    color: colors.background,
  },
  progressLabel2: {
    position: 'absolute',
    right : 20,
    top : -20,
    fontSize: 8,
    color: colors.primary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    lineHeight: 22,
  },
  achievementSubtext: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.text.secondary,
  },
  mealCard: {
    backgroundColor: colors.background2,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  mealDateTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  mealItems: {
    marginBottom: 12,
  },
  mealSection: {
    marginBottom: 20,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  mealSectionPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  foodItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 8,
  },
  foodTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  foodDetails: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  dailyTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  mealId: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.5,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
   },
  emptyStateCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default LeaderboardScreen;