import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { api } from "@/src/services/api";
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

import {
  ActiveSeason,
  BLUE,
  LeaderRow,
  MeBox,
  MeRow,
  RankingRow,
  RED,
  RulesBox,
} from "@/src/components/Ranking/RankingComponents";
import { RewardsModal } from "@/src/components/Ranking/RewardsModal";

export default function RankingScreen() {
  const [me, setMe] = useState<MeRow | null>(null);
  const [data, setData] = useState<LeaderRow[]>([]);
  const [season, setSeason] = useState<ActiveSeason | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErr(null);

    try {
      const [leaderRes, meRes, seasonRes] = await Promise.all([
        api.get<LeaderRow[]>("/engagement/leaderboard", {
          params: { limit: 50 },
        }),
        api.get<MeRow>("/engagement/me"),
        api.get("/engagement/active-season"),
      ]);

      setData(Array.isArray(leaderRes.data) ? leaderRes.data : []);
      setMe(meRes.data ?? null);
      setSeason(seasonRes.data?.activeSeason ?? null);
    } catch (e) {
      setErr("Não foi possível carregar o ranking.");
      setData([]);
      setMe(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(false);
  }, []);

  return (
    <View style={styles.page}>
      <LoginBackground />
      <BackButton />

      <View style={styles.card}>
        <View style={styles.actionButtonsRow}>
          <Pressable
            style={styles.actionBtn}
            onPress={() => setShowRules((s) => !s)}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={BLUE}
            />
            <Text style={styles.actionBtnText}>Pontuação</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: BLUE }]}
            onPress={() => setShowRewards(true)}
          >
            <Ionicons name="gift-outline" size={18} color="#fff" />
            <Text style={[styles.actionBtnText, { color: "#fff" }]}>
              Recompensas
            </Text>
          </Pressable>
        </View>

        {showRules && <RulesBox />}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={BLUE} size="large" />
            <Text style={styles.centerText}>Carregando ranking...</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.errText}>{err}</Text>
            <Pressable onPress={() => load(false)} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.userId}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => load(true)}
              />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
            ListHeaderComponent={
              <>
                <MeBox me={me} />
                <Text style={styles.sectionTitle}>Líderes da Temporada</Text>
              </>
            }
            renderItem={({ item }) => (
              <RankingRow item={item} isMe={me?.userId === item.userId} />
            )}
          />
        )}
      </View>

      <RewardsModal
        visible={showRewards}
        onClose={() => setShowRewards(false)}
        season={season}
        userLevel={me?.level ?? 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  card: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  actionButtonsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#F0F2FF",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(4,9,110,0.1)",
  },
  actionBtnText: { color: BLUE, fontWeight: "900", fontSize: 13 },
  center: { paddingVertical: 40, alignItems: "center" },
  centerText: { marginTop: 10, color: "#6B7280", fontWeight: "700" },
  errText: { color: RED, fontWeight: "900", textAlign: "center" },
  retryBtn: {
    marginTop: 12,
    backgroundColor: "rgba(4,9,110,0.10)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryText: { color: BLUE, fontWeight: "900" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BLUE,
    marginBottom: 12,
    marginTop: 4,
  },
});
