import { api } from "@/src/services/api";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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

import BackButton from "@/src/components/common/BackButton";
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
import { useAuth } from "@/src/contexts/AuthContext";
import {
  getVerificationState,
  type VerificationState,
} from "@/src/utils/verification";
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
  // Há horário livre nos próximos 7 dias (ausente em backends antigos).
  hasFreeSlotSoon?: boolean;
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
  const [blockState, setBlockState] = useState<VerificationState | null>(
    null,
  );
  const blockType: BlockType =
    blockState && blockState.status !== "APPROVED" ? blockState.status : null;

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

      // No iOS um Modal não abre enquanto outro ainda está fechando: o
      // alerta espera o modal de avaliação sair (mesmo atraso da reserva).
      setRateOpen(false);
      setTimeout(() => {
        showAlert(
          "success",
          "Avaliação salva!",
          "Sua avaliação foi registrada com sucesso.",
        );
      }, 400);
    } catch (e: any) {
      const code = e?.response?.data?.code;
      const msg = e?.response?.data?.error;

      setRateOpen(false);
      if (code === "CANNOT_RATE") {
        setCanRate(false);
        setTimeout(() => {
          showAlert(
            "info",
            "Avaliação bloqueada",
            "Você só pode avaliar este jogo após devolver.",
          );
        }, 400);
        return;
      }

      setTimeout(() => {
        showAlert(
          "error",
          "Erro",
          msg || "Não foi possível salvar sua avaliação. Tente novamente.",
        );
      }, 400);
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
          game.isAvailableNow && game.hasFreeSlotSoon === false
            ? "Vamos te avisar quando abrir um horário para este jogo."
            : "Vamos te avisar quando o jogo voltar a ficar disponível.",
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
          const code = e?.response?.data?.code;
          const msg = e?.response?.data?.error;

          // Sem resposta: a reserva pode ter sido criada mesmo assim (o
          // POST não é repetido automaticamente para não duplicar).
          if (!e?.response) {
            showAlert(
              "error",
              "Sem resposta do servidor",
              "Não sabemos se a reserva foi criada. Confira em Meus aluguéis antes de tentar de novo.",
            );
            return;
          }

          if (code === "RENTAL_LIMIT_REACHED") {
            showAlert(
              "info",
              "Limite atingido",
              msg
                ? `${msg} Finalize ou cancele um para agendar outro.`
                : "Você atingiu o limite de aluguéis em aberto. Finalize ou cancele um para agendar outro.",
            );
            return;
          }

          if (code === "ACCOUNT_PENDING") {
            refreshUser();
            showAlert(
              "info",
              "Cadastro não liberado",
              "Você poderá alugar assim que a biblioteca aprovar o seu cadastro.",
            );
            return;
          }

          if (code === "CONCURRENCY_CONFLICT") {
            showAlert(
              "error",
              "Horário Ocupado",
              "Outra pessoa acabou de reservar este horário. Escolha outro horário.",
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

          if (code === "OVERDUE_RENTAL") {
            showAlert(
              "error",
              "Jogo em atraso",
              msg ||
                "Você está com um jogo em atraso. Devolva-o na biblioteca para fazer novas reservas.",
            );
            return;
          }

          if (code === "SAME_DAY_ONLY") {
            showAlert(
              "info",
              "Devolução no mesmo dia",
              "A retirada e a devolução precisam ser no mesmo dia. Escolha um horário de início e de fim na mesma data.",
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
    [game, fetchDetails, showAlert, refreshUser],
  );

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
              accessibilityRole="button"
              suppressHighlighting
              style={{
                marginTop: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                color: "#0A1F5C",
                fontWeight: "900",
              }}
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
              unavailable={!game.isAvailableNow}
              noSlotSoon={game.hasFreeSlotSoon === false}
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

                let verification = getVerificationState(user);

                // O dado local pode estar velho (a biblioteca aprovou depois
                // do último carregamento): confirma no servidor antes de barrar.
                if (verification.status !== "APPROVED") {
                  try {
                    const res = await api.get(`/users/me?t=${Date.now()}`);
                    verification = getVerificationState({
                      ...user,
                      ...res.data,
                    });
                    refreshUser();
                  } catch {
                    // Segue com os dados locais se a checagem falhar.
                  }
                }

                if (verification.status !== "APPROVED") {
                  setBlockState(verification);
                  setBlockModalVisible(true);
                  return;
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
              rejectReason={blockState?.rejectReason}
              onClose={() => setBlockModalVisible(false)}
              onAction={() => {
                setBlockModalVisible(false);

                // Em análise ou conta suspensa não há o que enviar: o botão
                // "Entendido" só fecha.
                if (blockType === "NOT_SUBMITTED" || blockType === "REJECTED") {
                  router.push("/profile/documents");
                }
              }}
            />
          </>
        )}
      </View>

      {/* Sem o jogo carregado não há o cabeçalho com a seta de voltar. */}
      {loading || errMsg || !game ? <BackButton /> : null}
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
