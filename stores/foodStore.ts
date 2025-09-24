import { create } from 'zustand';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
  image?: string;
}

export interface FoodState {
  foods: FoodItem[];
  selectedFoods: string[];
  searchQuery: string;
  activeCategory: string;
  isLoading: boolean;
  error: string | null;
}

export interface FoodActions {
  setFoods: (foods: FoodItem[]) => void;
  addFood: (food: FoodItem) => void;
  removeFood: (foodId: string) => void;
  selectFood: (foodId: string) => void;
  deselectFood: (foodId: string) => void;
  clearSelectedFoods: () => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  getFoodsByCategory: (category: string) => FoodItem[];
  getFilteredFoods: () => FoodItem[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type FoodStore = FoodState & FoodActions;

export const useFoodStore = create<FoodStore>((set, get) => ({
  foods: [],
  selectedFoods: [],
  searchQuery: '',
  activeCategory: 'all',
  isLoading: false,
  error: null,

  setFoods: (foods) => set({ foods }),
  
  addFood: (food) => set((state) => ({ 
    foods: [...state.foods, food] 
  })),
  
  removeFood: (foodId) => set((state) => ({ 
    foods: state.foods.filter(food => food.id !== foodId) 
  })),
  
  selectFood: (foodId) => set((state) => ({
    selectedFoods: [...state.selectedFoods, foodId]
  })),
  
  deselectFood: (foodId) => set((state) => ({
    selectedFoods: state.selectedFoods.filter(id => id !== foodId)
  })),
  
  clearSelectedFoods: () => set({ selectedFoods: [] }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  getFoodsByCategory: (category) => {
    const { foods } = get();
    if (category === 'all') return foods;
    return foods.filter(food => food.category === category);
  },
  
  getFilteredFoods: () => {
    const { foods, searchQuery, activeCategory } = get();
    let filtered = foods;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(food => food.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
})); 