import { NavFooter } from "@/src/components/common/NavFooter";
import { AvatarPickerModal } from "@/src/components/Profile/AvatarPickerModal";
import { ProfileHeader } from "@/src/components/Profile/ProfileHeader";
import { ProfileMenuItem } from "@/src/components/Profile/ProfileMenuItem";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeBackground from "../../components/Home/HomeBackground";
import { RegistrationBanner } from "./RegistrationBanner";

const BLUE = "#31358B";
const RED = "#E62325";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, updateUser, logout } = useAuth();

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  function handleChangePhoto() {
    setAvatarModalVisible(true);
  }

  async function uploadAvatar(asset: ImagePicker.ImagePickerAsset) {
    try {
      setUploadingAvatar(true);

      const formData = new FormData();

      formData.append("avatar", {
        uri: asset.uri,
        name: asset.fileName || `avatar-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      } as any);

      const response = await api.post("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const nextUser = response.data?.user;

      if (nextUser) {
        await updateUser({
          avatar: nextUser.avatar ?? null,
          picture: nextUser.picture ?? user?.picture ?? null,
          name: nextUser.name ?? user?.name,
          nome: nextUser.nome ?? user?.nome,
        });
      }

      Alert.alert("Sucesso", "Foto de perfil atualizada.");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.error || "Não foi possível atualizar a foto.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handlePickFromGallery() {
    setAvatarModalVisible(false);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da sua permissão para acessar a galeria.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    await uploadAvatar(asset);
  }

  async function handleTakePhoto() {
    setAvatarModalVisible(false);

    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos da sua permissão para acessar a câmera.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    await uploadAvatar(asset);
  }

  async function removeProfilePhoto() {
    setAvatarModalVisible(false);

    try {
      setUploadingAvatar(true);

      await api.delete("/users/me/avatar");
      await updateUser({ avatar: null });

      Alert.alert("Sucesso", "Foto removida com sucesso.");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data?.error || "Não foi possível remover a foto.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleConfirmLogout() {
    try {
      setLeaving(true);
      await logout();
      setLogoutOpen(false);
      router.replace("/onboarding");
    } finally {
      setLeaving(false);
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />
      <HomeBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader user={user} onPressChangePhoto={handleChangePhoto} />

        <View style={styles.sheet}>
          {uploadingAvatar ? (
            <View style={styles.uploadingBox}>
              <ActivityIndicator size="large" color="#E62325" />
              <Text style={styles.uploadingText}>Atualizando foto...</Text>
            </View>
          ) : null}

          <View style={{ marginHorizontal: -20, marginBottom: 16 }}>
            <RegistrationBanner />
          </View>

          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.sectionLine} />

          <View style={{ marginTop: 26 }}>
            <ProfileMenuItem
              icon="person-outline"
              title="Conta"
              onPress={() => router.push("/profile/account")}
            />

            <ProfileMenuItem
              icon="ticket-outline"
              title="Meus Prêmios e Cupons"
              onPress={() => router.push("/wallet")}
            />

            <ProfileMenuItem
              icon="notifications-outline"
              title="Notificações"
              onPress={() => router.push("/notifications")}
            />

            <ProfileMenuItem
              icon="information-circle-outline"
              title="Sobre nós"
              onPress={() => router.push("/profile/about")}
            />

            <ProfileMenuItem
              icon="settings-outline"
              title="Configurações"
              onPress={() => router.push("/profile/settings")}
            />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.9}
            onPress={() => setLogoutOpen(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AvatarPickerModal
        visible={avatarModalVisible}
        hasPhoto={!!(user?.avatar || user?.picture)}
        onClose={() => setAvatarModalVisible(false)}
        onCamera={handleTakePhoto}
        onGallery={handlePickFromGallery}
        onRemove={removeProfilePhoto}
      />

      <Modal
        visible={logoutOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={24} color={RED} />
            </View>

            <Text style={styles.modalTitle}>Sair da conta?</Text>
            <Text style={styles.modalMessage}>
              Você realmente deseja encerrar sua sessão no Ludus?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setLogoutOpen(false)}
                disabled={leaving}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmBtn, leaving && { opacity: 0.7 }]}
                onPress={handleConfirmLogout}
                disabled={leaving}
              >
                <Text style={styles.confirmText}>
                  {leaving ? "Saindo..." : "Sair"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },

  scrollContent: {
    flexGrow: 1,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 6,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 140,
  },

  uploadingBox: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  uploadingText: {
    marginTop: 10,
    color: BLUE,
    fontWeight: "800",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: BLUE,
  },

  sectionLine: {
    marginTop: 10,
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#FBBC04",
  },

  logoutBtn: {
    marginTop: 22,
    height: 56,
    borderRadius: 18,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
  },

  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFE9EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: BLUE,
  },

  modalMessage: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#666D7E",
    fontWeight: "700",
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EEF0FF",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: BLUE,
    fontWeight: "900",
  },

  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "900",
  },
});
