import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { formatDateTime, getRentalStatusMeta } from "@/src/utils/rentals";
import type { RentalItemModel } from "./RentalItem";

const CANCEL_PENALTY_WINDOW_MS = 2 * 60 * 60 * 1000;

type Props = {
  visible: boolean;
  rental: RentalItemModel | null;
  onClose: () => void;
  onCancelRental: (rentalId: string) => void | Promise<void>;
  cancelLoading?: boolean;
  // Erro do último cancelamento, mostrado dentro do próprio modal: no iOS
  // outro Modal (alerta) não abre por cima deste.
  cancelError?: string | null;
};

function getRemainingText(endDate: string, status: string) {
  if ((status || "").toUpperCase() !== "ACTIVE") return null;

  const end = new Date(endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) return "Prazo encerrado";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} dia${days > 1 ? "s" : ""} restante${days > 1 ? "s" : ""}`;
  }

  return `${hours} hora${hours > 1 ? "s" : ""} restante${hours > 1 ? "s" : ""}`;
}

export default function RentalDetailsModal({
  visible,
  rental,
  onClose,
  onCancelRental,
  cancelLoading = false,
  cancelError = null,
}: Props) {
  // Cancelar pede confirmação: o primeiro toque só mostra o aviso.
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    setConfirmingCancel(false);
  }, [rental?.id, visible]);

  if (!rental) return null;

  const status = getRentalStatusMeta(rental.status);
  const remainingText = getRemainingText(rental.endDate, rental.status);

  const canCancel = (rental.status || "").toUpperCase() === "PENDING";

  // Regra de produto: só perde pontos quem cancela com menos de 2 h para a
  // retirada.
  const cancelLosesPoints =
    new Date(rental.startDate).getTime() - Date.now() < CANCEL_PENALTY_WINDOW_MS;

  const copyLabel =
    rental.copy?.number != null
      ? `Exemplar #${rental.copy.number}${rental.copy.code ? ` • ${rental.copy.code}` : ""}`
      : "Jogo original";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Detalhes do aluguel</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar detalhes do aluguel"
              hitSlop={6}
            >
              <Ionicons name="close" size={20} color="#31358B" />
            </Pressable>
          </View>

          <View style={styles.gameRow}>
            {rental.game.cover ? (
              <Image source={{ uri: rental.game.cover }} style={styles.image} />
            ) : (
              <View style={[styles.image, { backgroundColor: "#EEE" }]} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.gameTitle}>{rental.game.title}</Text>

              <View style={[styles.badge, { backgroundColor: status.color }]}>
                <Text style={styles.badgeText}>{status.label}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{status.description}</Text>

          {remainingText ? (
            <View style={styles.infoBoxHighlight}>
              <Ionicons name="time-outline" size={18} color="#2FA84F" />
              <Text style={styles.infoBoxHighlightText}>{remainingText}</Text>
            </View>
          ) : null}

          <View style={styles.infoBox}>
            <InfoRow icon="cube-outline" label="Exemplar" value={copyLabel} />
            <InfoRow icon="calendar-outline" label="Retirada" value={formatDateTime(rental.startDate)} />
            <InfoRow icon="calendar-clear-outline" label="Devolução até" value={formatDateTime(rental.endDate)} />
          </View>

          {canCancel && confirmingCancel ? (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Cancelar esta reserva?</Text>
              <Text style={styles.confirmText}>
                {cancelLosesPoints
                  ? "Como faltam menos de 2 horas, você perde 2 pontos."
                  : "Cancelar com antecedência não tira pontos."}
              </Text>

              {cancelError ? (
                <Text style={styles.errorText} accessibilityRole="alert">
                  {cancelError}
                </Text>
              ) : null}

              <View style={styles.confirmRow}>
                <Pressable
                  style={[styles.keepBtn, cancelLoading && { opacity: 0.7 }]}
                  onPress={() => setConfirmingCancel(false)}
                  disabled={cancelLoading}
                  accessibilityRole="button"
                >
                  <Text style={styles.keepBtnText}>Manter reserva</Text>
                </Pressable>

                <Pressable
                  style={[styles.confirmBtn, cancelLoading && { opacity: 0.7 }]}
                  onPress={() => onCancelRental(rental.id)}
                  disabled={cancelLoading}
                  accessibilityRole="button"
                  accessibilityLabel="Sim, cancelar reserva"
                  accessibilityState={{ busy: cancelLoading, disabled: cancelLoading }}
                >
                  {cancelLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.cancelBtnText}>Sim, cancelar</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : canCancel ? (
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setConfirmingCancel(true)}
              accessibilityRole="button"
            >
              <Text style={styles.cancelBtnText}>Cancelar reserva</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={17} color="#8B8EA1" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
  },

  handle: {
    width: 52,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E4E6EE",
    alignSelf: "center",
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2C2C2C",
  },

  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F6FA",
  },

  gameRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  image: {
    width: 82,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "#EEE",
  },

  gameTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2C2C2C",
  },

  badge: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 12,
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
  },

  description: {
    marginTop: 14,
    color: "#6A6A6A",
    fontWeight: "700",
    lineHeight: 20,
  },

  infoBoxHighlight: {
    marginTop: 16,
    backgroundColor: "#EEF9F1",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  infoBoxHighlightText: {
    color: "#2FA84F",
    fontWeight: "900",
    fontSize: 14,
  },

  infoBox: {
    marginTop: 16,
    backgroundColor: "#F8F8FB",
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },

  infoRow: {
    gap: 6,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  infoLabel: {
    color: "#8B8EA1",
    fontWeight: "800",
    fontSize: 12,
  },

  infoValue: {
    marginTop: 4,
    color: "#2C2C2C",
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 20,
  },

  cancelBtn: {
    marginTop: 18,
    backgroundColor: "#B3193A",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmBox: {
    marginTop: 18,
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 14,
  },

  confirmTitle: {
    color: "#B3193A",
    fontWeight: "900",
    fontSize: 15,
  },

  confirmText: {
    marginTop: 4,
    color: "#6A6A6A",
    fontWeight: "700",
    lineHeight: 20,
  },

  errorText: {
    marginTop: 10,
    color: "#B3193A",
    fontWeight: "800",
    lineHeight: 20,
  },

  confirmRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  keepBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E6E6EF",
  },

  keepBtnText: {
    color: "#2C2C2C",
    fontWeight: "900",
    fontSize: 14,
  },

  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B3193A",
  },

  cancelBtnText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 15,
  },
});