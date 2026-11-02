import FavoritesCard, { FavoriteGame } from "@/src/components/Favorites/FavoritesCard";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { NavFooter } from "@/src/components/common/NavFooter";
import { api } from "@/src/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

type SortKey = "price" | "rating" | "title";

export default function FavoritesScreen() {
  const safeTop = useSafeTop(58);
  const [items, setItems] = useState<FavoriteGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("price");

  const loadFavorites = useCallback(async () => {
    setErrMsg(null);
    try {
      
      const res = await api.get<FavoriteGame[]>("/favorites");
      setItems(res.data || []);
    } catch (e) {
      console.error("Erro ao carregar favoritos:", e);
      setErrMsg("Não foi possível carregar seus favoritos.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadFavorites();
    }, [loadFavorites])
  );

  const sorted = useMemo(() => {
    const arr = [...items];
    if (sortKey === "price") arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortKey === "rating") arr.sort((a, b) => (Number(b.rating ?? 0) - Number(a.rating ?? 0)));
    if (sortKey === "title") arr.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    return arr;
  }, [items, sortKey]);

  const handleToggleSort = () => {
    setSortKey((prev) => (prev === "price" ? "rating" : prev === "rating" ? "title" : "price"));
  };

  const handleDelete = async (gameId: string) => {

    await api.delete(`/favorites/${gameId}`);
    setItems((prev) => prev.filter((x) => x.id !== gameId));
  };

  return (
    <View style={styles.root}>
      <HomeBackground />

      <View style={[styles.header, { paddingTop: safeTop }]}>
        <Text style={styles.title}>Favoritos</Text>
      </View>

      <View style={styles.sheet}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : errMsg ? (
          <View style={styles.center}>
            <Text style={styles.err}>{errMsg}</Text>
            <Text style={styles.retry} onPress={loadFavorites}>
              Tentar novamente
            </Text>
          </View>
        ) : (
          <FavoritesCard
            data={sorted}
            sortKey={sortKey}
            onToggleSort={handleToggleSort}
            onDelete={handleDelete}
          />
        )}
      </View>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#31358B" },

  header: {
    paddingTop: 58,
    paddingBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    paddingTop: 18,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  err: { color: "#666", fontWeight: "800", textAlign: "center", paddingHorizontal: 24 },
  retry: { marginTop: 10, color: "#31358B", fontWeight: "900" },
});