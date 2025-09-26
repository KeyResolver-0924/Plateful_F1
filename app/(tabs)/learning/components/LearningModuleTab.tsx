import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInUp,
  SlideInUp,
  SlideOutDown
} from "react-native-reanimated";
import Button from "../../../../components/common/Button";
import { colors } from "../../../../constants/colors";
import foodGuideData from "../../../../db/foods.json";
import { getFoodImageSource } from "../../../../utils/imageUtils";
import { getFoodVideoSource } from "../../../../utils/videoUtils";

const { width } = Dimensions.get("window");

interface NavigationProp {
  navigate: (screen: string) => void;
}

interface LearningModuleTabProps {
  navigation?: NavigationProp;
}

interface Module {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  description: string;
  action: string;
  color: string;
  gradient: string[];
  progress?: number;
  isUnlocked: boolean;
  category: string;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  nutrition: any;
  how_grown?: string[];
  how_produced?: string[];
  how_to_eat?: string[];
  quiz?: any;
  videoUrl?: string;
  key_facts?: string[];
}

interface VideoData {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  color: string;
  category: string;
  isPremium: boolean;
  videoSource: ReturnType<typeof require>;
  description: string;
  foodItems: string[];
}

const LearningModuleTab: React.FC<LearningModuleTabProps> = ({ navigation }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFoodDetails, setShowFoodDetails] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [videoSource, setVideoSource] = useState<any>(null);

  // Video sources are resolved in a shared utility to keep imports static

  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  // const modules: Module[] = [
  //   {
  //     id: "quiz",
  //     title: "Food Quest",
  //     icon: require("../../../../assets/images/characters/zicon (40).png"),
  //     description: "Embark on an exciting journey through food knowledge with interactive quizzes and challenges.",
  //     action: "Start Quest",
  //     color: colors.success,
  //     gradient: [colors.success, "#45A049"],
  //     progress: 75,
  //     isUnlocked: true,
  //     category: "interactive",
  //   },
  //   {
  //     id: "rewards",
  //     title: "Achievement Hall",
  //     icon: require("../../../../assets/images/characters/zicon (24).png"),
  //     description: "Celebrate your accomplishments and collect badges for your food knowledge mastery.",
  //     action: "View Achievements",
  //     color: colors.warning,
  //     gradient: [colors.warning, "#F57C00"],
  //     progress: 60,
  //     isUnlocked: true,
  //     category: "rewards",
  //   },
  //   {
  //     id: "learning",
  //     title: "Knowledge Library",
  //     icon: require("../../../../assets/images/characters/learn.png"),
  //     description: "Access comprehensive learning materials and educational content about healthy eating.",
  //     action: "Explore Library",
  //     color: colors.primary,
  //     gradient: [colors.primary, "#1976D2"],
  //     progress: 30,
  //     isUnlocked: true,
  //     category: "education",
  //   },
  //   {
  //     id: "challenges",
  //     title: "Daily Challenges",
  //     icon: require("../../../../assets/images/characters/fire.png"),
  //     description: "Take on daily food challenges to keep your knowledge fresh and earn bonus rewards.",
  //     action: "View Challenges",
  //     color: colors.error,
  //     gradient: [colors.error, "#C2185B"],
  //     progress: 0,
  //     isUnlocked: true,
  //     category: "challenges",
  //   },
  // ];

  // Generate videos from food data
  const generateVideosFromFoods = (): VideoData[] => {
    const videos: VideoData[] = [];
    
    // Fruits video
    const fruits = foodGuideData.categories?.fruits?.foods ? Object.keys(foodGuideData.categories.fruits.foods).slice(0, 5) : [];
    // videos.push({
    //   id: "fruits",
    //   title: "Fruits & Berries",
    //   duration: "8 Min",
    //   thumbnail: "🍓",
    //   color: "#FF6B6B",
    //   category: "Nutrition Basics",
    //   isPremium: false,
    //   videoSource: require("../../../../assets/videos/fruits.mp4"),
    //   description: "Learn about different types of fruits and their nutritional benefits",
    //   foodItems: fruits,
    // });

    // // Vegetables video
    // const vegetables = foodGuideData.categories?.vegetables?.foods ? Object.keys(foodGuideData.categories.vegetables.foods).slice(0, 5) : [];
    // videos.push({
    //   id: "vegetables",
    //   title: "Veggie Power",
    //   duration: "10 Min",
    //   thumbnail: "🥦",
    //   color: "#4CAF50",
    //   category: "Plant Nutrition",
    //   isPremium: false,
    //   videoSource: require("../../../../assets/videos/vegetables.mp4"),
    //   description: "Discover the amazing world of vegetables and their health benefits",
    //   foodItems: vegetables,
    // });

    // // Proteins video
    // const proteins = foodGuideData.categories?.proteins?.foods ? Object.keys(foodGuideData.categories.proteins.foods).slice(0, 5) : [];
    // videos.push({
    //   id: "proteins",
    //   title: "Protein Power",
    //   duration: "12 Min",
    //   thumbnail: "🥩",
    //   color: "#45B7D1",
    //   category: "Building Blocks",
    //   isPremium: true,
    //   videoSource: require("../../../../assets/videos/proteins.mp4"),
    //   description: "Understanding protein sources and their importance",
    //   foodItems: proteins,
    // });

    // // Dairy video
    // videos.push({
    //   id: "dairy",
    //   title: "Dairy Delights",
    //   duration: "9 Min",
    //   thumbnail: "🥛",
    //   color: "#9C27B0",
    //   category: "Calcium & Vitamins",
    //   isPremium: true,
    //   videoSource: require("../../../../assets/videos/dairy.mp4"),
    //   description: "Learn about dairy products and their nutritional value",
    //   foodItems: ["milk", "cheese", "yogurt"],
    // });

    return videos;
  };

  const videos = generateVideosFromFoods();

  // Get all foods from the JSON data
  const getAllFoods = (): FoodItem[] => {
    const foods: FoodItem[] = [];
    
    // Add vegetables
    if (foodGuideData.categories?.vegetables?.foods) {
      Object.keys(foodGuideData.categories.vegetables.foods).forEach(vegName => {
        const vegData = foodGuideData.categories.vegetables.foods[vegName as keyof typeof foodGuideData.categories.vegetables.foods];
        foods.push({
          id: vegName,
          name: vegData.name || vegName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'vegetables',
          description: vegData.learning?.summary || '',
          image: '',
          nutrition: (vegData as any).nutrition_per_medium || (vegData as any).nutrition_per_cup,
          how_grown: (vegData as any).how_grown,
          how_to_eat: (vegData as any).how_to_eat,
          quiz: vegData.quiz,
          key_facts: vegData.learning?.key_facts || [],
        });
      });
    }
    // Add fruits
    if (foodGuideData.categories?.fruits?.foods) {
      Object.keys(foodGuideData.categories.fruits.foods).forEach(fruitName => {
        const fruitData = foodGuideData.categories.fruits.foods[fruitName as keyof typeof foodGuideData.categories.fruits.foods];
        foods.push({
          id: fruitName,
          name: fruitData.name || fruitName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'fruits',
          description: fruitData.learning?.summary || '',
          image: '',
          nutrition: (fruitData as any).nutrition_per_medium || (fruitData as any).nutrition_per_cup,
          how_grown: (fruitData as any).how_grown,
          how_to_eat: (fruitData as any).how_to_eat,
          quiz: fruitData.quiz,
          key_facts: fruitData.learning?.key_facts || [],
        });
      });
    }
    // Add carbohydrates
    if (foodGuideData.categories?.carbohydrates?.foods) {
      Object.keys(foodGuideData.categories.carbohydrates.foods).forEach(carbohydrateName => {
        const carbohydrateData = foodGuideData.categories.carbohydrates.foods[carbohydrateName as keyof typeof foodGuideData.categories.carbohydrates.foods];
        foods.push({
          id: carbohydrateName,
          name: carbohydrateData.name || carbohydrateName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'carbohydrates',
          description: carbohydrateData.learning?.summary || '',
          image: '',
          nutrition: (carbohydrateData as any).nutrition_per_medium || (carbohydrateData as any).nutrition_per_cup,
          how_grown: (carbohydrateData as any).how_grown,
          how_to_eat: (carbohydrateData as any).how_to_eat,
          quiz: carbohydrateData.quiz,
          key_facts: carbohydrateData.learning?.key_facts || [],
        });
      });
    }
    // Add proteins
    if (foodGuideData.categories?.proteins?.foods) {
      Object.keys(foodGuideData.categories.proteins.foods).forEach(proteinName => {
        const proteinData = foodGuideData.categories.proteins.foods[proteinName as keyof typeof foodGuideData.categories.proteins.foods];
        foods.push({
          id: proteinName,
          name: proteinData.name || proteinName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'proteins',
          description: proteinData.learning?.summary || '',
          image: '',
          nutrition: (proteinData as any).nutrition_per_3oz || (proteinData as any).nutrition_per_cup || (proteinData as any).nutrition_per_large_egg || (proteinData as any).nutrition_per_ounce,
          how_grown: undefined,
          how_produced: (proteinData as any).how_produced,
          how_to_eat: (proteinData as any).how_to_eat,
          quiz: proteinData.quiz,
          key_facts: proteinData.learning?.key_facts || [],
        });
      });
    }
    // Add fats
    if (foodGuideData.categories?.fats?.foods) {
      Object.keys(foodGuideData.categories.fats.foods).forEach(fatName => {
        const fatData = foodGuideData.categories.fats.foods[fatName as keyof typeof foodGuideData.categories.fats.foods];
        foods.push({
          id: fatName,
          name: fatData.name || fatName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'fats',
          description: fatData.learning?.summary || '',
          image: '',
          nutrition: (fatData as any).nutrition_per_medium || (fatData as any).nutrition_per_cup,
          how_grown: (fatData as any).how_grown,
          how_to_eat: (fatData as any).how_to_eat,
          quiz: fatData.quiz,
          key_facts: fatData.learning?.key_facts || [],
        });
      });
    }
    // Add dairy
    if (foodGuideData.categories?.dairy?.foods) {
      Object.keys(foodGuideData.categories.dairy.foods).forEach(dairyName => {
        const dairyData = foodGuideData.categories.dairy.foods[dairyName as keyof typeof foodGuideData.categories.dairy.foods];
        foods.push({
          id: dairyName,
          name: dairyData.name || dairyName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          category: 'dairy',
          description: dairyData.learning?.summary || '',
          image: '',
          nutrition: (dairyData as any).nutrition_per_medium || (dairyData as any).nutrition_per_cup,
          how_grown: (dairyData as any).how_grown,
          how_to_eat: (dairyData as any).how_to_eat,
          quiz: dairyData.quiz,
          key_facts: dairyData.learning?.key_facts || [],
        });
      });
    }

    return foods;
  };

  const foods = getAllFoods();
  const filteredFoods = foods.filter(food => {
    if (selectedCategory === 'all') return true;
    return food.category === selectedCategory;
  });

  const handleModulePress = (module: Module): void => {
    if (!module.isUnlocked) {
      Alert.alert(
        "Locked Module",
        "Complete earlier lessons or upgrade to unlock this module."
      );
      return;
    }
    
    if (module.id === "quiz" && navigation) {
      navigation.navigate("Quiz");
    } else if (module.id === "learning") {
      setSelectedCategory('all');
    } else {
      setSelectedModule(module);
      setShowSuccessModal(true);
    }
  };

  const handleVideoPress = (video: VideoData): void => {
    setSelectedVideo(video);
    setVideoSource(video.videoSource as any);
    setShowVideoModal(true);
  };

  const handleFoodPress = (food: FoodItem): void => {
    setSelectedFood(food);
    setShowFoodDetails(true);
  };

  // Play food video using path from foods.json
  const handlePlayFoodVideo = (food: FoodItem): void => {
    try {
      const categoryKey = food.category as keyof typeof foodGuideData.categories;
      const categoryObj = foodGuideData.categories?.[categoryKey] as any;
      const videoPath: string | undefined = categoryObj?.foods?.[food.id]?.video;
      if (!videoPath) {
        Alert.alert('No Video', 'Video not available for this food.');
        return;
      }
      // Resolve via shared video utils
      const normalized = videoPath.replace(/^\.\/+/, '');
      const requiredSource = getFoodVideoSource(normalized);
      if (!requiredSource) {
        Alert.alert('No Video', 'Video asset not found for this food.');
        return;
      }
      setSelectedVideo({
        id: food.id,
        title: food.name,
        duration: '',
        thumbnail: '',
        color: colors.primary,
        category: food.category,
        isPremium: false,
        videoSource: requiredSource,
        description: '',
        foodItems: [],
      });
      setVideoSource(requiredSource as any);
      setShowVideoModal(true);
    } catch (e) {
      Alert.alert('Playback Error', 'Could not load the video for this food.');
    }
  };

  const getFoodImage = (foodName: string) => {
    return getFoodImageSource(foodName);
  };

  const SuccessModal = () => (
    <Modal transparent visible={showSuccessModal} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInUp.springify()}
          exiting={SlideOutDown}
          style={styles.successModal}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuccessModal(false)}
          >
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Image
            source={
              selectedModule?.icon ||
              require("../../../../assets/images/characters/zicon (26).png")
            }
            style={styles.successEmoji}
          />
          <Text style={styles.successTitle}>
            {selectedModule?.title} Unlocked!
          </Text>
          <Text style={styles.successDescription}>
            {selectedModule?.description}
          </Text>
          <Button
            title="Continue Learning"
            onPress={() => setShowSuccessModal(false)}
          />
        </Animated.View>
      </View>
    </Modal>
  );

  const VideoModal = () => (
    <Modal transparent={false} visible={showVideoModal} animationType="slide">
      <SafeAreaView style={styles.videoModalContainer}>
        <View style={styles.videoModalHeader}>
          <TouchableOpacity
            onPress={() => setShowVideoModal(false)}
            style={styles.closeVideoButton}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.videoModalTitle}>{selectedVideo?.title}</Text>
        </View>
        {selectedVideo && (
          <View style={styles.videoContainer}>
            <VideoView 
              style={styles.video} 
              player={player} 
              allowsFullscreen 
              allowsPictureInPicture 
            />
          </View>
        )}
        {selectedVideo && (
          <View style={styles.videoModalInfo}>
            <Text style={styles.videoInfoTitle}>Featured Foods:</Text>
            <View style={styles.featuredFoods}>
              {selectedVideo.foodItems.map((foodName, index) => (
                <View key={index} style={styles.featuredFoodItem}>
                  <Image source={getFoodImage(foodName)} style={styles.featuredFoodImage} />
                  <Text style={styles.featuredFoodName}>
                    {foodName.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );

  const FoodDetailsModal = () => (
    <Modal transparent visible={showFoodDetails} animationType="slide">
      <SafeAreaView style={styles.foodDetailsContainer}>
        <View style={styles.foodDetailsHeader}>
          <TouchableOpacity
            onPress={() => setShowFoodDetails(false)}
            style={styles.closeFoodButton}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.foodDetailsTitle}>Food Details</Text>
        </View>
        {selectedFood && (
          <ScrollView style={styles.foodDetailsContent}>
            <TouchableOpacity onPress={() => handlePlayFoodVideo(selectedFood)} activeOpacity={0.8}>
              <Image source={getFoodImage(selectedFood.id)} style={styles.foodDetailImage} />
            </TouchableOpacity>
            <Text style={styles.foodDetailName}>{selectedFood.name}</Text>
            <Text style={styles.foodDetailDescription}>{selectedFood.description}</Text>
            
            {/* Key Facts Section */}
            {selectedFood.key_facts && selectedFood.key_facts.length > 0 && (
              <View style={styles.keyFactsSection}>
                <Text style={styles.sectionHeader}>Key Facts</Text>
                {selectedFood.key_facts.map((fact, index) => (
                  <Text key={index} style={styles.keyFactText}>• {fact}</Text>
                ))}
              </View>
            )}
            
            {selectedFood.nutrition && (
              <View style={styles.nutritionSection}>
                <Text style={styles.sectionHeader}>Nutrition Facts</Text>
                {selectedFood.nutrition.carbohydrates && (
                  <Text style={styles.nutritionText}>🍞 {selectedFood.nutrition.carbohydrates}</Text>
                )}
                {selectedFood.nutrition.protein && (
                  <Text style={styles.nutritionText}>🥩 {selectedFood.nutrition.protein}</Text>
                )}
                {selectedFood.nutrition.fat && (
                  <Text style={styles.nutritionText}>🥑 {selectedFood.nutrition.fat}</Text>
                )}
              </View>
            )}

            {(selectedFood.how_grown || selectedFood.how_produced) && (
              <View style={styles.howSection}>
                <Text style={styles.sectionHeader}>
                  {selectedFood.how_grown ? "How It's Grown" : "How It's Produced"}
                </Text>
                {(selectedFood.how_grown || selectedFood.how_produced)?.map((step, index) => (
                  <Text key={index} style={styles.stepText}>• {step}</Text>
                ))}
              </View>
            )}

            {selectedFood.how_to_eat && (
              <View style={styles.howSection}>
                <Text style={styles.sectionHeader}>How to Eat</Text>
                {selectedFood.how_to_eat.map((method, index) => (
                  <Text key={index} style={styles.stepText}>• {method}</Text>
                ))}
              </View>
            )}

            {selectedFood.quiz && (
              <View style={styles.quizSection}>
                <Text style={styles.sectionHeader}>Quick Quiz</Text>
                <Text style={styles.quizInfo}>
                  This food has {(selectedFood.quiz as any).questions?.length || 0} quiz questions available!
                </Text>
                <Button
                  title="Take Quiz"
                  onPress={() => {
                    setShowFoodDetails(false);
                    // Navigate to quiz when implemented
                    Alert.alert("Coming Soon", "Quiz functionality will be available soon!");
                  }}
                />
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>

      {/* <Animated.View entering={FadeInUp.delay(300)}>
        <Text style={styles.sectionTitle}>Learning Videos</Text>
        <Text style={styles.sectionSubtitle}>
          Watch educational videos about different food categories
        </Text>
      </Animated.View>

      {videos.map((v, i) => (
        <Animated.View
          key={v.id}
          entering={FadeInLeft.delay(i * 150).springify()}
          style={[styles.videoCard, { backgroundColor: v.color }]}
        >
          <TouchableOpacity onPress={() => handleVideoPress(v)}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoThumbnail}>{v.thumbnail}</Text>
              <View style={styles.videoInfo}>
                <Text style={styles.videoCategory}>{v.category}</Text>
                <Text style={styles.videoTitle}>{v.title}</Text>
                <Text style={styles.videoDescription}>{v.description}</Text>
                <Text style={styles.videoDuration}>{v.duration}</Text>
              </View>
              {v.isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={16} color="gold" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))} */}

      <Animated.View entering={FadeInUp.delay(400)}>
        <Text style={styles.sectionTitle}>Food Knowledge Library</Text>
        <Text style={styles.sectionSubtitle}>
          Explore detailed information about different foods
        </Text>
      </Animated.View>

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
            style={[styles.categoryButton, selectedCategory === 'vegetables' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('vegetables')}
          >
            <Text style={[styles.categoryText, selectedCategory === 'vegetables' && styles.categoryTextActive]}>
              Vegetables
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
            style={[styles.categoryButton, selectedCategory === 'proteins' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('proteins')}
          >
            <Text style={[styles.categoryText, selectedCategory === 'proteins' && styles.categoryTextActive]}>
              Proteins
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'carbohydrates' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('carbohydrates')}
          >
            <Text style={[styles.categoryText, selectedCategory === 'carbohydrates' && styles.categoryTextActive]}>
              Carbohydrates
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'dairy' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('dairy')}
          >
            <Text style={[styles.categoryText, selectedCategory === 'dairy' && styles.categoryTextActive]}>
              Dairy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === 'fats' && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory('fats')}
          >
            <Text style={[styles.categoryText, selectedCategory === 'fats' && styles.categoryTextActive]}>
              Fats
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>

      <View style={styles.foodList}>
        {filteredFoods.slice(0, 10).map((food, i) => (
          <Animated.View
            key={food.id}
            entering={FadeInUp.delay(i * 50).springify()}
          >
            <TouchableOpacity
              style={styles.foodItem}
              onPress={() => handleFoodPress(food)}
              activeOpacity={0.7}
            >
              <Image source={getFoodImage(food.id)} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDescription} numberOfLines={2}>
                  {food.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        {filteredFoods.length > 10 && (
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View All {filteredFoods.length} Foods</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <SuccessModal />
      <VideoModal />
      <FoodDetailsModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: { fontSize: 24, fontWeight: "bold", color: colors.text.primary},
  sectionSubtitle: { fontSize: 16, color: colors.text.secondary, marginTop: 5, marginBottom: 15 },
  modulesGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 12, 
    marginTop: 20,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  moduleCardContainer: { 
    width: width > 400 ? (width - 56) / 2 : width - 32,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleCard: {
    backgroundColor: colors.background2,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 200,
  },
  lockedModuleCard: { opacity: 0.6 },
  lockedText: { color: "#999" },
  moduleEmoji: { width: 64, height: 64, marginBottom: 8 },
  moduleTitle: { fontWeight: "bold", fontSize: 16, textAlign: "center", marginBottom: 8 },
  moduleDescription: { fontSize: 13, textAlign: "center", marginBottom: 12, lineHeight: 18 },
  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
    width: "100%",
  },
  videoCard: { 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoThumbnail: {
    fontSize: 32,
    marginRight: 12,
  },
  videoInfo: {
    flex: 1,
  },
  videoCategory: { color: "white", fontWeight: "600", fontSize: 12, opacity: 0.8 },
  videoTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginVertical: 4 },
  videoDescription: { color: "white", opacity: 0.9, fontSize: 14, lineHeight: 18 },
  videoDuration: { color: "white", opacity: 0.7, fontSize: 12, marginTop: 4 },
  premiumBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 4,
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTextActive: {
    color: "white",
  },
  foodList: {
    marginBottom: 20,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 15,
    marginTop: 10,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  successModal: { 
    backgroundColor: colors.background, 
    padding: 24, 
    borderRadius: 16,
    maxWidth: width * 0.8,
  },
  successEmoji: { width: 80, height: 80, marginBottom: 16, alignSelf: "center" },
  successTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  successDescription: { textAlign: "center", marginBottom: 16, lineHeight: 22 },
  closeButton: { position: "absolute", right: 8, top: 8, zIndex: 1 },
  videoModalContainer: { 
    flex: 1, 
    backgroundColor: "black",
    justifyContent: 'space-between',
  },
  videoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  closeVideoButton: { 
    padding: 8, 
    backgroundColor: "rgba(255,255,255,0.2)", 
    borderRadius: 20 
  },
  videoModalTitle: { color: "white", fontSize: 18, flex: 1, textAlign: "center" },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  video: {
    width: "100%",
    height: "100%",
    alignSelf: 'center',
    borderRadius: 8,
  },
  videoPlayer: {
    paddingLeft: 10,
    flex: 1,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  videoModalInfo: {
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  videoInfoTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  featuredFoods: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featuredFoodItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 8,
    minWidth: 30,
  },
  featuredFoodImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginBottom: 4,
  },
  featuredFoodName: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  foodDetailsContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  foodDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primary,
    justifyContent: "space-between",
  },
  closeFoodButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  foodDetailsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  foodDetailsContent: {
    flex: 1,
    padding: 20,
  },
  foodDetailImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
    alignSelf: "center",
    marginBottom: 16,
  },
  foodDetailName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  foodDetailDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  keyFactsSection: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  keyFactText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    lineHeight: 22,
  },
  nutritionSection: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  nutritionText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  howSection: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    lineHeight: 22,
  },
  quizSection: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  quizInfo: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
    textAlign: "center",
  },
});

export default LearningModuleTab;
