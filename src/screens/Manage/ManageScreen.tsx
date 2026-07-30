import ManageBackground from "@/src/components/Manage/ManageBackground";
import { ManageContainer } from "@/src/components/Manage/ManageContainer";
import { ManageGrid } from "@/src/components/Manage/ManageGrid";
import { ManageSearchModal } from "@/src/components/Manage/ManageSerachModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ManageScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ManageBackground />

      <ManageContainer>
        <Text style={styles.title}>Painel Administrativo</Text>
        <Text style={styles.subtitle}>
          Gerencie o catálogo do Ludus{" "}
          <Pressable
            onPress={async () => {
              await logout();
              router.replace("/onboarding");
            }}
          >
            <Text>Sair</Text>
          </Pressable>
        </Text>

        <ManageGrid
          onAddGamePress={() => setModalVisible(true)}
          onEditGamesPress={() => router.push("/admin/edit-games")}
          onManageCopiesPress={() => router.push("/admin/copies")}
          onManageRentalsPress={() => router.push("/admin/rentals")}
          onManageCategoriesPress={() =>
            router.push("/admin/client-categories")
          }
        />

        <ManageSearchModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </ManageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#31358B",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#535353",
    marginBottom: 28,
  },
});
