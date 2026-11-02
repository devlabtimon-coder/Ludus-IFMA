import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit: () => void;
  onOpenFilters: () => void;

  activeFiltersCount?: number; 
};

export default function SearchTop({
  value,
  onChangeText,
  onSubmit,
  onOpenFilters,
  activeFiltersCount = 0,
}: Props) {
  const router = useRouter();
  const safeTop = useSafeTop(56);

  return (
    <View style={{ paddingTop: safeTop, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        
        <Pressable
          onPress={() => router.replace("/home")}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={{
            width: 49,
            height: 49,
            borderRadius: 16,
            backgroundColor: "#B3193A",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>

        
        <View
          style={{
            flex: 1,
            height: 49,
            borderRadius: 18,
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            placeholder="Catan, dixit, trio"
            placeholderTextColor="#999"
            style={{ flex: 1, color: "#333", fontSize: 16 }}
            returnKeyType="search"
          />

          <Ionicons name="search" size={20} color="#999" />
        </View>
      </View>

      
    </View>
  );
}