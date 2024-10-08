import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
  } from "@react-navigation/native";
  import { useFonts } from "expo-font";
  import { Stack } from "expo-router";
  import * as SplashScreen from "expo-splash-screen";
  import { useEffect } from "react";
  import "react-native-reanimated";
  
  import { useColorScheme } from "@/hooks/useColorScheme";
  
  // Prevent the splash screen from auto-hiding before asset loading is complete.
  SplashScreen.preventAutoHideAsync();
  
  export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded, error] = useFonts({
        'Outfit': require("../assets/fonts/Outfit.ttf"),
      });
  
    useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);
  
    if (!loaded && !error) {
      return null;
    }
  
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen options={{ headerShown: false }} name="index" />
          <Stack.Screen options={{ title: "Oops!" }} name="+not-found" />
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation:"none" }} />
          <Stack.Screen name="(root)" options={{ headerShown: false, animation:"none"  }} />
          
        </Stack>
      </ThemeProvider>
    );
  }
  