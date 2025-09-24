export interface Food {
  id: string;
  name: string;
  category: string;
  icon: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    sugar: number;
    vitamins: string[];
    minerals: string[];
  };
  benefits: string[];
  allergens: string[];
  ageRecommended: string;
}

export interface FoodsByCategory {
  fruits: Food[];
  vegetables: Food[];
  proteins: Food[];
  grains: Food[];
  dairy: Food[];
}

export const foods: FoodsByCategory = {
  fruits: [
    {
      id: 'apple',
      name: 'Apple',
      category: 'fruits',
      icon: require('../assets/images/foods/apple.png'),
      nutrients: {
        calories: 52,
        protein: 0.3,
        carbs: 14,
        fiber: 2.4,
        sugar: 10,
        vitamins: ['C', 'K'],
        minerals: ['Potassium']
      },
      benefits: [
        'Rich in antioxidants',
        'Good source of fiber',
        'Supports heart health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'pear',
      name: 'Pear',
      category: 'fruits',
      icon: require('../assets/images/foods/pear.png'),
      nutrients: {
        calories: 57,
        protein: 0.4,
        carbs: 15,
        fiber: 3.1,
        sugar: 10,
        vitamins: ['C', 'K'],
        minerals: ['Potassium', 'Copper']
      },
      benefits: [
        'High in fiber',
        'Supports digestion',
        'Heart healthy'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'banana',
      name: 'Banana',
      category: 'fruits',
      icon: require('../assets/images/foods/banana.png'),
      nutrients: {
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fiber: 2.6,
        sugar: 12,
        vitamins: ['B6', 'C'],
        minerals: ['Potassium', 'Magnesium']
      },
      benefits: [
        'Easy to digest',
        'Great energy source',
        'Helps with digestion'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'orange',
      name: 'Orange',
      category: 'fruits',
      icon: require('../assets/images/foods/orange.png'),
      nutrients: {
        calories: 47,
        protein: 0.9,
        carbs: 12,
        fiber: 2.4,
        sugar: 9,
        vitamins: ['C', 'Folate'],
        minerals: ['Potassium']
      },
      benefits: [
        'Immune system booster',
        'High in vitamin C',
        'Supports skin health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      category: 'fruits',
      icon: require('../assets/images/foods/pineapple.png'),
      nutrients: {
        calories: 50,
        protein: 0.5,
        carbs: 13,
        fiber: 1.4,
        sugar: 10,
        vitamins: ['C', 'B6'],
        minerals: ['Manganese', 'Copper']
      },
      benefits: [
        'Contains bromelain enzyme',
        'Immune support',
        'Anti-inflammatory'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      category: 'fruits',
      icon: require('../assets/images/foods/strawberry.png'),
      nutrients: {
        calories: 32,
        protein: 0.7,
        carbs: 8,
        fiber: 2,
        sugar: 5,
        vitamins: ['C', 'Folate'],
        minerals: ['Manganese', 'Potassium']
      },
      benefits: [
        'High in antioxidants',
        'Anti-inflammatory',
        'Heart healthy'
      ],
      allergens: ['berries'],
      ageRecommended: '8+ months'
    },
    {
      id: 'grapes',
      name: 'Grapes',
      category: 'fruits',
      icon: require('../assets/images/foods/grapes.png'),
      nutrients: {
        calories: 69,
        protein: 0.7,
        carbs: 18,
        fiber: 0.9,
        sugar: 15,
        vitamins: ['K', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Rich in antioxidants',
        'Supports brain health',
        'Good for hydration'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      category: 'fruits',
      icon: require('../assets/images/foods/watermelon.png'),
      nutrients: {
        calories: 30,
        protein: 0.6,
        carbs: 8,
        fiber: 0.4,
        sugar: 6,
        vitamins: ['A', 'C'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent hydration',
        'Low calorie',
        'Heart healthy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'mango',
      name: 'Mango',
      category: 'fruits',
      icon: require('../assets/images/foods/mango.png'),
      nutrients: {
        calories: 60,
        protein: 0.8,
        carbs: 15,
        fiber: 1.6,
        sugar: 14,
        vitamins: ['A', 'C', 'E'],
        minerals: ['Potassium', 'Copper']
      },
      benefits: [
        'Rich in vitamin A',
        'Supports eye health',
        'Immune booster'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'peach',
      name: 'Peach',
      category: 'fruits',
      icon: require('../assets/images/foods/peach.png'),
      nutrients: {
        calories: 39,
        protein: 0.9,
        carbs: 10,
        fiber: 1.5,
        sugar: 8,
        vitamins: ['A', 'C', 'E'],
        minerals: ['Potassium', 'Iron']
      },
      benefits: [
        'Skin health support',
        'Digestive health',
        'Antioxidant rich'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'apricot',
      name: 'Apricot',
      category: 'fruits',
      icon: require('../assets/images/foods/peach.png'),
      nutrients: {
        calories: 48,
        protein: 1.4,
        carbs: 11,
        fiber: 2,
        sugar: 9,
        vitamins: ['A', 'C', 'E'],
        minerals: ['Potassium', 'Iron']
      },
      benefits: [
        'Eye health support',
        'Immune system boost',
        'Skin health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  vegetables: [
    {
      id: 'carrot',
      name: 'Carrot',
      category: 'vegetables',
      icon: require('../assets/images/foods/carrot.png'),
      nutrients: {
        calories: 41,
        protein: 0.9,
        carbs: 10,
        fiber: 2.8,
        sugar: 5,
        vitamins: ['A', 'K', 'B6'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent for eye health',
        'Rich in beta-carotene',
        'Supports immune system'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'carrots',
      name: 'Carrots',
      category: 'vegetables',
      icon: require('../assets/images/foods/carrot.png'),
      nutrients: {
        calories: 41,
        protein: 0.9,
        carbs: 10,
        fiber: 2.8,
        sugar: 5,
        vitamins: ['A', 'K', 'B6'],
        minerals: ['Potassium']
      },
      benefits: [
        'Excellent for eye health',
        'Rich in beta-carotene',
        'Supports immune system'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'broccoli',
      name: 'Broccoli',
      category: 'vegetables',
      icon: require('../assets/images/foods/broccoli.png'),
      nutrients: {
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fiber: 2.6,
        sugar: 1.7,
        vitamins: ['C', 'K', 'Folate'],
        minerals: ['Iron', 'Potassium']
      },
      benefits: [
        'High in vitamins',
        'Supports bone health',
        'Anti-inflammatory'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'sweetpotato',
      name: 'Sweet Potato',
      category: 'vegetables',
      icon: require('../assets/images/foods/sweetpotato.png'),
      nutrients: {
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fiber: 3,
        sugar: 4,
        vitamins: ['A', 'C', 'B6'],
        minerals: ['Potassium', 'Manganese']
      },
      benefits: [
        'Rich in fiber',
        'Good source of energy',
        'Supports gut health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'sweet_potato',
      name: 'Sweet Potato',
      category: 'vegetables',
      icon: require('../assets/images/foods/sweetpotato.png'),
      nutrients: {
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fiber: 3,
        sugar: 4,
        vitamins: ['A', 'C', 'B6'],
        minerals: ['Potassium', 'Manganese']
      },
      benefits: [
        'Rich in fiber',
        'Good source of energy',
        'Supports gut health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'peas',
      name: 'Peas',
      category: 'vegetables',
      icon: require('../assets/images/foods/peas.png'),
      nutrients: {
        calories: 84,
        protein: 5.4,
        carbs: 14,
        fiber: 5.7,
        sugar: 6,
        vitamins: ['K', 'C', 'Folate'],
        minerals: ['Iron', 'Manganese']
      },
      benefits: [
        'High in protein',
        'Good source of fiber',
        'Supports bone health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'corn',
      name: 'Corn',
      category: 'vegetables',
      icon: require('../assets/images/foods/corn.png'),
      nutrients: {
        calories: 86,
        protein: 3.2,
        carbs: 19,
        fiber: 2.7,
        sugar: 3.2,
        vitamins: ['B1', 'B5', 'C'],
        minerals: ['Magnesium', 'Phosphorus']
      },
      benefits: [
        'Good energy source',
        'Supports eye health',
        'Digestive health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'cucumber',
      name: 'Cucumber',
      category: 'vegetables',
      icon: require('../assets/images/foods/cucumber.png'),
      nutrients: {
        calories: 16,
        protein: 0.7,
        carbs: 3.6,
        fiber: 0.5,
        sugar: 1.7,
        vitamins: ['K', 'C'],
        minerals: ['Potassium', 'Magnesium']
      },
      benefits: [
        'Hydrating',
        'Low calorie',
        'Supports skin health'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'bellpepper',
      name: 'Bell Pepper',
      category: 'vegetables',
      icon: require('../assets/images/foods/bellpepper.png'),
      nutrients: {
        calories: 31,
        protein: 1,
        carbs: 7,
        fiber: 2.1,
        sugar: 5,
        vitamins: ['C', 'A', 'B6'],
        minerals: ['Potassium', 'Iron']
      },
      benefits: [
        'High in vitamin C',
        'Eye health support',
        'Immune booster'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'bell_pepper',
      name: 'Bell Pepper',
      category: 'vegetables',
      icon: require('../assets/images/foods/bellpepper.png'),
      nutrients: {
        calories: 31,
        protein: 1,
        carbs: 7,
        fiber: 2.1,
        sugar: 5,
        vitamins: ['C', 'A', 'B6'],
        minerals: ['Potassium', 'Iron']
      },
      benefits: [
        'High in vitamin C',
        'Eye health support',
        'Immune booster'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'bell_peppers',
      name: 'Bell Peppers',
      category: 'vegetables',
      icon: require('../assets/images/foods/bellpepper.png'),
      nutrients: {
        calories: 31,
        protein: 1,
        carbs: 7,
        fiber: 2.1,
        sugar: 5,
        vitamins: ['C', 'A', 'B6'],
        minerals: ['Potassium', 'Iron']
      },
      benefits: [
        'High in vitamin C',
        'Eye health support',
        'Immune booster'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'spinach',
      name: 'Spinach',
      category: 'vegetables',
      icon: require('../assets/images/foods/spinach.png'),
      nutrients: {
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fiber: 2.2,
        sugar: 0.4,
        vitamins: ['A', 'C', 'K', 'Folate'],
        minerals: ['Iron', 'Calcium', 'Magnesium']
      },
      benefits: [
        'Iron rich',
        'Bone health support',
        'Eye health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'tomato',
      name: 'Tomato',
      category: 'vegetables',
      icon: require('../assets/images/foods/tomato.png'),
      nutrients: {
        calories: 18,
        protein: 0.9,
        carbs: 3.9,
        fiber: 1.2,
        sugar: 2.6,
        vitamins: ['C', 'K', 'A'],
        minerals: ['Potassium', 'Folate']
      },
      benefits: [
        'Rich in lycopene',
        'Heart health support',
        'Skin protection'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
  ],
  proteins: [
    {
      id: 'chicken',
      name: 'Chicken',
      category: 'proteins',
      icon: require('../assets/images/foods/chicken.png'),
      nutrients: {
        calories: 165,
        protein: 31,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B6', 'B12'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'High in protein',
        'Easy to digest',
        'Supports muscle growth'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'fish',
      name: 'Fish',
      category: 'proteins',
      icon: require('../assets/images/foods/fish.png'),
      nutrients: {
        calories: 84,
        protein: 20,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['D', 'B12'],
        minerals: ['Omega-3', 'Iodine']
      },
      benefits: [
        'Brain development',
        'Heart healthy',
        'Rich in omega-3'
      ],
      allergens: ['fish'],
      ageRecommended: '12+ months'
    },
    {
      id: 'egg',
      name: 'Egg',
      category: 'proteins',
      icon: require('../assets/images/foods/egg.png'),
      nutrients: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fiber: 0,
        sugar: 1.1,
        vitamins: ['D', 'B12', 'Choline'],
        minerals: ['Iron', 'Selenium']
      },
      benefits: [
        'Complete protein',
        'Brain development',
        'Eye health'
      ],
      allergens: ['eggs'],
      ageRecommended: '8+ months'
    },
    {
      id: 'eggs',
      name: 'Eggs',
      category: 'proteins',
      icon: require('../assets/images/foods/eggs.png'),
      nutrients: {
        calories: 155,
        protein: 13,
        carbs: 1.1,
        fiber: 0,
        sugar: 1.1,
        vitamins: ['D', 'B12', 'Choline'],
        minerals: ['Iron', 'Selenium']
      },
      benefits: [
        'Complete protein',
        'Brain development',
        'Eye health'
      ],
      allergens: ['eggs'],
      ageRecommended: '8+ months'
    },
    {
      id: 'beans',
      name: 'Beans',
      category: 'proteins',
      icon: require('../assets/images/foods/beans.png'),
      nutrients: {
        calories: 81,
        protein: 5.4,
        carbs: 14,
        fiber: 5.7,
        sugar: 6,
        vitamins: ['K', 'C', 'Folate'],
        minerals: ['Iron', 'Manganese']
      },
      benefits: [
        'High in protein',
        'Good source of fiber',
        'Supports bone health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'lentils',
      name: 'Lentils',
      category: 'proteins',
      icon: require('../assets/images/foods/lentils.png'),
      nutrients: {
        calories: 116,
        protein: 9,
        carbs: 20,
        fiber: 7.9,
        sugar: 1.8,
        vitamins: ['B1', 'B6', 'Folate'],
        minerals: ['Iron', 'Zinc', 'Magnesium']
      },
      benefits: [
        'Excellent protein source',
        'High in fiber',
        'Supports heart health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'tofu',
      name: 'Tofu',
      category: 'proteins',
      icon: require('../assets/images/foods/tofu.png'),
      nutrients: {
        calories: 76,
        protein: 8,
        carbs: 1.9,
        fiber: 0.3,
        sugar: 0.6,
        vitamins: ['B1', 'B6', 'Folate'],
        minerals: ['Calcium', 'Iron', 'Magnesium']
      },
      benefits: [
        'Plant-based protein',
        'Calcium rich',
        'Heart healthy'
      ],
      allergens: ['soy'],
      ageRecommended: '12+ months'
    },
    {
      id: 'lean_beef',
      name: 'Lean Beef',
      category: 'proteins',
      icon: require('../assets/images/foods/beef.png'),
      nutrients: {
        calories: 250,
        protein: 26,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B12', 'B6', 'Niacin'],
        minerals: ['Iron', 'Zinc', 'Selenium']
      },
      benefits: [
        'High quality protein',
        'Iron rich',
        'Supports muscle growth'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    },
    {
      id: 'beef',
      name: 'Beef',
      category: 'proteins',
      icon: require('../assets/images/foods/beef.png'),
      nutrients: {
        calories: 250,
        protein: 26,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B12', 'B6', 'Niacin'],
        minerals: ['Iron', 'Zinc', 'Selenium']
      },
      benefits: [
        'High quality protein',
        'Iron rich',
        'Supports muscle growth'
      ],
      allergens: [],
      ageRecommended: '12+ months'
    },
    {
      id: 'turkey',
      name: 'Turkey',
      category: 'proteins',
      icon: require('../assets/images/foods/turkey.png'),
      nutrients: {
        calories: 189,
        protein: 29,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        vitamins: ['B6', 'B12', 'Niacin'],
        minerals: ['Iron', 'Zinc', 'Selenium']
      },
      benefits: [
        'Lean protein source',
        'Heart healthy',
        'Supports immune system'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'nuts',
      name: 'Nuts',
      category: 'proteins',
      icon: require('../assets/images/foods/nuts.png'),
      nutrients: {
        calories: 607,
        protein: 20,
        carbs: 23,
        fiber: 12.5,
        sugar: 4.8,
        vitamins: ['E', 'B1', 'B6'],
        minerals: ['Magnesium', 'Zinc', 'Copper']
      },
      benefits: [
        'Healthy fats',
        'Protein rich',
        'Heart healthy'
      ],
      allergens: ['tree nuts'],
      ageRecommended: '12+ months'
    }
  ],
  grains: [
    {
      id: 'rice',
      name: 'Rice',
      category: 'grains',
      icon: require('../assets/images/foods/rice.png'),
      nutrients: {
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fiber: 0.4,
        sugar: 0.1,
        vitamins: ['B1', 'B6'],
        minerals: ['Iron', 'Magnesium']
      },
      benefits: [
        'Easy to digest',
        'Good energy source',
        'Gentle on stomach'
      ],
      allergens: [],
      ageRecommended: '6+ months'
    },
    {
      id: 'oats',
      name: 'Oats',
      category: 'grains',
      icon: require('../assets/images/foods/maize .png'),
      nutrients: {
        calories: 68,
        protein: 2.4,
        carbs: 12,
        fiber: 1.7,
        sugar: 0.3,
        vitamins: ['B1', 'B6'],
        minerals: ['Iron', 'Zinc']
      },
      benefits: [
        'High in fiber',
        'Heart healthy',
        'Sustained energy'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    },
    {
      id: 'maize',
      name: 'Maize',
      category: 'grains',
      icon: require('../assets/images/foods/maize .png'),
      nutrients: {
        calories: 86,
        protein: 3.2,
        carbs: 19,
        fiber: 2.7,
        sugar: 3.2,
        vitamins: ['B1', 'B5', 'C'],
        minerals: ['Magnesium', 'Phosphorus']
      },
      benefits: [
        'Good energy source',
        'Supports eye health',
        'Digestive health'
      ],
      allergens: [],
      ageRecommended: '8+ months'
    }
  ],
  dairy: [
    {
      id: 'yogurt',
      name: 'Yogurt',
      category: 'dairy',
      icon: require('../assets/images/foods/yogurt.png'),
      nutrients: {
        calories: 59,
        protein: 10,
        carbs: 3.6,
        fiber: 0,
        sugar: 3.2,
        vitamins: ['B12', 'D'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'Probiotics',
        'Bone health',
        'Digestive health'
      ],
      allergens: ['milk'],
      ageRecommended: '8+ months'
    },
    {
      id: 'cheese',
      name: 'Cheese',
      category: 'dairy',
      icon: require('../assets/images/foods/cheese.png'),
      nutrients: {
        calories: 113,
        protein: 7,
        carbs: 0.4,
        fiber: 0,
        sugar: 0.4,
        vitamins: ['A', 'B12'],
        minerals: ['Calcium', 'Phosphorus']
      },
      benefits: [
        'High in calcium',
        'Protein source',
        'Bone development'
      ],
      allergens: ['milk'],
      ageRecommended: '12+ months'
    }
  ]
};

export const getFoodById = (id: string): Food | undefined => {
  for (const category of Object.values(foods)) {
    const food = category.find((f: Food) => f.id === id);
    if (food) return food;
  }
  return undefined;
};

export const getFoodsByCategory = (category: keyof FoodsByCategory): Food[] => {
  return foods[category] || [];
};

export const getFoodsByAge = (ageInMonths: number): Food[] => {
  const allFoods: Food[] = Object.values(foods).flat();
  return allFoods.filter(food => {
    if (!food.ageRecommended) return false;
    const ageStr = food.ageRecommended.replace(/\D/g, '');
    const recommendedAge = parseInt(ageStr);
    return ageInMonths >= recommendedAge;
  });
};

export const searchFoods = (query: string): Food[] => {
  const allFoods: Food[] = Object.values(foods).flat();
  const lowercaseQuery = query.toLowerCase();
  
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery) ||
    food.benefits.some(benefit => 
      benefit.toLowerCase().includes(lowercaseQuery)
    )
  );
}; 