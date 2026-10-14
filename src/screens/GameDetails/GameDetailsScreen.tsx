import { api } from "@/src/services/api";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LudusAlert from "@/src/components/common/LudusAlert/LudusAlert";
import { BottomBar } from "@/src/components/GameDetails/BottomBar";
import { GameComponents } from "@/src/components/GameDetails/GameComponents";
import { GameDescription } from "@/src/components/GameDetails/GameDescription";
import { GameFactsRow } from "@/src/components/GameDetails/GameFactsRow";
import { GameHero } from "@/src/components/GameDetails/GameHero";
import { GameHowToPlay } from "@/src/components/GameDetails/GameHowToPlay";
import { GameMeta } from "@/src/components/GameDetails/GameMeta";
import { MarketPriceBadge } from "@/src/components/GameDetails/MarketPriceBadge";
import { RateModal } from "@/src/components/GameDetails/RateModal";
import { RentModal } from "@/src/components/GameDetails/RentModal";
import {
  BlockType,
  VerificationBlockModal,
} from "@/src/components/GameDetails/VerificationBlockModal";
import { TermsRentModal } from "@/src/components/RentTerms/TermsRentModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type GameDetails = {
  id: string;
  title: string;
  cover?: string | null;

  description?: string | null;
  howToPlayUrl?: string | null;

  price: number;
  available?: boolean;
  allowOriginalRental?: boolean;

  rating?: number | null;
  ratingsCount?: number | null;
  myRating?: number | null;

  minPlayers?: number | null;
  maxPlayers?: number | null;
  minAge?: number | null;
  minTime?: number | null;
  maxTime?: number | null;

  isAvailableNow?: boolean;
  rentedByMe?: boolean;

  tier?: string | null;
  mechanics?: string[];
};

type AlertType = "error" | "success" | "info";

