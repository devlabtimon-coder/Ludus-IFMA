import { PasswordStrengthSection } from "@/src/components/Register/PasswordStrengthSection";
import { RegisterHeader } from "@/src/components/Register/RegisterHeader";
import { TermsConsentSection } from "@/src/components/Register/TermsConsentSection";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";

type AlertType = "error" | "success" | "info";

const IFMA_DOMAINS = ["@acad.ifma.edu.br", "@ifma.edu.br"];

const isValidIfmaEmail = (email: string) => {
  const clean = email.trim().toLowerCase();
  return IFMA_DOMAINS.some((domain) => clean.endsWith(domain));
};

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "#D9DDE7" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Za-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { score: 1, label: "Senha fraca", color: "#E62325" };
  if (score <= 4) return { score: 2, label: "Senha média", color: "#FBBC04" };
  return { score: 3, label: "Senha forte", color: "#2E7D32" };
}

export default function RegisterFormIFMA() {
  const router = useRouter();
  const { signInWithToken } = useAuth();

  const params = useLocalSearchParams();
  const initialEmail = (params.googleEmail as string) || "";
  const initialName = (params.googleName as string) || "";
  const googleIdToken = (params.googleIdToken as string) || "";

  const isGoogleFlow = !!googleIdToken || !!initialEmail;

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const [matricula, setMatricula] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const matriculaRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password],
  );
  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 6,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passwordError =
    touched.password && password.length > 0 && password.length < 6
      ? "Use pelo menos 6 caracteres."
      : "";

  const confirmError =
    touched.confirm && confirm.length > 0 && confirm !== password
      ? "A confirmação não confere."
      : "";

  const emailHint = useMemo(() => {
    const clean = email.trim().toLowerCase();
    if (!clean) return null;
    if (IFMA_DOMAINS.some((domain) => clean.endsWith(domain))) return null;
    return `Use seu e-mail @acad.ifma.edu.br ou @ifma.edu.br`;
  }, [email]);

  const IFMA_MATRICULA_REGEX = /^(\d{5}[A-Z0-9.]+\.TMN\d+|\d{7})$/;

  const isValidMatricula = (matricula: string) => {
    const clean = matricula.trim().toUpperCase();
    return IFMA_MATRICULA_REGEX.test(clean);
  };

  async function handleRegister() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMatricula = matricula.trim().toUpperCase();
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanName) {
      return showAlert("info", "Nome obrigatório", "Digite seu nome completo.");
    }

    if (!cleanEmail) {
      return showAlert(
        "info",
        "E-mail obrigatório",
        "Digite seu e-mail institucional.",
      );
    }

    if (!isValidIfmaEmail(cleanEmail)) {
      return showAlert(
        "info",
        "E-mail inválido",
        "Apenas e-mails institucionais são aceitos (@acad.ifma.edu.br ou @ifma.edu.br).",
      );
    }

    if (!cleanMatricula || !isValidMatricula(cleanMatricula)) {
      return showAlert(
        "error",
        "Matrícula inválida",
        "Use o padrão de aluno (ex: 20241INF.TMN0021) ou o seu SIAPE (7 dígitos).",
      );
    }

    if (cleanPhone.length < 10) {
      return showAlert(
        "info",
        "Telefone obrigatório",
        "Digite um número de telefone válido com DDD (WhatsApp).",
      );
    }

    if (!isGoogleFlow) {
      if (password.length < 6) {
        setTouched((t) => ({ ...t, password: true }));
        return showAlert("info", "Senha fraca", "Use pelo menos 6 caracteres.");
      }

      if (password !== confirm) {
        setTouched((t) => ({ ...t, confirm: true }));
        return showAlert(
          "info",
          "Senhas diferentes",
          "A confirmação não confere.",
        );
      }
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return showAlert(
        "info",
        "Confirmação necessária",
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
      );
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/ifma/register", {
        name: cleanName,
        email: cleanEmail,
        matricula: cleanMatricula,
        phone: cleanPhone || undefined,
        senha: password || "",
        acceptedTerms,
        acceptedPrivacy,
        googleIdToken: googleIdToken || undefined,
        isGoogle: isGoogleFlow,
      });

      if (isGoogleFlow) {
        await signInWithToken(response.data.token, response.data.user);

        showAlert(
          "success",
          "Tudo pronto! 🎉",
          "Seu cadastro foi concluído com sucesso via Google.",
        );

        setTimeout(() => {
          setAlertVisible(false);
          router.replace("/home");
        }, 1400);
      } else {
        showAlert(
          "success",
          "Cadastro iniciado! 🎉",
          "Enviamos um código para seu e-mail institucional. Confirme para continuar.",
        );

        setTimeout(() => {
          setAlertVisible(false);
          router.push({
            pathname: "/verify",
            params: { email: cleanEmail },
          });
        }, 1400);
      }
    } catch (e: any) {
      console.error("ERRO COMPLETO NO FRONTEND:", e);

      const status = e?.response?.status;
      const code = e?.response?.data?.code;

      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Erro desconhecido ao iniciar o registo.";

      if (e?.message === "Network Error") {
        showAlert(
          "error",
          "Erro de Conexão",
          "O aplicativo não conseguiu conectar-se ao servidor. Verifique sua rede e o backend.",
        );
      } else if (status === 404) {
        showAlert(
          "error",
          "Rota Inválida (404)",
          "O servidor não encontrou a rota /auth/ifma/register.",
        );
      } else if (code === "INVALID_INSTITUTIONAL_EMAIL") {
        showAlert("error", "E-mail inválido", msg);
      } else if (code === "MATRICULA_IN_USE") {
        showAlert(
          "error",
          "Matrícula já cadastrada",
          "Esta matrícula já está associada a uma conta Ludus.",
        );
      } else if (code === "WAIT_BEFORE_RESEND") {
        showAlert("info", "Aguarde um momento", msg);
      } else {
        showAlert("error", "Erro do Servidor", msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 28,
          paddingBottom: Platform.OS === "ios" ? 140 : 250,
        }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={Platform.OS === "ios" ? 140 : 160}
        extraScrollHeight={20}
      >
        <RegisterHeader />

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          ref={nameRef}
          style={styles.input}
          placeholder="Seu nome completo"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Text style={styles.label}>E-mail institucional</Text>
        <TextInput
          ref={emailRef}
          style={[
            styles.input,
            emailHint ? local.inputWarn : null,
            isGoogleFlow ? { backgroundColor: "#E8EAF6", color: "#666" } : null,
          ]}
          placeholder="seu.nome@acad.ifma.edu.br"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => matriculaRef.current?.focus()}
          textContentType="emailAddress"
          editable={!isGoogleFlow}
        />
        {emailHint ? <Text style={local.hintText}>{emailHint}</Text> : null}

        <Text style={styles.label}>Matrícula SUAP</Text>
        <View style={local.matriculaWrap}>
          <Ionicons
            name="card-outline"
            size={18}
            color="#04096E"
            style={{ marginRight: 8 }}
          />
          <TextInput
            ref={matriculaRef}
            style={local.matriculaInput}
            placeholder="20241INF.TMN0001 ou SIAPE"
            placeholderTextColor="#999"
            value={matricula}
            onChangeText={(t) => setMatricula(t.toUpperCase())}
            autoCapitalize="characters"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
        </View>
        <Text style={local.matriculaHint}>
          É o mesmo usuário que você usa para entrar no SUAP.
        </Text>

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          ref={phoneRef}
          style={styles.input}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() =>
            isGoogleFlow ? null : passRef.current?.focus()
          }
          textContentType="telephoneNumber"
        />

        {!isGoogleFlow && (
          <>
            <Text style={styles.label}>Senha do Ludus</Text>
            <View
              style={[
                styles.passwordWrapper,
                passwordError ? styles.fieldError : null,
              ]}
            >
              <TextInput
                ref={passRef}
                style={styles.inputPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setHidePassword((v) => !v)}>
                <Ionicons
                  name={hidePassword ? "eye-off" : "eye"}
                  size={22}
                  color={passwordError ? "#E62325" : "#535353"}
                />
              </Pressable>
            </View>
            <PasswordStrengthSection
              visible={password.length > 0}
              strength={passwordStrength}
              rules={passwordRules}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <Text style={styles.label}>Confirmar senha</Text>
            <View
              style={[
                styles.passwordWrapper,
                confirmError ? styles.fieldError : null,
              ]}
            >
              <TextInput
                ref={confirmRef}
                style={styles.inputPassword}
                placeholder="Repita a senha"
                placeholderTextColor="#999"
                secureTextEntry={hideConfirm}
                value={confirm}
                onChangeText={setConfirm}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setHideConfirm((v) => !v)}>
                <Ionicons
                  name={hideConfirm ? "eye-off" : "eye"}
                  size={22}
                  color={confirmError ? "#E62325" : "#535353"}
                />
              </Pressable>
            </View>
            {confirmError ? (
              <Text style={styles.errorText}>{confirmError}</Text>
            ) : null}
          </>
        )}

        <TermsConsentSection
          acceptedTerms={acceptedTerms}
          acceptedPrivacy={acceptedPrivacy}
          onToggleTerms={() => setAcceptedTerms((v) => !v)}
          onTogglePrivacy={() => setAcceptedPrivacy((v) => !v)}
        />

        <Pressable
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Processando..." : "Criar conta"}
          </Text>
        </Pressable>

        <Text style={styles.register}>
          Já possui uma conta?{" "}
          <Text style={styles.link} onPress={() => router.replace("/login")}>
            Entrar
          </Text>
        </Text>
      </KeyboardAwareScrollView>

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

const local = StyleSheet.create({
  ifmaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F2FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  ifmaBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#04096E",
  },
  inputWarn: {
    borderColor: "#FBBC04",
    borderWidth: 1.5,
  },
  hintText: {
    fontSize: 11,
    color: "#B8860B",
    marginTop: -6,
    marginBottom: 8,
    marginLeft: 4,
  },
  matriculaWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdfdfd",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  matriculaInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
  },
  matriculaHint: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  optional: {
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },
});
