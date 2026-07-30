import React, { createContext, useContext, useMemo, useState } from "react";

export type FilterStatus = "ALL" | "AVAILABLE" | "RENTED" | "RESERVED";

export type FilterValues = {
  status: FilterStatus;
  players: number | null;
  age: number | null;
  stars: number[];
  priceMin: number;
  priceMax: number;
  timeMax: number;
  tier: string[];
  mechanics: string[];
};

export const DEFAULT_FILTERS: FilterValues = {
  status: "ALL",
  players: null,
  age: null,
  stars: [],
  priceMin: 0,
  priceMax: 1000,
  timeMax: 999,
  tier: [],
  mechanics: [],
};

type FiltersContextData = {
  filters: FilterValues;
  setFilters: (next: FilterValues) => void;
  resetFilters: () => void;
  activeCount: number;
};

const FiltersContext = createContext<FiltersContextData | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFiltersState] = useState<FilterValues>(DEFAULT_FILTERS);

  const setFilters = (next: FilterValues) => setFiltersState(next);
  const resetFilters = () => setFiltersState(DEFAULT_FILTERS);

  const activeCount = useMemo(() => {
    let count = 0;

    if (filters.status !== DEFAULT_FILTERS.status) count++;
    if (filters.players !== DEFAULT_FILTERS.players) count++;
    if (filters.age !== DEFAULT_FILTERS.age) count++;
    if (filters.stars.length > 0) count++;
    if (
      filters.priceMin !== DEFAULT_FILTERS.priceMin ||
      filters.priceMax !== DEFAULT_FILTERS.priceMax
    )
      count++;
    if (filters.timeMax !== DEFAULT_FILTERS.timeMax) count++;

    // 👇 Nova lógica de contagem para os novos filtros
    if (filters.tier.length > 0) count++;
    if (filters.mechanics.length > 0) count++;

    return count;
  }, [filters]);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters, activeCount }),
    [filters, activeCount],
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
