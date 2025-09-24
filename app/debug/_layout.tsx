import { Stack } from 'expo-router';

export default function DebugLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user-data" />
      <Stack.Screen name="reset" />
    </Stack>
  );
} 