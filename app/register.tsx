import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import RegisterFormIFMA from "@/src/components/Register/RegisterFormIFMA";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <LoginBackground />
      <BackButton />

      <View style={styles.blueTopSpace} />

      {/* 🔥 Trocamos o Scroll pelo KeyboardAvoidingView, igual na tela de Login! */}
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <RegisterFormIFMA />
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
