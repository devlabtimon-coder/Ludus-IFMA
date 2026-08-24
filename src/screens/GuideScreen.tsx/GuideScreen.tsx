import { NavFooter } from "@/src/components/common/NavFooter";
import HomeBackground from "@/src/components/Home/HomeBackground";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GuideTab = "mechanics" | "users" | "games";

interface Mecanica {
  id: string | number;
  letter?: string;
  namePt: string;
  nameEn: string;
  definition: string;
  games: string[];
  chip: string;
  icon: string;
}

const BRAND_THEMES = [
  { main: "#31358B", contrast: "#FFFFFF", light: "#EEF0FF" },
  { main: "#E62325", contrast: "#FFFFFF", light: "#FFE9EA" },
  { main: "#FBBC04", contrast: "#31358B", light: "#FFF9E6" },
];

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const CHIPS = [
  { label: "Todos", icon: "dice-outline" },
  { label: "Estratégia", icon: "extension-puzzle-outline" },
  { label: "Social", icon: "people-outline" },
  { label: "Cartas", icon: "albums-outline" },
  { label: "Dados", icon: "cube-outline" },
  { label: "Movimento", icon: "navigate-outline" },
  { label: "Habilidade", icon: "bulb-outline" },
  { label: "Cooperativo", icon: "shield-checkmark-outline" },
  { label: "Construção", icon: "build-outline" },
  { label: "Criativo", icon: "color-palette-outline" },
  { label: "Econômico", icon: "cash-outline" },
  { label: "Narrativo", icon: "book-outline" },
  { label: "Lógica", icon: "search-outline" },
] as const;

function getValidIcon(
  iconName: string | undefined,
): keyof typeof Ionicons.glyphMap {
  if (!iconName) return "extension-puzzle-outline";

  const name = iconName.toLowerCase();

  if (name.includes("-outline") || name.includes("-sharp")) {
    return name as keyof typeof Ionicons.glyphMap;
  }

  const lucideToIonicons: Record<string, keyof typeof Ionicons.glyphMap> = {
    users: "people-outline",
    user: "person-outline",
    zap: "flash-outline",
    activity: "pulse-outline",
    star: "star-outline",
    settings: "settings-outline",
    clock: "time-outline",
    box: "cube-outline",
    flag: "flag-outline",
    layers: "layers-outline",
    "eye-off": "eye-off-outline",
    "bar-chart": "bar-chart-outline",
    timer: "timer-outline",
    grid: "grid-outline",
    trophy: "trophy-outline",
    book: "book-outline",
    shield: "shield-checkmark-outline",
    palette: "color-palette-outline",
    banknote: "cash-outline",
    search: "search-outline",
    hand: "hand-left-outline",
    heart: "heart-outline",
    map: "map-outline",
    compass: "navigate-outline",
    puzzle: "extension-puzzle-outline",
    "dice-1": "cube-outline",
  };

  return lucideToIonicons[name] || "extension-puzzle-outline";
}

function getLetter(m: Mecanica): string {
  if (m.letter) return m.letter.toUpperCase();
  if (m.namePt) return m.namePt.charAt(0).toUpperCase();
  return "";
}

