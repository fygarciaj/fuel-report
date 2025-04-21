import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  PaperProvider,
  MD3LightTheme as LightTheme,
  MD3DarkTheme as DarkTheme,
} from "react-native-paper";
import i18next from "../services/i18next";
import { I18nextProvider } from "react-i18next";
import "react-native-get-random-values";
import LoginScreen from "../components/Auth/LoginScreen"; // Import the LoginScreen
import { useUserStore } from "../services/userStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const theme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <I18nextProvider i18n={i18next}>
          <PaperProvider theme={theme}>
            <Stack>
              <Stack.Screen
                name="auth/login"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </PaperProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18next}>
        <PaperProvider theme={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
