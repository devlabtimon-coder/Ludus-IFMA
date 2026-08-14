import { FlatList, StyleSheet, View } from "react-native";
import GameCardHorizontal from "./GameCardHorizontal";

export interface ForYouGame {
  id: string;
  title: string;
  price: number;
  rating?: number | null;
  ratingsCount?: number | null;
  cover?: string | null;
  isAvailableNow?: boolean;
}

export default function GameCarousel({ data }: { data: ForYouGame[] }) {
  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      removeClippedSubviews
      initialNumToRender={6}
      windowSize={7}
      renderItem={({ item }) => (
        <View style={styles.itemWrap}>
          <GameCardHorizontal
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.cover ?? null}
            rating={Number(item.rating ?? 0)}
            isAvailableNow={item.isAvailableNow}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 4,
  },
  itemWrap: {
    marginRight: 2,
  },
});
