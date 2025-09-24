import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import { colors } from '../../constants/colors';
import { getFoodsByCategory } from '../../constants/foods';

const { width, height } = Dimensions.get('window');

// Move CameraView component outside the main component
const CameraView = ({ visible, onClose, onCapture, cameraRef }) => (
  <Modal visible={visible} animationType="slide">
    <View style={styles.cameraContainer}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type="back"
      >
        <View style={styles.cameraOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </Camera>
      
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Move FoodSelector component outside the main component
const FoodSelector = ({ 
  visible, 
  onClose, 
  categories, 
  activeCategory, 
  onCategoryChange, 
  selectedFoods, 
  onToggleFood,
  getFoodsByCategory 
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Foods</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryTabs}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  activeCategory === category.id && styles.categoryTabActive
                ]}
                onPress={() => onCategoryChange(category.id)}
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
        </ScrollView>

        <ScrollView style={styles.foodGrid} showsVerticalScrollIndicator={false}>
          <View style={styles.foodGridContent}>
            {getFoodsByCategory(activeCategory)?.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.foodItem,
                  selectedFoods.includes(food.id) && styles.foodItemSelected
                ]}
                onPress={() => onToggleFood(food.id)}
              >
                <Image 
                  source={food.image} 
                  style={styles.foodImage}
                  resizeMode="contain"
                />
                <Text style={styles.foodName}>{food.name}</Text>
                {selectedFoods.includes(food.id) && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Button
          title="Done"
          onPress={onClose}
          style={styles.modalButton}
        />
      </View>
    </View>
  </Modal>
);

const MealLoggingScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [mealType, setMealType] = useState('');
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [activeCategory, setActiveCategory] = useState('fruits');
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅', time: 'Morning' },
    { id: 'lunch', name: 'Lunch', icon: '☀️', time: 'Afternoon' },
    { id: 'snack', name: 'Snack', icon: '🍎', time: 'Anytime' },
    { id: 'dinner', name: 'Dinner', icon: '🌙', time: 'Evening' },
  ];

  const categories = [
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
    { id: 'proteins', name: 'Proteins', icon: '🍗' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'fats', name: 'Fats', icon: '🥑' },
  ];

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setShowCamera(false);
      // Here you would call your food recognition API
      analyzeFoodImage(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      analyzeFoodImage(result.assets[0].uri);
    }
  };

  const analyzeFoodImage = async (imageUri) => {
    // Simulate food recognition API call
    // In production, this would send the image to your backend
    setTimeout(() => {
      // Mock detected foods
      setSelectedFoods(['apple', 'banana', 'carrot']);
    }, 1000);
  };

  const toggleFood = (foodId) => {
    if (selectedFoods.includes(foodId)) {
      setSelectedFoods(selectedFoods.filter(id => id !== foodId));
    } else {
      setSelectedFoods([...selectedFoods, foodId]);
    }
  };

  const saveMeal = () => {
    if (!mealType || selectedFoods.length === 0) {
      // Show error
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
    if (navigation && navigation.navigate) {
      navigation.navigate('MealDetail', { meal: mealData });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.inverse} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Meal</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Meal Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What meal is this?</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.mealTypeCard,
                  mealType === type.id && styles.mealTypeCardActive
                ]}
                onPress={() => setMealType(type.id)}
              >
                <Text style={styles.mealTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.mealTypeName,
                  mealType === type.id && styles.mealTypeNameActive
                ]}>
                  {type.name}
                </Text>
                <Text style={[
                  styles.mealTypeTime,
                  mealType === type.id && styles.mealTypeTimeActive
                ]}>
                  {type.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Capture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Take a photo</Text>
          
          {capturedImage ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={() => setCapturedImage(null)}
              >
                <Ionicons name="camera" size={20} color={colors.text.inverse} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.captureOptions}>
              <TouchableOpacity
                style={styles.captureOption}
                onPress={() => setShowCamera(true)}
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
          )}
        </View>

        {/* Food Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What&apos;s in the meal?</Text>
            <TouchableOpacity onPress={() => setShowFoodSelector(true)}>
              <Text style={styles.addMoreText}>+ Add More</Text>
            </TouchableOpacity>
          </View>

          {selectedFoods.length > 0 ? (
            <View style={styles.selectedFoods}>
              {selectedFoods.map((foodId) => {
                const food = getFoodsByCategory(activeCategory)?.find(f => f.id === foodId);
                
                if (!food) return null;
                
                return (
                  <View key={food.id} style={styles.selectedFoodChip}>
                    <Text style={styles.selectedFoodName}>{food.name}</Text>
                    <TouchableOpacity onPress={() => toggleFood(food.id)}>
                      <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addFoodButton}
              onPress={() => setShowFoodSelector(true)}
            >
              <Ionicons name="add-circle" size={24} color={colors.primary} />
              <Text style={styles.addFoodText}>Add foods</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Save Button */}
        <Button
          title="Save Meal"
          onPress={saveMeal}
          style={styles.saveButton}
          disabled={!mealType || selectedFoods.length === 0}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      <CameraView
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={takePicture}
        cameraRef={cameraRef}
      />
      <FoodSelector
        visible={showFoodSelector}
        onClose={() => setShowFoodSelector(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(id) => setActiveCategory(id)}
        selectedFoods={selectedFoods}
        onToggleFood={toggleFood}
        getFoodsByCategory={getFoodsByCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  addMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mealTypeCardActive: {
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
  mealTypeNameActive: {
    color: colors.primary,
  },
  mealTypeTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  mealTypeTimeActive: {
    color: colors.primary,
  },
  captureOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captureOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 6,
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
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    padding: 3,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black',
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
    width: (width - 72) / 3,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  foodItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  foodName: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 20,
  },
});

export default MealLoggingScreen;