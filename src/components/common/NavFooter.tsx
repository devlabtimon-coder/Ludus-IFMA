import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NavFooter() {
  const router = useRouter();
  const pathName = usePathname();
  const insets = useSafeAreaInsets();

  function isActive(route: string) {
    return pathName.startsWith(route);
  }

  function getColor(route: string) {
    return isActive(route) ? "#FBBC04" : "#DDD";
  }

  // Ícones de 26pt: o hitSlop leva a área de toque a ~44pt sem mudar o layout.
  function tabProps(route: string, label: string) {
    return {
      accessibilityRole: "button" as const,
      accessibilityLabel: label,
      accessibilityState: { selected: isActive(route) },
      hitSlop: 9,
    };
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: 10 + insets.bottom,
          height: 70 + insets.bottom,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => router.push("/home")}
        {...tabProps("/home", "Início")}
      >
        <Ionicons name="grid" size={26} color={getColor("/home")} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/favorites")}
        {...tabProps("/favorites", "Favoritos")}
      >
        <Ionicons name="heart" size={26} color={getColor("/favorites")} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/guide")}
        {...tabProps("/guide", "Guia")}
      >
        <Ionicons name="book" size={26} color={getColor("/guide")} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/rentals")}
        {...tabProps("/rentals", "Meus aluguéis")}
      >
        <Ionicons name="bag" size={26} color={getColor("/rentals")} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/profile")}
        {...tabProps("/profile", "Perfil")}
      >
        <Ionicons name="person" size={26} color={getColor("/profile")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 24,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 10,
  },
});
