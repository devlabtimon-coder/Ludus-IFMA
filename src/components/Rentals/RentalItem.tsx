import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatRentalPeriod, getRentalStatusMeta } from "@/src/utils/rentals";

export type RentalItemModel = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  game: { id: string; title: string; cover?: string | null };
  copy?: { id: string; code?: string | null; number: number } | null;
};

export default function RentalItem({
  rental,
  onPress,
}: {
  rental: RentalItemModel;
  onPress?: () => void;
}) {
  const st = getRentalStatusMeta(rental.status);
  const isPending = (rental.status || "").toUpperCase() === "PENDING";
  const period = formatRentalPeriod(rental.startDate, rental.endDate);

  const copyLabel =
    rental.copy?.number != null
      ? `Exemplar #${rental.copy.number}${rental.copy.code ? ` • ${rental.copy.code}` : ""}`
      : "Jogo original";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${rental.game.title}, ${st.label}, ${period}`}
      accessibilityHint="Abre os detalhes do aluguel"
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      {rental.game.cover ? (
        <Image source={{ uri: rental.game.cover }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#EEE" }]} />
      )}

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {rental.game.title}
          </Text>

          <View style={[styles.badge, { backgroundColor: st.color }]}>
            <Text style={styles.badgeText}>{st.label}</Text>
          </View>
        </View>

        <View style={styles.subRow}>
          <Ionicons name="cube-outline" size={14} color="#8B8EA1" />
          <Text style={styles.subText} numberOfLines={1}>
            {copyLabel}
          </Text>
        </View>

        <View style={styles.subRow}>
          <Ionicons name="calendar-outline" size={14} color="#8B8EA1" />
          <Text style={styles.subText}>{period}</Text>
        </View>

        {isPending ? (
          <View style={styles.subRow}>
            <Ionicons name="location-outline" size={14} color="#9A6B00" />
            <Text style={styles.pickupText} numberOfLines={2}>
              Retire na biblioteca no horário agendado (tolerância de 30 min)
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8F8FB",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 84,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#EEE",
  },
  info: { flex: 1, marginLeft: 12 },
  // Título em cima e selo embaixo: "Aguardando retirada" não cabe ao lado
  // do título em telas estreitas.
  topRow: { alignItems: "flex-start", gap: 6 },
  title: { alignSelf: "stretch", fontSize: 16, fontWeight: "900", color: "#2C2C2C" },
  badge: { paddingHorizontal: 10, height: 26, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  subRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  subText: { color: "#8B8EA1", fontWeight: "700", fontSize: 13, flex: 1 },
  pickupText: { color: "#9A6B00", fontWeight: "700", fontSize: 12, flex: 1 },
});