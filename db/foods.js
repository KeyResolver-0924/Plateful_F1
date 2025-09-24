import { foods } from '../constants/foods';

// Get all foods from all categories
export const getAllFoods = () => {
  const allFoods = [];
  
  // Combine all food categories into a single array
  Object.keys(foods).forEach(category => {
    allFoods.push(...foods[category]);
  });
  
  return allFoods;
};

// Get a specific food by ID
export const getFoodById = (id) => {
  const allFoods = getAllFoods();
  return allFoods.find(food => food.id === id);
};

// Get foods by category
export const getFoodsByCategory = (category) => {
  return foods[category] || [];
};

// Search foods by name
export const searchFoods = (query) => {
  const allFoods = getAllFoods();
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};
