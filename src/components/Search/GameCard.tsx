import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { gameCoverSource } from "@/src/constants/images";

export type Game = {
  id: string;
  title: string;
  cover?: string | null;
  price: number;
  rating?: number | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minAge?: number | null;
  minTime?: number | null;
  maxTime?: number | null;
  available?: boolean;
  isAvailableNow?: boolean;
};

type Props = {
  item: Game;
};



export default function GameCard({ item }: Props) {
  const router = useRouter()
  // isAvailableNow considera os exemplares livres; `available` é só a flag manual do jogo.
  const isAvailable = item?.isAvailableNow ?? item?.available !== false;

  const rating = typeof item?.rating === "number" ? item.rating.toFixed(1) : "0.0";

  const playersText =
    item?.minPlayers && item?.maxPlayers
      ? `${item.minPlayers}-${item.maxPlayers} jogadores`
      : item?.minPlayers
        ? `${item.minPlayers}+ jogadores`
        : "—";

  const priceText = Number(item?.price ?? 0).toFixed(2);

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} onPress={() => router.push(`/game/${item.id}`)}>
      <Image source={gameCoverSource(item?.cover)} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="people-outline" size={14} color="#777" />
            <Text style={styles.metaText}>{playersText}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name={isAvailable ? "checkmark-circle-outline" : "close-circle-outline"}
              size={14}
              color={isAvailable ? "#2E7D32" : "#E62325"}
            />
            <Text
              style={[
                styles.metaText,
                { color: isAvailable ? "#2E7D32" : "#E62325" },
              ]}
            >
              {isAvailable ? "Disponível" : "Indisponível"}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            R$ {priceText}
            <Text style={styles.perDay}> / dia</Text>
          </Text>

          <View style={styles.rating}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  image: {
    width: 90,
    height: 130,
    borderRadius: 12,
    marginRight: 16,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },

  metaText: {
    fontSize: 12,
    color: "#777",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: 14,
  },

  perDay: {
    color: "#777",
    fontWeight: "400",
    fontSize: 12,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
});