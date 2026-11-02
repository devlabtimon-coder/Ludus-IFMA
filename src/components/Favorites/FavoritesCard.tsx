import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import FavoriteItem from "./FavoriteItem";
import FavoritesEmpty from "./FavoritesEmpty";

export type FavoriteGame = {
  id: string;
  title: string;
  cover?: string | null;
  price?: number;
  rating?: number | null;
  locationLabel?: string; 
};

export type SortKey = "rating" | "title";

function sortLabel(k: SortKey) {
  if (k === "rating") return "avaliação";
  return "nome";
}

export default function FavoritesCard({
  data,
  sortKey,
  onToggleSort,
  onDelete,
}: {
  data: FavoriteGame[];
  sortKey: SortKey;
  onToggleSort: () => void;
  onDelete: (gameId: string) => Promise<void> | void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onToggleSort} style={styles.sortPill}>
        <Text style={styles.sortText}>Ordenar por: {sortLabel(sortKey)}</Text>
        <Ionicons name="chevron-down" size={18} color="#FFF" />
      </Pressable>

      {data.length === 0 ? (
        <FavoritesEmpty />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
          renderItem={({ item }) => (
            <FavoriteItem
              game={item}
              onDelete={onDelete}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 18 },

  sortPill: {
    alignSelf: "flex-start",
    backgroundColor: "#31358B",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sortText: { color: "#FFF", fontWeight: "900", fontSize: 16 },
});