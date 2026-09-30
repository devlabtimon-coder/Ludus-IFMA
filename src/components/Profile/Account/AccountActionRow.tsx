import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  accent?: "blue" | "red" | "yellow";
  onPress: () => void;
};

export function AccountActionRow({
  icon,
  title,
  subtitle,
  accent = "blue",
  onPress,
}: Props) {
  const iconBg =
    accent === "red"
      ? "#FFE9EA"
      : accent === "yellow"
      ? "#FFF4CC"
      : "#EEF0FF";

  const iconColor =
    accent === "red"
      ? "#E62325"
      : accent === "yellow"
      ? "#9A6B00"
      : "#31358B";

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#31358B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 74,
    borderRadius: 20,
    backgroundColor: "#F7F8FF",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#31358B",
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
    color: "#7A7E8B",
  },
});