export default function GuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<GuideTab>("mechanics");

  const [mechanicsData, setMechanicsData] = useState<Mecanica[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedChip, setSelectedChip] = useState<string>("Todos");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    async function fetchMechanics() {
      try {
        const response = await api.get("/mechanics/guide");
        setMechanicsData(response.data);
      } catch (error) {
        console.error("Erro ao buscar as mecânicas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMechanics();
  }, []);

  const availableLetters = useMemo(() => {
    const letters = new Set(mechanicsData.map(getLetter));
    return Array.from(letters).filter(Boolean);
  }, [mechanicsData]);

  const filteredMechanics = useMemo(() => {
    return mechanicsData.filter((m) => {
      const matchChip = selectedChip === "Todos" || m.chip === selectedChip;
      const matchLetter = !selectedLetter || getLetter(m) === selectedLetter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.namePt?.toLowerCase().includes(q) ||
        m.nameEn?.toLowerCase().includes(q) ||
        m.definition?.toLowerCase().includes(q);

      return matchChip && matchLetter && matchQuery;
    });
  }, [mechanicsData, selectedChip, selectedLetter, searchQuery]);

  const clearAll = () => {
    setSearchQuery("");
    setSelectedLetter(null);
    setSelectedChip("Todos");
  };

  const hasActiveFilters =
    searchQuery || selectedLetter || selectedChip !== "Todos";

  const TAB_ITEMS = [
    {
      key: "mechanics" as const,
      label: "Mecânicas",
      icon: "settings" as const,
      theme: BRAND_THEMES[0],
    },
    {
      key: "users" as const,
      label: "Usuários",
      icon: "people" as const,
      theme: BRAND_THEMES[2],
    },
    {
      key: "games" as const,
      label: "Acervo",
      icon: "diamond" as const,
      theme: BRAND_THEMES[1],
    },
  ];

  return (
    <View style={styles.root}>
      <HomeBackground />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Guia Ludus</Text>
        <Text style={styles.headerSubtitle}>
          Descubra os segredos do acervo
        </Text>
      </View>

      <View style={styles.sheet}>
        <View style={styles.tabsContainer}>
          {TAB_ITEMS.map((t) => (
            <Pressable
              key={t.key}
              style={[
                styles.tab,
                tab === t.key && { backgroundColor: t.theme.main },
              ]}
              onPress={() => setTab(t.key)}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={tab === t.key ? t.theme.contrast : "#7A8194"}
              />
              <Text
                style={[
                  styles.tabText,
                  tab === t.key && { color: t.theme.contrast },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {tab === "mechanics" && (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.letterScroll}
              >
                {ALL_LETTERS.map((letter, index) => {
                  const hasTerms = availableLetters.includes(letter);
                  const isActive = selectedLetter === letter;
                  const theme = BRAND_THEMES[index % 3];

                  return (
                    <Pressable
                      key={letter}
                      onPress={() =>
                        hasTerms && setSelectedLetter(isActive ? null : letter)
                      }
                      style={[
                        styles.letterBtn,
                        isActive && { backgroundColor: theme.main },
                        hasTerms &&
                          !isActive && { backgroundColor: theme.light },
                      ]}
                    >
                      <Text
                        style={[
                          styles.letterText,
                          isActive && { color: theme.contrast },
                          hasTerms && !isActive && { color: theme.main },
                        ]}
                      >
                        {letter}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}
              >
                {CHIPS.map((chip, index) => {
                  const isActive = selectedChip === chip.label;
                  const theme = BRAND_THEMES[index % 3];

                  return (
                    <Pressable
                      key={chip.label}
                      onPress={() => setSelectedChip(chip.label)}
                      style={[
                        styles.chipBtn,
                        isActive && {
                          backgroundColor: theme.main,
                          borderColor: theme.main,
                        },
                      ]}
                    >
                      <Ionicons
                        name={chip.icon as any}
                        size={14}
                        color={isActive ? theme.contrast : "#31358B"}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isActive && { color: theme.contrast },
                        ]}
                      >
                        {chip.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.searchWrap}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#535353" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar mecânica..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {hasActiveFilters && (
                    <Pressable
                      onPress={clearAll}
                      style={styles.clearFiltersBtn}
                    >
                      <Ionicons name="close" size={14} color="#666" />
                    </Pressable>
                  )}
                </View>
                {hasActiveFilters && !isLoading && (
                  <Text style={styles.resultsCount}>
                    {filteredMechanics.length} resultado(s)
                  </Text>
                )}
              </View>

              {isLoading ? (
                <View style={styles.emptyWrap}>
                  <ActivityIndicator size="large" color="#31358B" />
                  <Text style={styles.emptyTitle}>Carregando o acervo...</Text>
                </View>
              ) : (
                <View style={styles.mechanicsList}>
                  {filteredMechanics.length === 0 ? (
                    <View style={styles.emptyWrap}>
                      <Ionicons
                        name="search-outline"
                        size={48}
                        color="#D1D5DB"
                      />
                      <Text style={styles.emptyTitle}>
                        Nenhuma mecânica encontrada
                      </Text>
                      <Text style={styles.emptySub}>
                        Ajuste os filtros ou o termo de busca.
                      </Text>
                    </View>
                  ) : (
                    filteredMechanics.map((m, index) => {
                      const isExpanded = expandedId === m.id;
                      const theme = BRAND_THEMES[index % 3];

                      const validIcon = getValidIcon(m.icon);

                      return (
                        <View key={m.id} style={styles.accordionCard}>
                          <Pressable
                            style={styles.accordionHeader}
                            onPress={() =>
                              setExpandedId(isExpanded ? null : m.id)
                            }
                          >
                            <View
                              style={[
                                styles.accordionIconWrap,
                                { backgroundColor: theme.light },
                              ]}
                            >
                              <Ionicons
                                name={validIcon}
                                size={20}
                                color={theme.main}
                              />
                            </View>
                            <View style={styles.accordionTitleWrap}>
                              <Text style={styles.accordionTitle}>
                                {m.namePt}
                              </Text>
                              <Text style={styles.accordionSubTitle}>
                                {m.nameEn}
                              </Text>
                            </View>
                            <Ionicons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={20}
                              color="#9CA3AF"
                            />
                          </Pressable>
                          {isExpanded && (
                            <View style={styles.accordionBody}>
                              <Text style={styles.accordionDesc}>
                                {m.definition}
                              </Text>
                              <Text style={styles.gamesLabel}>No acervo:</Text>
                              <View style={styles.gamesList}>
                                {m.games && m.games.length > 0 ? (
                                  m.games.map((g, gIndex) => {
                                    const tagTheme =
                                      BRAND_THEMES[(gIndex + 1) % 3];
                                    return (
                                      <Pressable
                                        key={g}
                                        style={[
                                          styles.gameTag,
                                          { backgroundColor: tagTheme.main },
                                        ]}
                                        onPress={() => {}}
                                      >
                                        <Ionicons
                                          name="game-controller"
                                          size={12}
                                          color={tagTheme.contrast}
                                        />
                                        <Text
                                          style={[
                                            styles.gameTagText,
                                            { color: tagTheme.contrast },
                                          ]}
                                        >
                                          {g}
                                        </Text>
                                      </Pressable>
                                    );
                                  })
                                ) : (
                                  <Text style={styles.emptySub}>
                                    Nenhum jogo vinculado.
                                  </Text>
                                )}
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>
          )}

          {tab === "users" && (
            <View style={styles.staticContainer}>
              <View style={styles.staticHero}>
                <Text style={styles.staticHeroIcon}>🏆</Text>
                <Text style={styles.staticMainTitle}>Progressão de Nível</Text>
                <Text style={styles.staticDesc}>
                  Entenda como evoluir sua categoria e desbloquear acesso a
                  jogos exclusivos do Ludus.
                </Text>
              </View>
              {[
                {
                  name: "Starter",
                  color: "#22C55E",
                  icon: "leaf",
                  desc: "Nível inicial após cadastro. Acesso: Latão e Bronze.",
                },
                {
                  name: "Family",
                  color: "#F59E0B",
                  icon: "home",
                  desc: "Conclua 5 aluguéis sem atraso. Acesso estendido ao Prata.",
                },
                {
                  name: "Expert",
                  color: "#7C3AED",
                  icon: "medal",
                  desc: "15+ aluguéis e avaliações. Acesso a Ouro liberado.",
                },
                {
                  name: "Ultragamer",
                  color: "#31358B",
                  icon: "trophy",
                  desc: "O auge do engajamento. Acesso VIP aos jogos Diamante.",
                },
              ].map((lvl) => (
                <View key={lvl.name} style={styles.levelCard}>
                  <View
                    style={[
                      styles.levelIconWrap,
                      { backgroundColor: lvl.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={lvl.icon as any}
                      size={26}
                      color={lvl.color}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.levelName}>{lvl.name}</Text>
                    <Text style={styles.levelDesc}>{lvl.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tab === "games" && (
            <View style={styles.staticContainer}>
              <View style={styles.staticHero}>
                <Text style={styles.staticHeroIcon}>🎲</Text>
                <Text style={styles.staticMainTitle}>
                  Classificação do Acervo
                </Text>
                <Text style={styles.staticDesc}>
                  Nossos jogos são divididos por Tiers que representam a
                  complexidade, tempo de jogo e exclusividade de acesso.
                </Text>
              </View>
              {[
                {
                  name: "Latão",
                  color: "#8B7355",
                  icon: "shield-outline",
                  desc: "Regras simples, rápidos. Ideais para iniciar. Acesso Livre.",
                },
                {
                  name: "Bronze",
                  color: "#CD7F32",
                  icon: "shield-half-outline",
                  desc: "Profundidade moderada, partidas até 60 min. Acesso Livre.",
                },
                {
                  name: "Prata",
                  color: "#7A7A7A",
                  icon: "shield",
                  desc: "Mecânicas complexas, múltiplas fases. Requer Family+.",
                },
                {
                  name: "Ouro",
                  color: "#B8860B",
                  icon: "star-outline",
                  desc: "Estratégia pesada, longa duração. Requer Expert+.",
                },
                {
                  name: "Diamante",
                  color: "#0277BD",
                  icon: "diamond-outline",
                  desc: "Raros e épicos. Acesso exclusivo para Ultragamer.",
                },
              ].map((tier) => (
                <View
                  key={tier.name}
                  style={[styles.tierCard, { borderLeftColor: tier.color }]}
                >
                  <View style={styles.tierHeader}>
                    <Ionicons
                      name={tier.icon as any}
                      size={20}
                      color={tier.color}
                    />
                    <Text style={[styles.tierName, { color: tier.color }]}>
                      {tier.name}
                    </Text>
                  </View>
                  <Text style={styles.tierDesc}>{tier.desc}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#31358B" },
  header: { paddingHorizontal: 24, paddingBottom: 24, alignItems: "center" },
  headerTitle: { color: "#FFF", fontSize: 28, fontWeight: "900" },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },
  tabText: { fontSize: 12, fontWeight: "800", color: "#6B7280" },
  letterScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  letterBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  letterText: { fontSize: 13, fontWeight: "700", color: "#D1D5DB" },
  chipsScroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  chipBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  chipText: { fontSize: 12, fontWeight: "700", color: "#4B5563" },
  searchWrap: { paddingHorizontal: 20, marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#333", fontWeight: "600" },
  clearFiltersBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  resultsCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
  emptyWrap: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A2E",
    marginTop: 12,
  },
  emptySub: { fontSize: 13, color: "#9CA3AF", marginTop: 4 },
  mechanicsList: { paddingHorizontal: 20 },
  accordionCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  accordionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  accordionTitleWrap: { flex: 1 },
  accordionTitle: { fontSize: 16, fontWeight: "900", color: "#1A1A2E" },
  accordionSubTitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
  accordionBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  accordionDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    fontWeight: "500",
  },
  gamesLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#31358B",
    marginTop: 18,
    marginBottom: 10,
  },
  gamesList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gameTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  gameTagText: { fontSize: 12, fontWeight: "700" },
  staticContainer: { paddingTop: 24, paddingHorizontal: 20 },
  staticHero: { alignItems: "center", marginBottom: 24 },
  staticHeroIcon: { fontSize: 48, marginBottom: 8 },
  staticMainTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#31358B",
    marginBottom: 8,
    textAlign: "center",
  },
  staticDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    textAlign: "center",
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  levelIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  levelName: { fontSize: 17, fontWeight: "900", color: "#1A1A2E" },
  levelDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
    lineHeight: 18,
  },
  tierCard: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 5,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  tierHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tierName: { fontSize: 17, fontWeight: "900" },
  tierDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
    fontWeight: "500",
  },
});
