import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

type MarketPrice = {
  price: number;
  storesCount: number;
  sourceUrl: string | null;
};

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Valor de mercado do jogo (menor preço de novo no ComparaJogos), buscado
// na hora. Sem preço ou com falha, o selo simplesmente não aparece.
export function MarketPriceBadge({ gameId }: { gameId: string }) {
  const [price, setPrice] = useState<MarketPrice | null>(null);

  useEffect(() => {
    let alive = true;
    setPrice(null);
    api
      .get<{ marketPrice: MarketPrice | null }>(`/games/${gameId}/market-price`)
      .then(({ data }) => {
        // Resposta em formato inesperado (ex.: backend antigo) esconde o selo
        // em vez de derrubar a tela do jogo.
        const value = data?.marketPrice;
        if (alive) setPrice(value && Number.isFinite(value.price) ? value : null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [gameId]);

  if (!price) return null;

  const stores = price.storesCount === 1 ? "1 loja" : `${price.storesCount} lojas`;

  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Ionicons name="pricetag-outline" size={15} color="#2E7D32" />
        <Text style={styles.label}>
          Valor de mercado: a partir de <Text style={styles.value}>{formatBRL(price.price)}</Text>
        </Text>
      </View>

      <Pressable
        disabled={!price.sourceUrl}
        onPress={() => price.sourceUrl && Linking.openURL(price.sourceUrl)}
        accessibilityRole="link"
        hitSlop={8}
      >
        <Text style={styles.source}>
          Menor preço novo em {stores} no ComparaJogos
          {price.sourceUrl ? " ›" : ""}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    alignItems: "flex-start",
    gap: 4,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(46,125,50,0.08)",
    borderWidth: 1,
    borderColor: "rgba(46,125,50,0.22)",
  },

  label: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },

  value: {
    color: "#1F2937",
    fontWeight: "900",
  },

  source: {
    marginLeft: 4,
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "600",
  },
});
