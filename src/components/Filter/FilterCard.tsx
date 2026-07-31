import {
  DEFAULT_FILTERS,
  FilterSort,
  FilterValues,
  useFilters,
} from "@/src/contexts/FiltersContext";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface Props {
  onApply: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

const POPULAR_MECHANICS = [
  "Gerenciamento de Mãos",
  "Eliminação de Jogadores",
  "Apostas e Blefes",
  "Dedução",
  "Memória",
  "Toma Essa",
  "Force sua sorte",
  "Posicionamento Secreto",
  "Jogadores com Diferentes Habilidades",
];

export function FilterCard({ onApply, initialValues }: Props) {
  const { resetFilters } = useFilters();

  const initial = initialValues ?? DEFAULT_FILTERS;

  const [status, setStatus] = useState<FilterValues["status"]>(initial.status);
  const [players, setPlayers] = useState<number | null>(initial.players);
  const [age, setAge] = useState<number | null>(initial.age);
  const [sort, setSort] = useState<FilterSort>(initial.sort);
  const [timeMax, setTimeMax] = useState<number>(initial.timeMax);

  const [tier, setTier] = useState<string[]>(initial.tier);
  const [mechanics, setMechanics] = useState<string[]>(initial.mechanics);

  useEffect(() => {
    const v = initialValues ?? DEFAULT_FILTERS;
    setStatus(v.status);
    setPlayers(v.players);
    setAge(v.age);
    setSort(v.sort);
    setTimeMax(v.timeMax);
    setTier(v.tier);
    setMechanics(v.mechanics);
  }, [initialValues]);

  function toggleTier(value: string) {
    setTier((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  }

  function toggleMechanic(value: string) {
    setMechanics((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value],
    );
  }

  const handleClear = () => {
    setStatus(DEFAULT_FILTERS.status);
    setPlayers(DEFAULT_FILTERS.players);
    setAge(DEFAULT_FILTERS.age);
    setSort(DEFAULT_FILTERS.sort);
    setTimeMax(DEFAULT_FILTERS.timeMax);
    setTier(DEFAULT_FILTERS.tier);
    setMechanics(DEFAULT_FILTERS.mechanics);

    resetFilters();
  };

  const canClear = useMemo(() => {
    return (
      status !== DEFAULT_FILTERS.status ||
      players !== DEFAULT_FILTERS.players ||
      age !== DEFAULT_FILTERS.age ||
      sort !== DEFAULT_FILTERS.sort ||
      timeMax !== DEFAULT_FILTERS.timeMax ||
      tier.length > 0 ||
      mechanics.length > 0
    );
  }, [status, players, age, sort, timeMax, tier, mechanics]);

  return (
    <View style={[styles.card, { paddingBottom: 0, marginTop: 125 }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#0A1628" }}>
          Filtros
        </Text>

        <TouchableOpacity
          onPress={handleClear}
          disabled={!canClear}
          style={{
            padding: 8,
            backgroundColor: canClear ? "#FEF2F2" : "transparent",
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: canClear ? "#B3193A" : "#D1D5DB",
              fontWeight: "800",
              fontSize: 13,
            }}
          >
            Limpar Tudo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      >
        <Text style={styles.title}>Ordenação</Text>
        <View style={styles.row}>
          {[
            { label: "A - Z", value: "A-Z" },
            { label: "Z - A", value: "Z-A" },
            { label: "Melhores Avaliados", value: "TOP_RATED" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, sort === item.value && styles.chipActive]}
              onPress={() => setSort(item.value as FilterSort)}
            >
              <Text
                style={[
                  styles.chipText,
                  sort === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Status do jogo</Text>
        <View style={styles.row}>
          {[
            { label: "Todos", value: "ALL" },
            { label: "Disponível", value: "AVAILABLE" },
            { label: "Reservado", value: "RESERVED" },
            { label: "Alugado", value: "RENTED" },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, status === item.value && styles.chipActive]}
              onPress={() => setStatus(item.value as FilterValues["status"])}
            >
              <Text
                style={[
                  styles.chipText,
                  status === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Tier (Classificação)</Text>
        <View style={styles.row}>
          {["Latão", "Bronze", "Prata", "Ouro", "Diamante"].map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.chip, tier.includes(value) && styles.chipActive]}
              onPress={() => toggleTier(value)}
            >
              <Text
                style={[
                  styles.chipText,
                  tier.includes(value) && styles.chipTextActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Quantidade de jogadores</Text>
        <View style={styles.row}>
          {[null, 2, 3, 4, 5, 6, 7, 8].map((value) => (
            <TouchableOpacity
              key={value ?? "ALL"}
              style={[styles.square, players === value && styles.squareActive]}
              onPress={() => setPlayers(value)}
            >
              <Text
                style={[
                  styles.squareText,
                  players === value && styles.squareTextActive,
                ]}
              >
                {value === null ? "Qualquer" : value === 8 ? "8+" : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Idade Recomendada</Text>
        <View style={styles.row}>
          {[null, 4, 6, 8, 10, 12, 14].map((value) => (
            <TouchableOpacity
              key={value ?? "ALL"}
              style={[styles.square, age === value && styles.squareActive]}
              onPress={() => setAge(value)}
            >
              <Text
                style={[
                  styles.squareText,
                  age === value && styles.squareTextActive,
                ]}
              >
                {value === null ? "Todas" : value === 14 ? "14+" : value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Tempo Máximo de Jogo</Text>
        <View style={styles.row}>
          {[
            { label: "Qualquer", value: 999 },
            { label: "15 min", value: 15 },
            { label: "30 min", value: 30 },
            { label: "45 min", value: 45 },
            { label: "60 min", value: 60 },
            { label: "90 min", value: 90 },
            { label: "120 min", value: 120 },
          ].map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, timeMax === item.value && styles.chipActive]}
              onPress={() => setTimeMax(item.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  timeMax === item.value && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.title}>Mecânicas</Text>
        <View style={styles.row}>
          {POPULAR_MECHANICS.map((mechanic) => (
            <TouchableOpacity
              key={mechanic}
              style={[
                styles.chip,
                mechanics.includes(mechanic) && styles.chipActive,
              ]}
              onPress={() => toggleMechanic(mechanic)}
            >
              <Text
                style={[
                  styles.chipText,
                  mechanics.includes(mechanic) && styles.chipTextActive,
                ]}
              >
                {mechanic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            onApply({
              status,
              players,
              age,
              sort,
              priceMin: DEFAULT_FILTERS.priceMin,
              priceMax: DEFAULT_FILTERS.priceMax,
              timeMax,
              tier,
              mechanics,
            })
          }
        >
          <Text style={styles.buttonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
