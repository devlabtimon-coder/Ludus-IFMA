import SplashBackground from "@/src/components/Splash/SplashBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import { styles } from "@/src/screens/Splash/styles";
import { useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function SplashScreen() {
  const router = useRouter();

  const { user, isLoading } = useAuth();

  const [appReady, setAppReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const fullOpacity = useRef(new Animated.Value(1)).current;
  const fullScale = useRef(new Animated.Value(1)).current;
  const diceOpacity = useRef(new Animated.Value(0)).current;
  const diceScale = useRef(new Animated.Value(0.75)).current;

  const onLayoutRootView = useCallback(async () => {
    if (!appReady) {
      setAppReady(true);
      await ExpoSplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    if (!appReady) return;

    Animated.sequence([
      Animated.delay(600),

      Animated.parallel([
        Animated.timing(fullOpacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fullScale, {
          toValue: 0.92,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(diceOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(diceScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        setAnimationFinished(true);
      }, 400);
    });
  }, [appReady]);

  useEffect(() => {
    if (animationFinished && !isLoading) {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [animationFinished, isLoading, user, router]);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SplashBackground />

      <Animated.Image
        source={require("@/assets/logo-full.png")}
        style={[
          styles.logoFull,
          { opacity: fullOpacity, transform: [{ scale: fullScale }] },
        ]}
        resizeMode="contain"
      />

      <Animated.Image
        source={require("@/assets/logo-dice.png")}
        style={[
          styles.logoDice,
          {
            position: "absolute",
            opacity: diceOpacity,
            transform: [{ scale: diceScale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}
