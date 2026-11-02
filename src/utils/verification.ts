import type { AuthUser } from "@/src/contexts/AuthContext";

// Situação do cadastro para alugar, calculada num só lugar para que a tela do
// jogo e o banner do perfil digam a mesma coisa.
//
// O que libera o aluguel no backend (rental.service):
// - modo IFMA: isAcademicVerified (a aprovação dos documentos liga esse campo);
// - fora dele: registrationStatus === "APPROVED".
// Reenviar documentos volta registrationStatus para PENDING (e, no modo IFMA,
// desliga isAcademicVerified); recusar grava REJECTED com rejectReason.
export type VerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "REJECTED"
  | "APPROVED"
  | "BLOCKED";

export type VerificationState = {
  status: VerificationStatus;
  rejectReason: string | null;
};

type VerificationUser =
  | (Partial<
      Pick<
        AuthUser,
        | "registrationStatus"
        | "isAcademicVerified"
        | "rejectReason"
        | "documentFile"
        | "addressProof"
        | "selfieWithId"
        | "enrollmentProof"
      >
    > & { isBlocked?: boolean | null })
  | null
  | undefined;

export const VERIFICATION_PENDING_TEXT =
  "Cadastro em análise — você poderá alugar assim que a biblioteca aprovar.";

export function isIfmaMode() {
  return process.env.EXPO_PUBLIC_IFMA_MODE === "true";
}

export function getVerificationState(
  user: VerificationUser,
  ifma: boolean = isIfmaMode(),
): VerificationState {
  const rejectReason = user?.rejectReason?.trim() || null;

  if (!user) return { status: "NOT_SUBMITTED", rejectReason: null };

  if (user.isBlocked) return { status: "BLOCKED", rejectReason: null };

  const approved = ifma
    ? Boolean(user.isAcademicVerified)
    : user.registrationStatus === "APPROVED";

  if (approved) return { status: "APPROVED", rejectReason: null };

  if (user.registrationStatus === "REJECTED") {
    return { status: "REJECTED", rejectReason };
  }

  if (user.registrationStatus === "PENDING") {
    return { status: "PENDING", rejectReason: null };
  }

  // Cadastro antigo sem status, mas com todos os arquivos enviados: está
  // esperando a biblioteca.
  const hasAllDocs = ifma
    ? Boolean(user.documentFile && user.enrollmentProof)
    : Boolean(user.documentFile && user.addressProof && user.selfieWithId);

  return {
    status: hasAllDocs ? "PENDING" : "NOT_SUBMITTED",
    rejectReason: null,
  };
}
