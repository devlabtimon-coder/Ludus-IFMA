import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export const BLUE = "#04096D";
export const YELLOW = "#FBBC04";
export const RED = "#E53935";
export const GRAY = "#8A8A8A";

const DEFAULT_AVATAR = require("../../../assets/profile-default.png");

export type LeaderRow = {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  avatar?: string | null;
  picture?: string | null;
  category?: string;
};

export type MeRow = {
  userId: string;
  name: string;
  points: number;
  level: number;
  levelName?: string;
  rank: number;
  avatar?: string | null;
  picture?: string | null;
  category?: string;
};

export type ActiveSeason = {
  id: string;
  name: string;
  endDate: string;
  rewards: any;
};

export function rankBadgeStyle(rank: number) {
  if (rank === 1)
    return { bg: "rgba(251,188,4,0.2)", fg: "#9A6B00", border: "#FBBC04" };
  if (rank === 2)
    return { bg: "rgba(156,163,175,0.2)", fg: "#4B5563", border: "#9CA3AF" };
  if (rank === 3)
    return { bg: "rgba(205,127,50,0.2)", fg: "#9A3412", border: "#CD7F32" };
  return { bg: "rgba(4,9,110,0.06)", fg: BLUE, border: "transparent" };
}

export function categoryBadgeStyle(cat?: string) {
  const c = (cat || "STARTER").toUpperCase();
  if (c === "ULTRAGAMER")
    return { bg: BLUE, text: YELLOW, label: "Ultragamer" };
  if (c === "EXPERT") return { bg: "#31358B", text: "#fff", label: "Expert" };
  if (c === "FAMILY") return { bg: YELLOW, text: BLUE, label: "Family" };
  return { bg: "#E5E7EB", text: "#374151", label: "Starter" };
}

export function getLevelTitle(levelNumber: number) {
  switch (levelNumber) {
    case 1:
      return "Iniciante";
    case 2:
      return "Veterano";
    case 3:
      return "Mestre";
    case 4:
      return "Lenda";
    case 5:
      return "Mito";
    default:
      return `Nível ${levelNumber}`;
  }
}

export function Avatar({ uri, picture, size = 42, radius = 14 }: any) {
  const sourceUri = uri || picture || null;
  return (
    <Image
      source={sourceUri ? { uri: sourceUri } : DEFAULT_AVATAR}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: "#EAEAEA",
      }}
    />
  );
}

export function RulesBox() {
  return (
    <View style={styles.rulesBox}>
      <Text style={styles.rulesTitle}>Sistema de Pontuação da Ludus</Text>
      <View style={styles.ruleRow}>
        <View style={[styles.dot, { backgroundColor: YELLOW }]} />
        <Text style={styles.ruleText}>
          +5 pts ao confirmar a retirada oficial
        </Text>
      </View>
      <View style={styles.ruleRow}>
        <View style={[styles.dot, { backgroundColor: BLUE }]} />
        <Text style={styles.ruleText}>+5 pts ao devolver no tempo correto</Text>
      </View>
      <View style={styles.ruleRow}>
        <View style={[styles.dot, { backgroundColor: GRAY }]} />
        <Text style={styles.ruleText}>+2 pts ao devolver com atraso</Text>
      </View>
      <View style={styles.ruleRow}>
        <View style={[styles.dot, { backgroundColor: RED }]} />
        <Text style={styles.ruleText}>
          -20 pts por danos ou perda de componentes
        </Text>
      </View>
    </View>
  );
}

export function MeBox({ me }: { me: MeRow | null }) {
  if (!me) return null;

  const lvl = me.levelName ?? getLevelTitle(me.level);
  const catStyle = categoryBadgeStyle(me.category);

  return (
    <View style={styles.meBox}>
      <View style={styles.meLeft}>
        <View style={styles.avatarWrap}>
          <Avatar uri={me.avatar} picture={me.picture} size={48} radius={16} />
          <View style={styles.meRankFloat}>
            <Text style={styles.meRankText}>#{me.rank}</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.meTitle} numberOfLines={1}>
            {me.name}{" "}
            <Text style={{ fontWeight: "normal", fontSize: 12 }}> (Você)</Text>
          </Text>
          <View style={styles.badgesInline}>
            <Text style={styles.meSub}>{lvl}</Text>
            <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
              <Text style={[styles.catBadgeText, { color: catStyle.text }]}>
                {catStyle.label}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.mePtsPill}>
        <Ionicons name="medal" size={14} color={BLUE} />
        <Text style={styles.mePtsText}>{me.points} pts</Text>
      </View>
    </View>
  );
}

export function RankingRow({ item, isMe }: { item: LeaderRow; isMe: boolean }) {
  const lvl = item.levelName ?? getLevelTitle(item.level);
  const badge = rankBadgeStyle(item.rank);
  const catStyle = categoryBadgeStyle(item.category);

  return (
    <View
      style={[
        styles.row,
        isMe && styles.rowMe,
        {
          borderColor:
            badge.border !== "transparent" ? badge.border : "#F3F4F6",
        },
      ]}
    >
      <View style={[styles.rankBadge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.rankBadgeText, { color: badge.fg }]}>
          {item.rank}
        </Text>
      </View>
      <Avatar uri={item.avatar} picture={item.picture} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name} {isMe ? " (você)" : ""}
        </Text>
        <View style={styles.badgesInline}>
          <Text style={styles.meta} numberOfLines={1}>
            {lvl}
          </Text>
          <View style={[styles.catBadge, { backgroundColor: catStyle.bg }]}>
            <Text style={[styles.catBadgeText, { color: catStyle.text }]}>
              {catStyle.label}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.pointsPill}>
        <Ionicons name="medal" size={14} color="#9A6B00" />
        <Text style={styles.pointsText}>{item.points}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rulesBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rulesTitle: {
    fontWeight: "900",
    color: "#1A1A2E",
    marginBottom: 12,
    fontSize: 14,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 999 },
  ruleText: { color: "#4B5563", fontWeight: "600", fontSize: 12 },
  meBox: {
    backgroundColor: BLUE,
    borderRadius: 22,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  meLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
  avatarWrap: { position: "relative" },
  meRankFloat: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: YELLOW,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: BLUE,
  },
  meRankText: { color: BLUE, fontSize: 10, fontWeight: "900" },
  meTitle: { color: "#fff", fontWeight: "900", fontSize: 16 },
  badgesInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  meSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
  catBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  catBadgeText: { fontSize: 9, fontWeight: "900", textTransform: "uppercase" },
  mePtsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: YELLOW,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  mePtsText: { color: BLUE, fontWeight: "900", fontSize: 13 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  rowMe: { backgroundColor: "#F0F2FF" },
  rankBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeText: { fontWeight: "900", fontSize: 15 },
  name: { fontWeight: "900", color: "#1A1A2E", fontSize: 15 },
  meta: { color: "#6B7280", fontSize: 12, fontWeight: "600" },
  pointsPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,193,7,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pointsText: { fontWeight: "900", color: "#9A6B00", fontSize: 13 },
});
