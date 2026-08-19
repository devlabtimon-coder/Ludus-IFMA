import BackButton from "@/src/components/common/BackButton";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#31358B";
const RED = "#E62325";
const YELLOW = "#FBBC04";

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  accent = "blue",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  accent?: "blue" | "red" | "yellow";
}) {
  const iconBg =
    accent === "red" ? "#FFE9EA" : accent === "yellow" ? "#FFF5D8" : "#EEF0FF";

  const iconColor =
    accent === "red" ? RED : accent === "yellow" ? "#9A6B00" : BLUE;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.itemIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={BLUE} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  async function handleOpenNotificationSettings() {
    try {
      await Linking.openSettings();
    } catch {}
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <BackButton />

      <View style={styles.topTitle}>
        <Text style={styles.h1}>Configurações</Text>
      </View>

      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <View style={styles.list}>
            <SettingsItem
              icon="notifications-outline"
              title="Notificações"
              subtitle="Abra as configurações do aparelho para ativar ou revisar permissões"
              onPress={handleOpenNotificationSettings}
              accent="yellow"
            />

            <SettingsItem
              icon="document-text-outline"
              title="Termos de uso"
              subtitle="Consulte as regras e condições de uso do Ludus"
              onPress={() => router.push("/terms")}
              accent="red"
            />

            <SettingsItem
              icon="shield-checkmark-outline"
              title="Política de privacidade"
              subtitle="Veja como os dados da sua conta são utilizados no aplicativo"
              onPress={() => router.push("/privacy-policy")}
              accent="blue"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },

  topTitle: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 90,
  },

  h1: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  sheet: {
    flex: 1,
    marginTop: 120,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  sheetContent: {
    paddingBottom: 30,
  },

  list: {
    gap: 12,
  },

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  itemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  itemTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: BLUE,
  },

  itemSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: "#666D7E",
    fontWeight: "700",
  },
});
