import SplashBackground from "@/src/components/Splash/SplashBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [appReady, setAppReady] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const onLayoutRootView = useCallback(async () => {
    if (!appReady) {
      setAppReady(true);
      await ExpoSplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    Animated.timing(progress, {
      toValue: 0.85,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    if (!isLoading) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        if (user) {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      });
    }
  }, [isLoading, user, appReady, router]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SplashBackground />

      <Image
        source={require("@/assets/logo-full.png")}
        style={styles.logoFull}
        resizeMode="contain"
      />

      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: barWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#31358B",
    justifyContent: "center",
    alignItems: "center",
  },
  logoFull: {
    width: 260,
    height: 260,
    marginBottom: 3,
  },

  progressBarContainer: {
    width: 180,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
});
