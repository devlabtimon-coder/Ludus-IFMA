import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import RentalItem, { RentalItemModel } from "./RentalItem";

type Props = {
  rentals: RentalItemModel[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onPressRental?: (rental: RentalItemModel) => void;
  // A última carga falhou (sem rede, servidor fora).
  loadError?: boolean;
  onRetry?: () => void;
};

export default function RentalsCard({
  rentals,
  onRefresh,
  refreshing = false,
  onPressRental,
  loadError = false,
  onRetry,
}: Props) {
  const router = useRouter();
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

  // Retirado e com o horário de devolução vencido: o servidor bloqueia
  // novas reservas até a devolução (OVERDUE_RENTAL).
  const overdue = useMemo(() => {
    const now = Date.now();
    return active.find((r) => {
      if ((r.status || "").toUpperCase() !== "ACTIVE") return false;
      const end = new Date(r.endDate).getTime();
      return Number.isFinite(end) && end < now;
    });
  }, [active]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Meus aluguéis</Text>

      {overdue ? (
        <Pressable
          style={styles.overdue}
          onPress={() => onPressRental?.(overdue)}
          accessibilityRole="button"
          accessibilityLabel={`Jogo em atraso: ${overdue.game?.title ?? ""}. Devolva na biblioteca. Enquanto isso, novas reservas ficam bloqueadas.`}
        >
          <Ionicons name="alert-circle" size={24} color="#B3193A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.overdueTitle}>
              Jogo em atraso — devolva na biblioteca
            </Text>
            <Text style={styles.overdueText}>
              {overdue.game?.title ? `"${overdue.game.title}" passou do horário de devolução. ` : ""}
              Enquanto isso, novas reservas ficam bloqueadas.
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab("ACTIVE")}
          style={[styles.tab, tab === "ACTIVE" && styles.tabActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "ACTIVE" }}
        >
          <Text style={[styles.tabText, tab === "ACTIVE" && styles.tabTextActive]}>
            Em andamento ({active.length})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab("HISTORY")}
          style={[styles.tab, tab === "HISTORY" && styles.tabActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === "HISTORY" }}
        >
          <Text style={[styles.tabText, tab === "HISTORY" && styles.tabTextActive]}>
            Anteriores ({history.length})
          </Text>
        </Pressable>
      </View>

      {loadError && rentals.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="cloud-offline-outline" size={36} color="#8B8EA1" />
          <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
          <Text style={styles.emptyText}>
            Verifique sua conexão e tente de novo.
          </Text>
          <Pressable
            style={styles.emptyBtn}
            onPress={onRetry}
            accessibilityRole="button"
          >
            <Text style={styles.emptyBtnText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {tab === "ACTIVE" ? "Nenhum aluguel em andamento" : "Sem histórico ainda"}
          </Text>
          <Text style={styles.emptyText}>
            {tab === "ACTIVE"
              ? "Quando você alugar um jogo, ele aparece aqui."
              : "Depois que você devolver um jogo, ele aparece aqui."}
          </Text>
          {tab === "ACTIVE" ? (
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push("/search")}
              accessibilityRole="button"
            >
              <Text style={styles.emptyBtnText}>Explorar jogos</Text>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            loadError ? (
              <Text style={styles.staleText}>
                Não foi possível atualizar. Puxe a lista para tentar de novo.
              </Text>
            ) : null
          }
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

  overdue: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FDECEF",
    borderWidth: 1,
    borderColor: "#F5B5C1",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  overdueTitle: { fontWeight: "900", fontSize: 14, color: "#B3193A" },
  overdueText: {
    marginTop: 4,
    fontWeight: "600",
    fontSize: 13,
    color: "#5A1A26",
    lineHeight: 18,
  },

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

  empty: { paddingTop: 40, alignItems: "center", gap: 2 },
  emptyBtn: {
    marginTop: 16,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBtnText: { color: "#FFF", fontWeight: "900", fontSize: 14 },
  staleText: {
    color: "#B3193A",
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyTitle: { fontWeight: "900", fontSize: 16, color: "#2C2C2C" },
  emptyText: { marginTop: 6, color: "#8B8EA1", fontWeight: "700", textAlign: "center" },
});