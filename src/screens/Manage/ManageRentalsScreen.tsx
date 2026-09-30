import ManageBackground from "@/src/components/Manage/ManageBackground";
import { ManageContainer } from "@/src/components/Manage/ManageContainer";
import { RentalActionsSheet } from "@/src/components/Manage/Rentals/RentalActionsSheet";
import { RentalRow } from "@/src/components/Manage/Rentals/RentalRow";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type RentalStatus = "PENDING" | "ACTIVE" | "RETURNED" | "CANCELED";

export type AdminRental = {
  id: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;

  user: { id: string; name: string; email: string; phone?: string | null };
  game: { id: string; title: string; cover?: string | null; price: number };
  copy?: { id: string; code?: string | null; number: number; condition?: string | null } | null;
};

type AdminRentalsPage = {
  data: AdminRental[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const PAGE_SIZE = 50;

export default function ManageRentalsScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState<AdminRental[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<RentalStatus | "ALL">("ALL");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const [selected, setSelected] = useState<AdminRental | null>(null);
  const [saving, setSaving] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type: "error" | "success" | "info", title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const fetchRentals = useCallback(async (nextPage = 1) => {
    if (nextPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await api.get<AdminRentalsPage>("/admin/rentals", {
        params: {
          q: q.trim() || undefined,
          status: status === "ALL" ? undefined : status,
          overdue: overdueOnly ? "true" : undefined,
          page: nextPage,
          limit: PAGE_SIZE,
        },
      });

      const items = res.data?.data ?? [];
      setRentals((prev) => (nextPage === 1 ? items : [...prev, ...items]));
      setPage(nextPage);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotal(res.data?.total ?? items.length);
    } catch {
      if (nextPage === 1) setRentals([]);
      showAlert("error", "Erro", "Não foi possível carregar os aluguéis.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [q, status, overdueOnly]);

  useEffect(() => {
    fetchRentals(1);
  }, [fetchRentals]);

  const loadMore = () => {
    if (loading || loadingMore || page >= totalPages) return;
    fetchRentals(page + 1);
  };

  const chips = useMemo(
    () => [
      { label: "Todos", value: "ALL" as const },
      { label: "Pendentes", value: "PENDING" as const },
      { label: "Ativos", value: "ACTIVE" as const },
      { label: "Devolvidos", value: "RETURNED" as const },
      { label: "Cancelados", value: "CANCELED" as const },
    ],
    []
  );

  const counts = useMemo(() => {
    const pending = rentals.filter((r) => r.status === "PENDING").length;
    const active = rentals.filter((r) => r.status === "ACTIVE").length;
    const returned = rentals.filter((r) => r.status === "RETURNED").length;
    const canceled = rentals.filter((r) => r.status === "CANCELED").length;

    const now = Date.now();
    const overdue = rentals.filter(
      (r) => (r.status === "PENDING" || r.status === "ACTIVE") && new Date(r.endDate).getTime() < now
    ).length;

    return { total, pending, active, returned, canceled, overdue };
  }, [rentals, total]);

  const setRentalStatus = async (rentalId: string, nextStatus: "ACTIVE" | "RETURNED" | "CANCELED") => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/rentals/${rentalId}/status`, { status: nextStatus });

      setRentals((prev) => prev.map((r) => (r.id === rentalId ? { ...r, status: res.data.status } : r)));
      setSelected(null);

      if (nextStatus === "RETURNED") showAlert("success", "Devolvido", "Aluguel marcado como devolvido.");
      if (nextStatus === "CANCELED") showAlert("success", "Cancelado", "Aluguel cancelado e item liberado.");
      if (nextStatus === "ACTIVE") showAlert("success", "Ativado", "Aluguel marcado como ativo.");
    } catch (e: any) {
      const code = e?.response?.data?.code;
      if (code === "RENTAL_FINALIZED") {
        showAlert("info", "Já finalizado", "Esse aluguel já foi finalizado.");
      } else {
        showAlert("error", "Erro", "Não foi possível atualizar o aluguel.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ManageBackground />

      <ManageContainer>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#31358B" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Jogos Alugados</Text>
            <Text style={styles.subtitle}>Acompanhe e gerencie os aluguéis</Text>

            <View style={styles.countRow}>
              <View style={styles.countPill}>
                <Ionicons name="albums-outline" size={14} color="#31358B" />
                <Text style={styles.countText}>Total: {counts.total}</Text>
              </View>

              <View style={styles.countPill}>
                <Ionicons name="alert-circle-outline" size={14} color="#B3193A" />
                <Text style={styles.countText}>Atrasados: {counts.overdue}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#535353" />
          <TextInput
            style={styles.input}
            placeholder="Buscar por jogo, aluno, email, exemplar..."
            placeholderTextColor="#333"
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
            onSubmitEditing={() => fetchRentals(1)}
          />

          <Pressable
            onPress={() => {
              setOverdueOnly((p) => !p);
            }}
            style={[styles.overdueBtn, overdueOnly && styles.overdueBtnActive]}
          >
            <Ionicons name="time-outline" size={18} color={overdueOnly ? "#fff" : "#31358B"} />
          </Pressable>
        </View>

        <View style={styles.chipsRow}>
          {chips.map((c) => (
            <Pressable
              key={c.value}
              onPress={() => setStatus(c.value)}
              style={[styles.chip, status === c.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, status === c.value && styles.chipTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {loading ? (
          <View style={{ paddingTop: 18 }}>
            <ActivityIndicator size="large" color="#31358B" />
          </View>
        ) : (
          <FlatList
            data={rentals}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <RentalRow item={item} onPress={() => setSelected(item)} />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator style={{ marginVertical: 16 }} color="#31358B" />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="stats-chart-outline" size={46} color="#999" />
                <Text style={styles.emptyTitle}>Nenhum aluguel encontrado</Text>
                <Text style={styles.emptySubtitle}>Ajuste os filtros ou tente outra busca.</Text>
              </View>
            }
          />
        )}

        <RentalActionsSheet
          visible={!!selected}
          rental={selected}
          saving={saving}
          onClose={() => setSelected(null)}
          onSetStatus={setRentalStatus}
        />

        <LudusAlert
          visible={alertVisible}
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ManageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#31358B" },
  subtitle: { fontSize: 14, color: "#535353", marginTop: 2 },

  countRow: { flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" },
  countPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0F2FF",
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 14,
  },
  countText: { fontSize: 12, fontWeight: "900", color: "#31358B" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    marginBottom: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14, color: "#333" },

  overdueBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  overdueBtnActive: { backgroundColor: "#31358B" },

  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  chip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#31358B", borderColor: "#31358B" },
  chipText: { color: "#535353", fontWeight: "800", fontSize: 12 },
  chipTextActive: { color: "#fff" },

  emptyWrap: { alignItems: "center", justifyContent: "center", paddingTop: 30 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#31358B" },
  emptySubtitle: { marginTop: 6, fontSize: 14, color: "#777", textAlign: "center" },
});