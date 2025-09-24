import { ImageSourcePropType } from 'react-native';

// Avatar mapping for predefined avatars (static require statements)
export const avatarMap: { [key: string]: any } = {
  'boy': require('../assets/images/avatars/boy.png'),
  'girl': require('../assets/images/avatars/girl.png'),
  'user': require('../assets/images/avatars/user.jpg'),
};

// Helper function to get avatar source safely
export const getAvatarSource = (child: any, avatarLoadErrors: Set<string> = new Set()): ImageSourcePropType => {
  try {
    // If avatar failed to load before, use fallback
    if (avatarLoadErrors.has(child.id)) {
      return avatarMap.boy;
    }
    
    if (child.avatar && typeof child.avatar === 'string') {
      // If avatar is a backend filename (e.g., "86bc4690-5d7b-4d4c-98b0-1401b680908a.jpeg")
      if (child.avatar.includes('.') && !child.avatar.startsWith('http')) {
        const avatarUri = `http://plateful.info//uploads/avatars/${child.avatar}`;
        return { uri: avatarUri };
      }
      // If avatar is already a full URL
      if (child.avatar.startsWith('http')) {
        return { uri: child.avatar };
      }
      // If avatar is a predefined option like 'boy' or 'girl'
      if (avatarMap[child.avatar]) {
        return avatarMap[child.avatar];
      }
      // Default fallback for unknown string format
      return avatarMap.boy;
    } else if (child.avatar && typeof child.avatar === 'number') {
      // If avatar is a require() result
      return child.avatar;
    } else {
      // Default fallback avatar
      return avatarMap.boy;
    }
  } catch (error) {
    console.error(`Error in getAvatarSource for child ${child.id}:`, error);
    return avatarMap.boy;
  }
};

export default getAvatarSource;
