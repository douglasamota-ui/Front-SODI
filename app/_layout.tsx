import { SplashScreen, Stack } from "expo-router";

export default function RootLayout() {

  SplashScreen.preventAutoHideAsync();

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}