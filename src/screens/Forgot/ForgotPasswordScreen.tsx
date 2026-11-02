import BackButton from "@/src/components/common/BackButton";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { styles } from "@/src/components/Verify/styles";
import VerifyBackground from "@/src/components/Verify/VerifyBackground";
import VerifyHero from "@/src/components/Verify/VerifyHero";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";

type Step = "email" | "code" | "newPassword";
type AlertType = "error" | "success" | "info";

const OTP_LENGTH = 6;

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

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

  
  const [renderHero, setRenderHero] = useState(true);
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScaleY = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setRenderHero(true);
      heroOpacity.setValue(1);
      heroScaleY.setValue(1);

      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(heroScaleY, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setRenderHero(false);
      });
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setRenderHero(true);
      heroOpacity.setValue(0);
      heroScaleY.setValue(0);

      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(heroScaleY, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [heroOpacity, heroScaleY]);

  const Wrapper: any = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const wrapperProps =
    Platform.OS === "ios"
      ? { behavior: "padding" as const, keyboardVerticalOffset: 0 }
      : {};


  const stepOpacity = useRef(new Animated.Value(1)).current;

  function transitionTo(next: Step) {
    Animated.timing(stepOpacity, {
      toValue: 0,
      duration: 130,
      useNativeDriver: true,
    }).start(() => {
      setStep(next);
      Animated.timing(stepOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }

  return (
    <View style={styles.container}>
      <VerifyBackground />
      <BackButton />

      <Wrapper style={{ flex: 1 }} {...wrapperProps}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingTop: 100 }}>
            <View style={styles.card}>

       
              {renderHero && (
                <Animated.View
                  style={{
                    opacity: heroOpacity,
                    transform: [{ scaleY: heroScaleY }],
                    overflow: "hidden",
                  }}
                >
                  <VerifyHero method={step === "newPassword" ? "password" : "email"} />
                </Animated.View>
              )}


              <View style={local.stepsRow}>
                {(["email", "code", "newPassword"] as Step[]).map((s, i) => (
                  <View
                    key={s}
                    style={[
                      local.dot,
                      step === s && local.dotActive,
                      (step === "code" && i === 0) ||
                      (step === "newPassword" && i < 2)
                        ? local.dotDone
                        : null,
                    ]}
                  />
                ))}
              </View>

              <Animated.View style={{ opacity: stepOpacity }}>
                {step === "email" && (
                  <StepEmail
                    email={email}
                    setEmail={setEmail}
                    showAlert={showAlert}
                    onNext={() => transitionTo("code")}
                  />
                )}

                {step === "code" && (
                  <StepCode
                    email={email}
                    showAlert={showAlert}
                    onNext={(token) => {
                      setResetToken(token);
                      transitionTo("newPassword");
                    }}
                    onBack={() => transitionTo("email")}
                  />
                )}

                {step === "newPassword" && (
                  <StepNewPassword
                    resetToken={resetToken}
                    showAlert={showAlert}
                    onSuccess={() => {
                      showAlert(
                        "success",
                        "Senha redefinida! ✅",
                        "Sua nova senha foi salva. Faça login para continuar."
                      );
                      setTimeout(() => router.replace("/login"), 1800);
                    }}
                  />
                )}
              </Animated.View>

            </View>
          </View>
        </ScrollView>
      </Wrapper>

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



function StepEmail({
  email,
  setEmail,
  showAlert,
  onNext,
}: {
  email: string;
  setEmail: (v: string) => void;
  showAlert: (t: AlertType, title: string, msg: string) => void;
  onNext: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const clean = email.trim().toLowerCase();

    if (!clean) {
      showAlert("info", "Campo obrigatório", "Informe seu e-mail cadastrado.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      showAlert("info", "E-mail inválido", "Verifique o endereço digitado.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: clean });
      onNext();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Erro ao enviar código.";
      showAlert("error", "Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <Text style={styles.title}>
        Informe seu e-mail para receber o código de redefinição.
      </Text>

      <View style={local.inputWrap}>
        <TextInput
          style={local.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <Pressable
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enviando..." : "Enviar código"}
        </Text>
      </Pressable>
    </View>
  );
}



function StepCode({
  email,
  showAlert,
  onNext,
  onBack,
}: {
  email: string;
  showAlert: (t: AlertType, title: string, msg: string) => void;
  onNext: (token: string) => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(true);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCounting]);

  const focusIndex = (i: number) => {
    if (i < 0 || i >= OTP_LENGTH) return;
    inputsRef.current[i]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");

    if (digits.length > 1) {
      const next = [...otp];
      for (let k = 0; k < digits.length && index + k < OTP_LENGTH; k++) {
        next[index + k] = digits[k];
      }
      setOtp(next);
      focusIndex(Math.min(index + digits.length, OTP_LENGTH - 1));
      return;
    }

    const digit = digits.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key !== "Backspace") return;
    if (otp[index]) return;
    if (index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      focusIndex(index - 1);
    }
  };

  async function handleVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      showAlert("info", "Código incompleto", "Por favor, preencha os 6 dígitos.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password/verify", { email, code });
      onNext(res.data.resetToken);
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Código inválido ou expirado.";
      showAlert("error", "Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (isCounting || resendLoading) return;
    setResendLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      showAlert("success", "E-mail enviado 📩", "Novo código enviado para seu e-mail!");
      setCountdown(30);
      setIsCounting(true);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (e: any) {
      const retryAfter = e?.response?.data?.retryAfter;
      const msg = e?.response?.data?.error || "Erro ao reenviar código.";
      if (retryAfter && typeof retryAfter === "number") {
        setCountdown(retryAfter);
        setIsCounting(true);
      }
      showAlert("error", "Erro", msg);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <View>
      <Text style={styles.title}>
        Digite o código que enviamos para o seu e-mail.
      </Text>

      <View style={styles.otpContainer}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(r) => { inputsRef.current[index] = r; }}
            style={styles.input}
            value={otp[index]}
            maxLength={6}
            keyboardType="number-pad"
            inputMode="numeric"
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize="none"
            textContentType="oneTimeCode"
            importantForAutofill="yes"
            onChangeText={(t) => handleChange(t, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <Text style={styles.resend}>Não recebeu o e-mail?</Text>

      <Pressable onPress={handleResend} disabled={isCounting || resendLoading}>
        <Text style={[styles.resendBold, (isCounting || resendLoading) && { opacity: 0.5 }]}>
          {isCounting
            ? `Reenviar em 00:${countdown.toString().padStart(2, "0")}`
            : resendLoading
            ? "Enviando..."
            : "REENVIAR E-MAIL"}
        </Text>
      </Pressable>

      <View style={{ flexGrow: 1 }} />

      <Pressable
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verificando..." : "Confirmar código"}
        </Text>
      </Pressable>

      <Pressable style={local.backLink} onPress={onBack}>
        <Text style={local.backLinkText}>← Voltar</Text>
      </Pressable>
    </View>
  );
}



function StepNewPassword({
  resetToken,
  showAlert,
  onSuccess,
}: {
  resetToken: string;
  showAlert: (t: AlertType, title: string, msg: string) => void;
  onSuccess: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hideNew, setHideNew] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (newPassword.length < 6) {
      showAlert("info", "Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirm) {
      showAlert("error", "Senhas diferentes", "As senhas digitadas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password/reset", { resetToken, newPassword });
      onSuccess();
    } catch (e: any) {
      const msg = e?.response?.data?.error || "Erro ao redefinir senha.";
      showAlert("error", "Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View style={{ alignItems: "center" }}>
      </View>

      <Text style={styles.title}>
        Crie uma nova senha para a sua conta.
      </Text>

      <View style={local.passwordWrap}>
        <TextInput
          style={local.passwordInput}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nova senha (mín. 6 caracteres)"
          placeholderTextColor="#999"
          secureTextEntry={hideNew}
          autoCapitalize="none"
          returnKeyType="next"
        />
        <Pressable onPress={() => setHideNew((v) => !v)}>
          <Ionicons
            name={hideNew ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>

      <View style={local.passwordWrap}>
        <TextInput
          style={local.passwordInput}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#999"
          secureTextEntry={hideConfirm}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleReset}
        />
        <Pressable onPress={() => setHideConfirm((v) => !v)}>
          <Ionicons
            name={hideConfirm ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>

      <View style={{ flexGrow: 1 }} />

      <Pressable
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Redefinir senha"}
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Estilos locais (só o que não existe no styles do Verify) ─────────────────

const local = {
  stepsRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D0D0D0",
  },
  dotActive: {
    backgroundColor: "#04096E",
    width: 24,
    borderRadius: 5,
  },
  dotDone: {
    backgroundColor: "#2E7D32",
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#979BB5",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 30,
    marginBottom: 8,
    height: 56,
    justifyContent: "center" as const,
  },
  textInput: {
    fontSize: 15,
    color: "#222",
  },
  passwordWrap: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: "#979BB5",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 20,
    height: 56,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
  backLink: {
    alignItems: "center" as const,
    paddingVertical: 12,
    marginBottom: 20,
  },
  backLinkText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600" as const,
  },
};