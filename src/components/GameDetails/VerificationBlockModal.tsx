import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  isIfmaMode,
  VERIFICATION_PENDING_TEXT,
  type VerificationStatus,
} from "@/src/utils/verification";

// Situação do cadastro que impede o aluguel (APPROVED não abre o modal).
export type BlockType = Exclude<VerificationStatus, "APPROVED"> | null;

interface Props {
  visible: boolean;
  type: BlockType;
  rejectReason?: string | null;
  onClose: () => void;
  onAction: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export function VerificationBlockModal({
  visible,
  type,
  rejectReason,
  onClose,
  onAction,
}: Props) {
  if (!type) return null;

  const ifma = isIfmaMode();

  const content = {
    NOT_SUBMITTED: ifma
      ? {
          icon: "school",
          color: "#FBBC04",
          bg: "#FFF9E6",
          title: "Vínculo Necessário 🎓",
          message:
            "Para alugar jogos no campus Timon, envie seu documento de identificação e o comprovante de matrícula. A biblioteca analisa e libera os aluguéis.",
          actionText: "Enviar Documentos",
          showCancel: true,
          textColor: "#04096E",
        }
      : {
          icon: "warning",
          color: "#FBBC04",
          bg: "#FFF9E6",
          title: "Quase lá! 🛡️",
          message:
            "Para garantir a segurança do acervo, envie o seu documento (frente e verso), o comprovante de residência e a selfie.",
          actionText: "Enviar Agora",
          showCancel: true,
          textColor: "#04096E",
        },
    PENDING: {
      icon: "time",
      color: "#04096E",
      bg: "#F0F2FF",
      title: "Em Análise ⏳",
      message: VERIFICATION_PENDING_TEXT,
      actionText: "Entendido",
      showCancel: false,
      textColor: "#FFFFFF",
    },
    REJECTED: {
      icon: "alert-circle",
      color: "#E62325",
      bg: "#FEF2F2",
      title: "Cadastro Recusado",
      message: rejectReason
        ? `A biblioteca recusou seus documentos. Motivo: ${rejectReason}\n\nCorrija e reenvie para liberar os aluguéis.`
        : "A biblioteca recusou seus documentos. Confira os arquivos e reenvie para liberar os aluguéis.",
      actionText: "Reenviar Documentos",
      showCancel: true,
      textColor: "#FFFFFF",
    },
    BLOCKED: {
      icon: "lock-closed",
      color: "#E62325",
      bg: "#FEF2F2",
      title: "Conta Suspensa",
      message:
        "Sua conta foi suspensa por um administrador e não pode fazer aluguéis. Contate o suporte para mais informações.",
      actionText: "Entendido",
      showCancel: false,
      textColor: "#FFFFFF",
    },
  }[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.iconWrap, { backgroundColor: content.bg }]}>
              <Ionicons
                name={content.icon as any}
                size={36}
                color={content.color}
              />
            </View>

            <Text maxFontSizeMultiplier={1.2} style={styles.title}>
              {content.title}
            </Text>
            <Text maxFontSizeMultiplier={1.2} style={styles.message}>
              {content.message}
            </Text>

            <View style={styles.buttonRow}>
              {content.showCancel && (
                <Pressable
                  style={[styles.baseButton, styles.cancelButton]}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text maxFontSizeMultiplier={1.1} style={styles.cancelText}>
                    Depois
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.baseButton,
                  styles.actionButton,
                  { backgroundColor: content.color },
                  !content.showCancel && { flex: 1 },
                ]}
                onPress={onAction}
                accessibilityRole="button"
              >
                <Text
                  maxFontSizeMultiplier={1.1}
                  numberOfLines={2}
                  style={[styles.actionText, { color: content.textColor }]}
                >
                  {content.actionText}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4, 9, 110, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 380,
    maxHeight: SCREEN_HEIGHT * 0.82,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    overflow: "hidden",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "900",
    color: "#04096E",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#535353",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
    width: "100%",
  },
  baseButton: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F2F4F8",
  },
  cancelText: {
    color: "#7A8194",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  actionButton: {
    flex: 1.4,
  },
  actionText: {
    fontWeight: "900",
    fontSize: 14,
    textAlign: "center",
  },
});
