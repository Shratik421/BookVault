import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../component/SafeScreen";
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';
import { useAuthStore } from "../store/authStore";
import { useState, useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

    const [appReady, setAppReady] = useState(false);

      useEffect(() => {
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (!appReady) return;
    checkAuth();
  }, [appReady]);

  //handle navigation based on auth state
   useEffect(() => {
    if (!appReady) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = !!user && !!token;

    // Prevent undefined routes early
    if (!segments || segments.length === 0) return;

    if (!isSignedIn && !inAuthScreen) {
      // Delay routing until after layout is mounted
      setTimeout(() => router.replace("/(auth)"), 0);
    }

    if (isSignedIn && inAuthScreen) {
      setTimeout(() => router.replace("/(tabs)"), 0);
    }
  }, [appReady, user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
        <Toast />
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>

  );
}
