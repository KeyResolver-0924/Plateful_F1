import { Stack } from 'expo-router';
export default function ReportingLayout() {
  return (
    <Stack>
      <Stack.Screen name="report" options={{ headerShown: false }} />
    </Stack>
  );
} 