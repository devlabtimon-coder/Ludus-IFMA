// Converte o destino de uma notificação numa rota do app. Usado no toque do
// push (app aberto, em segundo plano ou fechado) e na lista de notificações.

// Notificações antigas do "Me avise" apontam para /details?id=<id>, uma
// rota que não existe no app; a tela do jogo é /game/<id>.
function normalizeRoute(route: string, gameId?: unknown): string | null {
  const path = route.startsWith("/") ? route : `/${route}`;

  if (/^\/details(\?|\/|$)/.test(path)) {
    const match = path.match(/[?&]id=([^&#]+)/);
    const id = match ? decodeURIComponent(match[1]) : gameId ? String(gameId) : "";
    return id ? `/game/${encodeURIComponent(id)}` : null;
  }

  return path;
}

export function resolveNotificationRoute(data: any): string | null {
  const route = typeof data?.route === "string" ? data.route.trim() : "";
  if (route) return normalizeRoute(route, data?.gameId);

  if (data?.gameId) return `/game/${encodeURIComponent(String(data.gameId))}`;

  const type = String(data?.type || "").toUpperCase();

  if (type.startsWith("RENTAL_") || type.startsWith("RATING")) return "/rentals";
  if (type.startsWith("FAVORITE")) return "/favorites";
  if (type.includes("LEVEL") || type.includes("POINTS")) return "/ranking";
  if (type.includes("VERIFY")) return "/profile";

  return null;
}
