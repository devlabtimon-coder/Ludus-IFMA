import {
  DEFAULT_FILTERS,
  FilterValues,
  useFilters,
} from "@/src/contexts/FiltersContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GameTimeRange } from "./GameTimeRange";
import { styles } from "./styles";

interface Props {
  onApply: (filters: FilterValues) => void;
  initialValues?: FilterValues;
}

export function FilterCard({ onApply, initialValues }: Props) {
  const { resetFilters } = useFilters();

  const initial = initialValues ?? DEFAULT_FILTERS;

  const [status, setStatus] = useState<FilterValues["status"]>(initial.status);
  const [players, setPlayers] = useState<number | null>(initial.players);
  const [age, setAge] = useState<number | null>(initial.age);
  const [stars, setStars] = useState<number[]>(initial.stars);
  const [timeMax, setTimeMax] = useState<number>(initial.timeMax);

  useEffect(() => {
    const v = initialValues ?? DEFAULT_FILTERS;
    setStatus(v.status);
    setPlayers(v.players);
    setAge(v.age);
    setStars(v.stars);
    setTimeMax(v.timeMax);
  }, [initialValues]);

  function toggleStar(value: number) {
    setStars((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  }

  const handleClear = () => {
    setStatus(DEFAULT_FILTERS.status);
    setPlayers(DEFAULT_FILTERS.players);
    setAge(DEFAULT_FILTERS.age);
    setStars(DEFAULT_FILTERS.stars);
    setTimeMax(DEFAULT_FILTERS.timeMax);

    resetFilters();
  };

  const canClear = useMemo(() => {
    return (
      status !== DEFAULT_FILTERS.status ||
      players !== DEFAULT_FILTERS.players ||
      age !== DEFAULT_FILTERS.age ||
      stars.length > 0 ||
      timeMax !== DEFAULT_FILTERS.timeMax
    );
  }, [status, players, age, stars, timeMax]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 6, flexGrow: 1 }}
    >
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
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

        <GameTimeRange valueMax={timeMax} onChange={(max) => setTimeMax(max)} />

        <Text style={styles.title}>Avaliação (Estrelas)</Text>
        <View
          style={{
            backgroundColor: "#F9FAFB",
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          {[5, 4, 3, 2, 1].map((star, index) => (
            <TouchableOpacity
              key={star}
              style={[styles.starRow, index === 4 && { borderBottomWidth: 0 }]}
              onPress={() => toggleStar(star)}
            >
              <View style={{ flexDirection: "row", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < star ? "star" : "star-outline"}
                    size={20}
                    color={i < star ? "#FBBC04" : "#D1D5DB"}
                  />
                ))}
              </View>

              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  backgroundColor: stars.includes(star) ? "#B3193A" : "#FFF",
                  borderWidth: stars.includes(star) ? 0 : 2,
                  borderColor: "#E5E7EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {stars.includes(star) && (
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                )}
              </View>
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
              stars,
              priceMin: DEFAULT_FILTERS.priceMin, // Mantido apenas para evitar erro de TS
              priceMax: DEFAULT_FILTERS.priceMax, // Mantido apenas para evitar erro de TS
              timeMax,
            })
          }
        >
          <Text style={styles.buttonText}>Aplicar Filtros</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
