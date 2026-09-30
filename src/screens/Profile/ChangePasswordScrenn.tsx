import HomeBackground from "@/src/components/Home/HomeBackground";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type AlertType = "error" | "success" | "info";

type MeResponse = {
  authProvider?: string;
  hasPassword?: boolean;
};

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [authProvider, setAuthProvider] = useState<string>("LOCAL");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hideCurrent, setHideCurrent] = useState(true);
  const [hideNew, setHideNew] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const [saving, setSaving] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  async function loadPasswordMode() {
    setLoading(true);
    try {
      const res = await api.get<MeResponse>("/users/me");
      setHasPassword(!!res.data?.hasPassword);
      setAuthProvider(res.data?.authProvider || "LOCAL");
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error?.response?.data?.error || "Não foi possível carregar os dados da conta."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPasswordMode();
  }, []);

  async function handleSave() {
    if (hasPassword && !currentPassword.trim()) {
      showAlert("info", "Senha atual", "Informe sua senha atual.");
      return;
    }

    if (newPassword.length < 6) {
      showAlert("info", "Nova senha", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("info", "Confirmação", "As senhas não coincidem.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/users/me/password", {
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });

      // O backend invalida as sessões antigas e devolve um token novo para esta.
      if (res.data?.token) {
        await SecureStore.setItemAsync("token", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      }

      showAlert(
        "success",
        hasPassword ? "Senha alterada" : "Senha criada",
        hasPassword
          ? "Sua senha foi atualizada com sucesso."
          : "Sua senha local foi criada com sucesso."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error?.response?.data?.error || "Não foi possível alterar a senha."
      );
    } finally {
      setSaving(false);
    }
  }

  const title = hasPassword ? "Alterar senha" : "Criar senha";
  const subtitle = hasPassword
    ? "Atualize sua senha de acesso"
    : authProvider === "GOOGLE"
    ? "Crie uma senha para entrar também sem o Google"
    : "Defina sua senha de acesso";

  return (
    <View style={styles.root}>
      <HomeBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#31358B" />
              <Text style={styles.loadingText}>Carregando...</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
            >
              {!hasPassword && (
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={18} color="#31358B" />
                  <Text style={styles.infoText}>
                    Você entrou com Google e ainda não possui senha local. Crie uma senha para
                    também poder entrar com e-mail e senha.
                  </Text>
                </View>
              )}

              {hasPassword && (
                <>
                  <Text style={styles.label}>Senha atual</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={hideCurrent}
                      placeholder="Digite sua senha atual"
                      placeholderTextColor="#8B8EA1"
                      style={styles.input}
                    />
                    <Pressable onPress={() => setHideCurrent((v) => !v)}>
                      <Ionicons
                        name={hideCurrent ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#7A7E8B"
                      />
                    </Pressable>
                  </View>
                </>
              )}

              <Text style={styles.label}>Nova senha</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={hideNew}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#8B8EA1"
                  style={styles.input}
                />
                <Pressable onPress={() => setHideNew((v) => !v)}>
                  <Ionicons
                    name={hideNew ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#7A7E8B"
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Confirmar nova senha</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={hideConfirm}
                  placeholder="Repita a nova senha"
                  placeholderTextColor="#8B8EA1"
                  style={styles.input}
                />
                <Pressable onPress={() => setHideConfirm((v) => !v)}>
                  <Ionicons
                    name={hideConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#7A7E8B"
                  />
                </Pressable>
              </View>

              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={[styles.saveBtn, saving && { opacity: 0.65 }]}
              >
                <Text style={styles.saveText}>
                  {saving
                    ? "Salvando..."
                    : hasPassword
                    ? "Salvar nova senha"
                    : "Criar senha"}
                </Text>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>

      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#31358B" },

  header: {
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#0A1F5C",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.80)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#535353",
    fontWeight: "700",
  },

  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#EEF0FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  infoText: {
    flex: 1,
    color: "#31358B",
    fontWeight: "700",
    lineHeight: 20,
    fontSize: 13,
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#31358B",
    marginBottom: 8,
    marginTop: 16,
  },

  inputWrap: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F3F5FF",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontWeight: "700",
  },

  saveBtn: {
    marginTop: 26,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#31358B",
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});