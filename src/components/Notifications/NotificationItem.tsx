import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  readAt?: string | null;
  createdAt: string;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - d.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `há ${days}d`;
}

function shouldShowExpand(body?: string) {
  return (body || "").trim().length > 60;
}

function metaForType(type: string) {
  const t = (type || "").toUpperCase();

  if (t.startsWith("RENTAL_"))
    return {
      icon: "dice-outline" as const,
      tone: "blue" as const,
      label: "Aluguel",
    };

  if (t.startsWith("FAVORITE"))
    return { icon: "heart" as const, tone: "red" as const, label: "Favoritos" };

  if (t.startsWith("RATING"))
    return {
      icon: "star" as const,
      tone: "yellow" as const,
      label: "Avaliação",
    };

  if (t.includes("VERIFY") || t.includes("EMAIL") || t.includes("PHONE"))
    return {
      icon: "shield-checkmark" as const,
      tone: "blue" as const,
      label: "Verificação",
    };

  if (t.includes("LEVEL") || t.includes("POINTS"))
    return {
      icon: "trophy" as const,
      tone: "yellow" as const,
      label: "Ranking",
    };

  return { icon: "megaphone" as const, tone: "red" as const, label: "Sistema" };
}

const BLUE = "#31358B";
const RED = "#B3193A";
const YELLOW = "#FBBC04";
const GREEN = "#34A853";

function toneColor(tone: "blue" | "red" | "yellow") {
  if (tone === "red") return RED;
  if (tone === "yellow") return YELLOW;
  return BLUE;
}
function toneBg(tone: "blue" | "red" | "yellow") {
  if (tone === "red") return "rgba(179,25,58,0.14)";
  if (tone === "yellow") return "rgba(251,188,4,0.20)";
  return "rgba(49,53,139,0.14)";
}

export function NotificationItem({
  item,
  onOpen,
}: {
  item: AppNotification;
  onOpen: (item: AppNotification) => void;
}) {
  const isUnread = !item.readAt;
  const [expanded, setExpanded] = useState(false);

  const meta = useMemo(() => metaForType(item.type), [item.type]);
  const tint = useMemo(() => toneColor(meta.tone), [meta.tone]);
  const bg = useMemo(() => toneBg(meta.tone), [meta.tone]);
  const showExpand = useMemo(() => shouldShowExpand(item.body), [item.body]);

  return (
    <View style={[styles.card, isUnread && styles.cardUnread]}>
      <Pressable
        onPress={() => onOpen(item)}
        style={styles.row}
        android_ripple={{ color: "rgba(0,0,0,0.04)" }}
      >
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Ionicons name={meta.icon} size={18} color={tint} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.top}>
            <View style={styles.pills}>
              <View style={[styles.pill, { backgroundColor: bg }]}>
                <Text style={[styles.pillText, { color: tint }]}>
                  {meta.label}
                </Text>
              </View>

              {isUnread && (
                <View style={styles.newWrap}>
                  <View style={[styles.newDot, { backgroundColor: YELLOW }]} />
                  <Text style={[styles.newText, { color: GREEN }]}>Nova</Text>
                </View>
              )}
            </View>

            <Text style={styles.time}>{formatWhen(item.createdAt)}</Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.body} numberOfLines={expanded ? 0 : 2}>
            {item.body}
          </Text>

          {showExpand && (
            <Pressable
              onPress={() => setExpanded((v) => !v)}
              style={[
                styles.expandBtn,
                { backgroundColor: "rgba(49,53,139,0.10)" },
              ]}
              hitSlop={10}
            >
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color={BLUE}
              />
              <Text style={styles.expandText}>
                {expanded ? "Ver menos" : "Ver mais"}
              </Text>
            </Pressable>
          )}
        </View>

        <Ionicons name="chevron-forward" size={18} color="#B0B4C1" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  cardUnread: {
    borderColor: "rgba(49,53,139,0.22)",
  },

  row: {
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  badge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  pills: { flexDirection: "row", alignItems: "center", gap: 10 },

  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  pillText: { fontWeight: "900", fontSize: 11 },

  newWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  newDot: { width: 8, height: 8, borderRadius: 99 },
  newText: { fontWeight: "900", fontSize: 11 },

  time: { fontWeight: "800", color: "#7A7E8B", fontSize: 12 },

  title: { marginTop: 8, fontWeight: "900", color: "#1E1E1E", fontSize: 14 },
  body: {
    marginTop: 4,
    color: "#4A4A4A",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 16,
  },

  expandBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  expandText: { color: BLUE, fontWeight: "900", fontSize: 12 },
});
