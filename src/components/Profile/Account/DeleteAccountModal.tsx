import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  hasPassword: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

const RED = "#E62325";

// Exclusão da conta (App Store 5.1.1(v) e LGPD). O erro fica dentro do
// próprio modal: no iOS um alerta não abre por cima de outro Modal.
export function DeleteAccountModal({
  visible,
  hasPassword,
  onClose,
  onDeleted,
}: Props) {
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setConfirmation("");
    setPassword("");
    setError(null);
  }, [visible]);

  const canDelete =
    confirmation.trim().toUpperCase() === "EXCLUIR" &&
    (!hasPassword || password.length > 0) &&
    !deleting;

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await api.delete("/users/me", {
        data: {
          confirmation: "EXCLUIR",
          ...(hasPassword && { password }),
        },
      });
      onDeleted();
    } catch (e: any) {
      setError(
        e?.response?.data?.error ||
          "Não foi possível excluir a conta. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !deleting && onClose()}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="trash-outline" size={24} color={RED} />
          </View>

          <Text style={styles.title}>Excluir sua conta?</Text>
          <Text style={styles.message}>
            Seus dados pessoais, documentos, foto, favoritos, avisos e cupons
            serão apagados e você sairá do ranking. Reservas pendentes serão
            canceladas. Os aluguéis já feitos ficam no histórico da biblioteca
            sem o seu nome. Essa ação não pode ser desfeita.
          </Text>

          {hasPassword && (
            <>
              <Text style={styles.label}>Sua senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
                autoComplete="current-password"
                placeholder="Senha"
                placeholderTextColor="#999"
                style={styles.input}
                editable={!deleting}
              />
            </>
          )}

          <Text style={styles.label}>Digite EXCLUIR para confirmar</Text>
          <TextInput
            value={confirmation}
            onChangeText={setConfirmation}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="EXCLUIR"
            placeholderTextColor="#999"
            style={styles.input}
            editable={!deleting}
            accessibilityLabel="Digite EXCLUIR para confirmar"
          />

          {error && (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {error}
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.cancel]}
              onPress={onClose}
              disabled={deleting}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.danger,
                !canDelete && styles.disabled,
              ]}
              onPress={handleDelete}
              disabled={!canDelete}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canDelete }}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.dangerText}>Excluir conta</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFE9EA",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    textAlign: "center",
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    color: RED,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: {
    backgroundColor: "#F3F4F6",
  },
  cancelText: {
    fontWeight: "700",
    color: "#374151",
  },
  danger: {
    backgroundColor: RED,
  },
  dangerText: {
    fontWeight: "800",
    color: "#fff",
  },
  disabled: {
    opacity: 0.5,
  },
});
