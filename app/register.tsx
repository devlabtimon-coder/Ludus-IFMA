import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import RegisterFormIFMA from "@/src/components/Register/RegisterFormIFMA";
import { StyleSheet, View } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <LoginBackground />
      <BackButton />
      <RegisterFormIFMA />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
