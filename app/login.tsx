import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { LoginForm } from "@/src/components/Login/LoginForm";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function Login() {
  return (
    <View style={styles.container}>
      <LoginBackground />
      <BackButton />

      <View style={styles.blueTopSpace} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LoginForm />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04096E",
  },
  blueTopSpace: {
    height: 140,
    width: "100%",
  },
  keyboardArea: {
    flex: 1,
  },
});
