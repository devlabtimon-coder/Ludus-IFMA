import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import type { FavoriteGame } from "./FavoritesCard";

function formatRating(v?: number | null) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n.toFixed(1) : "0.0";
}

export default function FavoriteItem({
  game,
  onDelete,
}: {
  game: FavoriteGame;
  onDelete: (gameId: string) => Promise<void> | void;
}) {
  const router = useRouter();

  const confirmDelete = () => {
    Alert.alert("Remover dos favoritos?", `Deseja remover "${game.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await onDelete(game.id);
        },
      },
    ]);
  };

  const renderLeftActions = () => {
    return (
      <Pressable style={styles.deleteAction} onPress={confirmDelete}>
        <Ionicons name="trash-outline" size={26} color="#FFF" />
        <Text style={styles.deleteText}>Deletar</Text>
      </Pressable>
    );
  };

  return (
  <View style={{ marginBottom: 10 }}>
    <Swipeable
      renderLeftActions={renderLeftActions}
      leftThreshold={40}
      overshootLeft={false}
    >
      <Pressable
        onPress={() =>
          router.push({ pathname: "/game/[id]", params: { id: game.id } })
        }
        style={styles.card}
      >
        {game.cover ? (
          <Image source={{ uri: game.cover }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: "#EEE" }]} />
        )}

        <View style={styles.info}>
          <View style={styles.rowTop}>
            <Text style={styles.title} numberOfLines={2}>
              {game.title}
            </Text>

            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FBBC04" />
              <Text style={styles.ratingText}>
                {formatRating(game.rating)}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#8B8EA1"
            />
            <Text style={styles.locationText} numberOfLines={1}>
              {game.locationLabel ?? "Biblioteca"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Swipeable>
  </View>
);
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 120,
    backgroundColor: "#B3193A",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginRight: 10,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#F8F8FB",
    borderRadius: 16,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  image: {
    width: 76,
    height: 76,
    borderRadius: 14,
  },

  info: {
    flex: 1,
    marginLeft: 10,
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2C2C2C",
    flex: 1,
    marginRight: 6,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: {
    fontWeight: "800",
    fontSize: 14,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  locationText: {
    color: "#8B8EA1",
    fontWeight: "600",
    fontSize: 12,
  },
});