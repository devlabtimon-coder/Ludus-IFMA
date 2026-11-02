import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function FilterButton() {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push("/filter")}
      accessibilityRole="button"
      accessibilityLabel="Filtros"
      hitSlop={4}
    >
      <Ionicons name="filter" size={16} color="#FFFFFF" />
      <Text style={styles.text}>Filtros</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    backgroundColor: "#B3193A",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DM Sans",
  },
});
