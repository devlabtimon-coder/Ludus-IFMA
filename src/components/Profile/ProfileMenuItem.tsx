import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
};

export function ProfileMenuItem({ icon, title, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color="#31358B" />
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#c32715" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 72,
    borderRadius: 20,
    backgroundColor: "#F7F8FF",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#31358B",
  },
});