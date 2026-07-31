import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

interface BackButtonProps {
  color?: string;
}

export default function BackButton({ color = "#B3193A" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={22} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 47,
    left: 25,

    width: 50,
    height: 50,

    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    elevation: 6,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
});
