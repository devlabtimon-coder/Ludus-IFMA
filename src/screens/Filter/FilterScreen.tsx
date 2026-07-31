import FilterBackground from "@/src/components/Filter/FilterBackgroud";
import { FilterCard } from "@/src/components/Filter/FilterCard";
import { FilterValues, useFilters } from "@/src/contexts/FiltersContext";
import { useRouter } from "expo-router";
import { View } from "react-native";

import BackButton from "@/src/components/common/BackButton";

export default function FilterScreen() {
  const router = useRouter();
  const { filters, setFilters } = useFilters();

  function handleApplyFilters(nextFilters: FilterValues) {
    setFilters(nextFilters);

    router.replace({
      pathname: "/search",
      params: {
        ...nextFilters,
        tier: nextFilters.tier.join(","),
        mechanics: nextFilters.mechanics.join(","),
      } as any,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <FilterBackground />

      <FilterCard onApply={handleApplyFilters} initialValues={filters} />

      <BackButton />
    </View>
  );
}
