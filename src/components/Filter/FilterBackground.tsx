import { StyleSheet, View } from "react-native";

export default function FilterBackground() {
    return (
        <View style={styles.container}>
            <View style={styles.circleSolid}></View>
            <View style={styles.circleLight}></View>
            <View style={styles.circleDashedSmall}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#04096E'

    },
    circleSolid: {
        position: "absolute",
        width: 195,
        height: 195,
        borderRadius: 120,
        backgroundColor: "rgba(255,255,255,0.15)",
        top: -15,
        right: -40,
    },
    circleLight: {
        position: "absolute",
        width: 225,
        height: 225,
        borderRadius: 120,
        backgroundColor: "rgba(255, 255, 255, 0.23)",
        top: -25,
        right: -40,
    },
    circleDashedSmall: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 125,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#fff",
    opacity: 0.15,
    right: -80,
    top: 55,
  },
});