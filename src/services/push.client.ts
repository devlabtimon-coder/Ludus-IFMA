import { api } from "@/src/services/api";
import { openHref } from "@/src/services/navigation";
import { resolveNotificationRoute } from "@/src/services/notificationRoutes";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPush(userId?: string) {
  if (!userId) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("rentals", {
      name: "Aluguéis",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    await Notifications.setNotificationChannelAsync("system", {
      name: "Sistema",
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync("default", {
      name: "Geral",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await api.post("/users/me/push-token", { expoPushToken: token });

  return token;
}

// Com o app fechado, o toque chega antes do login ser restaurado e a splash
// ainda vai trocar a tela para a Home. A rota fica guardada até a splash
// liberar a navegação (releaseNotificationNavigation).
let navigationReady = false;
let pendingRoute: string | null = null;
const handledResponses = new Set<string>();

function handleResponse(resp: Notifications.NotificationResponse) {
  const id = resp.notification.request.identifier;
  if (handledResponses.has(id)) return;
  handledResponses.add(id);

  // Não reabrir a mesma notificação no próximo início do app.
  try {
    Notifications.clearLastNotificationResponse();
  } catch {
    // Sem suporte nativo: o Set acima já evita repetir nesta sessão.
  }

  const route = resolveNotificationRoute(resp.notification.request.content.data);
  if (!route) return;

  if (navigationReady && openHref(route)) return;
  pendingRoute = route;
}

// Chamado pela splash depois de decidir a tela inicial. Logado, abre a rota
// da notificação que iniciou o app; deslogado, descarta.
export function releaseNotificationNavigation(loggedIn: boolean) {
  navigationReady = true;
  const route = pendingRoute;
  pendingRoute = null;
  if (route && loggedIn) openHref(route);
}

export function attachNotificationListeners() {
  const sub1 = Notifications.addNotificationResponseReceivedListener(handleResponse);

  // App aberto pelo toque numa notificação (estava fechado).
  try {
    const last = Notifications.getLastNotificationResponse();
    if (last) handleResponse(last);
  } catch {
    // Plataforma sem suporte (web).
  }

  return () => {
    sub1.remove();
  };
}
