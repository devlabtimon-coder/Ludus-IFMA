import { AuthUser } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const DEFAULT_AVATAR = require("../../../assets/logo-dice.png");

type Props = {
  user: AuthUser | null;
  onPressChangePhoto?: () => void;
};

export function ProfileHeader({ user, onPressChangePhoto }: Props) {
  const displayName = user?.nome || user?.name || "Usuário";
  const avatarUri = user?.avatar || user?.picture || null;

  return (
    <View style={styles.header}>
      <View style={styles.avatarWrap}>
        <Image
          source={avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR}
          style={styles.avatar}
        />
        <Pressable onPress={onPressChangePhoto} style={styles.cameraBtn}>
          <Ionicons name="camera" size={18} color="#fff" />
        </Pressable>
      </View>
      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.email}>{user?.email || ""}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 34,
  },
  avatarWrap: {
    marginTop: 18,
    position: "relative",
  },
  avatar: {
    width: 122,
    height: 122,
    borderRadius: 999,
    backgroundColor: "#EAEAEA",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  cameraBtn: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "#E62325",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  email: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.82)",
  },
});
