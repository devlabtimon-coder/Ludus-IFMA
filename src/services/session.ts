import * as SecureStore from "expo-secure-store";
import { showLudusAlert } from "./alert.service";
import { resetTo } from "./navigation";

// O AuthContext registra aqui o próprio logout. Assim o interceptor do axios
// encerra a sessão sem importar o contexto (o que criaria import circular).
type LogoutHandler = () => Promise<void> | void;

let logoutHandler: LogoutHandler | null = null;
let handlingBlocked = false;

export function setLogoutHandler(handler: LogoutHandler | null) {
  logoutHandler = handler;
}

// Conta bloqueada pelo admin: sai da conta, avisa e volta para o login.
// Várias requisições podem falhar juntas; só a primeira faz o fluxo.
export async function handleAccountBlocked() {
  if (handlingBlocked) return;
  handlingBlocked = true;

  try {
    if (logoutHandler) {
      await logoutHandler();
    } else {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
    }
  } catch {
    // Mesmo se o logout falhar, o usuário precisa sair das telas logadas.
  }

  resetTo("/login");

  showLudusAlert({
    type: "error",
    title: "Acesso bloqueado",
    message:
      "Sua conta foi suspensa por um administrador. Contate o suporte para mais informações.",
  });

  setTimeout(() => {
    handlingBlocked = false;
  }, 3000);
}
