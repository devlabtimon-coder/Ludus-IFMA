import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../services/api";
import {
  attachNotificationListeners,
  registerForPush,
} from "../services/push.client";

type Role = "USER" | "ADMIN" | string;

export type AuthUser = {
  id: string;
  nome?: string;
  name?: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  address?: string | null;
  role?: Role;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  points?: number;
  level?: number;
  authProvider?: string;
  avatar?: string | null;
  picture?: string | null;

  isAcademicVerified?: boolean;
  academicVerifiedAt?: string | null;
  matricula?: string | null;

  documentFile?: string | null;
  addressProof?: string | null;
  selfieWithId?: string | null;

  enrollmentProof?: string | null;

  registrationStatus?: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string | null;
};

type AuthResult = { success: true } | { success: false; message: string };

type GoogleAuthResult =
  | { success: true; needsPhoneVerification: boolean }
  | { success: false; message: string };

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (emailOrPhone: string, senha: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signInWithToken: (
    token: string,
    userData: AuthUser,
    redirectFn?: (path: string) => void,
  ) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<GoogleAuthResult>;
  updateUser: (patch: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          try {
            const res = await api.get(`/users/me?t=${Date.now()}`);

            const freshUser = { ...parsedUser, ...res.data };
            setUser(freshUser);
            SecureStore.setItemAsync("user", JSON.stringify(freshUser)).catch(
              () => {},
            );
          } catch (err: any) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
              await logout();
            }
          }
        }
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  useEffect(() => {
    const detach = attachNotificationListeners();
    return detach;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get(`/users/me?t=${Date.now()}`);
      setUser((prev) => {
        if (!prev) return prev;
        const next: AuthUser = {
          ...prev,
          ...res.data,
        };
        SecureStore.setItemAsync("user", JSON.stringify(next)).catch(() => {});
        return next;
      });
    } catch (e) {
      console.error("Erro ao recarregar dados do usuário:", e);
    }
  }, []);

  async function signInWithToken(
    token: string,
    userData: AuthUser,
    redirectFn?: (path: string) => void,
  ) {
    if (!token || typeof token !== "string") {
      console.error(
        "FALHA CRÍTICA: Token inválido ou undefined recebido:",
        token,
      );
      throw new Error(
        "Não foi possível gerar a credencial de acesso. Tente novamente.",
      );
    }

    if (!userData) {
      console.error("FALHA CRÍTICA: userData undefined recebido:", userData);
      throw new Error("Não foi possível carregar os dados do perfil.");
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));

    setUser(userData);

    if (redirectFn) {
      redirectFn("/home");
    }

    try {
      await registerForPush(userData.id);
    } catch (error: any) {
      const status = error?.response?.status;
      const code = error?.response?.data?.code;

      // Conta sem fator verificado: o registro é refeito no próximo login.
      if (status !== 403 && code !== "ACCOUNT_NOT_VERIFIED") {
        console.warn(
          "Não foi possível registrar o push token:",
          error?.message || error,
        );
      }
    }
  }

  async function updateUser(patch: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      SecureStore.setItemAsync("user", JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  async function login(
    emailOrPhone: string,
    senha: string,
  ): Promise<AuthResult> {
    try {
      const response = await api.post("/auth/login", {
        email: emailOrPhone,
        senha,
      });

      const { token, user: userData } = response.data as {
        token: string;
        user: AuthUser;
      };

      await signInWithToken(token, userData);
      return { success: true };
    } catch (error: any) {
      let message = "Erro ao conectar com o servidor";

      if (error?.response) {
        message =
          error.response?.data?.error || "E-mail/telefone ou senha inválidos";
      }

      console.error("Erro no login:", message);
      return { success: false, message };
    }
  }

  async function loginGoogle(idToken: string): Promise<GoogleAuthResult> {
    try {
      const res = await api.post("/auth/google", { idToken });

      const {
        token,
        user: userData,
        needsPhoneVerification,
      } = res.data as {
        token: string;
        user: AuthUser;
        needsPhoneVerification: boolean;
      };

      await signInWithToken(token, userData);

      return {
        success: true,
        needsPhoneVerification: !!needsPhoneVerification,
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Falha ao autenticar com Google.";

      console.error("Erro no loginGoogle:", message);
      return { success: false, message };
    }
  }

  async function logout() {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Sessão do Google já estava encerrada.
    }

    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");

    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
      signInWithToken,
      loginGoogle,
      updateUser,
      refreshUser,
    }),
    [user, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
