import { Stack } from 'expo-router';
export default function ProfileModuleLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
} 