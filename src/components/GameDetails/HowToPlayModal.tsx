import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const LUDUS = { blue: "#31358B", red: "#E62325" };

export function HowToPlayModal({
  visible,
  title,
  url,
  onClose,
}: {
  visible: boolean;
  title: string;
  url: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        >
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
      </View>

      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    paddingTop: 12,
    paddingHorizontal: 14,
    backgroundColor: LUDUS.blue,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { flex: 1, color: "#fff", fontWeight: "900" },
});