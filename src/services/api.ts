import axios from "axios";
import axiosRetry, {
  exponentialDelay,
  isNetworkError,
  isRetryableError,
} from "axios-retry";
import * as SecureStore from "expo-secure-store";
import { showLudusAlert } from "./alert.service";
import { goToVerify } from "./navigation";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

// Só repete requisições que não mudam nada no servidor. Um POST que estourou
// o tempo pode ter sido processado (ex.: a reserva foi criada e a resposta se
// perdeu); repetir duplicaria a ação.
const SAFE_METHODS = ["get", "head", "options"];

axiosRetry(api, {
  retries: 2,
  retryDelay: exponentialDelay,
  retryCondition: (error) => {
    const method = (error.config?.method || "").toLowerCase();
    if (!SAFE_METHODS.includes(method)) return false;

    // Sem resposta (rede caiu) ou 5xx/429. Timeout não repete: o tempo
    // total da requisição continua limitado ao timeout acima.
    return isNetworkError(error) || isRetryableError(error);
  },
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

      showLudusAlert({
        type: "error",
        title: "Acesso Bloqueado",
        message:
          "Sua conta foi suspensa por um administrador. Contate o suporte para mais informações.",
      });

      return Promise.reject(error);
    }

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
