import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface GameCardHorizontalProps {
  id: string;
  title: string;
  price: number;
  rating: number;
  image?: string | null;
  isAvailableNow?: boolean;
}

function formatBRL(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatRating(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}

function getHighResImage(url?: string | null) {
  if (!url) return null;
  return url
    .replace("_t.jpg", ".jpg")
    .replace("_t.jpeg", ".jpeg")
    .replace("_t.png", ".png");
}

export default function GameCardHorizontal({
  id,
  title,
  price,
  rating,
  image,
  isAvailableNow,
}: GameCardHorizontalProps) {
  const router = useRouter();
  const img = getHighResImage(image) ?? image ?? null;

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/game/[id]", params: { id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      {img ? (
        <Image
          source={{ uri: img }}
          style={styles.image}
          resizeMode="cover"
          fadeDuration={200}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]} />
      )}

      <View style={styles.rating}>
        <Ionicons name="star" size={14} color="#FFC107" />
        <Text style={styles.ratingText}>{formatRating(rating)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>{formatBRL(price)} / dia</Text>

        {isAvailableNow !== undefined && (
          <View style={styles.availabilityRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isAvailableNow ? "#31358B" : "#E53935" },
              ]}
            />
            <Text
              style={
                isAvailableNow
                  ? styles.availabilityText
                  : styles.availabilityTextInactive
              }
            >
              {isAvailableNow ? "Disponível" : "Indisponível"}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 16,
    marginBottom: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EEE",
  },
  imageFallback: {},
  rating: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    height: 26,
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  ratingText: {
    fontWeight: "800",
    color: "#333",
    fontSize: 12,
  },
  footer: {
    padding: 12,
  },
  title: {
    fontWeight: "800",
    fontSize: 14,
    color: "#333",
    minHeight: 38,
  },
  price: {
    color: "#08b73f",
    fontWeight: "800",
    marginTop: 6,
    fontSize: 14,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: "#31358B",
    fontWeight: "600",
  },
  availabilityTextInactive: {
    fontSize: 12,
    color: "#E53935",
    fontWeight: "600",
  },
});
