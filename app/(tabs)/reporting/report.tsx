import HeaderProfile from '@/components/common/HeaderProfile';
import { useMealStore } from '@/stores/mealStore';
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { colors } from '../../../constants/colors';
import { getAvatarSource } from '../../../utils/avatarUtils';
import { getFoodImageSource } from '../../../utils/imageUtils';

const ReportSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
  <View style={styles.infoRow}>
    {icon && <Ionicons name={icon as any} size={16} color={colors.text.secondary} style={styles.infoIcon} />}
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const FoodReportScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { meals, getMeal, getMealHistoryByIdToday, mealHistory } = useMealStore();
  const { childProfile: childProfileStore, getChildById, selectedChildId } = useUserStore();

  useEffect(() => {
    if (selectedChildId) {
      getChildById(selectedChildId);
      getMealHistoryByIdToday(selectedChildId);
      getMeal(selectedChildId);
    }
  }, [selectedChildId]);

  const dummyMealHistory = mealHistory && mealHistory.length > 0 ? mealHistory : [];
  const dummyMealPlan = meals && meals.length > 0 ? meals[0] : null;
  const dummyChildProfile = childProfileStore || {
    name: 'Loading...',
    ageRange: 'Loading...',
    gender: 'Loading...',
    avatar: 'girl',
    allergies: [],
    preferences: {},
    height: "0",
    weight: "0",
    gamification: {},
    fruits: [],
    vegetables: [],
    proteins: [],
  };

  const dummyNutritionSummary = {
    weeklyAverage: {
      calories: '1,200',
      protein: '45g',
      carbs: '150g',
      fat: '35g'
    },
    foodGroups: {
      fruits: dummyChildProfile.fruits,
      vegetables: dummyChildProfile.vegetables,
      proteins: dummyChildProfile.proteins,
    }
  };
  
  const generateReportText = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let reportText = `PLATEFUL NUTRITION REPORT\n`;
    reportText += `Generated on: ${currentDate}\n`;
    reportText += `================================\n\n`;
    
    reportText += `CHILD PROFILE\n`;
    reportText += `Name: ${dummyChildProfile.name}\n`;
    reportText += `Age: ${dummyChildProfile.ageRange}\n`;
    reportText += `Gender: ${dummyChildProfile.gender}\n`;
    reportText += `Height: ${dummyChildProfile.height}\n`;
    reportText += `Weight: ${dummyChildProfile.weight}\n`;
    
    reportText += `Allergies: ${dummyChildProfile.allergies?.join(', ')}\n`;
    
    reportText += `NUTRITION SUMMARY (Weekly Averages)\n`;
    reportText += `Calories: ${dummyNutritionSummary.weeklyAverage.calories}\n`;
    reportText += `Protein: ${dummyNutritionSummary.weeklyAverage.protein}\n`;
    reportText += `Carbohydrates: ${dummyNutritionSummary.weeklyAverage.carbs}\n`;
    reportText += `Fat: ${dummyNutritionSummary.weeklyAverage.fat}\n\n`;
    
    reportText += `FOOD GROUPS (Weekly Servings)\n`;
    Object.entries(dummyNutritionSummary.foodGroups).forEach(([group, servings]) => {
      reportText += `${group.charAt(0).toUpperCase() + group.slice(1)}: ${servings}\n`;
    });
    reportText += `\n`;
    
    reportText += `TODAY'S MEALS\n`;
    if (dummyMealPlan) {
      Object.entries(dummyMealPlan).forEach(([mealType, mealData]: [string, any]) => {
        reportText += `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:\n`;
        if (mealData?.foods && Array.isArray(mealData.foods) && mealData.foods.length > 0) {
          mealData.foods.forEach((foodItem: any) => {
            reportText += `  ${foodItem.food}: ${foodItem.amount}g\n`;
          });
        } else {
          reportText += `  No ${mealType} logged yet\n`;
        }
        reportText += `\n`;
      });
    }
    
    reportText += `RECENT MEAL HISTORY\n`;
    if (dummyMealHistory.length > 0) {
      dummyMealHistory.forEach((day: any) => {
        reportText += `${day.date}\n`;
        reportText += `  Breakfast: ${day.breakfast.foods.map((food: any) => food.foodName).join(', ')} (${day.breakfast.mealPercentage}%)\n`;
        reportText += `  Lunch: ${day.lunch.foods.map((food: any) => food.foodName).join(', ')} (${day.lunch.mealPercentage}%)\n`;
        reportText += `  Dinner: ${day.dinner.foods.map((food: any) => food.foodName).join(', ')} (${day.dinner.mealPercentage}%)\n`;
        reportText += `  Snack: ${day.snack.foods.map((food: any) => food.foodName).join(', ')} (${day.snack.mealPercentage}%)\n`;
        reportText += `  Daily Total: ${day.dailyPercentage}%\n\n`;
      });
    }
    return reportText;
  };

  const handleDownload = async () => {
    try {
      const reportText = generateReportText();
      const fileName = `Plateful_Report_${dummyChildProfile.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;   
      if (Platform.OS === 'web') {
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert(
          'Download Complete',
          'Report has been downloaded successfully!',
          [{ text: 'OK' }]
        );
      } else {
        await Share.share({
          message: reportText,
          title: 'Plateful Nutrition Report'
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert(
        'Error',
        'Failed to generate report. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const DownloadButton = () => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSpring(0.95, {}, () => {
        scale.value = withSpring(1);
      });
      handleDownload();
    };

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity style={styles.downloadButton} onPress={handlePress}>
          <Ionicons name="download" size={24} color={colors.background} />
          <Text style={styles.downloadButtonText}>Download Report</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderOverview = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <ReportSection title="Child Profile">
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={getAvatarSource(dummyChildProfile)} style={styles.profileAvatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.childName}>{dummyChildProfile.name}</Text>
              <Text style={styles.childAge}>{dummyChildProfile.ageRange}</Text>
            </View>
          </View>
          
          <View style={styles.profileDetails}>
            <InfoRow label="Gender" value={dummyChildProfile.gender} icon="person" />
            <InfoRow label="Height" value={dummyChildProfile.height || ''} icon="resize" />
            <InfoRow label="Weight" value={dummyChildProfile.weight || ''} icon="scale" />
          </View>

          <View style={styles.allergiesSection}>
            <Text style={styles.subsectionTitle}>Allergies & Preferences</Text>
            <View style={styles.tagsContainer}>
              {dummyChildProfile.allergies?.map((allergy, index) => (
                <View key={index} style={[styles.tag, styles.allergyTag]}>
                  <Text style={styles.tagText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ReportSection>

      <ReportSection title="Nutrition Summary">
        <View style={styles.nutritionCard}>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{dummyNutritionSummary.weeklyAverage.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories(kcal)</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{dummyNutritionSummary.weeklyAverage.protein}</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{dummyNutritionSummary.weeklyAverage.carbs}</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{dummyNutritionSummary.weeklyAverage.fat}</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
          
          <Text style={styles.subsectionTitle}>Food Groups (Weekly)</Text>
          <View style={styles.foodGroupsContainer}>
            {Object.entries(dummyNutritionSummary.foodGroups).map(([group, servings]) => (
              <View key={group} style={styles.foodGroupItem}>
                <Text style={styles.foodGroupLabel}>{group.charAt(0).toUpperCase() + group.slice(1)} : </Text>
                <Text style={styles.foodGroupValue}>{servings?.join(', ')}</Text>
              </View>
            ))}
          </View>
        </View>
      </ReportSection>
    </ScrollView>
  );

  const renderMealPlan = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <ReportSection title="Today's Meals">
        {dummyMealPlan ? (
          Object.entries(dummyMealPlan).slice(0, 4).map(([mealType, mealData]: [string, any]) => (
            <View key={mealType} style={styles.dayPlanCard}>
              {Array.isArray(mealData.foods) && <Text style={styles.dayTitle}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>}
              {mealData?.foods && Array.isArray(mealData.foods) && mealData.foods.length > 0 && (
                <View style={styles.mealTimes}>
                  {mealData.foods.map((foodItem: any, foodIndex: number) => (
                    <View key={foodIndex} style={styles.mealTime}>
                      <Image 
                        source={getFoodImageSource(foodItem.food)} 
                        style={styles.foodIcon} 
                      />
                      <Text style={styles.mealTimeLabel}>{foodItem.food}</Text>
                      <Text style={styles.mealTimeFood}>{foodItem.amount} g</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noMealText}>No meals logged yet</Text>
        )}
      </ReportSection>
    </ScrollView>
  );

  const renderMealHistory = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      <ReportSection title="Recent Meal History">
        {dummyMealHistory.map((day: any, index: number) => (
          <View key={day._id || index} style={styles.historyDayCard}>
            <Text style={styles.historyDate}>{format(parseISO(day.date), "yyyy-MM-dd")}</Text>
            <View style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>Breakfast</Text>
                <Text style={styles.mealPercentage}>{day.breakfast.mealPercentage}%</Text>
              </View>
              <View style={styles.foodTags}>
                {day.breakfast.foods.slice(0, 4).map((food: any, foodIndex: number) => (
                  <View key={foodIndex} style={styles.foodTag}>
                    <Image 
                      source={getFoodImageSource(food.foodName)} 
                      style={styles.foodIcon} 
                    />
                    <Text style={styles.foodTagText}>{food.foodName}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>Lunch</Text>
                <Text style={styles.mealPercentage}>{day.lunch.mealPercentage}%</Text>
              </View>
              <View style={styles.foodTags}>
                {day.lunch.foods.slice(0, 4).map((food: any, foodIndex: number) => (
                  <View key={foodIndex} style={styles.foodTag}>
                    <Image 
                      source={getFoodImageSource(food.foodName)} 
                      style={styles.foodIcon} 
                    />
                    <Text style={styles.foodTagText}>{food.foodName}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>Dinner</Text>
                <Text style={styles.mealPercentage}>{day.dinner.mealPercentage}%</Text>
              </View>
              <View style={styles.foodTags}>
                {day.dinner.foods.slice(0, 4).map((food: any, foodIndex: number) => (
                  <View key={foodIndex} style={styles.foodTag}>
                    <Image 
                      source={getFoodImageSource(food.foodName)} 
                      style={styles.foodIcon} 
                    />
                    <Text style={styles.foodTagText}>{food.foodName}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>Snack</Text>
                <Text style={styles.mealPercentage}>{day.snack.mealPercentage}%</Text>
              </View>
              <View style={styles.foodTags}>
                {day.snack.foods.slice(0, 4).map((food: any, foodIndex: number) => (
                  <View key={foodIndex} style={styles.foodTag}>
                    <Image 
                      source={getFoodImageSource(food.foodName)} 
                      style={styles.foodIcon} 
                    />
                    <Text style={styles.foodTagText}>{food.foodName}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.dailyTotal}>
              <Text style={styles.dailyTotalText}>Daily Total: {day.dailyPercentage}%</Text>
            </View>
          </View>
        ))}
      </ReportSection>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'mealPlan':
        return renderMealPlan();
      case 'mealHistory':
        return renderMealHistory();
      default:
        return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderProfile />
      </View>
      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mealPlan' && styles.tabActive]}
            onPress={() => setActiveTab('mealPlan')}
          >
            <Text style={[styles.tabText, activeTab === 'mealPlan' && styles.tabTextActive]}>
              Meal Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mealHistory' && styles.tabActive]}
            onPress={() => setActiveTab('mealHistory')}
          >
            <Text style={[styles.tabText, activeTab === 'mealHistory' && styles.tabTextActive]}>
              Meal History
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>
        <View style={styles.bottomContainer}>
          <DownloadButton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    marginBottom: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  tabContent: {
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  downloadButtonText: {
    color: colors.background,
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    marginTop: 16,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  childAge: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  profileDetails: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    width: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  allergiesSection: {
    marginTop: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyTag: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  preferenceTag: {
    backgroundColor: colors.info + '20',
    borderWidth: 1,
    borderColor: colors.info,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  nutritionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  foodGroupsContainer: {
    marginTop: 16,
  },
  foodGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  foodGroupLabel: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  foodGroupValue: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  dayPlanCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  mealTimes: {
    gap: 12,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  mealTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  mealTimeFood: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'right',
  },
  historyDayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  mealRating: {
    flexDirection: 'row',
  },
  foodTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  foodTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodTagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  foodIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 4,
  },
  noMealText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  mealPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  dailyTotal: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    alignItems: 'center',
  },
  dailyTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default FoodReportScreen;
