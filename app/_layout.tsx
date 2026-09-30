import "@react-native-firebase/app";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { FiltersProvider } from "@/src/contexts/FiltersContext";
import { setAlertCallback } from "@/src/services/alert.service";
import { setRouter } from "@/src/services/navigation";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const router = useRouter();
  const [alert, setAlert] = useState({
    visible: false,
    type: "info" as "error" | "success" | "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    setRouter(router);
    setAlertCallback((data) => {
      setAlert({ ...data, visible: true });
    });
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <FiltersProvider>
            <StatusBar
              style="light"
              backgroundColor="transparent"
              translucent
            />
            <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="home" />
            </Stack>

            <LudusAlert
              visible={alert.visible}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
            />
          </FiltersProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
