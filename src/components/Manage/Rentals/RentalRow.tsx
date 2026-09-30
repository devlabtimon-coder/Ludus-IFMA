import type { AdminRental } from "@/src/screens/Manage/ManageRentalsScreen";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { gameCoverSource } from "@/src/constants/images";

function formatDate(dt: string) {
  const d = new Date(dt);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

export function RentalRow({ item, onPress }: { item: AdminRental; onPress: () => void }) {

  const now = Date.now();
  const overdue =
    (item.status === "PENDING" || item.status === "ACTIVE") && new Date(item.endDate).getTime() < now;

  const statusLabel =
    item.status === "PENDING"
      ? "Pendente"
      : item.status === "ACTIVE"
      ? "Ativo"
      : item.status === "RETURNED"
      ? "Devolvido"
      : "Cancelado";

  const statusColor =
    item.status === "RETURNED"
      ? "#2E7D32"
      : item.status === "CANCELED"
      ? "#B3193A"
      : overdue
      ? "#B3193A"
      : "#31358B";

  const copyLabel = item.copy?.code ? `Exemplar: ${item.copy.code}` : "Original";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
      <Image source={gameCoverSource(item.game.cover)} style={styles.thumb} />

      <View style={{ flex: 1 }}>
        <View style={styles.topLine}>
          <Text style={styles.title} numberOfLines={1}>
            {item.game.title}
          </Text>

          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{overdue ? "Atrasado" : statusLabel}</Text>
          </View>
        </View>

        <Text style={styles.sub} numberOfLines={1}>
          {item.user.name} • {item.user.email}
        </Text>

        <View style={styles.metaLine}>
          <Ionicons name="calendar-outline" size={14} color="#535353" />
          <Text style={styles.metaText}>
            {formatDate(item.startDate)} → {formatDate(item.endDate)}
          </Text>
        </View>

        <View style={styles.metaLine}>
          <Ionicons name="albums-outline" size={14} color="#535353" />
          <Text style={styles.metaText}>{copyLabel}</Text>
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
  thumb: { width: 52, height: 52, borderRadius: 12 },
  topLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontSize: 15, fontWeight: "900", color: "#31358B", flex: 1 },
  badge: { paddingHorizontal: 10, height: 26, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 11 },
  sub: { marginTop: 4, fontSize: 13, fontWeight: "700", color: "#6A6A6A" },
  metaLine: { marginTop: 4, flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  metaText: { fontSize: 12, fontWeight: "700", color: "#535353" },
});