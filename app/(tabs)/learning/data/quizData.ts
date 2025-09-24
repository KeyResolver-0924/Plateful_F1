import foodsData from '../../../../db/foods.json';
import { Question } from '../types/navigation';

// Transform foods.json data into quiz questions
const generateQuestionsFromFoods = (): Question[] => {
  const questions: Question[] = [];
  
  // Helper function to create questions from food data
  const createQuestionsForFood = (foodKey: string, foodData: any, category: string) => {
    const foodName = foodKey.charAt(0).toUpperCase() + foodKey.slice(1).replace('_', ' ');
    
    // Add quiz questions if they exist in the food data
    if (foodData.quiz && foodData.quiz.questions) {
      foodData.quiz.questions.forEach((q: any, index: number) => {
        questions.push({
          id: `${foodKey}_${index}`,
          question: q.question,
          options: q.options,
          correct_answer: q.explanation || q.options[q.correct_answer.charCodeAt(0) - 65] || '',
          correct_index: q.correct_answer.charCodeAt(0) - 65,
          category: category,
          difficulty: 'EASY',
          explanation: q.explanation || ''
        });
      });
    }
  };

  // Process fruits
  if (foodsData.categories?.fruits?.foods) {
    Object.entries(foodsData.categories.fruits.foods).forEach(([key, data]) => {
      createQuestionsForFood(key, data, 'Fruits');
    });
  }

  // Process vegetables
  if (foodsData.categories?.vegetables?.foods) {
    Object.entries(foodsData.categories.vegetables.foods).forEach(([key, data]) => {
      createQuestionsForFood(key, data, 'Vegetables');
    });
  }

  // Process proteins
  if (foodsData.categories?.proteins?.foods) {
    Object.entries(foodsData.categories.proteins.foods).forEach(([key, data]) => {
      createQuestionsForFood(key, data, 'Proteins');
    });
  }

  return questions;
};

// Generate base questions from foods data
const baseQuestions = generateQuestionsFromFoods();

// Additional custom questions for variety
const customQuestions: Question[] = [
  {
    id: 'nutrition_1',
    question: 'Which nutrient gives you energy?',
    options: ['Protein', 'Carbohydrates', 'Vitamins', 'Water'],
    correct_answer: 'Carbohydrates',
    correct_index: 1,
    category: 'Nutrition',
    difficulty: 'EASY',
    explanation: 'Carbohydrates are the body\'s main source of energy'
  },
  {
    id: 'nutrition_2',
    question: 'What helps build strong muscles?',
    options: ['Sugar', 'Protein', 'Fat', 'Salt'],
    correct_answer: 'Protein',
    correct_index: 1,
    category: 'Nutrition',
    difficulty: 'EASY',
    explanation: 'Protein helps build and repair muscles'
  },
  {
    id: 'health_1',
    question: 'How many servings of fruits and vegetables should you eat daily?',
    options: ['1-2', '3-4', '5 or more', '10 or more'],
    correct_answer: '5 or more',
    correct_index: 2,
    category: 'Health',
    difficulty: 'NORMAL',
    explanation: 'Experts recommend at least 5 servings of fruits and vegetables daily'
  },
  {
    id: 'cooking_1',
    question: 'What cooking method helps preserve most nutrients?',
    options: ['Deep frying', 'Steaming', 'Boiling for long time', 'Burning'],
    correct_answer: 'Steaming',
    correct_index: 1,
    category: 'Cooking',
    difficulty: 'HARD',
    explanation: 'Steaming helps preserve vitamins and minerals in food'
  }
];

// Combine all questions
const QUIZ_DATA = {
  fruits: baseQuestions.filter(q => q.category === 'Fruits'),
  vegetables: baseQuestions.filter(q => q.category === 'Vegetables'), 
  proteins: baseQuestions.filter(q => q.category === 'Proteins'),
  nutrition: customQuestions.filter(q => q.category === 'Nutrition'),
  health: customQuestions.filter(q => q.category === 'Health'),
  cooking: customQuestions.filter(q => q.category === 'Cooking'),
  all: [...baseQuestions, ...customQuestions]
};

export default QUIZ_DATA;
