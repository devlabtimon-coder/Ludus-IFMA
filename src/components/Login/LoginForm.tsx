import { styles } from "@/src/components/Login/styles";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
});

export function LoginForm() {
  const router = useRouter();
  const { login, signInWithToken } = useAuth();

  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">(
    "info",
  );
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (
    type: "error" | "success" | "info",
    title: string,
    message: string,
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = senha.trim();

    if (!cleanedEmail || !cleanedPassword) {
      return showAlert(
        "info",
        "Inventário vazio",
        "Preencha e-mail e senha para continuar.",
      );
    }

    const result = await login(cleanedEmail, cleanedPassword);

    if (result.success) {
      showAlert(
        "success",
        "Acesso liberado 🛡️",
        "Bem-vindo de volta ao Ludus!",
      );

      setTimeout(() => {
        setAlertVisible(false);

        if ((result as any).user?.role === "ADMIN") {
          return router.replace("/admin/manage");
        }

        router.replace("/home");
      }, 1200);
    } else {
      showAlert(
        "error",
        "Falha crítica",
        result.message || "E-mail ou senha incorretos",
      );
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!clientId) {
      showAlert(
        "error",
        "Erro Estrutural",
        "Web Client ID ausente no APK. O eas.json não injetou a chave.",
      );
      setGoogleLoading(false);
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo: any = await GoogleSignin.signIn();

      const userEmail = userInfo?.user?.email || userInfo?.data?.user?.email;

      if (userEmail) {
        const cleanEmail = userEmail.trim().toLowerCase();
        const isIfma =
          cleanEmail.endsWith("@ifma.edu.br") ||
          cleanEmail.endsWith("@acad.ifma.edu.br");

        if (!isIfma) {
          await GoogleSignin.signOut();
          showAlert(
            "error",
            "Acesso Negado",
            "Apenas contas institucionais do IFMA são permitidas.",
          );
          setGoogleLoading(false);
          return;
        }
      }

      const idToken =
        userInfo?.idToken || userInfo?.data?.idToken || userInfo?.user?.idToken;

      if (!idToken) {
        throw new Error("Token do Google não encontrado.");
      }

      const res = await api.post("/auth/google", { idToken });

      // 3. O DESVIO DE FLUXO (Usuário Novo - Vai para o Register reaproveitado)
      if (res.data.needsCompletion || res.data.isNewUser) {
        showAlert(
          "info",
          "Quase lá! 🎲",
          "Finalize seu cadastro com os dados institucionais.",
        );

        setTimeout(() => {
          setAlertVisible(false);
          router.replace({
            pathname: "/register", // Redirecionando para a tela de registro principal
            params: {
              googleEmail: res.data.user?.email || userEmail,
              googleName:
                res.data.user?.name ||
                userInfo?.user?.name ||
                userInfo?.data?.user?.name,
              googleIdToken: idToken,
            },
          });
        }, 1200);
        return;
      }

      // 4. FLUXO NORMAL (Usuário já existe e possui cadastro completo)
      await signInWithToken(res.data.token, res.data.user);

      showAlert(
        "success",
        "Login com Google ✅",
        "Você entrou com sua conta Google.",
      );

      setTimeout(() => {
        setAlertVisible(false);

        if (res.data.needsPhoneVerification) {
          router.replace({
            pathname: "/verify",
            params: {
              email: res.data.user.email,
              phone: res.data.user.phone ?? "",
            },
          });
          return;
        }

        if (res.data.user?.role === "ADMIN") {
          return router.replace("/admin/manage");
        }

        router.replace("/home");
      }, 1000);
    } catch (e: any) {
      console.log("Google Login Error:", e);

      if (e.code === "SIGN_IN_CANCELLED" || e.message?.includes("CANCELLED")) {
        setGoogleLoading(false);
        return;
      }

      showAlert(
        "error",
        "Erro Google",
        e?.response?.data?.error ||
          e?.message ||
          "Falha ao autenticar com Google.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <Image
          source={require("../../../assets/logo-dice.png")}
          style={{ width: 63, height: 63, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-vindo ao Ludus</Text>
      </View>

      <Text style={styles.subtitle}>
        Entre com seu e-mail cadastrado ou número de telefone.
      </Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Seu e-mail"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          style={styles.inputPassword}
          onChangeText={setSenha}
          value={senha}
        />
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={24}
            color="#535353"
          />
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgot}>Esqueceu a senha?</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Logar</Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      <Pressable
        style={[styles.googleButton, googleLoading && { opacity: 0.6 }]}
        onPress={handleGoogleLogin}
        disabled={googleLoading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="logo-google"
            size={24}
            style={{ marginRight: 10 }}
            color="#0409ce"
          />
          <Text style={styles.googleText}>
            {googleLoading ? "Conectando..." : "Logar com Google"}
          </Text>
        </View>
      </Pressable>

      <Text style={styles.register}>
        Não possui uma conta?{" "}
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Registre-se aqui!
        </Text>
      </Text>

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
