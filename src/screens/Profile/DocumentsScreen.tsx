import BackButton from "@/src/components/common/BackButton";
import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import LoginBackground from "@/src/components/Login/LoginBackground";
import { DocumentPicker } from "@/src/components/Profie/DocumentPicker";
import { useAuth } from "@/src/contexts/AuthContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import * as ExpoDocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { height } = Dimensions.get("window");
type AlertType = "error" | "success" | "info";

export default function DocumentsScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [documentFile, setDocumentFile] = useState<any>(
    user?.documentFile || null,
  );

  const [enrollmentProof, setEnrollmentProof] = useState<any>(
    user?.enrollmentProof || null,
  );

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (
      user?.documentFile &&
      (!documentFile || typeof documentFile === "string")
    ) {
      setDocumentFile(user.documentFile);
    }
    if (
      user?.enrollmentProof &&
      (!enrollmentProof || typeof enrollmentProof === "string")
    ) {
      setEnrollmentProof(user.enrollmentProof);
    }
  }, [user?.documentFile, user?.enrollmentProof]);

  const showAlert = (type: AlertType, title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const pickEnrollmentProof = async () => {
    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setEnrollmentProof(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar documento:", error);
    }
  };

  const handleSubmit = async () => {
    if (!documentFile || !enrollmentProof) {
      return showAlert(
        "info",
        "Faltam informações",
        "Por favor, anexe todos os documentos solicitados.",
      );
    }

    setLoading(true);
    try {
      const formData = new FormData();
      let hasChanges = false;

      if (documentFile && typeof documentFile !== "string") {
        const isPdf =
          documentFile.mimeType === "application/pdf" ||
          documentFile.name?.toLowerCase().endsWith(".pdf");

        formData.append("documentFile", {
          uri: documentFile.uri,
          name:
            documentFile.name || (isPdf ? "documento.pdf" : "documento.jpg"),
          type:
            documentFile.mimeType || (isPdf ? "application/pdf" : "image/jpeg"),
        } as any);
        hasChanges = true;
      } else if (
        typeof documentFile === "string" &&
        !documentFile.startsWith("http")
      ) {
        const isPdf = documentFile.toLowerCase().endsWith(".pdf");
        formData.append("documentFile", {
          uri: documentFile,
          name: isPdf ? "documento.pdf" : "documento.jpg",
          type: isPdf ? "application/pdf" : "image/jpeg",
        } as any);
        hasChanges = true;
      }

      if (enrollmentProof && typeof enrollmentProof !== "string") {
        formData.append("enrollmentProof", {
          uri: enrollmentProof.uri,
          name: enrollmentProof.name || "comprovante.pdf",
          type: enrollmentProof.mimeType || "application/pdf",
        } as any);
        hasChanges = true;
      }

      if (!hasChanges) {
        setLoading(false);
        return showAlert(
          "info",
          "Nenhuma alteração",
          "Você não modificou nenhum arquivo.",
        );
      }

      await api.patch("/users/me/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await refreshUser();

      showAlert(
        "success",
        "Enviado com sucesso!",
        "Seus documentos estão em análise. Você será notificado assim que o vínculo for aprovado.",
      );

      setTimeout(() => {
        setAlertVisible(false);
        router.back();
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const serverMsg = error.response?.data?.error;
      showAlert(
        "error",
        "Erro no envio",
        serverMsg || "Não foi possível enviar os documentos. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LoginBackground />
      <BackButton />

      <View style={styles.bottomArea}>
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <View style={styles.headerTitleRow}>
              <View style={styles.iconWrap}>
                <Ionicons name="documents" size={26} color="#ffffff" />
              </View>
              <Text style={styles.title}>Documentação</Text>
            </View>

            <Text style={styles.subtitle}>
              Anexe o seu documento e o comprovante do SUAP para liberar os
              aluguéis no IFMA.
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoBoxHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#31358B" />
                <Text style={styles.infoTitle}>Ambiente Seguro</Text>
              </View>
              <Text style={styles.infoText}>
                Este aplicativo é de uso exclusivo da comunidade do IFMA Campus
                Timon. Seus dados estão criptografados e serão usados
                exclusivamente para a aprovação do cadastro.
              </Text>
            </View>

            {user?.registrationStatus === "REJECTED" && (
              <View style={styles.rejectedBox}>
                <View style={styles.rejectedHeader}>
                  <Ionicons name="alert-circle" size={18} color="#E62325" />
                  <Text style={styles.rejectedTitle}>
                    Documentação Recusada
                  </Text>
                </View>
                <Text style={styles.rejectedText}>
                  {user?.rejectReason ||
                    "Por favor, verifique a qualidade dos arquivos e envie novamente."}
                </Text>
              </View>
            )}

            <View style={styles.enrollmentBox}>
              <Text style={styles.inputLabel}>
                Comprovante de Matrícula/Declaração de vínculo
              </Text>
              <Text style={styles.enrollmentDesc}>
                Baixe o PDF do comprovante no SUAP ou tire um print legível da
                tela onde aparece seu nome e status.
              </Text>

              {typeof enrollmentProof === "string" ? (
                <View style={styles.savedFileContainer}>
                  <View style={styles.savedFileInfo}>
                    <Ionicons
                      name="checkmark-circle"
                      size={26}
                      color="#22C55E"
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.savedFileTitle}>
                        Comprovante Salvo
                      </Text>
                      <Text style={styles.savedFileSub}>
                        Enviado anteriormente
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => Linking.openURL(enrollmentProof)}
                      style={styles.viewFileBtn}
                    >
                      <Ionicons name="eye-outline" size={18} color="#31358B" />
                      <Text style={styles.viewFileBtnText}>Ver</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={styles.replaceFileBtn}
                    onPress={pickEnrollmentProof}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={18}
                      color="#6B7280"
                    />
                    <Text style={styles.replaceFileBtnText}>
                      Trocar documento
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.uploadButton}
                  onPress={pickEnrollmentProof}
                >
                  <Ionicons
                    name={
                      enrollmentProof ? "document-text" : "cloud-upload-outline"
                    }
                    size={28}
                    color="#31358B"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.uploadButtonText} numberOfLines={1}>
                      {enrollmentProof?.name
                        ? enrollmentProof.name
                        : "Selecionar Arquivo (PDF ou Imagem)"}
                    </Text>
                    {enrollmentProof && (
                      <Text style={styles.uploadSubtext}>
                        Arquivo pronto para envio
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
            </View>

            <View style={styles.docsContainer}>
              <DocumentPicker
                label="Documento de Identificação (RG/CNH)"
                description="Envie foto ou PDF contendo frente e verso visíveis."
                imageUri={documentFile}
                onImageSelected={setDocumentFile}
              />
            </View>

            <Pressable
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Ionicons name="paper-plane-outline" size={20} color="#FFF" />
              <Text style={styles.buttonText}>
                {loading ? "Enviando arquivos..." : "Enviar para Análise"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#31358B",
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.88,
    height: height * 0.88,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  scroll: {
    paddingBottom: 40,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FBBC04",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    color: "#0A1F5C",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 22,
    fontWeight: "500",
  },

  infoBox: {
    backgroundColor: "#F0F2FF",
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.15)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoBoxHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#31358B",
  },
  infoText: {
    fontSize: 13,
    color: "#535353",
    lineHeight: 19,
    fontWeight: "600",
  },

  rejectedBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#E62325",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  rejectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rejectedTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#E62325",
  },
  rejectedText: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
    fontWeight: "600",
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0A1F5C",
    marginBottom: 8,
  },

  enrollmentBox: {
    marginBottom: 24,
  },
  enrollmentDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  savedFileContainer: {
    backgroundColor: "#F7F8FF",
    borderWidth: 1.5,
    borderColor: "#31358B",
    borderRadius: 16,
    overflow: "hidden",
  },
  savedFileInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F0F2FF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(49,53,139,0.1)",
  },
  savedFileTitle: {
    color: "#0A1F5C",
    fontSize: 15,
    fontWeight: "900",
  },
  savedFileSub: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  viewFileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCE1FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewFileBtnText: {
    color: "#31358B",
    fontSize: 13,
    fontWeight: "800",
  },
  replaceFileBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    gap: 8,
  },
  replaceFileBtnText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "700",
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FF",
    borderWidth: 1.5,
    borderColor: "#31358B",
    borderStyle: "dashed",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
  },
  uploadButtonText: {
    color: "#31358B",
    fontSize: 14,
    fontWeight: "900",
  },
  uploadSubtext: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  docsContainer: {
    marginTop: 10,
  },

  button: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#E62325",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#E62325",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
