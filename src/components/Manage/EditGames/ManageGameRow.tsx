import type { ManageGame } from "@/src/screens/Manage/EditGamesScreen";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { gameCoverSource } from "@/src/constants/images";

export function ManageGameRow({ item, onPress }: { item: ManageGame; onPress: () => void }) {
  const rating = typeof item.rating === "number" ? item.rating.toFixed(1) : "0.0";
  const count = typeof item.ratingsCount === "number" ? item.ratingsCount : 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
      <Image source={gameCoverSource(item.cover)} style={styles.thumb} />

      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.metaLine}>
          <Ionicons name="cash-outline" size={14} color="#31358B" />
          <Text style={styles.metaText}>R$ {Number(item.price ?? 0).toFixed(2)} / dia</Text>
        </View>

        <View style={styles.metaLine}>
          <Ionicons
            name={item.available !== false ? "checkmark-circle-outline" : "close-circle-outline"}
            size={14}
            color={item.available !== false ? "#2E7D32" : "#E62325"}
          />
          <Text style={[styles.metaText, { color: item.available !== false ? "#2E7D32" : "#E62325" }]}>
            {item.available !== false ? "Disponível" : "Indisponível"}
          </Text>

          <View style={{ width: 10 }} />

          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={styles.metaText}>
            {rating} <Text style={{ color: "#8B8EA1" }}>({count})</Text>
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#31358B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FF",
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
    gap: 12,
  },
  thumb: { width: 48, height: 48, borderRadius: 10 },
  name: { fontSize: 15, fontWeight: "700", color: "#31358B" },
  metaLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, flexWrap: "wrap" },
  metaText: { fontSize: 13, fontWeight: "600", color: "#535353" },
});