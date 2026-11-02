import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { api } from "@/src/services/api";
import { formatDate } from "@/src/utils/rentals";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

const BLUE = "#04096D";
const GRAY = "#8A8A8A";

type CouponStatus = "ATIVO" | "USADO" | "EXPIRADO";

// O servidor já mandou o status em minúsculas ("ativo", "utilizado",
// "expirado") e passa a mandar ATIVO | USADO | EXPIRADO: aceita os dois.
type Coupon = {
  id: string;
  code: string;
  rewardType?: string | null;
  type?: string | null;
  description?: string | null;
  status?: string | null;
  seasonName?: string | null;
  // Nulo = vale até o fim da próxima temporada.
  expiresAt?: string | null;
  usedAt?: string | null;
  createdAt?: string;
};

function normalizeStatus(status?: string | null): CouponStatus {
  const s = (status ?? "").toUpperCase();
  if (s === "USADO" || s === "UTILIZADO") return "USADO";
  if (s === "EXPIRADO") return "EXPIRADO";
  return "ATIVO";
}

const STATUS_COLORS: Record<CouponStatus, { bg: string; fg: string }> = {
  ATIVO: { bg: "rgba(34,197,94,0.12)", fg: "#15803D" },
  USADO: { bg: "rgba(4,9,110,0.08)", fg: BLUE },
  EXPIRADO: { bg: "rgba(229,57,53,0.10)", fg: "#C62828" },
};

function statusLabel(status: CouponStatus, usedAt?: string | null) {
  if (status === "USADO") {
    return usedAt ? `Usado em ${formatDate(usedAt).slice(0, 5)}` : "Usado";
  }
  if (status === "EXPIRADO") return "Expirado";
  return "Ativo";
}

function validityText(expiresAt?: string | null) {
  if (!expiresAt) return "Válido até o fim da próxima temporada";
  return `Válido até ${formatDate(expiresAt)}`;
}

export default function WalletScreen() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"ativos" | "historico">("ativos");

  const loadCoupons = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get<Coupon[]>("/engagement/my-coupons");
      setCoupons(res.data);
    } catch (error) {
      console.error("Erro ao buscar cupons", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCoupons(false);
  }, []);

  const filteredCoupons = coupons.filter((c) =>
    filter === "ativos"
      ? normalizeStatus(c.status) === "ATIVO"
      : normalizeStatus(c.status) !== "ATIVO",
  );

  const renderTicket = ({ item }: { item: Coupon }) => {
    const status = normalizeStatus(item.status);
    const isAtivo = status === "ATIVO";
    const colors = STATUS_COLORS[status];

    return (
      <View style={[styles.ticketContainer, !isAtivo && styles.ticketDisabled]}>
        <View style={styles.ticketLeft}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(251,188,4,0.15)" }]}>
            <Ionicons name="gift" size={24} color="#9A6B00" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Text style={styles.kindBadge}>Brinde</Text>
              <Text
                style={[
                  styles.statusBadge,
                  { backgroundColor: colors.bg, color: colors.fg },
                ]}
              >
                {statusLabel(status, item.usedAt)}
              </Text>
            </View>
            <Text style={styles.ticketTitle} numberOfLines={2}>
              {item.description || "Brinde da temporada"}
            </Text>
            {!!item.seasonName && (
              <Text style={styles.ticketSeason}>{item.seasonName}</Text>
            )}
            {status !== "USADO" && (
              <Text
                style={[
                  styles.ticketExpire,
                  status === "EXPIRADO" && { color: RED },
                ]}
              >
                {validityText(item.expiresAt)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.ticketDivider}>
          <View style={styles.notchTop} />
          <View style={styles.dashedLine} />
          <View style={styles.notchBottom} />
        </View>

        <View style={styles.ticketRight}>
          <Text style={styles.codeLabel}>CÓDIGO</Text>
          <View style={[styles.codeBox, !isAtivo && styles.codeBoxDisabled]}>
            <Text
              selectable
              style={[styles.codeText, !isAtivo && styles.codeTextDisabled]}
            >
              {item.code}
            </Text>
          </View>
          {isAtivo && (
            <Text style={styles.codeHint}>Mostre na biblioteca</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.page}>
      <LoginBackground />
      <BackButton />

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Brindes</Text>
          <Text style={styles.subtitle}>
            Mostre este código na biblioteca para retirar seu brinde.
          </Text>
        </View>

        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabBtn, filter === "ativos" && styles.tabBtnActive]}
            onPress={() => setFilter("ativos")}
          >
            <Text
              style={[
                styles.tabText,
                filter === "ativos" && styles.tabTextActive,
              ]}
            >
              Disponíveis
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabBtn,
              filter === "historico" && styles.tabBtnActive,
            ]}
            onPress={() => setFilter("historico")}
          >
            <Text
              style={[
                styles.tabText,
                filter === "historico" && styles.tabTextActive,
              ]}
            >
              Histórico
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={BLUE} size="large" />
            <Text style={styles.centerText}>Carregando sua carteira...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredCoupons}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadCoupons(true)}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="sad-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  {filter === "ativos"
                    ? "Você não tem nenhum brinde disponível no momento.\nContinue alugando e subindo de nível!"
                    : "Seu histórico está vazio."}
                </Text>
              </View>
            }
            renderItem={renderTicket}
          />
        )}
      </View>
    </View>
  );
}

const RED = "#E53935";

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  card: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#F7F8FF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: { paddingHorizontal: 24, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "900", color: BLUE },
  subtitle: {
    fontSize: 13,
    color: GRAY,
    marginTop: 4,
    fontWeight: "500",
    marginBottom: 20,
  },

  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
  tabBtnActive: { backgroundColor: BLUE },
  tabText: { fontSize: 13, fontWeight: "800", color: "#64748B" },
  tabTextActive: { color: "#fff" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerText: { marginTop: 12, color: GRAY, fontWeight: "600" },

  listContent: { paddingHorizontal: 24, paddingBottom: 40 },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: "center",
    color: GRAY,
    marginTop: 12,
    lineHeight: 20,
    fontWeight: "500",
  },

  ticketContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  ticketDisabled: { opacity: 0.6, backgroundColor: "#F9FAFB" },

  ticketLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111",
    marginBottom: 2,
  },
  ticketSeason: { fontSize: 12, color: BLUE, fontWeight: "700" },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  kindBadge: {
    fontSize: 10,
    fontWeight: "900",
    color: "#9A6B00",
    backgroundColor: "rgba(251,188,4,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  ticketExpire: { fontSize: 11, color: GRAY, marginTop: 6, fontWeight: "600" },

  ticketDivider: {
    width: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dashedLine: {
    flex: 1,
    width: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    marginVertical: 4,
  },
  notchTop: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F7F8FF",
    position: "absolute",
    top: -8,
  },
  notchBottom: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F7F8FF",
    position: "absolute",
    bottom: -8,
  },

  ticketRight: {
    width: 120,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: GRAY,
    marginBottom: 4,
    letterSpacing: 1,
  },
  codeBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: BLUE,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  codeBoxDisabled: { borderColor: GRAY, backgroundColor: "#E5E7EB" },
  codeText: {
    fontSize: 13,
    fontWeight: "900",
    color: BLUE,
    textAlign: "center",
  },
  codeTextDisabled: { color: GRAY },
  codeHint: {
    fontSize: 9,
    color: BLUE,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
});
