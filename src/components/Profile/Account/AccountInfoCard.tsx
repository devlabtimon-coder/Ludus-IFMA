import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  helper?: string;
  locked?: boolean;
};

export function AccountInfoCard({
  icon,
  title,
  value,
  helper,
  locked = false,
}: Props) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.top}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color="#31358B" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>

        {locked && <Ionicons name="lock-closed" size={18} color="#8B8EA1" />}
      </View>

      {!!helper && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginTop: 16,
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6E7385",
  },

  value: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "900",
    color: "#31358B",
  },

  helper: {
    marginTop: 10,
    color: "#8B8EA1",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 18,
  },
});