import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NavFooter() {
  const router = useRouter();
  const pathName = usePathname();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  function getColor(route: string) {
    return pathName.startsWith(route) ? "#FBBC04" : "#DDD";
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
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Ionicons name="grid" size={26} color={getColor("/home")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/favorites")}>
        <Ionicons name="heart" size={26} color={getColor("/favorites")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/guide")}>
        <Ionicons name="book" size={26} color={getColor("/guide")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/rentals")}>
        <Ionicons name="bag" size={26} color={getColor("/rentals")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/profile")}>
        <Ionicons name="person" size={26} color={getColor("/profile")} />
      </TouchableOpacity>

      {user?.role === "ADMIN" && (
        <TouchableOpacity onPress={() => router.push("/admin/manage")}>
          <Ionicons name="construct" size={24} color={getColor("/admin")} />
        </TouchableOpacity>
      )}
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
