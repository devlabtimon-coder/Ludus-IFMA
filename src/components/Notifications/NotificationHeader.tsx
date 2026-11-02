import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

export function NotificationsHeader({
  onBack,
  onReadAll,
}: {
  onBack: () => void;
  onReadAll: () => void;
}) {
  const safeTop = useSafeTop(54);
  return (
    <View style={[styles.header, { paddingTop: safeTop }]}>
      <Pressable
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Ionicons name="chevron-back" size={22} color={RED} />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Notificações</Text>
        
      </View>

      <Pressable
        onPress={onReadAll}
        style={styles.readAll}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Marcar todas como lidas"
      >
        <Ionicons name="checkmark-done" size={18} color="#fff" />
        <Text style={styles.readAllText}>Ler tudo</Text>
      </Pressable>
    </View>
  );
}

const RED = "#B3193A";

const styles = StyleSheet.create({
  header: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backBtn: {
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

  title: { color: "#fff", fontWeight: "900", fontSize: 18 },
  subtitle: { marginTop: 2, color: "rgba(255,255,255,0.85)", fontWeight: "700", fontSize: 12 },

  readAll: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(179,25,58,0.92)",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  readAllText: { color: "#fff", fontWeight: "900", fontSize: 12 },
});