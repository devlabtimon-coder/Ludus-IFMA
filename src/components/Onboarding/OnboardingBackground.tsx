import { StyleSheet, View } from "react-native";

export function OnboardingBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.base} />
      
      <View style={[styles.circle, styles.topSolid]} />
      <View style={[styles.circle, styles.topLight]} />
      <View style={[styles.circle, styles.topDashed]} />

      <View style={[styles.circle, styles.bottomLight]} />
      <View style={[styles.circle, styles.bottomDashed]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#31358B",
  },

  circle: {
    position: "absolute",
    borderRadius: 999,
  },

  topSolid: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: -90,
    right: -120,
  },

  topLight: {
    width: 225,
    height: 225,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -50,
    right: -70,
  },

  topDashed: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
    borderStyle: "dashed",
    top: 70,
    right: -200,
  },

  bottomLight: {
    width: 400,
    height: 400,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -160,
    left: -160,
  },

  bottomDashed: {
    width: 340,
    height: 340,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
    borderStyle: "dashed",
    bottom: 40,
    left: -140,
  },
});