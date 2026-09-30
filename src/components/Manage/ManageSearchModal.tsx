import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import LudusAlert from "../common/LudusAlert/LudusAlert";
import { styles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface LudopediaGame {
  id: number;
  name: string;
  image: string;
}

export function ManageSearchModal({ visible, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LudopediaGame[]>([]);
  const [addingGameId, setAddingGameId] = useState<number | null>(null);
  const [addedGameIds, setAddedGameIds] = useState<number[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"error" | "success" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const showAlert = (
    type: "error" | "success" | "info",
    title: string,
    message: string
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  async function handleSearch() {
    if (!search.trim() || addingGameId !== null) return;

    setHasSearched(true);
    setLoading(true);

    try {
      const response = await api.get<LudopediaGame[]>(
        `/games/search-ludopedia?q=${encodeURIComponent(search)}`
      );
      setResults(response.data);
    } catch (error) {
      showAlert("error", "Erro", "Erro ao buscar jogos");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGame(game: LudopediaGame) {
    if (addingGameId !== null || addedGameIds.includes(game.id)) return;

    setAddingGameId(game.id);

    try {
      await api.post("/games", {
        ludopediaId: game.id,
        title: game.name,
        cover: game.image,
        price: 3,
      });

      setAddedGameIds((prev) => [...prev, game.id]);

      showAlert("success", "Sucesso 🎲", `"${game.name}" adicionado!`);

    } catch (error: any) {
      showAlert(
        "error",
        "Erro",
        error?.response?.data?.error || "Erro ao adicionar jogo"
      );
    } finally {
      setAddingGameId(null);
    }
  }

  const isAdding = addingGameId !== null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Buscar na Ludopedia</Text>
            <Pressable onPress={onClose} disabled={isAdding}>
              <Ionicons name="close" size={26} color="#31358B" />
            </Pressable>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#535353" />
            <TextInput
              style={styles.input}
              placeholder="Nome do jogo..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              editable={!isAdding}
              placeholderTextColor="#333"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#31358B" />
          ) : results.length === 0 && hasSearched ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#999" />
              <Text style={styles.emptyTitle}>Nenhum resultado</Text>
              <Text style={styles.emptySubtitle}>
                Tente outro nome
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const isAdded = addedGameIds.includes(item.id);
                const isLoadingItem = addingGameId === item.id;

                return (
                  <View style={styles.gameItem}>
                    <Image source={{ uri: item.image }} style={styles.thumb} />

                    <Text style={styles.gameName} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Pressable
                      style={[
                        styles.addButton,
                        (isAdded || isAdding) && styles.addButtonDisabled,
                      ]}
                      onPress={() => handleAddGame(item)}
                      disabled={isAdded || isAdding}
                    >
                      {isLoadingItem ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.addButtonText}>
                          {isAdded ? "Adicionado" : "Add"}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              }}
            />
          )}

          {isAdding && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255,255,255,0.9)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#31358B" />
              <Text style={{ marginTop: 10, fontWeight: "700" }}>
                Processando...
              </Text>
            </View>
          )}
        </View>
      </View>

      <LudusAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </Modal>
  );
}