import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { AccountActionRow } from "@/src/components/Profile/Account/AccountActionRow";
import { AccountHeader } from "@/src/components/Profile/Account/AccountHeader";
import { AccountInfoCard } from "@/src/components/Profile/Account/AccountInfoCard";
import { AccountPersonalForm } from "@/src/components/Profile/Account/AccountPersonalForm";
import { AccountStatusPill } from "@/src/components/Profile/Account/AccountStatusPill";
import { AccountSummaryCard } from "@/src/components/Profile/Account/AccountSummaryCard";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AlertType = "error" | "success" | "info";

type MeResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;

  emailVerified?: boolean;
  phoneVerified?: boolean;

  avatar?: string | null;
  picture?: string | null;

  role?: string;
  points?: number;
  level?: number;

  authProvider?: string;

  clientCategory: string;
  totalRentalsCount: number;

  categoryProgress: {
    current: number;
    total: number;
    remaining: number;
    nextCategory: string | null;
  };
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getLevelLabel(level?: number) {
  switch (level) {
    case 1:
      return "Iniciante";
    case 2:
      return "Explorador";
    case 3:
      return "Estrategista";
    case 4:
      return "Campeão";
    case 5:
      return "Lenda";
    default:
      return "Jogador";
  }
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const isIfmaMode = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [picture, setPicture] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [authProvider, setAuthProvider] = useState<string>("LOCAL");
  const [role, setRole] = useState<string>("USER");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [clientCategory, setClientCategory] = useState("STARTER");
  const [nextCategory, setNextCategory] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [rentalsCount, setRentalsCount] = useState(0);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await api.get<MeResponse>("/users/me");
      const data = res.data;

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(formatPhone(data.phone || ""));
      setEmailVerified(!!data.emailVerified);
      setPhoneVerified(!!data.phoneVerified);
      setAvatar(data.avatar || null);
      setPicture(data.picture || null);
      setPoints(data.points || 0);
      setLevel(data.level || 1);
      setAuthProvider(data.authProvider || "LOCAL");
      setRole(data.role || "USER");
      setClientCategory(data.clientCategory || "STARTER");
      setNextCategory(data.categoryProgress?.nextCategory || null);

      setProgress(
        data.categoryProgress
          ? data.categoryProgress.current / data.categoryProgress.total
          : 0,
      );

      setRentalsCount(data.totalRentalsCount || 0);
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error?.response?.data?.error || "Não foi possível carregar sua conta.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const canSave = useMemo(() => {
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isEmailValid = isIfmaMode || emailRegex.test(email);

    return cleanName.length >= 3 && cleanPhone.length >= 10 && isEmailValid;
  }, [name, phone, email, isIfmaMode]);

  const displayName = name.trim() || user?.nome || user?.name || "Usuário";

  async function handleSave() {
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim();

    if (cleanName.length < 3) {
      showAlert(
        "info",
        "Nome inválido",
        "Seu nome precisa ter pelo menos 3 caracteres.",
      );
      return;
    }

    if (cleanPhone.length < 10) {
      showAlert("info", "Telefone inválido", "Digite um telefone válido.");
      return;
    }

    if (!isIfmaMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showAlert("info", "E-mail inválido", "Digite um e-mail válido.");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name: cleanName,
        phone: cleanPhone,
      };

      if (!isIfmaMode) {
        payload.email = cleanEmail;
      }

      const res = await api.patch("/users/me", payload);
      const nextUser = res.data?.user || res.data;

      if (nextUser) {
        await updateUser({
          name: nextUser.name,
          nome: nextUser.name,
          email: nextUser.email,
          phone: nextUser.phone,
          emailVerified: nextUser.emailVerified,
          phoneVerified: nextUser.phoneVerified,
          avatar: nextUser.avatar,
          picture: nextUser.picture,
          role: nextUser.role,
          points: nextUser.points,
          level: nextUser.level,
          authProvider: nextUser.authProvider,
        });

        setEmail(nextUser.email || email);
        setPhone(formatPhone(nextUser.phone || ""));
        setEmailVerified(!!nextUser.emailVerified);
        setPhoneVerified(!!nextUser.phoneVerified);
        setAvatar(nextUser.avatar || null);
        setPicture(nextUser.picture || null);
        setPoints(nextUser.points || 0);
        setLevel(nextUser.level || 1);
        setAuthProvider(nextUser.authProvider || "LOCAL");
        setRole(nextUser.role || "USER");
      }

      showAlert(
        "success",
        "Tudo certo",
        "Seus dados foram atualizados com sucesso.",
      );
    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error?.response?.data?.error ||
          "Não foi possível salvar suas alterações.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AccountHeader
          title="Conta"
          subtitle="Gerencie seus dados e segurança"
          onBack={() => router.back()}
        />

        <View style={styles.sheet}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#31358B" />
              <Text style={styles.loadingText}>Carregando sua conta...</Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <AccountSummaryCard
                name={displayName}
                email={email}
                avatar={avatar}
                picture={picture}
                points={points}
                level={level}
                levelLabel={getLevelLabel(level)}
                clientCategory={clientCategory}
                nextCategory={nextCategory}
                progress={progress}
                rentalsCount={rentalsCount}
              />

              <Text style={styles.sectionTitle}>Status da conta</Text>
              <View style={styles.sectionLine} />

              <View style={styles.statusGrid}>
                <AccountStatusPill
                  icon={
                    emailVerified ? "checkmark-circle" : "alert-circle-outline"
                  }
                  text={emailVerified ? "E-mail verificado" : "E-mail pendente"}
                  ok={emailVerified}
                />

                <AccountStatusPill
                  icon={
                    phoneVerified ? "checkmark-circle" : "alert-circle-outline"
                  }
                  text={
                    phoneVerified ? "Telefone verificado" : "Telefone pendente"
                  }
                  ok={phoneVerified}
                />

                <AccountStatusPill
                  icon="shield-checkmark-outline"
                  text={
                    authProvider === "GOOGLE" ? "Login Google" : "Login local"
                  }
                  ok={true}
                />

                <AccountStatusPill
                  icon="person-circle-outline"
                  text={role === "ADMIN" ? "Administrador" : "Usuário"}
                  ok={true}
                />
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 26 }]}>
                Dados pessoais
              </Text>
              <View style={styles.sectionLine} />

              <AccountPersonalForm
                name={name}
                phone={phone}
                email={email}
                isIfmaMode={isIfmaMode}
                onChangeName={setName}
                onChangePhone={(text) => setPhone(formatPhone(text))}
                onChangeEmail={setEmail}
              />

              {isIfmaMode && (
                <AccountInfoCard
                  icon="mail-outline"
                  title="E-mail institucional"
                  value={email}
                  helper="Esse dado é definido pela autenticação acadêmica e não pode ser alterado."
                  locked
                />
              )}

              <Text style={[styles.sectionTitle, { marginTop: 26 }]}>
                Segurança
              </Text>
              <View style={styles.sectionLine} />

              <View style={{ marginTop: 18 }}>
                <AccountActionRow
                  icon="lock-closed-outline"
                  title="Alterar senha"
                  subtitle="Atualize sua senha de acesso"
                  onPress={() => router.push("/profile/change-password")}
                />

                <AccountActionRow
                  icon="call-outline"
                  title="Verificar telefone"
                  subtitle={
                    phoneVerified
                      ? "Seu telefone já está verificado"
                      : "Confirme seu número de telefone"
                  }
                  accent={phoneVerified ? "blue" : "yellow"}
                  onPress={() => {
                    if (phoneVerified) {
                      showAlert(
                        "info",
                        "Tudo certo",
                        "Seu telefone já está verificado.",
                      );
                      return;
                    }

                    const cleanPhone = phone.replace(/\D/g, "");

                    if (cleanPhone.length < 10) {
                      showAlert(
                        "info",
                        "Telefone inválido",
                        "Informe um telefone válido antes de verificar.",
                      );
                      return;
                    }

                    router.push({
                      pathname: "/verify",
                      params: { phone: cleanPhone },
                    });
                  }}
                />

                <AccountActionRow
                  icon="mail-open-outline"
                  title="Verificar e-mail"
                  subtitle={
                    emailVerified
                      ? "Seu e-mail já está verificado"
                      : "Confirme seu e-mail"
                  }
                  accent={emailVerified ? "blue" : "yellow"}
                  onPress={async () => {
                    if (emailVerified) {
                      showAlert(
                        "info",
                        "Tudo certo",
                        "Seu e-mail já está verificado.",
                      );
                      return;
                    }

                    try {
                      await api.post("/auth/resend-email-code", { email });

                      router.push({
                        pathname: "/verify",
                        params: { email },
                      });
                    } catch (error: any) {
                      showAlert(
                        "error",
                        "Erro",
                        error?.response?.data?.error ||
                          "Não foi possível reenviar o código.",
                      );
                    }
                  }}
                />
              </View>

              <Pressable
                onPress={handleSave}
                disabled={!canSave || saving}
                style={[
                  styles.saveBtn,
                  (!canSave || saving) && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.saveText}>
                  {saving ? "Salvando..." : "Salvar alterações"}
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
  root: {
    flex: 1,
    backgroundColor: "#31358B",
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  scrollContent: {
    paddingBottom: 36,
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#31358B",
  },

  sectionLine: {
    marginTop: 10,
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#FBBC04",
  },

  statusGrid: {
    marginTop: 18,
    gap: 10,
  },

  saveBtn: {
    marginTop: 16,
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
