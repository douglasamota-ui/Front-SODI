import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {

  //Chamando a splashScreen para carregar no momento certo
  SplashScreen.preventAutoHideAsync();

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}