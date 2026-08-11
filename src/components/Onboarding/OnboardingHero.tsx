import { api } from "@/src/services/api";
import { getOnboardingGames } from "@/src/services/ludopedia";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

export function OnboardingHero() {
  const [game, setGame] = useState<any>(null);
  const { height } = useWindowDimensions();
  
  
  const CIRCLE_SIZE = height < 700 ? 285 : 365;
  
  
  const MARGIN_TOP = height < 700 ? 60 : 130; 

  const PLACEHODER_IMAGE = "https://image.api.playstation.com/vulcan/ap/rnd/202209/2812/jm8wDLnosb3D8W6TUuLGa4jz.jpg"

  useEffect(() => {
    async function loadRandomGame() {
      try {
        const response = await api.get("/games")
        const games = response.data
        if(games.length > 0) {
          const randomIndex = Math.floor(Math.random() * games.length);
          setGame(games[randomIndex])
        }
      } catch (error) {
        console.error(error);
      }
      
      const games = await getOnboardingGames();
      const randomIndex = Math.floor(Math.random() * games.length);
      setGame(games[randomIndex]);
    }
    loadRandomGame();
  }, []);

  if (!game) return null; 

  return (
    <View style={[styles.container, { marginTop: MARGIN_TOP }]}>
      <View style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 }]}>
        <Image source={{ uri: game.image || PLACEHODER_IMAGE }} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  circle: {
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});