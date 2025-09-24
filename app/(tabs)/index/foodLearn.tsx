import LearnFoods from '@/components/common/LearnFoods';
import foodGuideData from '@/db/foods.json';
import { useUserStore } from '@/stores/userStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../../constants/colors';
import { getFoodImageSource } from '../../../utils/imageUtils';

const { width } = Dimensions.get('window');
const MIN_ITEM_WIDTH = 150;
const GUTTER = 12;

const FoodLearn = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLearnFoods, setShowLearnFoods] = useState(false);
  const [selectedFoodData, setSelectedFoodData] = useState<any>(null);
  const [numColumns, setNumColumns] = useState(2);
  const [itemCardWidth, setItemCardWidth] = useState<number>(() => {
    const contentPadding = 40; // styles.content paddingHorizontal = 20 each side
    const available = width - contentPadding;
    const initialColumns = Math.max(1, Math.floor((available + GUTTER) / (MIN_ITEM_WIDTH + GUTTER)));
    return Math.floor((available - (initialColumns - 1) * GUTTER) / initialColumns);
  });
  const { profile, selectedChildId } = useUserStore();

  const childProfile = (profile as any)?.data?.user?.children || profile?.children;
  const selectedChild = childProfile.find((child: any) => child.id === selectedChildId) || childProfile[0];

  const allowedFruits = selectedChild.fruits || [];
  const allowedVegetables = selectedChild.vegetables || [];
  const allowedProteins = selectedChild.proteins || [];

  // Reset selected category and food data when switching children
  useEffect(() => {
    console.log('FoodLearn - selectedChildId changed to:', selectedChildId);
    setSelectedCategory('all');
    setShowLearnFoods(false);
    setSelectedFoodData(null);
  }, [selectedChildId]);

  const getAllFoods = () => {
    const foods: { name: string; category: string; summary: string; key_facts: string[]; key: string }[] = [];
    
    // Only add fruits that are in the allowedFruits array
    if (foodGuideData.categories?.fruits?.foods) {
      Object.keys(foodGuideData.categories.fruits.foods).forEach(fruitName => {
        if (allowedFruits.includes(fruitName)) {
          const fruitData = foodGuideData.categories.fruits.foods[fruitName as keyof typeof foodGuideData.categories.fruits.foods];
          foods.push({
            name: fruitData.name || fruitName,
            category: 'fruits',
            summary: fruitData.learning?.summary || '',
            key_facts: fruitData.learning?.key_facts || [],
            key: fruitName, // Store the original key for lookup
          });
        }
      });
    }

    // Only add vegetables that are in the allowedVegetables array
    if (foodGuideData.categories?.vegetables?.foods) {
      Object.keys(foodGuideData.categories.vegetables.foods).forEach(vegName => {
        if (allowedVegetables.includes(vegName)) {
          const vegData = foodGuideData.categories.vegetables.foods[vegName as keyof typeof foodGuideData.categories.vegetables.foods];
          foods.push({
            name: vegData.name || vegName,
            category: 'vegetables',
            summary: vegData.learning?.summary || '',
            key_facts: vegData.learning?.key_facts || [],
            key: vegName, // Store the original key for lookup
          });
        }
      });
    }

    // Only add proteins that are in the allowedProteins array
    if (foodGuideData.categories?.proteins?.foods) {
      Object.keys(foodGuideData.categories.proteins.foods).forEach(proteinName => {
        if (allowedProteins.includes(proteinName)) {
          const proteinData = foodGuideData.categories.proteins.foods[proteinName as keyof typeof foodGuideData.categories.proteins.foods];
          foods.push({
            name: proteinData.name || proteinName,
            category: 'proteins',
            summary: proteinData.learning?.summary || '',
            key_facts: proteinData.learning?.key_facts || [],
            key: proteinName, // Store the original key for lookup
          });
        }
      });
    }

    return foods;
  };

  const getFoodImage = (foodName: string) => {
    return getFoodImageSource(foodName);
  };

  const filteredFoods = getAllFoods().filter(food => {
    if (selectedCategory === 'all') return true;
    return food.category === selectedCategory;
  });

  console.log('FoodLearn - filteredFoods:', filteredFoods);

  const handleFoodPress = (foodKey: string, category: string) => {
    console.log('FoodLearn - handleFoodPress called with:', { foodKey, category });
    // Get food data from the JSON file
    let foodData = null;
    
    if (category === 'fruits' && foodGuideData.categories?.fruits?.foods?.[foodKey as keyof typeof foodGuideData.categories.fruits.foods]) {
      const fruitData = foodGuideData.categories.fruits.foods[foodKey as keyof typeof foodGuideData.categories.fruits.foods];
      foodData = {
        name: fruitData.name || foodKey.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        summary: fruitData.learning?.summary || '',
        key_facts: fruitData.learning?.key_facts || [],
        key: foodKey,
      };
    } else if (category === 'vegetables' && foodGuideData.categories?.vegetables?.foods?.[foodKey as keyof typeof foodGuideData.categories.vegetables.foods]) {
      const vegData = foodGuideData.categories.vegetables.foods[foodKey as keyof typeof foodGuideData.categories.vegetables.foods];
      foodData = {
        name: vegData.name || foodKey.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        summary: vegData.learning?.summary || '',
        key_facts: vegData.learning?.key_facts || [],
        key: foodKey,
      };
    } else if (category === 'proteins' && foodGuideData.categories?.proteins?.foods?.[foodKey as keyof typeof foodGuideData.categories.proteins.foods]) {
      const proteinData = foodGuideData.categories.proteins.foods[foodKey as keyof typeof foodGuideData.categories.proteins.foods];
      foodData = {
        name: proteinData.name || foodKey.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        summary: proteinData.learning?.summary || '',
        key_facts: proteinData.learning?.key_facts || [],
        key: foodKey,
      };
    }
    
    if (foodData) {
       console.log('FoodLearn - foodData found:', foodData);
       setSelectedFoodData(foodData);
       setShowLearnFoods(true);
     } else {
       console.log('FoodLearn - No foodData found for:', { foodKey, category });
     }
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
        
        <Text style={styles.headerTitle}>Learn About Food</Text>
        
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'all' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'fruits' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('fruits')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'fruits' && styles.categoryTextActive]}>
                Fruits
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'vegetables' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('vegetables')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'vegetables' && styles.categoryTextActive]}>
                Vegetables
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === 'proteins' && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory('proteins')}
            >
              <Text style={[styles.categoryText, selectedCategory === 'proteins' && styles.categoryTextActive]}>
                Proteins
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View
          onLayout={(e) => {
            const availableWidth = e.nativeEvent.layout.width;
            const nextColumns = Math.max(1, Math.floor((availableWidth + GUTTER) / (MIN_ITEM_WIDTH + GUTTER)));
            const computedItemWidth = Math.floor((availableWidth - (nextColumns - 1) * GUTTER) / nextColumns);
            setNumColumns(nextColumns);
            setItemCardWidth(computedItemWidth);
          }}
        >
          <FlatList
            data={filteredFoods}
            keyExtractor={(food) => food.name}
            key={`cols-${numColumns}`}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between', marginBottom: GUTTER } : undefined}
            contentContainerStyle={numColumns === 1 ? { rowGap: GUTTER } : undefined}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: food }) => (
              <TouchableOpacity
                style={[styles.foodItem, { width: itemCardWidth }]}
                onPress={() => handleFoodPress(food.key, food.category)}
                activeOpacity={0.7}
              >
                <Image source={getFoodImage(food.key)} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>
                    {food.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      
       {showLearnFoods && selectedFoodData && (
        <View style={styles.overlay}>
          <LearnFoods
            imageSource={getFoodImage(selectedFoodData.key || selectedFoodData.name)}
            data={{
              summary: selectedFoodData.summary,
              key_facts: selectedFoodData.key_facts,
            } as any}
            onBack={() => setShowLearnFoods(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    paddingTop: 23,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 20,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: 'white',
  },
  foodList: {
    flexDirection: 'column',
  },
  foodItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 15,
    height: 120,
    padding: 15,
    marginRight: 0,
  },
  foodImage: {
    marginTop: 10,
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  foodDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
});

export default FoodLearn;