import { EditGameModal } from "@/src/components/Manage/EditGames/EditGameModal";
import { ManageGameRow } from "@/src/components/Manage/EditGames/ManageGameRow";
import ManageBackground from "@/src/components/Manage/ManageBackground";
import { ManageContainer } from "@/src/components/Manage/ManageContainer";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// RF017 — Tier adicionado ao tipo de jogo
export type ManageGame = {
  id: string;
  title: string;
  cover?: string | null;
  price: number;
  available?: boolean;
  tier?: string | null;        // "LATAO" | "BRONZE" | "PRATA" | "OURO" | "DIAMANTE"

  description?: string | null;
  howToPlayUrl?: string | null;
  components?: string | null;

  rating?: number | null;
  ratingsCount?: number | null;
};

export default function EditGamesScreen() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<ManageGame[]>([]);
  const [selected, setSelected] = useState<ManageGame | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return games;
    return games.filter((g) => g.title.toLowerCase().includes(term));
  }, [q, games]);

  async function fetchGames() {
    setLoading(true);
    try {
      const res = await api.get<ManageGame[]>("/games");
      setGames(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar jogos:", err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  async function handleSave(next: Partial<ManageGame> & { id: string }) {
    try {
      // Salva campos gerais
      const res = await api.patch(`/games/${next.id}`, next);

      // RF017 — se o tier mudou, chama o endpoint específico de tier
      if (next.tier) {
        await api.patch(`/categories/games/${next.id}/tier`, { tier: next.tier });
      }

      setGames((prev) =>
        prev.map((g) => (g.id === next.id ? { ...res.data, tier: next.tier } : g))
      );

      setSelected(null);
    } catch (err) {
      console.error("Erro ao salvar jogo:", err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/games/${id}`);
      setGames((prev) => prev.filter((g) => g.id !== id));
      setSelected(null);
    } catch (err) {
      const error = err as any;
      console.error("Erro ao deletar jogo:", err);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível deletar o jogo. Tente novamente mais tarde."
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ManageBackground />

      <ManageContainer>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#31358B" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Editar Jogos</Text>
            <Text style={styles.subtitle}>
              Atualize preço, tier e disponibilidade
            </Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#535353" />
          <TextInput
            style={styles.input}
            placeholder="Buscar jogo..."
            placeholderTextColor="#666"
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
          />
        </View>

        {loading ? (
          <View style={{ paddingTop: 20 }}>
            <ActivityIndicator size="large" color="#31358B" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="create-outline" size={46} color="#999" />
                <Text style={styles.emptyTitle}>Nenhum jogo encontrado</Text>
                <Text style={styles.emptySubtitle}>Tente buscar por outro nome.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <ManageGameRow item={item} onPress={() => setSelected(item)} />
            )}
          />
        )}

        <EditGameModal
          visible={!!selected}
          game={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </ManageContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#31358B",
  },

  subtitle: {
    fontSize: 14,
    color: "#535353",
    marginTop: 2,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 55,
    marginBottom: 16,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 28,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#31358B",
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});