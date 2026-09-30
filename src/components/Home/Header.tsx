import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { goToRoute } from "@/src/services/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; // <-- Import adicionado
import { useCallback, useState } from "react"; // <-- useEffect removido
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function Header() {
  const { user } = useAuth();

  const firstName = user?.nome ? user.nome.split(" ")[0] : "Visitante";

  const [notificationsCount, setNotificationsCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await api.get<{ count: number }>(
        "/notifications/unread-count",
      );
      setNotificationsCount(res.data?.count ?? 0);
    } catch {
      setNotificationsCount(0);
    }
  }, []);

  // Substituímos o useEffect pelo useFocusEffect
  // Agora ele roda toda vez que a tela aparecer para o usuário
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [loadUnreadCount]),
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hello}>Olá,</Text>
        <Text style={styles.name}>{firstName}!</Text>
        <Text style={styles.TextSearch}>Alugue seus jogos ideais!</Text>
      </View>

      <TouchableOpacity
        style={styles.nofication}
        onPress={() => {
          goToRoute("/notifications");
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={
            notificationsCount > 0 ? "notifications" : "notifications-outline"
          }
          size={22}
          color="#31358B"
        />

        {notificationsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationsCount > 9 ? "9+" : notificationsCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hello: {
    color: "#E0E0E0",
    fontSize: 20,
  },
  name: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  TextSearch: {
    marginTop: 12,
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "300",
  },
  nofication: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2ECC71",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
