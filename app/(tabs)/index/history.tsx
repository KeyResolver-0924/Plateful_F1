import { useMealStore } from '@/stores/mealStore';
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../../constants/colors';
import { getFoodImageSource } from '../../../utils/imageUtils';

interface MealPlan {
  id: string;
  name: string;
  isActive: boolean;
  startTime: number | null;
  finalTime?: number; // Store the final elapsed time when meal is finished
  plannedFoods: Array<{
    name: string;
    plannedAmount: string;
    unit: string;
    eatenAmount?: string;
  }>;
}

interface MealHistoryFood {
  foodName: string;
  plan: number;
  eaten: number;
  percentage: number;
}

interface MealHistoryMeal {
  foods: MealHistoryFood[];
  totalTime: number; // in minutes
  totalPlan: number; // total planned amount for the meal
  totalEaten: number; // total eaten amount for the meal
  mealPercentage: number; // percentage completion for the meal
}

interface MealHistory {
  breakfast: MealHistoryMeal;
  lunch: MealHistoryMeal;
  dinner: MealHistoryMeal;
  snack: MealHistoryMeal;
  date: string;
  childId: string;
  dailyTotalPlan: number; // total planned amount for the day
  dailyTotalEaten: number; // total eaten amount for the day
  dailyPercentage: number; // overall daily percentage completion
}

