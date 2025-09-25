import { ImageSourcePropType } from 'react-native';

// Map normalized food names to their static image requires
const foodImageMap: Record<string, ImageSourcePropType> = {
  // Vegetables
  asparagus: require('../assets/images/Food/Vegetable/asparagus.png'),
  beet: require('../assets/images/Food/Vegetable/beet.png'),
  broccoli: require('../assets/images/Food/Vegetable/broccoli.png'),
  bell_pepper: require('../assets/images/Food/Vegetable/bellpepper.png'),
  cabbage: require('../assets/images/Food/Vegetable/cabbage.png'),
  cauliflower: require('../assets/images/Food/Vegetable/cauliflower.png'),
  carrot: require('../assets/images/Food/Vegetable/carrot.png'),
  cucumber: require('../assets/images/Food/Vegetable/cucumber.png'),
  eggplant: require('../assets/images/Food/Vegetable/eggplant.png'),
  garlic: require('../assets/images/Food/Vegetable/garlic.png'),
  mushroom: require('../assets/images/Food/Vegetable/mushroom.png'),
  onion: require('../assets/images/Food/Vegetable/onion.png'),
  pepper: require('../assets/images/Food/Vegetable/pepper.png'),
  radish: require('../assets/images/Food/Vegetable/radish.png'),
  spinach: require('../assets/images/Food/Vegetable/spinach.png'),
  tomato: require('../assets/images/Food/Vegetable/tomato.png'),
  zucchini: require('../assets/images/Food/Vegetable/zucchini.png'),

  // Fruits
  apple: require('../assets/images/Food/Fruit/apple.png'),
  apricot: require('../assets/images/Food/Fruit/apricot.png'),
  banana: require('../assets/images/Food/Fruit/banana.png'),
  blueberry: require('../assets/images/Food/Fruit/blueberry.png'),
  blackberry: require('../assets/images/Food/Fruit/blackberry.png'),
  cantaloupe: require('../assets/images/Food/Fruit/cantaloupe.png'),
  cherry: require('../assets/images/Food/Fruit/cherry.png'),
  fig: require('../assets/images/Food/Fruit/fig.png'),
  grape: require('../assets/images/Food/Fruit/grape.png'),
  grapefruit: require('../assets/images/Food/Fruit/grapefruit.png'),
  kiwi: require('../assets/images/Food/Fruit/kiwi.png'),
  lemon: require('../assets/images/Food/Fruit/lemon.png'),
  lime: require('../assets/images/Food/Fruit/lime.png'),
  mango: require('../assets/images/Food/Fruit/mango.png'),
  nectarine: require('../assets/images/Food/Fruit/nectarine.png'),
  olive: require('../assets/images/Food/Fruit/olive.png'),
  papaya: require('../assets/images/Food/Fruit/papaya.png'),
  pomegranate: require('../assets/images/Food/Fruit/pomegranate.png'),
  peach: require('../assets/images/Food/Fruit/peach.png'),
  orange: require('../assets/images/Food/Fruit/orange.png'),
  plum: require('../assets/images/Food/Fruit/plum.png'),
  strawberry: require('../assets/images/Food/Fruit/strawberry.png'),
  pear: require('../assets/images/Food/Fruit/pear.png'),
  tangerine: require('../assets/images/Food/Fruit/tangerine.png'),
  watermelon: require('../assets/images/Food/Fruit/watermelon.png'),

  // Proteins
  chicken: require('../assets/images/Food/Protein/chicken.png'),
  egg: require('../assets/images/Food/Protein/egg.png'),
  fish: require('../assets/images/Food/Protein/fish.png'),
  pea: require('../assets/images/Food/Protein/pea.png'),
  beef: require('../assets/images/Food/Protein/beef.png'),
  tofu: require('../assets/images/Food/Protein/tofu.png'),

  // Carbohydrates
  rice: require('../assets/images/Food/Carbohydrate/rice.png'),
  pasta: require('../assets/images/Food/Carbohydrate/pasta.png'),
  butternut: require('../assets/images/Food/Carbohydrate/butternut.png'),
  corn: require('../assets/images/Food/Carbohydrate/corn.png'),
  pumpkin: require('../assets/images/Food/Carbohydrate/pumpkin.png'),
  oats: require('../assets/images/Food/Carbohydrate/oats.png'),
  quinoa: require('../assets/images/Food/Carbohydrate/quinoa.png'),
  sweet_potato: require('../assets/images/Food/Carbohydrate/sweetpotato.png'),

  // Dairy
  milk: require('../assets/images/Food/Dairy/milk.png'),
  cheese: require('../assets/images/Food/Dairy/cheese.png'),
  yogurt: require('../assets/images/Food/Dairy/yogurt.png'),
  cream: require('../assets/images/Food/Dairy/cream.png'),
  cottagecheese: require('../assets/images/Food/Dairy/cottagecheese.png'),
  ice_cream: require('../assets/images/Food/Dairy/icecream.png'),

  // Fats
  butter: require('../assets/images/Food/Fat/butter.png'),
  coconut: require('../assets/images/Food/Fat/coconut.png'),
  chocolate: require('../assets/images/Food/Fat/chocolate.png'),
  nut: require('../assets/images/Food/Fat/nut.png'),
  salmon: require('../assets/images/Food/Fat/salmon.png'),
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


