import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  hasPhoto?: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onRemove?: () => void;
};

export function AvatarPickerModal({
  visible,
  hasPhoto = false,
  onClose,
  onCamera,
  onGallery,
  onRemove,
}: Props) {
  const insets = useSafeAreaInsets();

  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(sheetAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 16,
          bounciness: 6,
        }),
      ]).start();
    } else {
      backdropAnim.setValue(0);
      sheetAnim.setValue(80);
    }
  }, [visible, backdropAnim, sheetAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 18),
              transform: [{ translateY: sheetAnim }],
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Alterar foto de perfil</Text>
            <Text style={styles.subtitle}>
              Escolha como deseja enviar sua nova foto
            </Text>
          </View>

          <Pressable style={[styles.actionButton, styles.primary]} onPress={onCamera}>
            <View style={[styles.iconWrap, styles.primaryIconWrap]}>
              <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.primaryTitle}>Tirar foto</Text>
              <Text style={styles.primarySubtitle}>
                Use a câmera do celular agora
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable style={[styles.actionButton, styles.secondary]} onPress={onGallery}>
            <View style={[styles.iconWrap, styles.secondaryIconWrap]}>
              <Ionicons name="images-outline" size={22} color="#31358B" />
            </View>

            <View style={styles.textWrap}>
              <Text style={styles.secondaryTitle}>Escolher da galeria</Text>
              <Text style={styles.secondarySubtitle}>
                Selecione uma imagem salva no aparelho
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#31358B" />
          </Pressable>

          {hasPhoto && onRemove ? (
            <Pressable style={[styles.actionButton, styles.remove]} onPress={onRemove}>
              <View style={[styles.iconWrap, styles.removeIconWrap]}>
                <Ionicons name="trash-outline" size={22} color="#E62325" />
              </View>

              <View style={styles.textWrap}>
                <Text style={styles.removeTitle}>Remover foto atual</Text>
                <Text style={styles.removeSubtitle}>
                  Voltar para a imagem padrão do perfil
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#E62325" />
            </Pressable>
          ) : null}

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 18, 38, 0.42)",
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -8 },
    elevation: 18,
  },

  handle: {
    alignSelf: "center",
    width: 52,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#D9DCE5",
    marginBottom: 14,
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1C2143",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    color: "#7A8095",
    textAlign: "center",
  },

  actionButton: {
    minHeight: 84,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

 primary: {
  backgroundColor: "#F4F6FB",
  borderWidth: 1,
  borderColor: "#E4E8F2",
},

  secondary: {
    backgroundColor: "#F4F6FB",
    borderWidth: 1,
    borderColor: "#E4E8F2",
  },

  remove: {
    backgroundColor: "#FFF4F4",
    borderWidth: 1,
    borderColor: "#FFD8D8",
  },

  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  primaryIconWrap: {
  backgroundColor: "#E8EDFF",
},

  secondaryIconWrap: {
    backgroundColor: "#E8EDFF",
  },

  removeIconWrap: {
    backgroundColor: "#FFE7E7",
  },

  textWrap: {
    flex: 1,
  },

 primaryTitle: {
  color: "#31358B",
  fontSize: 16,
  fontWeight: "900",
},

primarySubtitle: {
  marginTop: 3,
  color: "#6E7590",
  fontSize: 12,
  fontWeight: "700",
},

  secondaryTitle: {
    color: "#1F275C",
    fontSize: 16,
    fontWeight: "900",
  },

  secondarySubtitle: {
    marginTop: 3,
    color: "#6E7590",
    fontSize: 12,
    fontWeight: "700",
  },

  removeTitle: {
    color: "#D81F26",
    fontSize: 16,
    fontWeight: "900",
  },

  removeSubtitle: {
    marginTop: 3,
    color: "#AA5A5E",
    fontSize: 12,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 2,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#8B92A8",
    fontSize: 15,
    fontWeight: "900",
  },
});