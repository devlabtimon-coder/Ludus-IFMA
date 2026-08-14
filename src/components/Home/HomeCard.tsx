import type { GameCollection, HomeGame } from "@/src/screens/Home/HomeScreen";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GameCardVertical from "./GameCardVertical";
import GameCarousel from "./GameCarousel";

export function HomeCard({
  forYou,
  mostRented,
  collections = [],
  onSeeAll,
  footerSpace,
}: {
  forYou: HomeGame[];
  mostRented: HomeGame[];
  collections?: GameCollection[];
  onSeeAll: () => void;
  footerSpace: number;
}) {
  const forYouGames = forYou.slice(0, 8);
  const mostRentedGames = mostRented.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Para Você</Text>
        <Pressable onPress={onSeeAll} hitSlop={10}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </Pressable>
      </View>
      <GameCarousel data={forYouGames} />

      {collections.map((collection) => (
        <View key={collection.id} style={styles.collectionContainer}>
          <View style={styles.collectionHeader}>
            <Text style={styles.sectionTitle}>{collection.title}</Text>
            {collection.subtitle ? (
              <Text style={styles.sectionSubtitle}>{collection.subtitle}</Text>
            ) : null}
          </View>
          <GameCarousel data={collection.games} />
        </View>
      ))}

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Mais Alugados</Text>
        <View style={styles.top3Badge}>
          <Text style={styles.top3Text}>TOP 3</Text>
        </View>
      </View>

      {mostRentedGames.length === 0 ? (
        <Text style={styles.emptyText}>
          Ainda não há aluguéis suficientes para montar esse ranking.
        </Text>
      ) : (
        mostRentedGames.map((game, index) => (
          <GameCardVertical
            key={game.id}
            id={game.id}
            title={game.title}
            location={game.isAvailableNow ? "Disponível" : "Indisponível"}
            rating={Number(game.rating ?? 0)}
            image={game.cover ?? null}
            rank={index + 1}
          />
        ))
      )}

      <View style={{ height: footerSpace + 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 19,
    marginTop: 27,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  collectionContainer: {
    marginTop: 24,
  },
  collectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
    marginTop: 2,
  },
  top3Badge: {
    backgroundColor: "rgba(49, 53, 139, 0.10)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  top3Text: {
    color: "#31358B",
    fontWeight: "800",
    fontSize: 11,
  },
  seeAll: {
    color: "#FBBC04",
    fontWeight: "900",
    fontSize: 15,
  },
  emptyText: {
    color: "#777",
    fontWeight: "700",
    marginTop: 6,
  },
});
