import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import { colors } from '../../constants/colors';
import { foods, type Food } from '../../constants/foods';
import { cameraService } from '../../utils/cameraService';

const { width, height } = Dimensions.get('window');

interface MealType {
  id: string;
  name: string;
  icon: string;
  time: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const MealLoggingScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [mealType, setMealType] = useState<string>('');
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof foods>('fruits');
  const [isProcessing, setIsProcessing] = useState(false);

  const mealTypes: MealType[] = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅', time: 'Morning' },
    { id: 'lunch', name: 'Lunch', icon: '☀️', time: 'Afternoon' },
    { id: 'snack', name: 'Snack', icon: '🍎', time: 'Anytime' },
    { id: 'dinner', name: 'Dinner', icon: '🌙', time: 'Evening' },
  ];

  const categories: Category[] = [
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'proteins', name: 'Proteins', icon: '🍗' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
  ];

  React.useEffect(() => {
    initializeCamera();
  }, []);

  const initializeCamera = async () => {
    const permission = await cameraService.requestPermissions();
    setHasPermission(permission);
  };

  const takePicture = async () => {
    try {
      setIsProcessing(true);
      const imageUri = await cameraService.takePicture();
      
      if (imageUri) {
        setCapturedImage(imageUri);
        setShowCamera(false);
        analyzeFoodImage(imageUri);
      } else {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImage = async () => {
    try {
      setIsProcessing(true);
      const imageUri = await cameraService.pickFromGallery();
      
      if (imageUri) {
        setCapturedImage(imageUri);
        analyzeFoodImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery.');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeFoodImage = async (imageUri: string) => {
    // Simulate food recognition API call
    // In production, this would send the image to your backend
    setTimeout(() => {
      // Mock detected foods
      setSelectedFoods(['apple', 'banana', 'carrot']);
    }, 1000);
  };

  const toggleFood = (foodId: string) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else {
      setSelectedFoods([...selectedFoods, foodId]);
    }
  };

  const saveMeal = () => {
    if (!mealType || selectedFoods.length === 0) {
      Alert.alert('Error', 'Please select a meal type and at least one food item.');
      return;
    }

    const mealData = {
      type: mealType,
      foods: selectedFoods,
      image: capturedImage,
      timestamp: new Date(),
    };

    // Save meal and navigate to success
    console.log('Saving meal:', mealData);
    Alert.alert('Success', 'Meal logged successfully!');
  };

  const renderCaptureOptions = () => (
    <View style={styles.captureOptions}>
      <TouchableOpacity 
        style={styles.captureOption}
        onPress={() => setShowCamera(true)}
        disabled={!hasPermission}
      >
        <Ionicons name="camera" size={32} color={colors.primary} />
        <Text style={styles.captureOptionText}>Take Photo</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.captureOption}
        onPress={pickImage}
      >
        <Ionicons name="images" size={32} color={colors.primary} />
        <Text style={styles.captureOptionText}>Choose from Gallery</Text>
      </TouchableOpacity>
    </View>
  );

  const renderImagePreview = () => (
    <View style={styles.imagePreview}>
      <Image source={{ uri: capturedImage! }} style={styles.previewImage} />
      <TouchableOpacity 
        style={styles.retakeButton}
        onPress={() => setCapturedImage(null)}
      >
        <Ionicons name="refresh" size={16} color={colors.text.inverse} />
        <Text style={styles.retakeText}>Retake</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFoodSelector = () => (
    <Modal 
      visible={showFoodSelector} 
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Foods</Text>
            <TouchableOpacity onPress={() => setShowFoodSelector(false)}>
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoryTabs}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.categoryTabActive
                ]}
                onPress={() => setActiveCategory(category.id as keyof typeof foods)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  activeCategory === category.id && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <ScrollView style={styles.foodGrid}>
            <View style={styles.foodGridContent}>
              {foods[activeCategory]?.map((food: Food) => (
                <TouchableOpacity
                  key={food.id}
                  style={[
                    styles.foodItem,
                    selectedFoods.includes(food.id) && styles.foodItemSelected
                  ]}
                  onPress={() => toggleFood(food.id)}
                >
                  <Text style={styles.foodIcon}>{food.icon}</Text>
                  <Text style={styles.foodName}>{food.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Log Your Meal</Text>
          <Text style={styles.headerSubtitle}>Track what your child ate</Text>
        </LinearGradient>

        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.mealTypeCard,
                  mealType === type.id && styles.mealTypeCardSelected
                ]}
                onPress={() => setMealType(type.id)}
              >
                <Text style={styles.mealTypeIcon}>{type.icon}</Text>
                <Text style={styles.mealTypeName}>{type.name}</Text>
                <Text style={styles.mealTypeTime}>{type.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Capture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Photo</Text>
          {!capturedImage ? (
            renderCaptureOptions()
          ) : (
            renderImagePreview()
          )}
        </View>

        {/* Selected Foods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selected Foods</Text>
            <TouchableOpacity onPress={() => setShowFoodSelector(true)}>
              <Text style={styles.addFoodText}>+ Add More</Text>
            </TouchableOpacity>
          </View>
          
          {selectedFoods.length > 0 ? (
            <View style={styles.selectedFoods}>
              {selectedFoods.map((foodId) => {
                const food = Object.values(foods).flat().find(f => f.id === foodId);
                return food ? (
                  <View key={foodId} style={styles.selectedFoodChip}>
                    <Text style={styles.selectedFoodName}>{food.name}</Text>
                    <TouchableOpacity onPress={() => toggleFood(foodId)}>
                      <Ionicons name="close" size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addFoodButton}
              onPress={() => setShowFoodSelector(true)}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
              <Text style={styles.addFoodText}>Add Foods</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Save Button */}
        <View style={styles.saveButton}>
          <Button
            title="Save Meal"
            onPress={saveMeal}
            disabled={!mealType || selectedFoods.length === 0 || isProcessing}
            loading={isProcessing}
          />
        </View>
      </ScrollView>

      {renderFoodSelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealTypeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  mealTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  mealTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  mealTypeTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  captureOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  captureOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  captureOptionText: {
    fontSize: 14,
    color: colors.text.primary,
    marginTop: 8,
    fontWeight: '500',
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retakeText: {
    color: colors.text.inverse,
    marginLeft: 8,
    fontWeight: '600',
  },
  selectedFoods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedFoodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFoodName: {
    fontSize: 14,
    color: colors.text.primary,
    marginRight: 8,
  },
  addFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addFoodText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 40,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  categoryTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryTab: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  categoryNameActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  foodGrid: {
    maxHeight: 300,
  },
  foodGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: {
    width: (width - 80) / 3,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  foodItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  foodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MealLoggingScreen; 