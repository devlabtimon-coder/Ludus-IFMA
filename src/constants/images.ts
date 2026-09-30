import type { ImageSourcePropType } from "react-native";

const GAME_COVER_FALLBACK: ImageSourcePropType = require("@/assets/logo-dice.png");

// Capa do jogo, ou o logo local do Ludus quando o jogo não tem imagem.
export function gameCoverSource(uri?: string | null): ImageSourcePropType {
  return uri ? { uri } : GAME_COVER_FALLBACK;
}
