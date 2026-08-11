import { api } from "@/src/services/api";
import { useEffect, useRef, useState } from "react";
import {
  Animated, // Trocamos Dimensions por useWindowDimensions
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

interface Game {
  id: string;
  title: string;
  cover: string;
}

export function OnboardingCarousel() {
  const [games, setGames] = useState<Game[]>([]);
  const scrolX = useRef(new Animated.Value(0)).current;

  // Pegamos as dimensões exatas e em tempo real do celular
  const { width, height } = useWindowDimensions();

  // Regra de Ouro: Se a tela for pequena (ex: iPhone SE), o círculo fica com 220px. Senão, 300px.
  const ITEM_SIZE = height < 700 ? 220 : 300;

  useEffect(() => {
    api.get("/games")
      .then(response => setGames(response.data))
      .catch(err => console.error("Erro ao carregar onboarding", err));
  }, []);

  return (
    <Animated.FlatList
      data={games}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: (width - ITEM_SIZE) / 2,
        // Subimos o FlatList se a tela for pequena para escapar do card de baixo
        marginTop: height < 700 ? 50 : 80, 
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrolX } } }],
        { useNativeDriver: true }
      )}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
        ];
        const scale = scrolX.interpolate({
          inputRange,
          outputRange: [0.85, 1, 0.85],
        });
        const opacity = scrolX.interpolate({
          inputRange,
          outputRange: [0.6, 1, 0.6],
        });
        
        return (
          <View style={{ width: ITEM_SIZE, alignItems: "center" }}>
            <Animated.View
              style={[
                styles.circle,
                // Aplicamos as medidas dinâmicas diretamente na View animada
                { 
                  width: ITEM_SIZE, 
                  height: ITEM_SIZE, 
                  borderRadius: ITEM_SIZE / 2,
                  transform: [{ scale }], 
                  opacity 
                },
              ]}
            >
              <Image source={{ uri: item.cover }} style={styles.image} />
            </Animated.View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  // Tiramos o width, height e borderRadius fixos daqui
  circle: {
    backgroundColor: "#fff",
    elevation: 12,
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