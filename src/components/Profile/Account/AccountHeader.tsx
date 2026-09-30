import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
};

export function AccountHeader({ title, subtitle, onBack }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
});