import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { showLudusAlert } from "./alert.service";
import { goToVerify } from "./navigation";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    if (status === 403 && code === "ACCOUNT_BLOCKED") {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");

      // Usando o LudusAlert no lugar do Alert nativo
      showLudusAlert({
        type: "error",
        title: "Acesso Bloqueado",
        message:
          "Sua conta foi suspensa por um administrador. Contate o suporte para mais informações.",
      });

      // Ao deletar o token, o AuthContext.user deve virar null
      // e o app deve redirecionar para o Login automaticamente.
      return Promise.reject(error);
    }

    // 2. Lógica de Verificação (Email/Phone)
    const url = (error?.config?.url || "").toString();
    const isVerifyRelated =
      url.includes("/auth/verify-email") ||
      url.includes("/auth/resend-email-code") ||
      url.includes("/auth/verify-phone") ||
      url.includes("/auth/resend-code");

    if (status === 403 && !isVerifyRelated) {
      const storedUser = await SecureStore.getItemAsync("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (code === "EMAIL_NOT_VERIFIED") {
        showLudusAlert({
          type: "info",
          title: "Verificação de E-mail",
          message:
            "Por favor, verifique seu e-mail para continuar utilizando o app.",
        });
        goToVerify({ email: user?.email });
      } else if (code === "PHONE_NOT_VERIFIED") {
        showLudusAlert({
          type: "info",
          title: "Verificação de Telefone",
          message:
            "Por favor, verifique seu telefone para continuar utilizando o app.",
        });
        goToVerify({ phone: user?.phone });
      }
    }

    return Promise.reject(error);
  },
);
