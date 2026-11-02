// Textos e formatação dos aluguéis, usados na lista e nos detalhes para que
// as duas telas digam a mesma coisa.

export const PICKUP_PLACE = "Biblioteca do IFMA Campus Timon";

export const PENDING_PICKUP_TEXT = `Retire na ${PICKUP_PLACE} no horário agendado; após 30 min de tolerância a reserva é cancelada e você perde 5 pontos.`;

export type RentalStatusMeta = {
  label: string;
  color: string;
  description: string;
};

export function getRentalStatusMeta(status: string): RentalStatusMeta {
  const s = (status || "").toUpperCase();

  if (s === "PENDING") {
    return {
      label: "Aguardando retirada",
      color: "#FBBC04",
      description: PENDING_PICKUP_TEXT,
    };
  }

  if (s === "ACTIVE") {
    return {
      label: "Com você",
      color: "#2FA84F",
      description: `O jogo está com você. Devolva na ${PICKUP_PLACE} até o prazo final.`,
    };
  }

  if (s === "RETURNED") {
    return {
      label: "Devolvido",
      color: "#31358B",
      description: "Esse aluguel já foi finalizado com devolução.",
    };
  }

  if (s === "CANCELED") {
    return {
      label: "Cancelado",
      color: "#B3193A",
      description: "Essa reserva foi cancelada.",
    };
  }

  return {
    label: status || "—",
    color: "#6A6A6A",
    description: "Informações do aluguel.",
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function parse(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(iso: string) {
  const d = parse(iso);
  if (!d) return "—";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatTime(iso: string) {
  const d = parse(iso);
  if (!d) return "—";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateTime(iso: string) {
  const d = parse(iso);
  if (!d) return "—";
  return `${formatDate(iso)} às ${formatTime(iso)}`;
}

// Retirada e devolução no mesmo dia: "12/11/2026 • 14:00–18:00".
// Em dias diferentes: "12/11 14:00 → 14/11 18:00".
export function formatRentalPeriod(startIso: string, endIso: string) {
  const start = parse(startIso);
  const end = parse(endIso);
  if (!start || !end) return "—";

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return `${formatDate(startIso)} • ${formatTime(startIso)}–${formatTime(endIso)}`;
  }

  const short = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return `${short(start)} ${formatTime(startIso)} → ${short(end)} ${formatTime(endIso)}`;
}
