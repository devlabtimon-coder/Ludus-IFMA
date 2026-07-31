import BackButton from "@/src/components/common/BackButton";
import LoginBackground from "@/src/components/Login/LoginBackground";
import RegisterFormIFMA from "@/src/components/Register/RegisterFormIFMA";
import { Platform, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
  return (
    <View style={styles.container}>
      <LoginBackground />
      <BackButton />

      <View style={styles.blueTopSpace} />

      <KeyboardAwareScrollView
        style={styles.keyboardArea}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={Platform.OS === "ios" ? 140 : 160}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <RegisterFormIFMA />
      </KeyboardAwareScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
