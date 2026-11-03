import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { styles as form } from "@/src/components/Login/styles";
import { PasswordStrengthSection } from "@/src/components/Register/PasswordStrengthSection";
import { api } from "@/src/services/api";
import { getPasswordRules, getPasswordStrength } from "@/src/utils/passwordStrength";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Recuperação de senha em três etapas (e-mail → código → nova senha) e uma tela de conclusão,
// no mesmo padrão visual do login e do cadastro: fundo azul, folha branca, rótulos e erros embaixo do campo.

type Step = "email" | "code" | "newPassword" | "done";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEP_INFO: Record<Exclude<Step, "done">, { index: number; icon: keyof typeof Ionicons.glyphMap }> = {
  email: { index: 1, icon: "mail-outline" },
  code: { index: 2, icon: "keypad-outline" },
  newPassword: { index: 3, icon: "lock-closed-outline" },
};

const apiError = (e: any, fallback: string): string =>
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  (!e?.response ? "Sem conexão com o servidor. Verifique a internet e tente de novo." : fallback);

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(
    typeof params.email === "string" && EMAIL_RE.test(params.email) ? params.email : "",
  );
  const [resetToken, setResetToken] = useState("");

  const fade = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  const goTo = useCallback(
    (next: Step) => {
      Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
        setStep(next);
        scrollRef.current?.scrollTo({ y: 0, animated: false });
        Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      });
    },
    [fade],
  );

  // Voltar dentro do fluxo: do código volta para o e-mail; nas outras etapas sai da tela.
  const handleBack = useCallback(() => {
    if (step === "code") {
      goTo("email");
      return true;
    }
    if (step === "done") {
      router.replace("/login");
      return true;
    }
    if (router.canGoBack()) router.back();
    else router.replace("/login");
    return true;
  }, [step, goTo, router]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", handleBack);
      return () => sub.remove();
    }, [handleBack]),
  );

  return (
    <View style={s.container}>
      <LoginBackground />
      {step !== "done" && <BackButton onPress={handleBack} />}

      <View style={s.blueTopSpace} />

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={form.container}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View style={{ opacity: fade }}>
              {step !== "done" && <StepHeader step={step} />}

              {step === "email" && (
                <StepEmail
                  email={email}
                  setEmail={setEmail}
                  onSent={() => goTo("code")}
                  onLogin={handleBack}
                />
              )}

              {step === "code" && (
                <StepCode
                  email={email}
                  onVerified={(token) => {
                    setResetToken(token);
                    goTo("newPassword");
                  }}
                  onChangeEmail={() => goTo("email")}
                />
              )}

              {step === "newPassword" && (
                <StepNewPassword
                  resetToken={resetToken}
                  onSaved={() => goTo("done")}
                  onRestart={() => goTo("email")}
                />
              )}

              {step === "done" && <StepDone onLogin={() => router.replace("/login")} />}
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function StepHeader({ step }: { step: Exclude<Step, "done"> }) {
  const { index, icon } = STEP_INFO[step];
  return (
    <View style={s.header}>
      <View style={s.headerTop}>
        <View style={s.iconBadge}>
          <Ionicons name={icon} size={26} color="#31358B" />
        </View>
        <Text style={s.stepLabel}>Etapa {index} de 3</Text>
      </View>
      <View style={s.progress} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: 3, now: index }}>
        {[1, 2, 3].map((n) => (
          <View key={n} style={[s.progressBar, n <= index && s.progressBarOn]} />
        ))}
      </View>
    </View>
  );
}

function FieldError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={s.errorRow} accessibilityLiveRegion="polite">
      <Ionicons name="alert-circle" size={16} color="#B3193A" />
      <Text style={s.errorText}>{message}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  loadingLabel,
  loading,
  disabled,
  onPress,
}: {
  label: string;
  loadingLabel: string;
  loading: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const off = loading || disabled;
  return (
    <Pressable
      style={[form.button, s.primaryButton, off && s.buttonOff]}
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!off, busy: loading }}
    >
      {loading && <ActivityIndicator color="#FFF" style={{ marginRight: 10 }} />}
      <Text style={form.buttonText}>{loading ? loadingLabel : label}</Text>
    </Pressable>
  );
}

function StepEmail({
  email,
  setEmail,
  onSent,
  onLogin,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSent: () => void;
  onLogin: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const clean = email.trim().toLowerCase();
    if (!clean) return setError("Informe o e-mail da sua conta.");
    if (!EMAIL_RE.test(clean)) return setError("Confira o e-mail digitado.");

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: clean });
      setEmail(clean);
      onSent();
    } catch (e: any) {
      setError(apiError(e, "Não foi possível enviar o código. Tente de novo."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={form.title}>Esqueceu a senha?</Text>
      <Text style={form.subtitle}>
        Sem problema. Informe o e-mail da sua conta e enviaremos um código para criar uma nova senha.
      </Text>

      <Text style={form.label}>E-mail</Text>
      <TextInput
        style={[form.input, s.inputTight, !!error && s.inputError]}
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          if (error) setError("");
        }}
        placeholder="seu.email@acad.ifma.edu.br"
        placeholderTextColor="#999"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="send"
        onSubmitEditing={handleSubmit}
        editable={!loading}
        accessibilityLabel="E-mail"
      />
      <FieldError message={error} />

      <PrimaryButton label="Enviar código" loadingLabel="Enviando..." loading={loading} onPress={handleSubmit} />

      <Text style={form.register}>
        Lembrou a senha?{" "}
        <Text style={form.link} onPress={onLogin}>
          Voltar para o login
        </Text>
      </Text>
    </View>
  );
}

