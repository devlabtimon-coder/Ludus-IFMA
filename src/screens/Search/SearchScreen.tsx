import { DEFAULT_FILTERS, useFilters } from "@/src/contexts/FiltersContext";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

import GameCard, { Game } from "@/src/components/Search/GameCard";
import SearchBackground from "@/src/components/Search/SearchBackground";
import SearchTop from "@/src/components/Search/SearchTop";

const EMPTY_IMAGE = require("../../../assets/no-result.png");

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const qParam = Array.isArray(params.q)
    ? params.q[0]
    : (params.q as string | undefined);
  const initialQ = (qParam || "").toString();

  const { filters, activeCount } = useFilters();

  const safeFilters = filters ?? DEFAULT_FILTERS;

  const [q, setQ] = useState(initialQ);
  const [games, setGames] = useState<Game[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Novo estado para controlar o loading inicial e das buscas
  const [isLoading, setIsLoading] = useState(true);

  const requestIdRef = useRef(0);

  const queryParams = useMemo(() => {
    const status =
      safeFilters.status === "ALL" ? undefined : safeFilters.status;

    const sendPrice =
      safeFilters.priceMin !== DEFAULT_FILTERS.priceMin ||
      safeFilters.priceMax !== DEFAULT_FILTERS.priceMax;

    const sendTime = safeFilters.timeMax !== DEFAULT_FILTERS.timeMax;

    return {
      q: q.trim() || undefined,
      status,
      players: safeFilters.players ?? undefined,
      age: safeFilters.age ?? undefined,
      sort: safeFilters.sort,
      priceMin: sendPrice ? safeFilters.priceMin : undefined,
      priceMax: sendPrice ? safeFilters.priceMax : undefined,
      timeMax: sendTime ? safeFilters.timeMax : undefined,
      tier: safeFilters.tier.length ? safeFilters.tier.join(",") : undefined,
      mechanics: safeFilters.mechanics.length
        ? safeFilters.mechanics.join(",")
        : undefined,
    };
  }, [q, safeFilters]);

  const fetchGames = useCallback(async () => {
    const currentId = ++requestIdRef.current;

    setIsLoading(true);

    try {
      const res = await api.get("/games", { params: queryParams });
      if (currentId !== requestIdRef.current) return;

      setGames(res.data || []);
    } catch (e) {
      console.error("Erro ao buscar jogos:", e);
      if (currentId === requestIdRef.current) {
        setGames([]);
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryParams]);

  useEffect(() => {
    router.setParams({ q: q || undefined });
    fetchGames();
  }, [q, fetchGames, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
  };

  const onSubmitSearch = () => fetchGames();

  return (
    <View style={{ flex: 1 }}>
      <SearchBackground />

      <SearchTop
        value={q}
        onChangeText={setQ}
        onSubmit={onSubmitSearch}
        onOpenFilters={() => router.push("/filter")}
        activeFiltersCount={activeCount}
      />

      <View
        style={{
          flex: 1,
          marginTop: 25,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 18,
          paddingBottom: 24,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            paddingHorizontal: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#555" }}>
            {isLoading ? "Buscando..." : `${games.length} Resultados`}
          </Text>

          <Pressable
            onPress={() => router.push("/filter")}
            style={{
              height: 44,
              paddingHorizontal: 16,
              borderRadius: 14,
              backgroundColor: "#B3193A",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="filter" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800" }}>Filtros</Text>

            {activeCount > 0 && (
              <View
                style={{
                  marginLeft: 6,
                  minWidth: 18,
                  height: 18,
                  paddingHorizontal: 5,
                  borderRadius: 999,
                  backgroundColor: "#E62325",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}
                >
                  {activeCount > 9 ? "9+" : activeCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <FlatList
          data={games}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <GameCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 4,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#B3193A"
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 50,
                marginTop: 60,
              }}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="large" color="#B3193A" />
                  <Text
                    style={{
                      marginTop: 16,
                      fontSize: 15,
                      color: "#8B8EA1",
                      fontWeight: "600",
                    }}
                  >
                    Buscando jogos...
                  </Text>
                </>
              ) : (
                <>
                  <Image
                    source={EMPTY_IMAGE}
                    style={{
                      width: 140,
                      height: 140,
                      marginBottom: 18,
                      opacity: 0.85,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      marginTop: 6,
                      fontSize: 14,
                      color: "#8B8EA1",
                      textAlign: "center",
                      paddingHorizontal: 30,
                      lineHeight: 20,
                    }}
                  >
                    Tente buscar por outro nome ou ajuste os filtros.
                  </Text>
                </>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
}
