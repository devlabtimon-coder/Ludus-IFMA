import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  ok: boolean;
};

export function AccountStatusPill({ icon, text, ok }: Props) {
  return (
    <View style={[styles.pill, ok ? styles.pillOk : styles.pillWarn]}>
      <Ionicons
        name={icon}
        size={16}
        color={ok ? "#1E7A35" : "#B3193A"}
      />
      <Text style={[styles.pillText, { color: ok ? "#1E7A35" : "#B3193A" }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 48,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pillOk: {
    backgroundColor: "#EEF8F1",
  },

  pillWarn: {
    backgroundColor: "#FFF1F1",
  },

  pillText: {
    fontSize: 13,
    fontWeight: "900",
  },
});