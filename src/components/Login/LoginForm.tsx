import { styles } from "@/src/components/Login/styles";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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

  const scrollViewRef = useRef<ScrollView>(null);
  const coords = useRef<{ [key: string]: number }>({});

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

  const handleLayout = (key: string, y: number) => {
    coords.current[key] = y;
  };

  const handleFocus = (key: string) => {
    const y = coords.current[key];
    if (y !== undefined) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, y - 60),
          animated: true,
        });
      }, 150);
    }
  };

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
    /* ... */
  };
  const handleGoogleLogin = async () => {
    /* ... */
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.container, { padding: 0 }]}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 28,
        paddingBottom: Platform.OS === "ios" ? 140 : 250,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
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
        ref={emailRef}
        placeholder="Seu e-mail"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        onLayout={(e) => handleLayout("email", e.nativeEvent.layout.y)}
        onFocus={() => handleFocus("email")}
        returnKeyType="next"
        onSubmitEditing={() => senhaRef.current?.focus()}
      />

      <Text style={styles.label}>Senha</Text>

      <View
        style={styles.passwordWrapper}
        onLayout={(e) => handleLayout("senha", e.nativeEvent.layout.y)}
      >
        <TextInput
          ref={senhaRef}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={hidePassword}
          style={styles.inputPassword}
          onChangeText={setSenha}
          value={senha}
          onFocus={() => handleFocus("senha")}
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
    </ScrollView>
  );
}
