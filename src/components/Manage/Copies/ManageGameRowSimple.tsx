import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { gameCoverSource } from "@/src/constants/images";

type Game = { id: string; title: string; cover?: string | null };

export function ManageGameRowSimple({ item, onPress }: { item: Game; onPress: () => void }) {

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}>
      <Image source={gameCoverSource(item.cover)} style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sub}>Toque para ver/criar exemplares</Text>
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
  sub: { marginTop: 4, fontSize: 13, fontWeight: "600", color: "#8B8EA1" },
});