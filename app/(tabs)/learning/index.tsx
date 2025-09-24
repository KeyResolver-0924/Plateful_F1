import { Redirect } from 'expo-router';

export default function LearningIndex() {
  // Redirect to the learning screen by default
  return <Redirect href="/learning/learning" />;
} 