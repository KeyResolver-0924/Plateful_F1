import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import Button from '../../../components/common/Button';
import { colors } from '../../../constants/colors';
import { useFoodStore } from '../../../stores/foodStore';
import { useMealStore } from '../../../stores/mealStore';
import { useUserStore } from '../../../stores/userStore';
import { apiService } from '../../../utils/apiService';

const { width } = Dimensions.get('window');

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

// Move FoodItem component outside to prevent recreation on every render
const FoodItem = React.memo(({ 
  food, 
  index, 
  isSelected, 
  onToggle 
}: { 
  food: any; 
  index: number; 
  isSelected: boolean; 
  onToggle: (foodId: string) => void; 
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = useCallback(() => {
    // Don't allow selection of disabled foods
    if (!food.isAllowed) {
      return;
    }
    
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onToggle(food.id);
  }, [food.id, food.isAllowed, onToggle]);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify()}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[
            styles.foodItem,
            isSelected && styles.foodItemSelected,
            !food.isAllowed && styles.foodItemDisabled
          ]}
          onPress={handlePress}
          activeOpacity={food.isAllowed ? 0.8 : 1}
          disabled={!food.isAllowed}
        >
          <View style={styles.foodImageContainer}>
            <Image 
              source={food.image ? { uri: food.image } : require('../../../assets/images/logo/1.png')} 
              style={[
                styles.foodImage,
                !food.isAllowed && styles.foodImageDisabled
              ]}
              resizeMode="contain"
            />
          </View>
          <Text style={[
            styles.foodName,
            !food.isAllowed && styles.foodNameDisabled
          ]}>
            {food.name}
          </Text>
          {/* {!food.isAllowed && (
            <Text style={styles.notAllowedText}>Not Allowed</Text>
          )} */}
          {isSelected && (
            <View style={styles.checkmark}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

// Move AmountModal outside to prevent re-rendering and TextInput focus loss
const AmountModal = React.memo(({ 
  visible, 
  selectedFoods, 
  foods, 
  foodAmounts, 
  mealTime,
  onClose, 
  onAmountChange, 
  onTimeChange,
  onSubmit 
}: {
  visible: boolean;
  selectedFoods: string[];
  foods: any[];
  foodAmounts: { [key: string]: string };
  mealTime: string;
  onClose: () => void;
  onAmountChange: (foodId: string, amount: string) => void;
  onTimeChange: (time: string) => void;
  onSubmit: () => void;
}) => {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  
  const timeOptions = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
    '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  const handleTimeSelect = (time: string) => {
    onTimeChange(time);
    setShowTimeDropdown(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setShowTimeDropdown(false);
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={() => setShowTimeDropdown(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View 
              entering={FadeIn.springify()}
              style={[styles.modal, styles.amountModal]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowTimeDropdown(false);
                  onClose();
                }}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Set Food Amounts & Meal Time</Text>
              <Text style={styles.modalSubtitle}>Enter the amount for each selected food and select meal time</Text>

              {/* Meal Time Selection - Dropdown */}
              <View style={styles.timeSelectionContainer}>
                <Text style={styles.timeLabel}>Meal Time:</Text>
                <TouchableOpacity
                  style={styles.timeDropdownButton}
                  onPress={() => setShowTimeDropdown(!showTimeDropdown)}
                >
                  <Text style={styles.timeDropdownButtonText}>{mealTime}</Text>
                  <Ionicons 
                    name={showTimeDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.text.primary} 
                  />
                </TouchableOpacity>
                
                {/* Dropdown Options */}
                {showTimeDropdown && (
                  <View style={styles.timeDropdownOptions}>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      style={styles.timeDropdownScroll}
                    >
                      {timeOptions.map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeDropdownOption,
                            mealTime === time && styles.timeDropdownOptionSelected
                          ]}
                          onPress={() => handleTimeSelect(time)}
                        >
                          <Text style={[
                            styles.timeDropdownOptionText,
                            mealTime === time && styles.timeDropdownOptionTextSelected
                          ]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <ScrollView 
                style={styles.amountList}
                showsVerticalScrollIndicator={false}
              >
                {selectedFoods.map((foodId) => {
                  const food = foods.find(f => f.id === foodId);
                  return (
                    <View key={foodId} style={styles.amountItem}>
                      <View style={styles.amountItemLeft}>
                        <Image 
                          source={food?.image ? { uri: food.image } : require('../../../assets/images/logo/1.png')} 
                          style={styles.amountFoodImage}
                          resizeMode="contain"
                        />
                        <Text style={styles.amountFoodName}>{food?.name}</Text>
                      </View>
                      <View style={styles.amountInputContainer}>
                        <View style={styles.inputWrapper}>
                          <TextInput
                            style={styles.amountInput}
                            value={foodAmounts[foodId] || ''}
                            onChangeText={(text) => onAmountChange(foodId, text)}
                            placeholder="Amount"
                            placeholderTextColor={colors.text.secondary}
                            keyboardType="numeric"
                          />
                        </View>
                        <Text style={styles.amountUnit}>g</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              <Button
                title="Continue"
                onPress={onSubmit}
                style={styles.modalButton}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const MealTrackingScreen = ({ navigation }: { navigation: NavigationProps }) => {
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [mealTime, setMealTime] = useState('8:00 AM');
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [foodAmounts, setFoodAmounts] = useState<{ [key: string]: string }>({});
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New state for meal tracking
  const [mealData, setMealData] = useState<{
    [key: string]: {
      mealTime: string;
      foods: Array<{ food: string; amount: number }>;
    };
  }>({
    breakfast: { mealTime: '8:00 AM', foods: [] },
    lunch: { mealTime: '12:30 PM', foods: [] },
    dinner: { mealTime: '7:00 PM', foods: [] },
    snack: { mealTime: '3:00 PM', foods: [] }
  });
  
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { profile, selectedChildId } = useUserStore();
  const { addMeal, meals, getMeal } = useMealStore();
  const { foods: storeFoods, setFoods, isLoading: foodsLoading, setLoading: setFoodsLoading, setError: setFoodsError } = useFoodStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load foods from backend on mount if not already loaded
  useEffect(() => {
    let isActive = true;
    const loadFoods = async () => {
      try {
        if (!storeFoods || storeFoods.length === 0) {
          setFoodsLoading(true);
          const res = await apiService.getFoods();
          if (isActive && res.success && Array.isArray(res.data)) {
            setFoods(res.data as any);
          } else if (isActive && !res.success) {
            setFoodsError(res.error || 'Failed to load foods');
          }
        }
      } catch (e: any) {
        if (isActive) setFoodsError(e?.message || 'Failed to load foods');
      } finally {
        if (isActive) setFoodsLoading(false);
      }
    };
    loadFoods();
    return () => {
      isActive = false;
    };
  }, []);
  useEffect(() => {
    console.log('Tracking - Initial load effect, selectedChildId:', selectedChildId);
    if (selectedChildId) {
      console.log('Tracking - Initial load calling getMeal with childId:', selectedChildId);
      getMeal(selectedChildId).catch(error => {
        console.error('Error loading meals:', error);
      });
    }
  }, []); // Only run on mount

  // Effect for when selectedChildId changes
  useEffect(() => {
    if (selectedChildId) {
      getMeal(selectedChildId).catch(error => {
        console.error('Error loading meals for child:', error);
      });
    }
  }, [selectedChildId, getMeal]); // Include getMeal in dependencies
  
  // Reset tracking state when switching children
  useEffect(() => {
    setSelectedMealType('breakfast');
    setSelectedFoods([]);
    setMealData({
      breakfast: { mealTime: '8:00 AM', foods: [] },
      lunch: { mealTime: '12:00 PM', foods: [] },
      dinner: { mealTime: '6:00 PM', foods: [] },
      snack: { mealTime: '3:00 PM', foods: [] }
    });
    setCompletedMeals(new Set());
    setSearchQuery('');
  }, [selectedChildId]);
  
  console.log('selectedChildId1: >>--->', meals);

  const childProfile = (profile as any)?.data?.user?.children || profile?.children || [];
  const selectedChild = childProfile?.find((child: any) => child.id === selectedChildId) || childProfile?.[0];
  
  const mealTypes = [
    { id: 'breakfast', name: 'Break Fast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snack', name: 'Snack' }
  ];

  // Get all foods from backend store and filter based on selected child's allowed foods
  const foods = useMemo(() => {
    const allFoods = storeFoods || [];
    
    if (!selectedChild) {
      return allFoods; // Show all foods if no child is selected
    }
    
    // Get the child's allowed foods
    const allowedFruits = selectedChild?.fruits || [];
    const allowedVegetables = selectedChild?.vegetables || [];
    const allowedProteins = selectedChild?.proteins || [];
    
    // Filter foods based on what the child is allowed to eat
    let filteredFoods = allFoods.map(food => {
      let isAllowed = false;
      
      switch (food.category) {
        case 'fruits':
          isAllowed = allowedFruits.includes(food.id);
          break;
        case 'vegetables':
          isAllowed = allowedVegetables.includes(food.id);
          break;
        case 'proteins':
          isAllowed = allowedProteins.includes(food.id);
          break;
        default:
          // For other categories (grains, dairy), check if they're in any allowed list
          isAllowed = allowedFruits.includes(food.id) || 
                     allowedVegetables.includes(food.id) || 
                     allowedProteins.includes(food.id);
      }
      
      return {
        ...food,
        isAllowed
      };
    });
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredFoods = filteredFoods.filter(food => 
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
      );
    }
    
    return filteredFoods;
  }, [selectedChild, searchQuery, storeFoods]);

  // Memoize the toggle function to prevent recreation
  const handleFoodToggle = useCallback((foodId: string) => {
    const food = foods.find(f => f.id === foodId);
    
    // Only allow selection of allowed foods
    if (!food || !food.isAllowed) {
      return;
    }
    
    setSelectedFoods(prev => {
      if (prev.includes(foodId)) {
        return prev.filter(id => id !== foodId);
      } else {
        return [...prev, foodId];
      }
    });
  }, [foods]);

  // Memoize meal type selection
  const handleMealTypeSelect = useCallback((mealTypeId: string) => {
    setSelectedMealType(mealTypeId);
    
    // Load existing meal data for this meal type
    const existingMeal = mealData[mealTypeId];
    if (existingMeal && existingMeal.foods.length > 0) {
      // Convert food names back to food IDs for selection
      const foodIds = existingMeal.foods.map(foodItem => {
        const food = foods.find(f => f.name === foodItem.food);
        return food?.id || foodItem.food;
      }).filter(id => id);
      
      setSelectedFoods(foodIds);
      
      // Convert amounts back to string format for input
      const amounts: { [key: string]: string } = {};
      existingMeal.foods.forEach(foodItem => {
        const food = foods.find(f => f.name === foodItem.food);
        if (food) {
          amounts[food.id] = foodItem.amount.toString();
        }
      });
      setFoodAmounts(amounts);
      
      // Set meal time
      setMealTime(existingMeal.mealTime);
    } else {
      // Clear selections for new meal
      setSelectedFoods([]);
      setFoodAmounts({});
      setMealTime(mealData[mealTypeId]?.mealTime || '8:00 AM');
    }
  }, [mealData, foods]);

  const handleNext = useCallback(() => {
    if (selectedFoods.length > 0) {
      // Initialize amounts for selected foods if not already set
      setFoodAmounts(prev => {
        const initialAmounts = { ...prev };
        selectedFoods.forEach(foodId => {
          if (!initialAmounts[foodId]) {
            initialAmounts[foodId] = '';
          }
        });
        return initialAmounts;
      });
      setShowAmountModal(true);
    }
  }, [selectedFoods]);

  const handleAmountSubmit = useCallback(() => {
    // Validate that all selected foods have amounts
    const hasEmptyAmounts = selectedFoods.some(foodId => !foodAmounts[foodId] || foodAmounts[foodId].trim() === '');
    
    if (!hasEmptyAmounts) {
      // Create meal data for the current meal type
      const currentMealFoods = selectedFoods.map(foodId => {
        const food = foods.find(f => f.id === foodId);
        return {
          food: food?.name || foodId,
          amount: parseInt(foodAmounts[foodId]) || 0
        };
      });
      
      // Update meal data
      setMealData(prev => ({
        ...prev,
        [selectedMealType]: {
          mealTime: mealTime,
          foods: currentMealFoods
        }
      }));
      
      // Mark meal as completed
      setCompletedMeals(prev => new Set(Array.from(prev).concat(selectedMealType)));
      
      console.log('Meal Data Saved:', {
        mealType: selectedMealType,
        mealTime: mealTime,
        foods: currentMealFoods
      });
      
      setShowAmountModal(false);
      setShowSuccessModal(true);
      
      // Clear selections for next meal
      setSelectedFoods([]);
      setFoodAmounts({});
    }
  }, [selectedFoods, foodAmounts, selectedMealType, mealTime, foods]);

  // Function to save all meal data to backend
  const saveMealDataToBackend = useCallback(async () => {
    if (!selectedChildId) {
      console.log('No child selected: >>--->', selectedChildId);
      setError('No child selected. Please select a child first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const backendData = {
      childId: selectedChildId,
      ...mealData
    };

    console.log('Saving meal data to backend:', backendData);

    try {
      const result = await addMeal(backendData as any);
      console.log('result: >>--->', result);

      // If we get here without throwing, the meal was saved successfully
      setShowSuccessModal(false);
      setShowPairingModal(true);
      
    } catch (error: any) {
      console.error('Error saving meal data:', error);
      
      // Handle specific error types
      if (error?.error?.includes('404')) {
        setError('Server endpoint not found. Please check your connection and try again.');
      } else if (error?.error?.includes('500')) {
        setError('Server error. Please try again later.');
      } else if (error?.error?.includes('timeout')) {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        setError(`Network error: ${error?.error || error?.message || 'Please check your connection and try again.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [mealData, selectedChildId, addMeal]);

  // Function to get meal summary
  const getMealSummary = useMemo(() => {
    const summary = [];
    for (const [mealType, meal] of Object.entries(mealData)) {
      if (meal.foods.length > 0) {
        summary.push(`${mealType}: ${meal.foods.length} foods at ${meal.mealTime}`);
      }
    }
    return summary;
  }, [mealData]);

  const updateFoodAmount = useCallback((foodId: string, amount: string) => {
    setFoodAmounts(prev => ({
      ...prev,
      [foodId]: amount
    }));
  }, []);

  const updateMealTime = useCallback((time: string) => {
    setMealTime(time);
  }, []);

  // Memoize the close modal functions
  const closeAmountModal = useCallback(() => setShowAmountModal(false), []);
  const closePairingModal = useCallback(() => setShowPairingModal(false), []);

  // Memoize the back navigation
  const handleBack = useCallback(() => router.back(), []);

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <View style={styles.modalIcon}>
            <Text style={styles.modalEmoji}>✅</Text>
          </View>
          
          <Text style={styles.modalTitle}>Meal Added Successfully!</Text>
          <Text style={styles.modalSubtitle}>
            {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} has been completed.
          </Text>
          
          <View style={styles.mealProgressContainer}>
            <Text style={styles.mealProgressTitle}>Meal Progress:</Text>
            {mealTypes.map((type) => (
              <View key={type.id} style={styles.mealProgressItem}>
                <Text style={styles.mealProgressText}>
                  {type.name}: {completedMeals.has(type.id) ? 'Completed' : 'Pending'}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.modalButtons}>
            {completedMeals.size < mealTypes.length ? (
              <Button
                title="Continue with Other Meals"
                onPress={() => setShowSuccessModal(false)}
                style={styles.continueMealsButton}
              />
            ) : (
              <Button
                title={isLoading ? "Saving..." : "Save All Meals"}
                onPress={saveMealDataToBackend}
                style={styles.saveAllButton}
                disabled={isLoading}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  const PairingModal = () => (
    <Modal
      visible={showPairingModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          entering={FadeIn.springify()}
          style={styles.modal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closePairingModal}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={styles.caloriesText}>Create Meal</Text>

          <View style={styles.pairingImage}>
            <Image source={require('../../../assets/images/logo/1.png')} style={{width: 180, height: 170}} />
          </View>

          <Text style={styles.modalTitle}>Successfully Meal created</Text>

          <Button
            title="Continue"
            onPress={() => {
              router.push('/(tabs)' as any);
              setShowPairingModal(false);
            }}
            style={styles.modalButton}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Meal</Text>
        
        <View style={styles.headerImage}>
          <Image source={require('../../../assets/images/characters/meal_fruit_logo.png')} style={styles.headerImage1} />
        </View>
        <Text style={styles.title}>Which Meal Are You Eating</Text>
        <Text style={styles.subtitle}>Select Meal Type</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.mealTypes}
          contentContainerStyle={styles.mealTypesContent}
        >
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.mealTypeButton,
                selectedMealType === type.id && styles.mealTypeButtonActive,
                completedMeals.has(type.id) && styles.mealTypeButtonCompleted
              ]}
              onPress={() => handleMealTypeSelect(type.id)}
            >
              <Text style={[
                styles.mealTypeText,
                selectedMealType === type.id && styles.mealTypeTextActive,
                completedMeals.has(type.id) && styles.mealTypeTextCompleted
              ]}>
                {type.name}
              </Text>
              {completedMeals.has(type.id) && (
                <View style={styles.mealTypeCheckmark}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Food You&apos;re Eating</Text>
        {!selectedChild && (
          <Text style={styles.warningInfo}>
            Please select a child first to see allowed foods
          </Text>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => setError(null)}
            >
              <Text style={styles.retryButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.foodGrid}>
            {foods.filter(f => f.isAllowed).map((food, index) => (
              <FoodItem 
                key={food.id} 
                food={food} 
                index={index} 
                isSelected={selectedFoods.includes(food.id)}
                onToggle={handleFoodToggle}
              />
            ))}
          </View>
        </ScrollView>

        {selectedFoods.length > 0 && (
          <Animated.View 
            entering={FadeIn.springify()}
            style={styles.footer}
          >
            <View style={styles.buttonWrapper}>
              <Button
                title={`Continue with ${selectedFoods.length} items`}
                onPress={handleNext}
                style={styles.continueButton}
              />
            </View>
          </Animated.View>
        )}
      </View>

      <AmountModal 
        visible={showAmountModal}
        selectedFoods={selectedFoods}
        foods={foods}
        foodAmounts={foodAmounts}
        mealTime={mealTime}
        onClose={closeAmountModal}
        onAmountChange={updateFoodAmount}
        onTimeChange={updateMealTime}
        onSubmit={handleAmountSubmit}
      />
      <SuccessModal />
      <PairingModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 25,
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.inverse,
    marginBottom: 20,
  },
  headerImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage1: {
    width: 150,
    height: 140,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.inverse,
    textAlign: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  mealTypes: {
    marginBottom:10,
  },
  mealTypesContent: {
    paddingRight: 24,
  },
  mealTypeButton: {
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    paddingBottom: 15,
    paddingTop: 13,
    marginBottom: 30,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  mealTypeButtonCompleted: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success,
  },
  mealTypeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  mealTypeTextActive: {
    color: colors.text.inverse,
  },
  mealTypeTextCompleted: {
    color: colors.success,
    fontWeight: '600',
  },
  mealTypeCheckmark: {
    position: 'absolute',
    top: -10,
    right: -2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: (width - 72) / 3,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodItemSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  foodItemDisabled: {
    // opacity: 0.9,
    borderColor: colors.border,
    backgroundColor: colors.surface + '10',
  },
  foodImageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodImageDisabled: {
    opacity: 0.5,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  foodNameDisabled: {
    color: colors.text.secondary,
  },
  notAllowedText: {
    fontSize: 12,
    color: colors.warning,
    textAlign: 'center',
    marginTop: 4,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    zIndex: 100,
  },
  continueButton: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 32,
    width: width - 48,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  modalIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalEmoji: {
    fontSize: 64,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
  caloriesText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 20,
  },
  pairingImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  plateImage: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  // Amount Modal styles
  amountModal: {
    maxHeight: '80%',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  // Time selection styles
  timeSelectionContainer: {
    width: '100%',
    marginBottom: 24,
    position: 'relative',
    zIndex: 1000,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  timeDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeDropdownButtonText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  timeDropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    zIndex: 10,
  },
  timeDropdownScroll: {
    maxHeight: 200,
  },
  timeDropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeDropdownOptionSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  timeDropdownOptionText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  timeDropdownOptionTextSelected: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  amountList: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 24,
  },
  amountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  amountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  amountFoodImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  amountFoodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
  },
  amountInput: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    minWidth: 40,
  },
  inputWrapper: {
    flex: 1,
  },
  amountUnit: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  filterInfo: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  warningInfo: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    marginBottom: 16,
  },
  foodSummary: {
    backgroundColor: colors.surface + '10',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  foodSummaryText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  // Success Modal styles
  mealProgressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  mealProgressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  mealProgressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface + '10',
    borderRadius: 12,
    marginBottom: 8,
  },
  mealProgressText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  modalButtons: {
    width: '100%',
    marginTop: 20,
  },
  continueMealsButton: {
    width: '100%',
    marginBottom: 10,
  },
  saveAllButton: {
    width: '100%',
  },

  mealSummaryContainer: {
    backgroundColor: colors.surface + '10',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  mealSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  mealSummaryText: {
    fontSize: 16,
    color: colors.text.secondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  saveAllMealsButton: {
    width: '100%',
  },
  mealSummaryFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    zIndex: 99,
  },
  // Error handling styles
  errorContainer: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MealTrackingScreen;
