import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import RentalItem, { RentalItemModel } from "./RentalItem";

type Props = {
  rentals: RentalItemModel[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onPressRental?: (rental: RentalItemModel) => void;
};

export default function RentalsCard({ rentals, onRefresh, refreshing = false, onPressRental }: Props) {
  const [tab, setTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");

  const { active, history } = useMemo(() => {
    const activeStatuses = new Set(["PENDING", "ACTIVE"]);
    const historyStatuses = new Set(["RETURNED", "CANCELED", "DONE", "FINISHED"]);

    const a: RentalItemModel[] = [];
    const h: RentalItemModel[] = [];

    for (const r of rentals) {
      const s = (r.status || "").toUpperCase();
      if (activeStatuses.has(s)) a.push(r);
      else if (historyStatuses.has(s)) h.push(r);
      else h.push(r);
    }

    return { active: a, history: h };
  }, [rentals]);

  const data = tab === "ACTIVE" ? active : history;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Meus aluguéis</Text>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("ACTIVE")}
          style={[styles.tab, tab === "ACTIVE" && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === "ACTIVE" && styles.tabTextActive]}>
            Em andamento ({active.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab("HISTORY")}
          style={[styles.tab, tab === "HISTORY" && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === "HISTORY" && styles.tabTextActive]}>
            Anteriores ({history.length})
          </Text>
        </Pressable>
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {tab === "ACTIVE" ? "Nenhum aluguel em andamento" : "Sem histórico ainda"}
          </Text>
          <Text style={styles.emptyText}>
            {tab === "ACTIVE"
              ? "Quando você alugar um jogo, ele aparece aqui."
              : "Depois que você devolver um jogo, ele aparece aqui."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <RentalItem
              rental={item}
              onPress={() => onPressRental?.(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    marginTop: 120,
    overflow: "hidden",
  },
  title: { fontSize: 22, fontWeight: "900", color: "#2C2C2C", marginBottom: 14 },

  tabs: { flexDirection: "row", gap: 10, marginBottom: 14 },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E6EF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8FB",
  },
  tabActive: { backgroundColor: "#0A1F5C", borderColor: "#0A1F5C" },
  tabText: { fontWeight: "900", color: "#6A6A6A" },
  tabTextActive: { color: "#FFF" },

  empty: { paddingTop: 40, alignItems: "center" },
  emptyTitle: { fontWeight: "900", fontSize: 16, color: "#2C2C2C" },
  emptyText: { marginTop: 6, color: "#8B8EA1", fontWeight: "700", textAlign: "center" },
});