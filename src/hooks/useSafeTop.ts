import { useSafeAreaInsets } from "react-native-safe-area-context";

// Distância do topo para cabeçalhos sem barra nativa. Mantém o valor de
// design (calibrado no Android) e só desce quando a área segura é maior,
// como no iPhone com Dynamic Island (59–62pt).
export function useSafeTop(min: number, gap = 8) {
  const { top } = useSafeAreaInsets();
  return Math.max(min, top + gap);
}
