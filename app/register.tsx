import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import RegisterFormIFMA from "@/src/components/Register/RegisterFormIFMA";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

export default function Register() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LoginBackground />
      <BackButton />
      <RegisterFormIFMA />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
