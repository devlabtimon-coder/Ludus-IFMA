import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type GameTier = "LATAO" | "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";

const TIER_META: Record<GameTier, { label: string; color: string; bg: string; icon: string }> = {
  LATAO:    { label: "Latão",    color: "#8B7355", bg: "#F5EFE6", icon: "shield-outline" },
  BRONZE:   { label: "Bronze",   color: "#CD7F32", bg: "#FBF0E6", icon: "shield-half-outline" },
  PRATA:    { label: "Prata",    color: "#7A7A7A", bg: "#F2F2F2", icon: "shield" },
  OURO:     { label: "Ouro",     color: "#B8860B", bg: "#FFFBE6", icon: "star-outline" },
  DIAMANTE: { label: "Diamante", color: "#0277BD", bg: "#E3F2FD", icon: "diamond-outline" },
};

type Props = {
  title: string;
  avgRating: number;
  ratingsCount?: number | null;
  onPressRate: () => void;

  available?: boolean;
  rentalDaysText?: string;
  availabilityForecast?: string | null;

  // RF017
  tier?: string | null;
};

export function GameMeta({
  title,
  avgRating,
  ratingsCount,
  onPressRate,
  available = false,
  rentalDaysText = "Retirada e devolução no mesmo dia",
  availabilityForecast,
  tier,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const safeAvg = Number.isFinite(avgRating) ? avgRating : 0;
  const rounded = Math.round(safeAvg);
  const display = safeAvg.toFixed(1);
  const count = typeof ratingsCount === "number" ? ratingsCount : 0;

  const statusText = available ? "Disponível agora" : "Indisponível no momento";
  const statusColor = available ? "#2E7D32" : "#E62325";
  const statusBg = available ? "#EAF7EE" : "#FFE9EA";


  const tierKey = (tier as GameTier) ?? null;
  const tierMeta = tierKey && TIER_META[tierKey] ? TIER_META[tierKey] : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.ratingRow}>
        <View style={styles.ratingLeft}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rounded ? "star" : "star-outline"}
              size={18}
              color={i < rounded ? "#FFC107" : "#BDBDBD"}
            />
          ))}

          <Text style={styles.ratingText}>
            {display} <Text style={styles.countText}>({count})</Text>
          </Text>
        </View>

        <Pressable onPress={onPressRate} style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Avaliar</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{title}</Text>

      
      {tierMeta && (
        <View style={[styles.tierBadge, { backgroundColor: tierMeta.bg }]}>
          <Ionicons name={tierMeta.icon as any} size={14} color={tierMeta.color} />
          <Text style={[styles.tierText, { color: tierMeta.color }]}>
            Tier {tierMeta.label}
          </Text>
        </View>
      )}

      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.statusRow}
      >
        <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#8B8EA1"
        />
      </Pressable>

      {expanded && (
        <View style={styles.infoBox}>
          {available ? (
            <>
              <Text style={styles.infoLabel}>Prazo de aluguel</Text>
              <Text style={styles.infoValue}>{rentalDaysText}</Text>
            </>
          ) : (
            <>
              <Text style={styles.infoLabel}>Previsão de disponibilidade</Text>
              <Text style={styles.infoValue}>
                {availabilityForecast?.trim() || "Sem previsão no momento"}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingBottom: 4,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingLeft: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    flexShrink: 1,
  },

  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#6A6A6A",
  },

  countText: {
    fontWeight: "800",
    color: "#8B8EA1",
  },

  rateBtn: {
    backgroundColor: "#F1F3F7",
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  rateBtnText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#0A1F5C",
  },

  title: {
    marginTop: 10,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
    color: "#444",
  },

  // RF017
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  tierText: {
    fontSize: 12,
    fontWeight: "800",
  },

  statusRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "900",
  },

  infoBox: {
    marginTop: 10,
    backgroundColor: "#F7F8FF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8B8EA1",
  },

  infoValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "900",
    color: "#31358B",
  },
});