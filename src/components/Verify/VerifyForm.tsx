import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";
import VerifyBackground from "./VerifyBackground";
import VerifyHero from "./VerifyHero";

type AlertType = "error" | "success" | "info";

export default function VerifyForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signInWithToken } = useAuth();

  const emailParam = Array.isArray(params.email)
    ? params.email[0]
    : (params.email as string | undefined);

  const email = useMemo(
    () => (emailParam || "").trim().toLowerCase(),
    [emailParam],
  );

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

  const [loading, setLoading] = useState(false);

  const [renderHero, setRenderHero] = useState(true);
  const heroOpacity = useRef(new Animated.Value(1)).current;
  const heroScaleY = useRef(new Animated.Value(1)).current;

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      showAlert(
        "error",
        "Erro",
        "E-mail não encontrado. Volte e tente novamente.",
      );
    }
  }, [email]);

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

  const focusIndex = (i: number) => {
    if (i < 0 || i >= OTP_LENGTH) return;
    inputsRef.current[i]?.focus();
  };

  const setOtpFromString = (raw: string, startIndex = 0) => {
    const digits = (raw || "")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH - startIndex);

    if (!digits.length) return;

    setOtp((prev) => {
      const next = [...prev];
      for (let k = 0; k < digits.length; k++) {
        next[startIndex + k] = digits[k];
      }
      return next;
    });

    const nextFocus = Math.min(startIndex + digits.length, OTP_LENGTH - 1);
    focusIndex(nextFocus);
  };

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");

    if (digits.length > 1) {
      setOtpFromString(digits, index);
      return;
    }

    const digit = digits.slice(-1);

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key !== "Backspace") return;
    if (otp[index]) return;

    if (index > 0) {
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = "";
        return next;
      });
      focusIndex(index - 1);
    }
  };

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

  const handleConfirm = async () => {
    const fullCode = otp.join("");

    if (fullCode.length < 6) {
      showAlert(
        "info",
        "Código incompleto",
        "Por favor, preencha os 6 dígitos.",
      );
      return;
    }

    if (!email) {
      showAlert(
        "error",
        "Erro",
        "E-mail não encontrado. Volte e tente novamente.",
      );
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/verify-email", {
        email,
        code: fullCode,
      });

      const { token, user } = response.data;

      if (token && user) {
        await signInWithToken(token, user);
        router.replace("/suap-verify");
        return;
      }

      showAlert("success", "Verificado 🎉", "Conta criada com sucesso!");
      setTimeout(() => {
        router.replace("/suap-verify");
      }, 700);
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Erro ao verificar código.";
      showAlert("error", "Erro", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isCounting || resendLoading) return;

    if (!email) {
      showAlert(
        "error",
        "Erro",
        "E-mail não encontrado. Volte e tente novamente.",
      );
      return;
    }

    setResendLoading(true);
    try {
      await api.post("/auth/resend-email-code", { email });

      showAlert(
        "success",
        "E-mail enviado 📩",
        "Novo código enviado para seu e-mail!",
      );

      setCountdown(30);
      setIsCounting(true);
    } catch (error: any) {
      const retryAfter = error?.response?.data?.retryAfter;
      const message =
        error?.response?.data?.error || "Erro ao reenviar código.";

      if (retryAfter && typeof retryAfter === "number") {
        setCountdown(retryAfter);
        setIsCounting(true);
      }

      showAlert("error", "Erro", message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <VerifyBackground />

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
                  <VerifyHero method="email" />
                </Animated.View>
              )}

              <Text style={styles.title}>
                Verifique seu e-mail com o código que enviamos.
              </Text>

              <View style={styles.otpContainer}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(r) => {
                      inputsRef.current[index] = r;
                    }}
                    style={styles.input}
                    value={otp[index]}
                    maxLength={Platform.OS === "ios" ? 1 : 6}
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

              <Pressable
                onPress={handleResend}
                disabled={isCounting || resendLoading}
              >
                <Text
                  style={[
                    styles.resendBold,
                    (isCounting || resendLoading) && { opacity: 0.5 },
                  ]}
                >
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
                onPress={handleConfirm}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Processando..." : "Confirmar"}
                </Text>
              </Pressable>

              <View style={{ marginBottom: 50, alignItems: "center" }}>
                <Text style={{ color: "#535353", textAlign: "center" }}>
                  Você poderá verificar seu telefone depois no perfil.
                </Text>
              </View>
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
