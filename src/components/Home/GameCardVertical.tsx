import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameCardVerticalProps {
  id: string;
  title: string;
  location: string;
  rating: number;
  image?: string | null;
  rank?: number; // Posição opcional no ranking
}

function formatRating(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

export default function GameCardVertical({
  id,
  title,
  location,
  rating,
  image,
  rank,
}: GameCardVerticalProps) {
  const router = useRouter();

  // Cores de pódio para destacar o Top 3
  const getRankBadgeStyle = (pos: number) => {
    switch (pos) {
      case 1:
        return { bg: "rgba(255, 193, 7, 0.18)", text: "#B28200" }; // Ouro
      case 2:
        return { bg: "rgba(158, 158, 158, 0.18)", text: "#616161" }; // Prata
      case 3:
        return { bg: "rgba(205, 127, 50, 0.18)", text: "#9B581B" }; // Bronze
      default:
        return { bg: "rgba(49, 53, 139, 0.08)", text: "#31358B" };
    }
  };

  const badgeStyle = rank ? getRankBadgeStyle(rank) : null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
      onPress={() => router.push(`/game/${id}`)}
    >
      {/* Posição no Top 3 */}
      {rank && badgeStyle && (
        <View style={[styles.rankBadge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.rankText, { color: badgeStyle.text }]}>
            #{rank}
          </Text>
        </View>
      )}

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.location}>
          {location === "Disponível" ? (
            <Ionicons name="checkmark-circle" size={16} color="#2FA84F" />
          ) : (
            <Ionicons name="close-circle" size={16} color="#B3193A" />
          )}
          <Text
            style={
              location === "Disponível"
                ? styles.locationText
                : styles.locationTextInactive
            }
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>
      </View>

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text style={styles.ratingText}>{formatRating(rating)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rankText: {
    fontWeight: "900",
    fontSize: 12,
  },
  image: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: "#EEE",
  },
  imageFallback: {
    backgroundColor: "#E0E0E0",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "800",
    fontSize: 15,
    color: "#333",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    color: "#2FA84F",
    fontSize: 13,
    fontWeight: "700",
  },
  locationTextInactive: {
    color: "#B3193A",
    fontSize: 13,
    fontWeight: "700",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontWeight: "900",
    fontSize: 12,
    color: "#333",
  },
});
