import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

interface BackButtonProps {
  color?: string;
}

export default function BackButton({ color = "#B3193A" }: BackButtonProps) {
  const router = useRouter();
  const top = useSafeTop(47, 4);

  return (
    <Pressable
      style={[styles.container, { top }]}
      // Aberta direto por uma notificação, a tela não tem para onde voltar.
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
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
