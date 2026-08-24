import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OnboardingCTA() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: 28 + insets.bottom }]}>
      <Text style={styles.title}>Encontre seus{"\n"}jogos ideais!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Fazer Login</Text>
      </TouchableOpacity>

      <Text style={styles.login}>
        Ainda não possui uma conta?{" "}
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Registre-se!
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 28,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3932",
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    backgroundColor: "#31358B",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  login: {
    textAlign: "center",
    color: "#555568",
    marginBottom: 12,
  },
  link: {
    color: "#31358B",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
