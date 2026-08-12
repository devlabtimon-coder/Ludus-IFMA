import { api } from "@/src/services/api";
import { goToRoute } from "@/src/services/navigation";
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
    console.log("Permissão de notificação negada.");
    return;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await api.post("/users/me/push-token", { expoPushToken: token });

  return token;
}

export function attachNotificationListeners() {
  const sub1 = Notifications.addNotificationResponseReceivedListener((resp) => {
    const route = (resp.notification.request.content.data as any)?.route;
    if (route) goToRoute(route);
  });

  return () => {
    sub1.remove();
  };
}
