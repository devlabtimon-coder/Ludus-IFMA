import { api } from "@/src/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type ComponentItem = {
  id: string;
  name: string;
  quantity: number;
};

export function GameComponents({ gameId }: { gameId: string }) {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/games/${gameId}/components`)
      .then((res) => setComponents(res.data || []))
      .catch(() => setComponents([]))
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!components.length) {
    return (
      <Text style={styles.empty}>
        Nenhum componente cadastrado para este jogo.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {components.map((c) => (
        <View key={c.id} style={styles.row}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.qty}>x{c.quantity}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    padding: 12,
    borderRadius: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 12,
  },
  qty: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    flexShrink: 0,
  },
  empty: {
    marginTop: 12,
    color: "#777",
    fontWeight: "600",
  },
  center: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
