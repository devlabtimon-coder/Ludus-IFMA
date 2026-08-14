import { NavFooter } from "@/src/components/common/NavFooter";
import { EngagementPreview } from "@/src/components/Home/EngagementPreview";
import { Header } from "@/src/components/Home/Header";
import { HomeCard } from "@/src/components/Home/HomeCard";
import SearchBar from "@/src/components/Home/SearchBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { useFilters } from "@/src/contexts/FiltersContext";
import { api } from "@/src/services/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeBackground from "../../components/Home/HomeBackground";

export type HomeGame = {
  id: string;
  title: string;
  cover?: string | null;
  price: number;
  rating?: number | null;
  ratingsCount?: number | null;
  available?: boolean;
  allowOriginalRental?: boolean;
  copiesCount?: number;
  availableCopiesCount?: number;
  isAvailableNow?: boolean;
};

// NOVA TIPAGEM PARA AS COLEÇÕES
export type GameCollection = {
  id: string;
  title: string;
  subtitle: string;
  games: HomeGame[];
};

type HomePayload = {
  forYou: HomeGame[];
  mostRented: HomeGame[];
  collections?: GameCollection[]; // <-- Novo
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const footerSpace = 80 + insets.bottom;

  const [search, setSearch] = useState("");

  const [forYou, setForYou] = useState<HomeGame[]>([]);
  const [mostRented, setMostRented] = useState<HomeGame[]>([]);
  const [collections, setCollections] = useState<GameCollection[]>([]); // <-- Novo Estado

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const { activeCount } = useFilters();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.replace("/admin/manage");
    }
  }, [user?.role]);

  const loadHome = useCallback(async () => {
    setErrMsg(null);

    try {
      const res = await api.get<HomePayload>("/games/home");
      setForYou(res.data?.forYou || []);
      setMostRented(res.data?.mostRented || []);
      setCollections(res.data?.collections || []); // <-- Salvando as coleções
    } catch (e) {
      console.error("Erro ao carregar home:", e);
      setErrMsg("Não foi possível carregar os jogos.");
      setForYou([]);
      setMostRented([]);
      setCollections([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadHome();
      setLoading(false);
    })();
  }, [loadHome]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHome();
    setRefreshing(false);
  }, [loadHome]);

  const onSubmitSearch = useCallback(() => {
    if (!search.trim()) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/search",
      params: { q: search },
    });
  }, [router, search]);

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <HomeBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topBlock}>
          <Header />
          <EngagementPreview />

          <View style={styles.searchWrap}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={onSubmitSearch}
              activeFiltersCount={activeCount}
            />
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Carregando jogos...</Text>
          </View>
        ) : errMsg ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{errMsg}</Text>

            <Text
              onPress={async () => {
                setLoading(true);
                await loadHome();
                setLoading(false);
              }}
              style={styles.retry}
            >
              Tentar novamente
            </Text>
          </View>
        ) : (
          <HomeCard
            forYou={forYou}
            mostRented={mostRented}
            collections={collections}
            onSeeAll={() => router.push("/search")}
            footerSpace={footerSpace}
          />
        )}
      </ScrollView>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  topBlock: { paddingBottom: 6 },
  searchWrap: { backgroundColor: "transparent", paddingBottom: 6 },
  center: { paddingTop: 30, alignItems: "center" },
  loadingText: { marginTop: 10, color: "#E0E0E0", fontWeight: "700" },
  errorText: { color: "#E0E0E0", fontWeight: "800" },
  retry: { marginTop: 10, color: "#FFFFFF", fontWeight: "900" },
});
