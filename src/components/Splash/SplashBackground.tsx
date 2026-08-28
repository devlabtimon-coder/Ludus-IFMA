import { StyleSheet, View } from "react-native";

export default function SplashBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[styles.circle, styles.yellowSoft]} />

      <View style={[styles.circle, styles.yellowStrong]} />

      <View style={[styles.circle, styles.redSoft]} />

      <View style={[styles.circle, styles.redStrong]} />

      <View style={[styles.dashed, styles.dashedTop]} />
      <View style={[styles.dashed, styles.dashedBottom]} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    borderRadius: 999,
  },

  yellowSoft: {
    width: 340,
    height: 340,
    backgroundColor: "rgba(251, 188, 4, 0.25)",
    top: -140,
    right: -140,
  },
  yellowStrong: {
    width: 260,
    height: 260,
    backgroundColor: "rgba(251, 188, 4, 0.35)",
    top: -90,
    right: -90,
  },

  redSoft: {
    width: 420,
    height: 420,
    backgroundColor: "rgba(252, 9, 13, 0.25)",
    bottom: -180,
    left: -180,
  },
  redStrong: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(252, 9, 13, 0.3)",
    bottom: -120,
    left: -120,
  },

  dashed: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.25)",
  },

  dashedTop: {
    top: 60,
    right: -130,
  },

  dashedBottom: {
    bottom: 100,
    left: -130,
  },
});
