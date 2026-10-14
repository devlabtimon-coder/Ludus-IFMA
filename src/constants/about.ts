import type { Ionicons } from "@expo/vector-icons";

// Conteúdo da tela "Sobre o Ludus", publicado pelo painel em GET /about.
// O padrão abaixo aparece enquanto a API responde ou se ela estiver fora do ar.

export type AboutIcon =
  | "grid" | "search" | "bookmark" | "bell" | "graduation" | "phone" | "trophy" | "chart"
  | "users" | "building" | "award" | "database" | "globe" | "mail" | "message" | "shield"
  | "book" | "star" | "dice" | "heart";
export type AboutColor = "blue" | "yellow" | "red" | "green";

export type AboutContent = {
  identity: { appName: string; subtitle: string; description: string; chips: string[] };
  features: { id: string; icon: AboutIcon; color: AboutColor; title: string; description: string }[];
  mission: { mission: string; vision: string } | null;
  team: {
    institution: string;
    members: { id: string; name: string; role: string }[];
    advisor: string;
    advisorTitle: string;
  } | null;
  version: { status: string; changelog: { id: string; version: string; title: string; description: string }[] };
  integrations: { id: string; icon: AboutIcon; name: string; usage: string; status: string }[];
};

export const ABOUT_ICON_NAMES: Record<AboutIcon, keyof typeof Ionicons.glyphMap> = {
  grid: "grid-outline",
  search: "search-outline",
  bookmark: "bookmark-outline",
  bell: "notifications-outline",
  graduation: "school-outline",
  phone: "phone-portrait-outline",
  trophy: "trophy-outline",
  chart: "bar-chart-outline",
  users: "people-outline",
  building: "business-outline",
  award: "ribbon-outline",
  database: "server-outline",
  globe: "globe-outline",
  mail: "mail-outline",
  message: "chatbubble-ellipses-outline",
  shield: "shield-checkmark-outline",
  book: "book-outline",
  star: "star-outline",
  dice: "dice-outline",
  heart: "heart-outline",
};

export const ABOUT_COLORS: Record<AboutColor, { bg: string; fg: string }> = {
  blue: { bg: "#EEF0FF", fg: "#31358B" },
  yellow: { bg: "#FFF6D9", fg: "#9A6B00" },
  red: { bg: "#FFE9EA", fg: "#E62325" },
  green: { bg: "#E8F7EC", fg: "#1F7A39" },
};

export const ABOUT_STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  "Estável": { bg: "#DCFCE7", fg: "#15803D" },
  "Ativa": { bg: "#DCFCE7", fg: "#15803D" },
  "Beta": { bg: "#FEF3C7", fg: "#B45309" },
  "Integração prevista": { bg: "#FEF3C7", fg: "#B45309" },
  "Em desenvolvimento": { bg: "#EEF0FF", fg: "#31358B" },
  "Serviço configurável": { bg: "#EEF0FF", fg: "#31358B" },
  "Em manutenção": { bg: "#FFE9EA", fg: "#B3193A" },
  "Descontinuada": { bg: "#F3F4F6", fg: "#6B7280" },
};

export const DEFAULT_ABOUT: AboutContent = {
  identity: {
    appName: "Ludus",
    subtitle: "Plataforma de aluguel de jogos do IFMA Campus Timon",
    description:
      "O Ludus organiza e moderniza o acesso ao acervo de jogos, facilitando consultas, reservas, empréstimos e acompanhamento do uso da coleção em uma experiência simples, visual e envolvente.",
    chips: ["IFMA Campus Timon", "Aplicativo mobile", "Gamificação"],
  },
  features: [
    {
      id: "catalogo",
      icon: "grid",
      color: "blue",
      title: "Catálogo inteligente",
      description:
        "Permite explorar o acervo com busca e filtros, tornando mais rápido encontrar jogos por perfil, duração e disponibilidade.",
    },
    {
      id: "reservas",
      icon: "bookmark",
      color: "yellow",
      title: "Reservas e empréstimos",
      description:
        "Centraliza o fluxo de solicitação, retirada e devolução, reduzindo controles manuais e trazendo mais organização ao processo.",
    },
    {
      id: "avisos",
      icon: "bell",
      color: "red",
      title: "Acompanhamento e avisos",
      description:
        "Ajuda o usuário a acompanhar sua jornada dentro do sistema, com histórico, alertas e informações importantes sobre uso do acervo.",
    },
    {
      id: "engajamento",
      icon: "chart",
      color: "blue",
      title: "Engajamento e métricas",
      description:
        "Incorpora ranking e elementos de gamificação para incentivar participação contínua e ampliar o uso consciente dos jogos.",
    },
  ],
  mission: {
    mission:
      "Mais do que digitalizar empréstimos, o Ludus foi pensado para aproximar tecnologia, ludicidade e educação. A proposta do app é tornar o acervo de jogos do IFMA mais acessível, organizado e atrativo para a comunidade acadêmica.",
    vision: "",
  },
  team: {
    institution: "Instituto Federal do Maranhão – IFMA Campus Timon",
    members: [
      { id: "joseni", name: "Joseni Daniel", role: "" },
      { id: "hemyly", name: "Hemyly Rayany", role: "" },
      { id: "ramilson", name: "Ramilson Rios", role: "" },
      { id: "marcelo", name: "Marcelo Loureiro", role: "" },
      { id: "guilherme", name: "Guilherme Raphael", role: "" },
      { id: "helio", name: "Hélio Victor", role: "" },
    ],
    advisor: "Nara Chaves",
    advisorTitle: "",
  },
  version: {
    status: "Estável",
    changelog: [
      { id: "v1-0-0", version: "1.0.0", title: "Lançamento inicial", description: "Catálogo, reservas, gamificação e perfil de usuário." },
    ],
  },
  integrations: [
    { id: "google", icon: "shield", name: "Google Sign-In", usage: "Login com a conta Google.", status: "Ativa" },
    { id: "ludopedia", icon: "database", name: "Ludopedia", usage: "Dados do catálogo: títulos, capas e informações dos jogos.", status: "Ativa" },
    { id: "bgg", icon: "globe", name: "BoardGameGeek (BGG)", usage: "Dados complementares dos jogos, como descrição e número de jogadores.", status: "Ativa" },
    { id: "resend", icon: "mail", name: "Resend", usage: "Envio de e-mails de verificação e avisos.", status: "Ativa" },
    { id: "expo-push", icon: "bell", name: "Expo Push Notifications", usage: "Notificações no celular sobre aluguéis, ranking e avisos.", status: "Ativa" },
  ],
};
