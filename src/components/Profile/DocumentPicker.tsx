import { Ionicons } from "@expo/vector-icons";
import * as DocumentPickerExpo from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export type PickedDoc =
  | string
  | {
      uri: string;
      name?: string;
      mimeType?: string;
      size?: number;
    }
  | null;

type Props = {
  label: string;
  description: string;
  imageUri: PickedDoc;
  onImageSelected: (file: any) => void;
};

export function DocumentPicker({
  label,
  description,
  imageUri,
  onImageSelected,
}: Props) {
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Precisamos de permissão para acessar sua câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Precisamos de permissão para acessar suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const pickPdf = async () => {
    try {
      const result = await DocumentPickerExpo.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
    }
  };

  const handlePress = () => {
    Alert.alert(
      "Anexar Documento",
      "Escolha como deseja enviar o arquivo (com frente e verso)",
      [
        { text: "Tirar Foto (Câmera)", onPress: takePhoto },
        { text: "Escolher Foto da Galeria", onPress: pickImage },
        { text: "Arquivo / PDF", onPress: pickPdf },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const isString = typeof imageUri === "string";
  const displayUri = isString ? imageUri : imageUri?.uri;
  // Links assinados do Cloudinary indicam o formato em `format=pdf`.
  const isPdf = isString
    ? /\.pdf|format=pdf/.test(imageUri.toLowerCase())
    : imageUri?.mimeType === "application/pdf" ||
      imageUri?.name?.toLowerCase().endsWith(".pdf");
  const fileName = !isString ? imageUri?.name : "Documento em PDF";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>

      <Pressable
        onPress={handlePress}
        style={[styles.box, imageUri ? styles.boxFilled : null]}
      >
        {imageUri ? (
          <>
            {isPdf ? (
              <View style={styles.pdfPreview}>
                <Ionicons name="document-text" size={54} color="#31358B" />
                <Text style={styles.pdfText} numberOfLines={1}>
                  {fileName}
                </Text>
                <Text style={styles.pdfSubtext}>PDF carregado</Text>
              </View>
            ) : (
              <Image source={{ uri: displayUri }} style={styles.preview} />
            )}
            <View style={styles.changeOverlay}>
              <Ionicons name="swap-horizontal" size={18} color="#fff" />
              <Text style={styles.changeText}>Trocar arquivo</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.iconCircle}>
              <Ionicons name="cloud-upload-outline" size={28} color="#04096E" />
            </View>
            <Text style={styles.uploadText}>Toque para anexar</Text>
            <Text style={styles.uploadSubtext}>PDF, JPG ou PNG (Máx. 5MB)</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#535353",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#8B8EA1",
    marginBottom: 12,
  },
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    minHeight: 160,
    overflow: "hidden",
  },
  boxFilled: {
    padding: 0,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#04096E",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#04096E",
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#999",
  },
  preview: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },
  pdfPreview: {
    width: "100%",
    height: 220,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  pdfText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "800",
    color: "#31358B",
    textAlign: "center",
  },
  pdfSubtext: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },
  changeOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(4, 9, 110, 0.85)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
    gap: 6,
  },
  changeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
