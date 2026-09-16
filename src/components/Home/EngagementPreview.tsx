import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getLevelTitle } from "@/src/components/Ranking/RankingComponents";

type MeRow = {
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  rank: number;
  category?: string;
  seasonName?: string;
};

const BLUE = "#04096E";
const YELLOW = "#FBBC04";
const RED = "#E62325";
const MAX_SEASON_POINTS = 1500;

export function EngagementPreview() {
  const router = useRouter();
  const [me, setMe] = useState<MeRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await api.get<MeRow>("/engagement/me");
        if (mounted) setMe(res.data ?? null);
      } catch (e: any) {
        if (mounted) setMe(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const points = me?.points || 0;
  const progressPct = Math.min(
    100,
    Math.max(0, (points / MAX_SEASON_POINTS) * 100),
  );

  const customLevelName = me?.levelName ?? getLevelTitle(me?.level || 1);

  return (
    <Pressable style={styles.card} onPress={() => router.push("/ranking")}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.tagText} numberOfLines={1}>
            {loading
              ? "CARREGANDO..."
              : me?.seasonName?.toUpperCase() || "TEMPORADA ATUAL"}
          </Text>
          <Text style={styles.title}>Meu Desempenho</Text>
        </View>
        <View style={styles.arrowBox}>
          <Text style={styles.arrowText}>Ver Ranking</Text>
          <Ionicons name="chevron-forward" size={14} color={BLUE} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={BLUE} />
        </View>
      ) : (
        <>
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>Progresso para Lenda</Text>
              <Text style={styles.progressValue}>
                {Math.round(progressPct)}%
              </Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.bar, { width: `${progressPct}%` }]} />
            </View>
          </View>

          <View style={styles.badgesRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: "#F0F2FF",
                  borderColor: "rgba(4,9,110,0.1)",
                },
              ]}
            >
              <Ionicons name="medal" size={16} color={BLUE} />
              <Text style={[styles.badgeValue, { color: BLUE }]}>
                {points} pts
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: "#FEF2F2",
                  borderColor: "rgba(230,35,37,0.1)",
                },
              ]}
            >
              <Ionicons name="star" size={16} color={RED} />

              <Text
                style={[styles.badgeValue, { color: RED }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {customLevelName}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: YELLOW, borderColor: "rgba(251,188,4,0.3)" },
              ]}
            >
              <Ionicons name="trophy" size={16} color={BLUE} />
              <Text style={[styles.badgeValue, { color: BLUE }]}>
                {me?.rank ? `#${me.rank}` : "—"}
              </Text>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#04096D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  tagText: {
    color: RED,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    color: BLUE,
    fontSize: 18,
    fontWeight: "900",
  },
  arrowBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  arrowText: {
    color: BLUE,
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 2,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },
  progressValue: {
    color: BLUE,
    fontSize: 11,
    fontWeight: "900",
  },
  track: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    backgroundColor: BLUE,
    borderRadius: 999,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 4,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: "900",
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
