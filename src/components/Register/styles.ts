import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },

  scroll: {
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#535353",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#535353",
    marginBottom: 24,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#535353",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  inputPassword: {
    flex: 1,
    paddingVertical: 16,
    color: "#333",
  },

  fieldError: {
    borderColor: "#E62325",
  },

  passwordStrengthWrap: {
    marginTop: 2,
    marginBottom: 10,
  },

  strengthBars: {
    flexDirection: "row",
    gap: 8,
  },

  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E4E7EE",
  },

  strengthText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },

  rulesWrap: {
    marginTop: 2,
    marginBottom: 14,
    gap: 6,
  },

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ruleText: {
    fontSize: 12,
    color: "#8B8EA1",
    fontWeight: "600",
  },

  ruleTextOk: {
    color: "#2E7D32",
  },

  checksWrap: {
    marginTop: 6,
    marginBottom: 20,
    gap: 12,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  checkText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#535353",
    fontWeight: "600",
  },

  checkLink: {
    color: "#31358B",
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  errorText: {
    marginBottom: 14,
    marginTop: 6,
    color: "#E62325",
    fontSize: 12,
  },

  button: {
    backgroundColor: "#31358B",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },

  or: {
    marginHorizontal: 12,
    color: "#535353",
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  googleText: {
    fontSize: 16,
    fontWeight: "500",
  },
  googleTermsBottomText: {
    marginTop: -26,
    marginBottom: 26,
    flex: 1,
    fontSize: 11,
    lineHeight: 20,
    color: "#535353",
    fontWeight: "600",
  },

  register: {
    textAlign: "center",
    color: "#535353",
  },

  link: {
    color: "#1E3932",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
