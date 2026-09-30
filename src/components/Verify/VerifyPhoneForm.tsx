import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";
import VerifyBackground from "./VerifyBackground";
import VerifyHero from "./VerifyHero";

type AlertType = "error" | "success" | "info";

export default function VerifyPhoneForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signInWithToken } = useAuth();

  const phoneParam = Array.isArray(params.phone)
    ? params.phone[0]
    : (params.phone as string | undefined);

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

  const [confirmSession, setConfirmSession] = useState<any>(null);

  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);

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

  const sendVerificationSMS = async () => {
    if (!phoneParam) {
      showAlert("error", "Erro", "Telefone não encontrado.");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+55${phoneParam}`;

      const confirmation =
        await signInWithPhoneNumber(getAuth(), formattedPhone);

      setConfirmSession(confirmation);
      setCountdown(30);
      setIsCounting(true);

      showAlert(
        "success",
        "SMS Enviado",
        "Enviamos o código para o seu número.",
      );
    } catch (error: any) {
      console.log("Erro Firebase SMS:", error);
      showAlert(
        "error",
        "Erro",
        error?.message ||
          "Falha ao enviar o SMS. Verifique o número e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneParam && !confirmSession) {
      sendVerificationSMS();
    }
  }, [phoneParam]);

  const Wrapper: any = Platform.OS === "ios" ? KeyboardAvoidingView : View;
  const wrapperProps =
    Platform.OS === "ios"
      ? { behavior: "padding" as const, keyboardVerticalOffset: 0 }
      : {};

  const focusIndex = (i: number) => {
    if (i < 0 || i >= OTP_LENGTH) return;
    inputsRef.current[i]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const digits = (text || "").replace(/\D/g, "");
    if (digits.length > 1) return;
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

    if (!confirmSession) {
      showAlert(
        "error",
        "Sessão inválida",
        "Aguarde o envio do SMS ou solicite novamente.",
      );
      return;
    }

    setLoading(true);
    try {
      const credential = await confirmSession.confirm(fullCode);
      const idToken = await credential?.user.getIdToken();

      const response = await api.post("/auth/verify-phone", { idToken });

      const { token, user } = response.data;
      if (token && user) {
        await signInWithToken(token, user);

        showAlert(
          "success",
          "Verificado 📱",
          "Telefone confirmado com sucesso!",
        );

        setTimeout(() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/home");
          }
        }, 1200);
      }
    } catch (error: any) {
      console.log("Erro de Verificação:", error);
      if (error.code === "auth/invalid-verification-code") {
        showAlert(
          "error",
          "Código Inválido",
          "O código digitado está incorreto.",
        );
      } else {
        showAlert("error", "Erro", "Falha ao verificar telefone.");
      }
    } finally {
      setLoading(false);
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
                  <VerifyHero method="sms" />
                </Animated.View>
              )}
              <Text style={styles.title}>
                Verifique seu telefone com o código SMS que enviamos.
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

              <Text style={styles.resend}>Não recebeu o SMS?</Text>
              <Pressable
                onPress={sendVerificationSMS}
                disabled={isCounting || loading}
              >
                <Text
                  style={[
                    styles.resendBold,
                    (isCounting || loading) && { opacity: 0.5 },
                  ]}
                >
                  {isCounting
                    ? `Reenviar em 00:${countdown.toString().padStart(2, "0")}`
                    : loading
                      ? "Enviando..."
                      : "REENVIAR SMS"}
                </Text>
              </Pressable>

              <View style={{ flexGrow: 1 }} />

              <Pressable
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleConfirm}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Processando..." : "Confirmar Telefone"}
                </Text>
              </Pressable>
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
