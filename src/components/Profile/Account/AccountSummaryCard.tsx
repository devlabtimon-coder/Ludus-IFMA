import { Image, StyleSheet, Text, View } from "react-native";

const DEFAULT_AVATAR = require("../../../../assets/profile-default.png");

type Props = {
  name: string;
  email: string;
  avatar?: string | null;
  picture?: string | null;

  points: number;
  level: number;
  levelLabel: string;

  clientCategory: string;
  nextCategory: string | null;
  progress: number;
  rentalsCount: number;
};

export function AccountSummaryCard({
  name,
  email,
  avatar,
  picture,
  points,
  level,
  levelLabel,
  clientCategory,
  nextCategory,
  progress,
  rentalsCount,
}: Props) {
  function getCategoryAccess(category: string) {
    switch (category) {
      case "STARTER":
        return ["Latão", "Bronze"];

      case "FAMILY":
        return ["Latão", "Bronze", "Prata"];

      case "EXPERT":
        return ["Latão", "Bronze", "Prata", "Ouro"];

      case "ULTRAGAMER":
        return ["Todos os níveis"];

      default:
        return [];
    }
  }

  const displayAvatar = avatar || picture || null;
  const progressPercent = Math.round(progress * 100);
  const accessList = getCategoryAccess(clientCategory);

  let target = 11;
  if (rentalsCount <= 10) target = 11;
  else if (rentalsCount <= 30) target = 31;
  else if (rentalsCount <= 60) target = 61;
  else target = rentalsCount;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {displayAvatar ? (
          <Image
            key={displayAvatar}
            source={{ uri: displayAvatar }}
            style={styles.avatar}
          />
        ) : (
          <Image source={DEFAULT_AVATAR} style={styles.avatar} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.badges}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Nv. {level}</Text>
            </View>

            <View style={styles.pointsBadge}>
              <Text style={styles.pointsBadgeText}>{points} pts</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.levelName}>{levelLabel}</Text>

      <View style={styles.categoryBox}>
        <Text style={styles.categoryTitle}>{clientCategory}</Text>

        <Text style={styles.categoryAccess}>
          Acesso: {accessList.join(", ")}
        </Text>

        {nextCategory && (
          <Text style={styles.categoryNext}>Próximo: {nextCategory}</Text>
        )}

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>

        <Text style={styles.progressText}>
          {rentalsCount >= 61
            ? `${rentalsCount} aluguéis realizados (Nível Máximo)`
            : `${rentalsCount}/${target} aluguéis • ${progressPercent}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F7F8FF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    marginBottom: 24,
  },
  categoryAccess: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6E7385",
    marginTop: 4,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 999,
    backgroundColor: "#EAEAEA",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    color: "#31358B",
  },
  email: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "700",
    color: "#6E7385",
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  levelBadge: {
    backgroundColor: "#FBBC04",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  levelBadgeText: {
    color: "#0A1F5C",
    fontWeight: "900",
    fontSize: 12,
  },
  pointsBadge: {
    backgroundColor: "#E62325",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pointsBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  levelName: {
    marginTop: 14,
    color: "#31358B",
    fontSize: 14,
    fontWeight: "800",
  },
  categoryBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#31358B",
  },
  categoryNext: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6E7385",
    marginTop: 2,
  },
  progressBar: {
    marginTop: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E6E8F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FBBC04",
  },
  progressText: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "800",
    color: "#6E7385",
  },
});
