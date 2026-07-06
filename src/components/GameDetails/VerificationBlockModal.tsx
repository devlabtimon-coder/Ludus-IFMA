import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type BlockType =
  | "IFMA_UNVERIFIED"
  | "DOCS_UNVERIFIED"
  | "DOCS_PENDING"
  | "DOCS_REJECTED"
  | null;

interface Props {
  visible: boolean;
  type: BlockType;
  onClose: () => void;
  onAction: () => void;
}

export function VerificationBlockModal({
  visible,
  type,
  onClose,
  onAction,
}: Props) {
  if (!type) return null;

  const content = {
    IFMA_UNVERIFIED: {
      icon: "school",
      color: "#FBBC04",
      bg: "#FFF9E6",
      title: "Vínculo Necessário 🎓",
      message:
        "Para alugar jogos no campus Timon, precisamos que você envie alguns documentos que comprovem seu vínculo com o IFMA.",
      actionText: "Enviar Documentos",
      showCancel: true,
      textColor: "#ffffff",
    },
    DOCS_UNVERIFIED: {
      icon: "warning",
      color: "#FBBC04",
      bg: "#FFF9E6",
      title: "Quase lá! 🛡️",
      message:
        "Para garantir a segurança do nosso acervo, precisamos que você envie a foto do seu documento e comprovante de residência.",
      actionText: "Enviar Agora",
      showCancel: true,
      textColor: "#04096E",
    },
    DOCS_PENDING: {
      icon: "time",
      color: "#04096E",
      bg: "#F0F2FF",
      title: "Em Análise ⏳",
      message:
        "Seus documentos ainda estão sendo avaliados. Assim que forem aprovados, o aluguel será liberado!",
      actionText: "Entendido",
      showCancel: false,
      textColor: "#FFFFFF",
    },
    DOCS_REJECTED: {
      icon: "alert-circle",
      color: "#E62325",
      bg: "#FEF2F2",
      title: "Atenção aos Documentos",
      message:
        "Houve um problema com suas fotos. Você precisa enviar novamente para conseguir alugar.",
      actionText: "Reenviar",
      showCancel: true,
      textColor: "#FFFFFF",
    },
  }[type];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: content.bg }]}>
            <Ionicons
              name={content.icon as any}
              size={36}
              color={content.color}
            />
          </View>

          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>

          <View style={styles.buttonRow}>
            {content.showCancel && (
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Depois</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.actionButton, { backgroundColor: content.color }]}
              onPress={onAction}
            >
              <Text style={[styles.actionText, { color: content.textColor }]}>
                {content.actionText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,9,110,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#04096E",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#535353",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#F2F4F8",
    borderRadius: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#7A8194",
    fontWeight: "700",
    fontSize: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  actionText: {
    fontWeight: "900",
    fontSize: 15,
  },
});
