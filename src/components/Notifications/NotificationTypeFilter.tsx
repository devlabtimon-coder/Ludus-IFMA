import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type NotificationTypeFilterValue =
  | "all"
  | "rentals"
  | "ratings"
  | "verify"
  | "progress"
  | "system";

type Counts = {
  all: number;
  rentals: number;

  ratings: number;
  verify: number;
  progress: number;
  system: number;
};

const FILTERS: Array<{
  key: NotificationTypeFilterValue;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "blue" | "red" | "yellow";
}> = [
  { key: "all", label: "Tudo", icon: "apps", tone: "blue" },
  { key: "rentals", label: "Aluguéis", icon: "dice-outline", tone: "blue" },
  { key: "ratings", label: "Avaliações", icon: "star", tone: "yellow" },
  {
    key: "verify",
    label: "Verificação",
    icon: "shield-checkmark",
    tone: "blue",
  },
  { key: "progress", label: "Ranking", icon: "trophy", tone: "yellow" },
  { key: "system", label: "Sistema", icon: "megaphone", tone: "red" },
];

export function NotificationsTypeFilter({
  value,
  onChange,
  counts,
}: {
  value: NotificationTypeFilterValue;
  onChange: (v: NotificationTypeFilterValue) => void;
  counts: Counts;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.sectionTitle}>Filtrar por tipo</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 6 }}
      >
        {FILTERS.map((f) => {
          const active = value === f.key;
          const tone = palette(f.tone);

          return (
            <Pressable
              key={f.key}
              onPress={() => onChange(f.key)}
              style={[
                styles.chip,
                active && {
                  backgroundColor: tone.main,
                  borderColor: tone.main,
                },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name={f.icon}
                size={16}
                color={active ? "#fff" : tone.main}
              />
              <Text style={[styles.chipText, active && { color: "#fff" }]}>
                {f.label}
              </Text>

              <View
                style={[
                  styles.count,
                  active && { backgroundColor: "rgba(255,255,255,0.22)" },
                ]}
              >
                <Text style={[styles.countText, active && { color: "#fff" }]}>
                  {counts[f.key] ?? 0}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const BLUE = "#31358B";
const RED = "#B3193A";
const YELLOW = "#FBBC04";

function palette(tone: "blue" | "red" | "yellow") {
  if (tone === "red") return { main: RED };
  if (tone === "yellow") return { main: YELLOW };
  return { main: BLUE };
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "900",
    color: "#2A2E3B",
    marginBottom: 10,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  chipText: { fontWeight: "900", color: "#2A2E3B", fontSize: 12 },

  count: {
    marginLeft: 2,
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countText: { fontWeight: "900", color: "#2A2E3B", fontSize: 11 },
});
