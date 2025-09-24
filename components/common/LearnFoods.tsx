import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors } from '../../constants/colors';

export interface FoodData {
  summary: string;
  key_facts: string[];
}

interface LearnFoodsProps {
  imageSource: ImageSourcePropType;
  data: FoodData;
  onBack?: () => void;
}

const LearnFoods: React.FC<LearnFoodsProps> = ({ imageSource, data, onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => (onBack ? onBack() : router.back())}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Learn</Text>
        
        <View style={styles.tomatoCharacter}>
          <Image source={imageSource} style={styles.tomatoImage} />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Image source={imageSource} style={{ width: 30, height: 30, marginRight: 10 }} />
              <Text style={styles.sectionTitle}>About This Food</Text>
            </View>
            <Text style={styles.sectionText}>{data.summary}</Text>
          </View>

          {/* Key Facts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⭐</Text>
              <Text style={styles.sectionTitle}>Key Facts</Text>
            </View>
            <View style={styles.factsList}>
              {data.key_facts.map((fact, index) => (
                <View key={`fact-${index}`} style={styles.factItem}>
                  <Text style={styles.factBullet}>•</Text>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,// Orange background like in the image
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
  tomatoCharacter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tomatoImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  factsList: {
    marginBottom: 12,
  },
  factItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  factBullet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginRight: 8,
    minWidth: 20,
  },
  factText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    flex: 1,
  },
});

export default LearnFoods;