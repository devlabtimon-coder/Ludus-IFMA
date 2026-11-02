import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  getVerificationState,
  isIfmaMode as getIfmaMode,
  VERIFICATION_PENDING_TEXT,
} from "../../utils/verification";

export function RegistrationBanner() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, []),
  );

  const handleCheckStatus = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res = await api.get(`/users/me?t=${Date.now()}`);

      await refreshUser();

      const fresh = getVerificationState({ ...user, ...res.data });

      if (fresh.status !== "APPROVED") {
        router.push("/profile/documents");
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isIfmaMode = getIfmaMode();
  const { status, rejectReason } = getVerificationState(user);

  // Aprovado não precisa de aviso; conta suspensa é tratada no login.
  if (status === "APPROVED" || status === "BLOCKED") return null;

  if (status === "PENDING") {
    return (
      <Pressable
        style={styles.containerInfo}
        onPress={handleCheckStatus}
        accessibilityRole="button"
        accessibilityHint="Atualiza a situação do cadastro"
      >
        <View style={styles.iconWrapInfo}>
          {isRefreshing ? (
            <ActivityIndicator color="#1D4ED8" />
          ) : (
            <Ionicons name="time" size={24} color="#1D4ED8" />
          )}
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.titleInfo}>Em Análise</Text>
          <Text style={styles.subtitleInfo}>
            {VERIFICATION_PENDING_TEXT} Toque aqui para atualizar.
          </Text>
        </View>
      </Pressable>
    );
  }

  if (status === "REJECTED") {
    return (
      <Pressable
        style={styles.containerError}
        onPress={() => router.push("/profile/documents")}
      >
        <View style={styles.iconWrapError}>
          <Ionicons name="alert-circle" size={24} color="#DC2626" />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.titleError}>Cadastro recusado</Text>
          <Text style={styles.subtitleError}>
            {rejectReason
              ? `Motivo: ${rejectReason.replace(/[.!]+$/, "")}. Toque aqui para reenviar os documentos.`
              : "A biblioteca recusou seus documentos. Toque aqui para reenviar."}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#DC2626" />
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.containerWarning}
      onPress={() => router.push("/profile/documents")}
    >
      <View style={styles.iconWrapWarning}>
        <Ionicons
          name={isIfmaMode ? "school" : "warning"}
          size={24}
          color="#B8860B"
        />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.titleWarn}>
          {isIfmaMode ? "Vínculo Acadêmico" : "Termine seu cadastro!"}
        </Text>
        <Text style={styles.subtitleWarn}>
          {isIfmaMode
            ? "Envie seu comprovante de matrícula para liberar os aluguéis no campus Timon."
            : "Envie seus documentos para liberar o aluguel de jogos do acervo."}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#B8860B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textWrap: {
    flex: 1,
    paddingRight: 8,
  },

  containerWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderColor: "#FBBC04",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  iconWrapWarning: {
    backgroundColor: "#FEF08A",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleWarn: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9A6B00",
    marginBottom: 2,
  },
  subtitleWarn: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 18,
  },

  containerError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#E62325",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  iconWrapError: {
    backgroundColor: "#FEE2E2",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleError: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E62325",
    marginBottom: 2,
  },
  subtitleError: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
  },

  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  iconWrapInfo: {
    backgroundColor: "#DBEAFE",
    padding: 8,
    borderRadius: 50,
    marginRight: 12,
  },
  titleInfo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 2,
  },
  subtitleInfo: {
    fontSize: 13,
    color: "#1D4ED8",
    lineHeight: 18,
  },
});
