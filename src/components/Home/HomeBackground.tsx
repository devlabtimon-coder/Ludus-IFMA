import { StyleSheet, View } from "react-native";

export default function HomeBackground() {
  return (
    <View style={styles.container}>
      <View style={styles.circleLightTop} />
      <View style={styles.circleGradientTop} />
      <View style={styles.circleDashed} />

      <View style={styles.circleSideLight} />
      <View style={styles.circleSideGradient} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#31358B",
  },

  circleLightTop: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.18)",
    top: -60,
    right: -40,
  },

  circleGradientTop: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -100,
    right: -80,
  },

  circleDashed: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 140,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#FFF",
    opacity: 0.12,
    top: 70,
    right: -90,
  },

  circleSideLight: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.10)",
    left: -120,
    top: 250,
    transform: [{ rotate: "8deg" }],
  },

  circleSideGradient: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.06)",
    left: -180,
    top: 220,
    transform: [{ rotate: "8deg" }],
  },
});
