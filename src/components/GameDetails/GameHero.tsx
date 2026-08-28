import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  gameId: string;
  coverUrl?: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function GameHero({ coverUrl, isFavorite, onToggleFavorite }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function getHighResImage(url?: string | null) {
    if (!url) return null;
    return url.replace("_t.jpg", ".jpg");
  }

  const topPosition = Math.max(insets.top + 10, 20);

  return (
    <View style={styles.wrap}>
      <Image
        source={{
          uri:
            getHighResImage(coverUrl) ||
            "https://via.placeholder.com/600x400.png?text=Ludus",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Pressable
        onPress={() => router.back()}
        style={[styles.backBtn, { top: topPosition }]}
      >
        <Ionicons name="chevron-back" size={22} color="#fff" />
      </Pressable>

      <Pressable
        onPress={onToggleFavorite}
        style={[styles.bookmarkBtn, { top: topPosition }]}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#FBBC04" : "#fff"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", aspectRatio: 3 / 2.7 },
  image: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    left: 18,
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    position: "absolute",
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
});