function StepCode({
  email,
  onVerified,
  onChangeEmail,
}: {
  email: string;
  onVerified: (token: string) => void;
  onChangeEmail: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focused, setFocused] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const t = setTimeout(() => inputs.current[0]?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const verify = useCallback(
    async (code: string) => {
      if (code.length < OTP_LENGTH) {
        setError("Digite os 6 números do código.");
        return;
      }
      setError("");
      setNotice("");
      setLoading(true);
      try {
        const res = await api.post("/auth/forgot-password/verify", { email, code });
        onVerified(res.data.resetToken);
      } catch (e: any) {
        setError(apiError(e, "Código inválido ou expirado."));
        setOtp(Array(OTP_LENGTH).fill(""));
        inputs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [email, onVerified],
  );

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");
    const next = [...otp];

    if (digits.length > 1) {
      // Colou o código ou o iOS preencheu pelo e-mail.
      for (let k = 0; k < digits.length && index + k < OTP_LENGTH; k++) next[index + k] = digits[k];
    } else {
      next[index] = digits;
    }

    setOtp(next);
    if (error) setError("");

    const filled = next.join("");
    if (filled.length === OTP_LENGTH && !next.includes("")) {
      inputs.current[Math.min(index + digits.length, OTP_LENGTH - 1)]?.blur();
      verify(filled);
      return;
    }
    if (digits) inputs.current[Math.min(index + digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key !== "Backspace" || otp[index] || index === 0) return;
    const next = [...otp];
    next[index - 1] = "";
    setOtp(next);
    inputs.current[index - 1]?.focus();
  };

  async function handleResend() {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await api.post("/auth/forgot-password", { email });
      setNotice("Enviamos um novo código. Ele substitui o anterior.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(RESEND_SECONDS);
      inputs.current[0]?.focus();
    } catch (e: any) {
      const retryAfter = e?.response?.data?.retryAfter;
      if (typeof retryAfter === "number") setCountdown(retryAfter);
      setError(apiError(e, "Não foi possível reenviar o código."));
    } finally {
      setResending(false);
    }
  }

  return (
    <View>
      <Text style={form.title}>Digite o código</Text>
      <Text style={form.subtitle}>
        Se existir uma conta com o e-mail <Text style={s.strong}>{email}</Text>, você vai receber um código de 6
        números. Confira também a caixa de spam.
      </Text>

      <Text style={form.label}>Código de verificação</Text>
      <View style={s.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(r) => {
              inputs.current[index] = r;
            }}
            style={[
              s.otpBox,
              (focused === index || !!digit) && s.otpBoxActive,
              !!error && s.inputError,
            ]}
            value={digit}
            maxLength={index === 0 ? OTP_LENGTH : 1}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType={index === 0 ? "oneTimeCode" : "none"}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            onFocus={() => setFocused(index)}
            onChangeText={(t) => handleChange(t, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            editable={!loading}
            selectTextOnFocus
            accessibilityLabel={`Dígito ${index + 1} de ${OTP_LENGTH}`}
          />
        ))}
      </View>
      <FieldError message={error} />
      {!!notice && (
        <View style={s.noticeRow} accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
          <Text style={s.noticeText}>{notice}</Text>
        </View>
      )}

      <PrimaryButton
        label="Confirmar código"
        loadingLabel="Verificando..."
        loading={loading}
        onPress={() => verify(otp.join(""))}
      />

      <View style={s.linksRow}>
        <Text style={s.mutedText}>Não recebeu?</Text>
        {countdown > 0 ? (
          <Text style={s.mutedLink}>Reenviar em 0:{String(countdown).padStart(2, "0")}</Text>
        ) : (
          <Text style={form.link} onPress={handleResend}>
            {resending ? "Reenviando..." : "Reenviar código"}
          </Text>
        )}
      </View>

      <Text style={[form.register, { marginTop: 18 }]}>
        E-mail errado?{" "}
        <Text style={form.link} onPress={onChangeEmail}>
          Usar outro e-mail
        </Text>
      </Text>
    </View>
  );
}

function StepNewPassword({
  resetToken,
  onSaved,
  onRestart,
}: {
  resetToken: string;
  onSaved: () => void;
  onRestart: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const confirmRef = useRef<TextInput>(null);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const rules = useMemo(() => getPasswordRules(password), [password]);

  const passwordError =
    touched.password && password.length > 0 && password.length < 6 ? "Use pelo menos 6 caracteres." : "";
  const confirmError =
    touched.confirm && confirm.length > 0 && confirm !== password ? "As senhas não são iguais." : "";

  async function handleSave() {
    setTouched({ password: true, confirm: true });
    if (password.length < 6 || confirm !== password) return;

    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/reset", { resetToken, newPassword: password });
      onSaved();
    } catch (e: any) {
      const status = e?.response?.status;
      setExpired(status === 400 || status === 401);
      setError(apiError(e, "Não foi possível salvar a nova senha. Tente de novo."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={form.title}>Crie uma nova senha</Text>
      <Text style={form.subtitle}>Escolha uma senha que você não use em outros lugares.</Text>

      <Text style={form.label}>Nova senha</Text>
      <View style={[form.passwordWrapper, !!passwordError && s.inputError]}>
        <TextInput
          style={form.inputPassword}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          placeholder="Mínimo de 6 caracteres"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          editable={!loading}
          accessibilityLabel="Nova senha"
        />
        <Pressable
          onPress={() => setHidePassword((v) => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={hidePassword ? "Mostrar senha" : "Ocultar senha"}
        >
          <Ionicons name={hidePassword ? "eye-off" : "eye"} size={24} color="#535353" />
        </Pressable>
      </View>
      <FieldError message={passwordError} />
      <View style={{ marginTop: 10 }}>
        <PasswordStrengthSection visible={password.length > 0} strength={strength} rules={rules} />
      </View>

      <Text style={[form.label, { marginTop: 8 }]}>Confirmar nova senha</Text>
      <View style={[form.passwordWrapper, !!confirmError && s.inputError]}>
        <TextInput
          ref={confirmRef}
          style={form.inputPassword}
          value={confirm}
          onChangeText={setConfirm}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          placeholder="Digite a senha de novo"
          placeholderTextColor="#999"
          secureTextEntry={hideConfirm}
          textContentType="newPassword"
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          editable={!loading}
          accessibilityLabel="Confirmar nova senha"
        />
        <Pressable
          onPress={() => setHideConfirm((v) => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={hideConfirm ? "Mostrar senha" : "Ocultar senha"}
        >
          <Ionicons name={hideConfirm ? "eye-off" : "eye"} size={24} color="#535353" />
        </Pressable>
      </View>
      <FieldError message={confirmError} />
      <FieldError message={error} />

      <View style={{ height: 16 }} />
      {expired ? (
        <PrimaryButton label="Pedir um novo código" loadingLabel="" loading={false} onPress={onRestart} />
      ) : (
        <PrimaryButton label="Salvar nova senha" loadingLabel="Salvando..." loading={loading} onPress={handleSave} />
      )}
    </View>
  );
}

function StepDone({ onLogin }: { onLogin: () => void }) {
  return (
    <View style={s.done}>
      <View style={s.doneBadge}>
        <Ionicons name="checkmark" size={44} color="#FFF" />
      </View>
      <Text style={[form.title, s.center]}>Senha alterada</Text>
      <Text style={[form.subtitle, s.center]}>
        Tudo certo! Agora é só entrar no Ludus com a sua nova senha.
      </Text>
      <View style={s.fullWidth}>
        <PrimaryButton label="Ir para o login" loadingLabel="" loading={false} onPress={onLogin} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#04096E" },
  blueTopSpace: { height: 140, width: "100%" },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 28, paddingBottom: Platform.OS === "ios" ? 60 : 120 },

  header: { marginBottom: 22 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: { fontSize: 14, fontWeight: "700", color: "#5F6380" },
  progress: { flexDirection: "row", gap: 8 },
  progressBar: { flex: 1, height: 6, borderRadius: 999, backgroundColor: "#E4E7EE" },
  progressBarOn: { backgroundColor: "#31358B" },

  inputTight: { marginBottom: 6 },
  inputError: { borderColor: "#E62325" },
  errorRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: 4, marginBottom: 4 },
  errorText: { flex: 1, color: "#B3193A", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  noticeRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: 4 },
  noticeText: { flex: 1, color: "#1F7A39", fontSize: 13, fontWeight: "600", lineHeight: 18 },

  primaryButton: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  buttonOff: { opacity: 0.6 },

  strong: { fontWeight: "700", color: "#31358B" },

  otpRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  otpBox: {
    flex: 1,
    height: 58,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    backgroundColor: "#FFF",
  },
  otpBoxActive: { borderColor: "#31358B", borderWidth: 1.5, backgroundColor: "#F7F8FF" },

  linksRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6 },
  mutedText: { color: "#535353" },
  mutedLink: { color: "#5F6380", fontWeight: "600" },

  done: { alignItems: "center", paddingTop: 24 },
  doneBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  center: { textAlign: "center" },
  fullWidth: { alignSelf: "stretch" },
});
