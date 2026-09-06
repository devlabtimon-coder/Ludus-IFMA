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
    const data = resp.notification.request.content.data as any;

    if (data?.route) {
      goToRoute(data.route);
      return;
    }

    const type = String(data?.type || "").toUpperCase();

    if (type.startsWith("RENTAL_") || type.startsWith("RATING")) {
      goToRoute("/rentals");
    } else if (type.startsWith("FAVORITE")) {
      goToRoute("/favorites");
    } else if (type.includes("LEVEL") || type.includes("POINTS")) {
      goToRoute("/ranking");
    } else if (type.includes("VERIFY")) {
      goToRoute("/profile");
    }
  });

  return () => {
    sub1.remove();
  };
}