export default function GameDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useFocusEffect(
    useCallback(() => {
      refreshUser();
    }, []),
  );

  const params = useLocalSearchParams();
  const id = useMemo(
    () => (Array.isArray(params.id) ? params.id[0] : String(params.id)),
    [params.id],
  );

  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favSaving, setFavSaving] = useState(false);
  const [favToastVisible, setFavToastVisible] = useState(false);
  const [favToastMessage, setFavToastMessage] = useState("");

  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [rentOpen, setRentOpen] = useState(false);
  const [rentLoading, setRentLoading] = useState(false);

  const [rateOpen, setRateOpen] = useState(false);
  const [savingRate, setSavingRate] = useState(false);
  const [canRate, setCanRate] = useState(false);

  const [watching, setWatching] = useState(false);
  const [loadingWatch, setLoadingWatch] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);

  const pendingRentRef = useRef<null | {
    startDateIso: string;
    endDateIso: string;
  }>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [tab, setTab] = useState<"description" | "components" | "howtoplay">(
    "description",
  );

  const showAlert = useCallback(
    (type: AlertType, title: string, message: string) => {
      setAlertType(type);
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertVisible(true);
    },
    [],
  );

  const hasHowToPlay = !!(game?.howToPlayUrl && game.howToPlayUrl.trim());

  useEffect(() => {
    if (tab === "howtoplay" && !hasHowToPlay) setTab("description");
  }, [tab, hasHowToPlay]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.get(`/games/${id}`);
      setGame(res.data);
    } catch {
      setErrMsg("Não foi possível carregar os detalhes.");
      setGame(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const avgRating = Number(game?.rating ?? 0);

  const handleSaveRating = async (value: number) => {
    if (!game) return;

    if (isAdmin) {
      showAlert(
        "info",
        "Ação bloqueada",
        "Conta ADMIN não pode avaliar jogos.",
      );
      return;
    }

    setSavingRate(true);
    try {
      const res = await api.post(`/games/${game.id}/rating`, { value });

      setGame((prev) =>
        prev
          ? {
              ...prev,
              rating: res.data?.avgRating ?? prev.rating,
              ratingsCount: res.data?.ratingsCount ?? prev.ratingsCount,
              myRating: res.data?.myRating ?? value,
            }
          : prev,
      );

      setRateOpen(false);
      showAlert(
        "success",
        "Avaliação salva!",
        "Sua avaliação foi registrada com sucesso.",
      );
    } catch (e: any) {
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      if (code === "CANNOT_RATE") {
        setCanRate(false);
        showAlert(
          "info",
          "Avaliação bloqueada",
          "Você só pode avaliar este jogo após devolver.",
        );
        return;
      }

      showAlert(
        "error",
        "Erro",
        msg || "Não foi possível salvar sua avaliação. Tente novamente.",
      );
    } finally {
      setSavingRate(false);
    }
  };

  useEffect(() => {
    if (!game?.id) return;

    api
      .get(`/games/${game.id}/watch`)
      .then((res) => setWatching(!!res.data?.watching))
      .catch(() => setWatching(false));
  }, [game?.id]);

  const toggleWatch = async () => {
    if (!game) return;

    setLoadingWatch(true);
    try {
      if (!watching) {
        await api.post(`/games/${game.id}/watch`);
        setWatching(true);
        showAlert(
          "success",
          "Aviso ativado",
          "Vamos te avisar quando o jogo voltar a ficar disponível.",
        );
      } else {
        await api.delete(`/games/${game.id}/watch`);
        setWatching(false);
        showAlert("info", "Aviso removido", "Você não será mais notificado.");
      }
    } catch {
      showAlert("error", "Erro", "Não foi possível atualizar o aviso.");
    } finally {
      setLoadingWatch(false);
    }
  };

  useEffect(() => {
    if (!game?.id) return;

    api
      .get(`/games/${game.id}/can-rate`)
      .then((res) => setCanRate(!!res.data?.canRate))
      .catch(() => setCanRate(false));
  }, [game?.id]);

  const handleConfirmRental = useCallback(
    async (startDateIso: string, endDateIso: string) => {
      if (!game) return;

      setRentLoading(true);
      try {
        await api.post("/rentals", {
          gameId: game.id,
          startDateIso,
          endDateIso,
        });

        setRentOpen(false);

        setTimeout(async () => {
          showAlert(
            "success",
            "Reserva Confirmada! 🎲",
            "Retire o seu jogo na Biblioteca IFMA - Campus Timon no horário agendado.",
          );
          await fetchDetails();
        }, 400);
      } catch (e: any) {
        setRentOpen(false);

        setTimeout(() => {
          const status = e?.response?.status;
          const code = e?.response?.data?.code;

          if (status === 403 && code === "TERMS_NOT_ACCEPTED") {
            pendingRentRef.current = { startDateIso, endDateIso };
            setTermsOpen(true);
            return;
          }

          const msg = e?.response?.data?.error;

          if (code === "RENTAL_LIMIT_REACHED") {
            showAlert(
              "info",
              "Limite atingido",
              "Você já possui 2 aluguéis em aberto. Finalize um para agendar outro.",
            );
            return;
          }

          if (code === "TIER_ACCESS_DENIED") {
            showAlert(
              "error",
              "Acesso restrito",
              msg || "Sua categoria de cliente não permite alugar este jogo.",
            );
            return;
          }

          if (code === "TIME_SLOT_TAKEN") {
            showAlert(
              "error",
              "Horário Ocupado",
              msg ||
                "Todos os exemplares deste jogo já estão reservados para este horário.",
            );
            return;
          }

          showAlert(
            "error",
            "Erro ao reservar",
            msg ||
              "Não foi possível processar o seu agendamento. Tente novamente.",
          );
        }, 400);
      } finally {
        setRentLoading(false);
      }
    },
    [game, fetchDetails, showAlert],
  );

  const acceptTermsAndContinue = useCallback(async () => {
    if (!pendingRentRef.current) return;

    setTermsLoading(true);
    try {
      await api.post("/rentals/accept-terms");
      setTermsOpen(false);

      const pending = pendingRentRef.current;
      pendingRentRef.current = null;

      await handleConfirmRental(pending.startDateIso, pending.endDateIso);
    } catch {
      showAlert(
        "error",
        "Erro",
        "Não foi possível aceitar os termos. Tente novamente.",
      );
    } finally {
      setTermsLoading(false);
    }
  }, [handleConfirmRental, showAlert]);

  const openRentFlow = useCallback(() => {
    if (!game) return;
    setRentOpen(true);
  }, [game]);

  const checkFavorite = useCallback(async (gameId: string) => {
    try {
      const res = await api.get(`/favorites/check/${gameId}`);
      setIsFavorite(!!res.data?.isFavorite);
    } catch {
      setIsFavorite(false);
    }
  }, []);

  useEffect(() => {
    if (game?.id) checkFavorite(game.id);
  }, [game?.id, checkFavorite]);

  const handleToggleFavorite = async () => {
    if (!game?.id || favSaving) return;

    setFavSaving(true);
    const next = !isFavorite;
    setIsFavorite(next);

    try {
      if (next) {
        await api.post(`/favorites/${game.id}`);
        setFavToastMessage("Adicionado aos favoritos");
      } else {
        await api.delete(`/favorites/${game.id}`);
        setFavToastMessage("Removido dos favoritos");
      }

      setFavToastVisible(true);
      setTimeout(() => setFavToastVisible(false), 3000);
    } catch {
      setIsFavorite(!next);
    } finally {
      setFavSaving(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#31358B" />
      <View style={styles.mainContainer}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : errMsg ? (
          <View style={styles.center}>
            <Text style={{ color: "#666", fontWeight: "700" }}>{errMsg}</Text>
            <Text
              onPress={fetchDetails}
              style={{ marginTop: 10, color: "#0A1F5C", fontWeight: "900" }}
            >
              Tentar novamente
            </Text>
          </View>
        ) : !game ? (
          <View style={styles.center}>
            <Text style={{ color: "#666", fontWeight: "700" }}>
              Jogo não encontrado.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 140 }}
            >
              <GameHero
                gameId={game.id}
                coverUrl={game.cover}
                isFavorite={isFavorite}
                onToggleFavorite={() => {
                  if (isAdmin) {
                    showAlert(
                      "info",
                      "Ação bloqueada",
                      "Administrador não pode favoritar jogos",
                    );
                    return;
                  }
                  handleToggleFavorite();
                }}
              />

              <View style={styles.sheet}>
                <GameMeta
                  title={game.title}
                  avgRating={avgRating}
                  ratingsCount={game.ratingsCount}
                  onPressRate={() => {
                    if (isAdmin) {
                      showAlert(
                        "info",
                        "Ação bloqueada",
                        "Conta ADMIN não pode avaliar jogos.",
                      );
                      return;
                    }
                    if (!canRate) {
                      showAlert(
                        "info",
                        "Avaliação bloqueada",
                        "Você só pode avaliar este jogo após alugar e devolver.",
                      );
                      return;
                    }
                    setRateOpen(true);
                  }}
                  available={!!game.available}
                  rentalDaysText="Por agendamento"
                  availabilityForecast={null}
                  tier={game.tier}
                />

                <MarketPriceBadge gameId={game.id} />

                <GameFactsRow
                  minPlayers={game.minPlayers}
                  maxPlayers={game.maxPlayers}
                  minTime={game.minTime}
                  maxTime={game.maxTime}
                  minAge={game.minAge}
                />

                {game.mechanics && game.mechanics.length > 0 && (
                  <View style={styles.mechanicsContainer}>
                    {game.mechanics.map((mechanic, index) => (
                      <Pressable
                        key={index}
                        onPress={() =>
                          router.push({
                            pathname: "/guide",
                            params: { name: mechanic },
                          })
                        }
                        style={({ pressed }) => [
                          styles.mechanicPill,
                          pressed && { opacity: 0.75 },
                        ]}
                      >
                        <Ionicons
                          name="information-circle-outline"
                          size={13}
                          color="#31358B"
                        />
                        <Text style={styles.mechanicText}>{mechanic}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                <View style={styles.tabs}>
                  <Pressable
                    onPress={() => setTab("description")}
                    style={[
                      styles.tab,
                      tab === "description" && styles.tabYellow,
                    ]}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={16}
                      color={tab === "description" ? "#fff" : "#7A8194"}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tabText,
                        tab === "description" && styles.tabTextActive,
                      ]}
                    >
                      Descrição
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setTab("components")}
                    style={[styles.tab, tab === "components" && styles.tabBlue]}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={16}
                      color={tab === "components" ? "#fff" : "#7A8194"}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tabText,
                        tab === "components" && styles.tabTextActive,
                      ]}
                    >
                      Componentes
                    </Text>
                  </Pressable>

                  {hasHowToPlay && (
                    <Pressable
                      onPress={() => setTab("howtoplay")}
                      style={[styles.tab, tab === "howtoplay" && styles.tabRed]}
                    >
                      <Ionicons
                        name="play-circle-outline"
                        size={16}
                        color={tab === "howtoplay" ? "#fff" : "#7A8194"}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.tabText,
                          tab === "howtoplay" && styles.tabTextActive,
                        ]}
                      >
                        Como jogar
                      </Text>
                    </Pressable>
                  )}
                </View>

                {tab === "description" && (
                  <GameDescription description={game.description} />
                )}

                {tab === "components" && <GameComponents gameId={game.id} />}

                {tab === "howtoplay" && hasHowToPlay && (
                  <GameHowToPlay url={game.howToPlayUrl} title={game.title} />
                )}
              </View>
            </ScrollView>

            <BottomBar
              price={game.price}
              unavailable={!game.isAvailableNow}
              rentedByMe={game.rentedByMe}
              watching={watching}
              loadingWatch={loadingWatch}
              onToggleWatch={toggleWatch}
              onPressRent={async () => {
                if (isAdmin) {
                  showAlert(
                    "info",
                    "Ação bloqueada",
                    "Administrador não pode alugar jogos.",
                  );
                  return;
                }

                const isIfmaMode = process.env.EXPO_PUBLIC_IFMA_MODE === "true";

                let latestUser = user;

                const locallyBlocked = isIfmaMode
                  ? !latestUser?.isAcademicVerified
                  : latestUser?.registrationStatus !== "APPROVED";

                if (locallyBlocked) {
                  try {
                    const res = await api.get(`/users/me?t=${Date.now()}`);
                    latestUser = { ...latestUser, ...res.data };
                    refreshUser();
                  } catch {
                    // Segue com os dados locais se a checagem falhar.
                  }
                }

                if (isIfmaMode) {
                  if (!latestUser?.isAcademicVerified) {
                    setBlockType("IFMA_UNVERIFIED");
                    setBlockModalVisible(true);
                    return;
                  }
                } else {
                  if (latestUser?.registrationStatus !== "APPROVED") {
                    const isRejected =
                      latestUser?.registrationStatus === "REJECTED";

                    const hasSentDocs = Boolean(
                      (latestUser as any)?.documentFrontImage &&
                      (latestUser as any)?.documentBackImage &&
                      (latestUser as any)?.addressProof &&
                      (latestUser as any)?.selfieWithId,
                    );

                    const isAnalysis =
                      latestUser?.registrationStatus === "PENDING" &&
                      hasSentDocs;

                    if (isAnalysis) setBlockType("DOCS_PENDING");
                    else if (isRejected) setBlockType("DOCS_REJECTED");
                    else setBlockType("DOCS_UNVERIFIED");

                    setBlockModalVisible(true);
                    return;
                  }
                }

                openRentFlow();
              }}
            />

            <RateModal
              visible={rateOpen}
              currentValue={game.myRating ?? null}
              saving={savingRate}
              onClose={() => setRateOpen(false)}
              onSave={handleSaveRating}
            />

            <RentModal
              visible={rentOpen}
              gameId={game.id}
              loading={rentLoading}
              onClose={() => setRentOpen(false)}
              onConfirm={handleConfirmRental}
            />

            <TermsRentModal
              visible={termsOpen}
              loading={termsLoading}
              onClose={() => {
                setTermsOpen(false);
                pendingRentRef.current = null;
              }}
              onAccept={acceptTermsAndContinue}
            />

            {favToastVisible && (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{favToastMessage}</Text>
                <Pressable
                  onPress={() => {
                    setFavToastVisible(false);
                    router.push("/favorites");
                  }}
                >
                  <Text style={styles.toastAction}>Ver favoritos</Text>
                </Pressable>
              </View>
            )}

            <LudusAlert
              visible={alertVisible}
              type={alertType}
              title={alertTitle}
              message={alertMessage}
              onClose={() => setAlertVisible(false)}
            />

            <VerificationBlockModal
              visible={blockModalVisible}
              type={blockType}
              onClose={() => setBlockModalVisible(false)}
              onAction={() => {
                setBlockModalVisible(false);

                if (blockType === "DOCS_PENDING") {
                } else {
                  router.push("/profile/documents");
                }
              }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#31358B",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  toast: {
    position: "absolute",
    bottom: 110,
    left: 18,
    right: 18,
    backgroundColor: "#0A0A0A",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
  },

  toastText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  toastAction: {
    color: "#FBBC04",
    fontWeight: "900",
    fontSize: 13,
  },

  mechanicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  mechanicPill: {
    backgroundColor: "#F0F2FF",
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mechanicText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#31358B",
  },

  tabs: {
    flexDirection: "row",
    marginTop: 14,
    gap: 6,
  },

  tab: {
    flex: 1,
    minHeight: 42,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#F2F4F8",
  },

  tabText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: "#7A8194",
  },

  tabTextActive: {
    color: "#fff",
  },

  tabBlue: {
    backgroundColor: "#0A1F5C",
  },

  tabYellow: {
    backgroundColor: "#FBBC04",
  },

  tabRed: {
    backgroundColor: "#E53935",
  },
});
