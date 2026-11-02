import { api } from "@/src/services/api";
import { showLudusAlert } from "@/src/services/alert.service";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { NavFooter } from "@/src/components/common/NavFooter";
import HomeBackground from "@/src/components/Home/HomeBackground";
import RentalDetailsModal from "@/src/components/Rentals/RentalDetailsModal";
import type { RentalItemModel } from "@/src/components/Rentals/RentalItem";
import RentalsCard from "@/src/components/Rentals/RentalsCard";

function cancelErrorMessage(e: any) {
  const code = e?.response?.data?.code;

  if (code === "ONLY_PENDING_CAN_CANCEL") {
    return "Esta reserva não pode mais ser cancelada: a retirada já foi confirmada ou ela já foi encerrada.";
  }

  if (!e?.response) {
    return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
  }

  return (
    e.response.data?.error ||
    "Não foi possível cancelar a reserva. Tente novamente."
  );
}

export default function RentalsScreen() {
  const [rentals, setRentals] = useState<RentalItemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [selectedRental, setSelectedRental] = useState<RentalItemModel | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Em caso de erro mantém a lista que já estava na tela: um "nenhum
  // aluguel" falso faria o aluno achar que perdeu a reserva.
  const load = useCallback(async () => {
    try {
      const res = await api.get("/rentals/me");
      setRentals(res.data || []);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const onRetry = useCallback(async () => {
    setLoading(true);
    await load();
    setLoading(false);
  }, [load]);

  const openRental = useCallback((rental: RentalItemModel | null) => {
    setCancelError(null);
    setSelectedRental(rental);
  }, []);

  async function handleCancelRental(rentalId: string) {
    if (cancelLoading) return;

    setCancelLoading(true);
    setCancelError(null);
    try {
      await api.patch(`/rentals/${rentalId}/cancel`);

      setSelectedRental(null);
      load();

      // No iOS um Modal não abre enquanto outro ainda está fechando: o
      // alerta espera o modal de detalhes sair.
      setTimeout(() => {
        showLudusAlert({
          type: "success",
          title: "Reserva cancelada",
          message:
            "Sua reserva foi cancelada e o jogo ficou livre para outros alunos.",
        });
      }, 400);
    } catch (e: any) {
      setCancelError(cancelErrorMessage(e));

      // A reserva pode ter mudado no servidor (retirada confirmada ou
      // cancelada automaticamente): atualiza a lista por trás do modal.
      if (e?.response?.data?.code === "ONLY_PENDING_CAN_CANCEL") load();
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.cardWrap}>
            <RentalsCard
              rentals={rentals}
              onRefresh={onRefresh}
              refreshing={refreshing}
              onPressRental={openRental}
              loadError={loadError}
              onRetry={onRetry}
            />
          </View>
        </View>
      )}

      <RentalDetailsModal
        visible={!!selectedRental}
        rental={selectedRental}
        onClose={() => openRental(null)}
        onCancelRental={handleCancelRental}
        cancelLoading={cancelLoading}
        cancelError={cancelError}
      />

      <NavFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },

  container: { flex: 1 },
  cardWrap: {
    flex: 1,
  },
});
