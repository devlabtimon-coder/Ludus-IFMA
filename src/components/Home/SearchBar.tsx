import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  activeFiltersCount?: number;
};

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  activeFiltersCount,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#535353" />
        <TextInput
          style={styles.input}
          placeholder="Procure o jogo..."
          placeholderTextColor="#535353"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
        />
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => router.push("/filter")}
        accessibilityRole="button"
        accessibilityLabel={
          activeFiltersCount
            ? `Filtros, ${activeFiltersCount} ativos`
            : "Filtros"
        }
      >
        <Ionicons name="filter" size={22} color="#31358B" />

        {!!activeFiltersCount && activeFiltersCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgetext}>
              {activeFiltersCount > 9 ? "9+" : activeFiltersCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  searchContainer: {
    flex: 1,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#E3E3E3",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 4,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#535353",
  },

  filterButton: {
    width: 60,
    height: 60,
    marginLeft: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E3E3E3",
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 4,
  },

  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 999,
    backgroundColor: "#E62325",
    alignItems: "center",
    justifyContent: "center",
  },

  badgetext: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});