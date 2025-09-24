import { apiService } from '@/utils/apiService';
import { create } from 'zustand';
import MessageHandler from '../utils/messageHandler';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  image?: string;
}

export interface MealEntry {
  id: string;
  childId: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    foodId: string;
    food: FoodItem;
    quantity: number;
    unit: string;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  notes?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealState {
  meals: MealEntry[];
  currentMeal: Partial<MealEntry> | null;
  isLoading: boolean;
  error: string | null;
  mealHistory: any;
}

export interface MealActions {
  getMeal: (childId?: string) => Promise<void>;
  addMeal: (mealData: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  recordMeal: (mealData: any) => Promise<any>;
  getMealHistoryByIdToday: (childId: string) => Promise<any>;
  updateMeal: (mealId: string, mealData: Partial<MealEntry>) => Promise<void>;
  removeMeal: (mealId: string) => Promise<void>;
  getMealsByDate: (date: string, childId?: string) => MealEntry[];
  startNewMeal: (type: MealEntry['type'], childId: string) => void;
  addFoodToCurrentMeal: (food: FoodItem, quantity: number, unit: string) => void;
  removeFoodFromCurrentMeal: (foodId: string) => void;
  saveCurrentMeal: () => Promise<void>;
  clearCurrentMeal: () => void;
  setMeals: (meals: MealEntry[]) => void;
  setCurrentMeal: (meal: Partial<MealEntry> | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type MealStore = MealState & MealActions;

export const useMealStore = create<MealStore>((set, get) => ({
  meals: [],
  currentMeal: null,
  isLoading: false,
  error: null,
  mealHistory: [],
  getMeal: async (childId?: string) => {
    if (!childId) return;
    const result = await apiService.getMeals(childId);
    console.log('MealStore - API result:', result);
    set({ meals: result.data, isLoading: false });
  },

  addMeal: async (mealData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.addMeal(mealData);
      
      if (result.success && result.data) {
        set({ meals: [...get().meals, result.data], isLoading: false });
        
        // Show success message
        MessageHandler.showSuccess('Meal added successfully!');
        return result.data;
      } else {
        // Handle error response
        MessageHandler.handleApiResponse(result, {
          title: 'Add Meal',
          errorMessage: 'Failed to add meal. Please try again.'
        });
        throw new Error(result.error || 'Failed to add meal');
      }
    } catch (error) {
      // Handle caught errors
      MessageHandler.handleApiError(error, {
        title: 'Add Meal Error',
        errorMessage: 'Failed to add meal. Please check your connection and try again.'
      });
      
      set({
        error: error instanceof Error ? error.message : 'Failed to add meal',
        isLoading: false,
      });
    }
  },

  recordMeal: async (mealData: any) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.recordMeal(mealData);
      
      if (result.success && result.data) {
        set({ meals: [...get().meals, result.data], isLoading: false });
        
        // Show success message
        MessageHandler.showSuccess('Meal recorded successfully!');
        return result.data;
      } else {
        // Handle error response
        MessageHandler.handleApiResponse(result, {
          title: 'Record Meal',
          errorMessage: 'Failed to record meal. Please try again.'
        });
        throw new Error(result.error || 'Failed to record meal');
      }
    } catch (error) {
      // Handle caught errors
      MessageHandler.handleApiError(error, {
        title: 'Record Meal Error',
        errorMessage: 'Failed to record meal. Please check your connection and try again.'
      });
      
      set({
        error: error instanceof Error ? error.message : 'Failed to record meal',
        isLoading: false,
      });
    }
  },

  getMealHistoryByIdToday: async (childId: string) => {
    const result = await apiService.getMealHistoryByIdToday(childId);
    set({ mealHistory: result.data });
  },

  updateMeal: async (mealId, mealData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMeals = get().meals.map(meal =>
        meal.id === mealId
          ? { ...meal, ...mealData, updatedAt: new Date().toISOString() }
          : meal
      );
      set({ meals: updatedMeals, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update meal',
        isLoading: false,
      });
    }
  },

  removeMeal: async (mealId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMeals = get().meals.filter(meal => meal.id !== mealId);
      set({ meals: updatedMeals, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove meal',
        isLoading: false,
      });
    }
  },

  getMealsByDate: (date, childId) => {
    const meals = get().meals;
    return meals.filter(meal => {
      const mealDate = new Date(meal.createdAt).toDateString();
      const targetDate = new Date(date).toDateString();
      return mealDate === targetDate && (!childId || meal.childId === childId);
    });
  },

  startNewMeal: (type, childId) => {
    set({
      currentMeal: {
        type,
        childId,
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
      }
    });
  },

  addFoodToCurrentMeal: (food, quantity, unit) => {
    const currentMeal = get().currentMeal;
    if (!currentMeal) return;

    const updatedFoods = [...(currentMeal.foods ?? [])];
    const existingFoodIndex = updatedFoods.findIndex(f => f.foodId === food.id);

    if (existingFoodIndex >= 0) {
      updatedFoods[existingFoodIndex] = {
        ...updatedFoods[existingFoodIndex],
        quantity: updatedFoods[existingFoodIndex].quantity + quantity,
      };
    } else {
      updatedFoods.push({
        foodId: food.id,
        food,
        quantity,
        unit,
      });
    }

    const totals = updatedFoods.reduce((acc, item) => ({
      calories: acc.calories + (item.food.calories * item.quantity),
      protein: acc.protein + (item.food.protein * item.quantity),
      carbs: acc.carbs + (item.food.carbs * item.quantity),
      fat: acc.fat + (item.food.fat * item.quantity),
      fiber: acc.fiber + (item.food.fiber * item.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    set({
      currentMeal: {
        ...currentMeal,
        foods: updatedFoods,
        ...totals,
      }
    });
  },

  removeFoodFromCurrentMeal: (foodId) => {
    const currentMeal = get().currentMeal;
    if (!currentMeal) return;

    const updatedFoods = currentMeal.foods?.filter(f => f.foodId !== foodId) || [];
    
    const totals = updatedFoods.reduce((acc, item) => ({
      calories: acc.calories + (item.food.calories * item.quantity),
      protein: acc.protein + (item.food.protein * item.quantity),
      carbs: acc.carbs + (item.food.carbs * item.quantity),
      fat: acc.fat + (item.food.fat * item.quantity),
      fiber: acc.fiber + (item.food.fiber * item.quantity),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    set({
      currentMeal: {
        ...currentMeal,
        foods: updatedFoods,
        ...totals,
      }
    });
  },

  saveCurrentMeal: async () => {
    const currentMeal = get().currentMeal;
    if (!currentMeal || !currentMeal.childId || !currentMeal.type) {
      throw new Error('Invalid meal data');
    }

    await get().addMeal(currentMeal as Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>);
    set({ currentMeal: null });
  },

  clearCurrentMeal: () => {
    set({ currentMeal: null });
  },

  setMeals: (meals) => set({ meals }),
  setCurrentMeal: (meal) => set({ currentMeal: meal }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));