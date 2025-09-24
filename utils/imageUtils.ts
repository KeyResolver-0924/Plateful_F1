import { ImageSourcePropType } from 'react-native';

// Map normalized food names to their static image requires
const foodImageMap: Record<string, ImageSourcePropType> = {
  // Fruits
  apple: require('../assets/images/foods/apple.png'),
  pear: require('../assets/images/foods/pear.png'),
  banana: require('../assets/images/foods/banana.png'),
  orange: require('../assets/images/foods/orange.png'),
  pineapple: require('../assets/images/foods/pineapple.png'),
  strawberry: require('../assets/images/foods/strawberry.png'),
  grapes: require('../assets/images/foods/grapes.png'),
  watermelon: require('../assets/images/foods/watermelon.png'),
  mango: require('../assets/images/foods/mango.png'),
  peach: require('../assets/images/foods/peach.png'),
  apricot: require('../assets/images/foods/peach.png'), // fallback if apricot asset is missing

  // Vegetables
  carrot: require('../assets/images/foods/carrot.png'),
  carrots: require('../assets/images/foods/carrot.png'),
  broccoli: require('../assets/images/foods/broccoli.png'),
  sweetpotato: require('../assets/images/foods/sweetpotato.png'),
  sweet_potato: require('../assets/images/foods/sweetpotato.png'),
  peas: require('../assets/images/foods/peas.png'),
  corn: require('../assets/images/foods/corn.png'),
  cucumber: require('../assets/images/foods/cucumber.png'),
  bellpepper: require('../assets/images/foods/bellpepper.png'),
  bell_pepper: require('../assets/images/foods/bellpepper.png'),
  bell_peppers: require('../assets/images/foods/bellpepper.png'),
  spinach: require('../assets/images/foods/spinach.png'),
  tomato: require('../assets/images/foods/tomato.png'),

  // Proteins
  chicken: require('../assets/images/foods/chicken.png'),
  fish: require('../assets/images/foods/fish.png'),
  egg: require('../assets/images/foods/egg.png'),
  eggs: require('../assets/images/foods/eggs.png'),
  beans: require('../assets/images/foods/beans.png'),
  lentils: require('../assets/images/foods/lentils.png'),
  tofu: require('../assets/images/foods/tofu.png'),
  lean_beef: require('../assets/images/foods/beef.png'),
  beef: require('../assets/images/foods/beef.png'),
  turkey: require('../assets/images/foods/turkey.png'),
  nuts: require('../assets/images/foods/nuts.png'),
};

const fallbackImage: ImageSourcePropType = require('../assets/images/foods/box.png');

const normalizeFoodName = (name: string): string => {
  const lowered = (name || '').toLowerCase().trim();
  // keep underscores if provided by JSON, remove extra spaces/hyphens
  const normalized = lowered
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');
  return normalized;
};

export const getFoodImageSource = (foodName: string): ImageSourcePropType => {
  const key = normalizeFoodName(foodName);
  return foodImageMap[key] || fallbackImage;
};

export default getFoodImageSource;


