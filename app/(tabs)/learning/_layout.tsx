import { Stack } from 'expo-router';
export default function LearningModuleLayout() {
  return (
    <Stack>
      <Stack.Screen name="learning" options={{ headerShown: false }} />
    </Stack>
  );
} 