const MealHistoryScreen = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [eatenAmounts, setEatenAmounts] = useState<{ [key: string]: string }>({});
  const { meals, getMeal, recordMeal } = useMealStore();
  const { selectedChildId } = useUserStore();

  useEffect(() => {
    if (selectedChildId) {
      getMeal(selectedChildId);
    }
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      getMeal(selectedChildId);
    }
  }, [selectedChildId]);

  useEffect(() => {
    if (meals && meals.length > 0) {
      const firstMeal = meals[0] as any;
      const newMealPlans: MealPlan[] = [];
      
      if (firstMeal.breakfast?.foods) {
        newMealPlans.push({
          id: 'breakfast',
          name: 'Breakfast',
          isActive: false,
          startTime: null,
          plannedFoods: firstMeal.breakfast.foods.map((food: any) => ({
            name: food.food || 'Unknown Food',
            plannedAmount: food.amount || '0',
            unit: food.unit || 'g'
          }))
        });
      }
      
      if (firstMeal.lunch?.foods) {
        newMealPlans.push({
          id: 'lunch',
          name: 'Lunch',
          isActive: false,
          startTime: null,
          plannedFoods: firstMeal.lunch.foods.map((food: any) => ({
            name: food.food || 'Unknown Food',
            plannedAmount: food.amount || '0',
            unit: food.unit || 'g'
          }))
        });
      }
      
      if (firstMeal.dinner?.foods) {
        newMealPlans.push({
          id: 'dinner',
          name: 'Dinner',
          isActive: false,
          startTime: null,
          plannedFoods: firstMeal.dinner.foods.map((food: any) => ({
            name: food.food || 'Unknown Food',
            plannedAmount: food.amount || '0',
            unit: food.unit || 'g'
          }))
        });
      }
      
      if (firstMeal.snack?.foods) {
        newMealPlans.push({
          id: 'snack',
          name: 'Snack',
          isActive: false,
          startTime: null,
          plannedFoods: firstMeal.snack.foods.map((food: any) => ({
            name: food.food || 'Unknown Food',
            plannedAmount: food.amount || '0',
            unit: food.unit || 'g'
          }))
        });
      }
      
      setMealPlans(newMealPlans);
    } else {
      setMealPlans([]);
    }
    
    setShowFoodModal(false);
    setSelectedMealPlan(null);
    setEatenAmounts({});
  }, [meals, selectedChildId]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const MealTimer = React.memo(({ startTime }: { startTime: number }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(interval);
    }, [startTime]);
    return (
      <Text style={styles.mealTimer}>{formatTime(elapsedTime)}</Text>
    );
  });
  const handleStartMeal = (mealId: string) => {
    setMealPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === mealId 
          ? { ...plan, isActive: true, startTime: Date.now(), finalTime: undefined }
          : plan
      )
    );
  };

  const handleFinishMeal = (mealPlan: MealPlan) => {
    const finalElapsedTime = mealPlan.startTime ? Date.now() - mealPlan.startTime : 0;
    setMealPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === mealPlan.id 
          ? { ...plan, isActive: false, startTime: null, finalTime: finalElapsedTime }
          : plan
      )
    );
    setSelectedMealPlan(mealPlan);
    setShowFoodModal(true);
  };

  const handleUpdateEatenAmount = (foodName: string, amount: string) => {
    setEatenAmounts(prev => ({
      ...prev,
      [foodName]: amount
    }));
  };

  const calculateMealHistory = (): MealHistory => {
    const today = new Date().toISOString().split('T')[0];
    const createMealHistoryMeal = (mealPlan: MealPlan): MealHistoryMeal => {
      const foods: MealHistoryFood[] = mealPlan.plannedFoods.map(food => {
        const planned = parseFloat(food.plannedAmount) || 0;
        const eaten = parseFloat(food.eatenAmount || '0') || 0;
        const percentage = planned > 0 ? Math.round((eaten / planned) * 100) : 0;
        return {
          foodName: food.name,
          plan: planned,
          eaten: eaten,
          percentage: percentage
        };
      });
      const totalTime = mealPlan.finalTime ? Math.round(mealPlan.finalTime / 60000) : 0;
      const totalPlan = foods.reduce((sum, food) => sum + food.plan, 0);
      const totalEaten = foods.reduce((sum, food) => sum + food.eaten, 0);
      const mealPercentage = totalPlan > 0 ? Math.round((totalEaten / totalPlan) * 100) : 0;
      return {
        foods,
        totalTime,
        totalPlan,
        totalEaten,
        mealPercentage
      };
    };
    const breakfast = mealPlans.find(plan => plan.id === 'breakfast');
    const lunch = mealPlans.find(plan => plan.id === 'lunch');
    const dinner = mealPlans.find(plan => plan.id === 'dinner');
    const snack = mealPlans.find(plan => plan.id === 'snack');
    const dailyTotalPlan = (breakfast?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.plannedAmount) || 0, 0) || 0) +
                            (lunch?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.plannedAmount) || 0, 0) || 0) +
                            (dinner?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.plannedAmount) || 0, 0) || 0) +
                            (snack?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.plannedAmount) || 0, 0) || 0);
    const dailyTotalEaten = (breakfast?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.eatenAmount || '0') || 0, 0) || 0) +
                            (lunch?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.eatenAmount || '0') || 0, 0) || 0) +
                            (dinner?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.eatenAmount || '0') || 0, 0) || 0) +
                            (snack?.plannedFoods.reduce((sum, food) => sum + parseFloat(food.eatenAmount || '0') || 0, 0) || 0);
    const dailyPercentage = dailyTotalPlan > 0 ? Math.round((dailyTotalEaten / dailyTotalPlan) * 100) : 0;
    const mealHistory = {
      breakfast: breakfast ? createMealHistoryMeal(breakfast) : { foods: [], totalTime: 0, totalPlan: 0, totalEaten: 0, mealPercentage: 0 },
      lunch: lunch ? createMealHistoryMeal(lunch) : { foods: [], totalTime: 0, totalPlan: 0, totalEaten: 0, mealPercentage: 0 },
      dinner: dinner ? createMealHistoryMeal(dinner) : { foods: [], totalTime: 0, totalPlan: 0, totalEaten: 0, mealPercentage: 0 },
      snack: snack ? createMealHistoryMeal(snack) : { foods: [], totalTime: 0, totalPlan: 0, totalEaten: 0, mealPercentage: 0 },
      date: today,
      childId: selectedChildId as any,
      dailyTotalPlan,
      dailyTotalEaten,
      dailyPercentage
    };
    return mealHistory;
  };
  const saveMealHistoryToBackend = async (mealHistory: any) => {
    try {
      const result = await recordMeal(mealHistory);
      return result;
    } catch (error) {
      console.error('Error saving meal history:', error);
    }
  };
  const handleSaveEatenAmounts = () => {
    if (selectedMealPlan) {
      setMealPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === selectedMealPlan.id 
            ? {
                ...plan,
                plannedFoods: plan.plannedFoods.map(food => ({
                  ...food,
                  eatenAmount: eatenAmounts[food.name] || ''
                }))
              }
            : plan
        )
      );
      setShowFoodModal(false);
      setSelectedMealPlan(null);
      setEatenAmounts({});
    }
  };
  const sendAllMealHistoryToBackend = async () => {
    const mealHistory = calculateMealHistory();
    await saveMealHistoryToBackend(mealHistory);
    router.push('/(tabs)' as any);
  };
  const isMealCompleted = (mealPlan: MealPlan) => {
    return mealPlan.plannedFoods.every(food => food.eatenAmount && food.eatenAmount !== '');
  };
  const isAllMealsCompleted = () => {
    return mealPlans.every(plan => isMealCompleted(plan));
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
        <Text style={styles.headerTitle}>Time to Eat</Text>
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
        {/* Meal Plans Section */}
        <View style={styles.mealPlansSection}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {mealPlans.map((plan) => (
            <View key={plan.id} style={styles.mealPlanCard}>
              <View style={styles.mealPlanHeader}>
                <Text style={styles.mealPlanName}>{plan.name}</Text>
                {plan.isActive && plan.startTime ? (
                   <MealTimer startTime={plan.startTime} />
                 ) : plan.finalTime ? (
                   <Text style={styles.mealTimer}>{formatTime(plan.finalTime)}</Text>
                 ) : null}
              </View>
              <View style={styles.mealPlanFoods}>
                 {plan.plannedFoods.map((food, index) => (
                   <View key={index} style={styles.mealPlanFoodRow}>
                     <View style={styles.mealPlanFoodInfo}>
                       <Image 
                         source={getFoodImageSource(food.name)} 
                         style={styles.foodIcon}
                         resizeMode="contain"
                       />
                       <View style={styles.foodTextContainer}>
                         <Text style={styles.mealPlanFoodName}>{food.name}</Text>
                         <Text style={styles.mealPlanFoodAmount}>
                           Planned: {food.plannedAmount}{food.unit}
                         </Text>
                         {food.eatenAmount && (
                           <Text style={styles.mealPlanFoodEaten}>
                             Eaten: {food.eatenAmount}{food.unit}
                           </Text>
                         )}
                       </View>
                     </View>
                   </View>
                 ))}
          </View>
              <View style={styles.mealPlanActions}>
                {!plan.isActive ? (
                  <TouchableOpacity
                    style={[
                      styles.startButton,
                      isMealCompleted(plan) && styles.disabledButton
                    ]}
                    onPress={() => handleStartMeal(plan.id)}
                    disabled={isMealCompleted(plan)}
                  >
                    <Text style={[
                      styles.startButtonText,
                      isMealCompleted(plan) && styles.disabledButtonText
                    ]}>Start</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.finishButton}
                    onPress={() => handleFinishMeal(plan)}
                  >
                    <Text style={styles.finishButtonText}>Finish</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          </View>
        {/* Send All Button */}
        {isAllMealsCompleted() && (
          <View style={styles.sendAllSection}>
            <TouchableOpacity
              style={styles.sendAllButton}
              onPress={sendAllMealHistoryToBackend}
            >
              <Text style={styles.sendAllButtonText}>Send All Meal History</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Food Input Modal */}
      <Modal
        visible={showFoodModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFoodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Foods for {selectedMealPlan?.name}</Text>
              <TouchableOpacity onPress={() => setShowFoodModal(false)}>
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
               <Text style={styles.modalSubtitle}>Enter the amounts you actually ate:</Text>
               {selectedMealPlan?.plannedFoods.map((food, index) => (
                 <View key={index} style={styles.foodInputRow}>
                   <View style={styles.foodInputInfo}>
                     <Image 
                       source={getFoodImageSource(food.name)} 
                       style={styles.modalFoodIcon}
                       resizeMode="contain"
                     />
                     <View style={styles.modalFoodTextContainer}>
                       <Text style={styles.foodInputName}>{food.name}</Text>
                       <Text style={styles.foodInputPlanned}>
                         Planned: {food.plannedAmount}{food.unit}
                        </Text>
                     </View>
                   </View>
                   <View style={styles.foodInputField}>
                     <Text style={styles.foodInputLabel}>Eaten:</Text>
                     <TextInput
                       style={styles.modalTextInput}
                       value={eatenAmounts[food.name] || ''}
                       onChangeText={(text) => handleUpdateEatenAmount(food.name, text)}
                       placeholder="0"
                       placeholderTextColor={colors.text.secondary}
                       keyboardType="numeric"
                     />
                     <Text style={styles.foodInputUnit}>{food.unit}</Text>
                   </View>
                 </View>
               ))}
               <TouchableOpacity style={styles.saveButton} onPress={handleSaveEatenAmounts}>
                 <Text style={styles.saveButtonText}>Save Eaten Amounts</Text>
               </TouchableOpacity>
             </View>
          </View>
        </View>
      </Modal>
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
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealEmoji: {
    fontSize: 24,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  mealItemValue: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 2,
  },
  mealId: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.5,
    textAlign: 'right',
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
   },
  mealPlansSection: {
    marginBottom: 20,
  },
  mealPlanCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mealPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealPlanName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  mealTimer: {
    fontSize: 16,
    fontWeight: '600',
    color: 'blue',
    fontFamily: 'monospace',
  },
  mealPlanFoods: {
    marginBottom:8,
  },
  mealPlanFood: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  mealPlanFoodRow: {
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealPlanFoodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 4,
  },
  foodTextContainer: {
    flex: 1,
  },
  mealPlanFoodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  mealPlanFoodAmount: {
    position: 'absolute',
    left: 100,
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  mealPlanFoodEaten: {
    position: 'absolute',
    right: 10,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  mealPlanActions: {
    alignItems: 'flex-end',
  },
  startButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius:10,
    width: 90,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical:6,
    borderRadius: 10,
    width: 90,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalBody: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
  },
  addFoodButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFoodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  foodList: {
    gap: 8,
  },
  foodListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  foodListItem: {
    fontSize: 14,
    color: colors.text.secondary,
    paddingLeft: 16,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  foodInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  foodInputInfo: {
    flex: 0.6,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFoodIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderRadius: 4,
  },
  modalFoodTextContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  foodInputName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  foodInputPlanned: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  foodInputField: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  foodInputLabel: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  foodInputUnit: {
    fontSize: 14,
    color: colors.text.secondary,
    minWidth: 30,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    width: 60,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  disabledButtonText: {
    color: colors.text.secondary,
  },
  sendAllSection: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  sendAllButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendAllButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
   },
});

export default MealHistoryScreen;