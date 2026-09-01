import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActiveSeason, BLUE } from "./RankingComponents";

type Props = {
  visible: boolean;
  onClose: () => void;
  season: ActiveSeason | null;
  userLevel: number;
};

export function RewardsModal({ visible, onClose, season, userLevel }: Props) {
  const router = useRouter();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Recompensas</Text>
              <Text style={styles.modalSubtitle}>
                {season?.name || "Temporada Atual"}
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {[2, 3, 4, 5].map((lvl, index) => {
              const isReached = userLevel >= lvl;
              const rewardDesc =
                season?.rewards?.[`nivel${lvl}`]?.cuponsGerados?.[0]
                  ?.descricao || `Recompensa Surpresa do Nível ${lvl}`;

              return (
                <View key={lvl} style={styles.roadmapRow}>
                  {index !== 3 && (
                    <View
                      style={[
                        styles.roadmapLine,
                        { backgroundColor: isReached ? BLUE : "#E5E7EB" },
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.roadmapIconWrap,
                      isReached
                        ? { backgroundColor: BLUE, borderColor: BLUE }
                        : { backgroundColor: "#fff", borderColor: "#D1D5DB" },
                    ]}
                  >
                    <Ionicons
                      name={isReached ? "checkmark-sharp" : "lock-closed"}
                      size={20}
                      color={isReached ? "#fff" : "#9CA3AF"}
                    />
                  </View>
                  <View style={styles.roadmapTextWrap}>
                    <Text
                      style={[
                        styles.roadmapLevelText,
                        { color: isReached ? BLUE : "#6B7280" },
                      ]}
                    >
                      Nível {lvl}
                    </Text>
                    <Text
                      style={[
                        styles.roadmapRewardText,
                        { color: isReached ? "#111" : "#9CA3AF" },
                      ]}
                    >
                      {rewardDesc}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* NOVO BOTÃO DE ACESSO À CARTEIRA */}
          <Pressable
            style={styles.walletBtn}
            onPress={() => {
              onClose();
              router.push("/wallet");
            }}
          >
            <Ionicons name="ticket" size={20} color="#fff" />
            <Text style={styles.walletBtnText}>Acessar Minha Carteira</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "900", color: BLUE },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  roadmapRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    position: "relative",
  },
  roadmapLine: {
    position: "absolute",
    left: 21,
    top: 30,
    bottom: -40,
    width: 2,
    zIndex: -1,
  },
  roadmapIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  roadmapTextWrap: { flex: 1, justifyContent: "center", minHeight: 44 },
  roadmapLevelText: { fontSize: 14, fontWeight: "900", marginBottom: 4 },
  roadmapRewardText: { fontSize: 15, fontWeight: "700" },

  walletBtn: {
    marginTop: 12,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  walletBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
