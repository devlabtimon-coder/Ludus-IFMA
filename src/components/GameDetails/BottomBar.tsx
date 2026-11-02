import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPressRent?: () => void;
  unavailable?: boolean;
  // Tem exemplar, mas nenhum horário livre nos próximos 7 dias: oferece
  // o "Me avise" sem tirar a opção de reservar mais para frente.
  noSlotSoon?: boolean;
  watching?: boolean;
  loadingWatch?: boolean;
  onToggleWatch?: () => void;
  rentedByMe?: boolean;
};

export function BottomBar({
  onPressRent,
  unavailable,
  noSlotSoon,
  watching,
  loadingWatch,
  onToggleWatch,
  rentedByMe,
}: Props) {
  const insets = useSafeAreaInsets();

  const notifyButton = (
    <Pressable
      onPress={onToggleWatch}
      disabled={loadingWatch}
      style={styles.notifyBtn}
      accessibilityRole="button"
      accessibilityLabel={watching ? "Desativar aviso" : "Me avise"}
    >
      {loadingWatch ? (
        <ActivityIndicator color="#111" />
      ) : (
        <>
          <Ionicons
            name={watching ? "notifications" : "notifications-outline"}
            size={18}
            color="#111"
          />
          <Text style={styles.notifyText}>
            {watching ? "Aviso ativado" : "Me avise"}
          </Text>
        </>
      )}
    </Pressable>
  );

  if (!unavailable && noSlotSoon) {
    return (
      <View style={[styles.wrap, { paddingBottom: insets.bottom + 10 }]}>
        <View style={[styles.inner, styles.innerColumn]}>
          <Text style={styles.hint}>
            Sem horários livres nos próximos 7 dias. Peça para ser avisado
            quando abrir um horário.
          </Text>
          <View style={styles.row}>
            <View style={styles.flex}>{notifyButton}</View>
            <Pressable
              onPress={onPressRent}
              style={[styles.btn, styles.flex]}
              accessibilityRole="button"
            >
              <Text style={styles.btnText}>Ver datas</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.inner}>
        <View style={styles.flex}>
          <Text style={styles.free}>Grátis</Text>
          <Text style={styles.freeSub}>Devolução no mesmo dia</Text>
        </View>

        {!unavailable ? (
          <Pressable
            onPress={onPressRent}
            style={styles.btn}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>Alugar</Text>
          </Pressable>
        ) : rentedByMe ? (
          <View style={styles.rentedBtn}>
            <Ionicons name="checkmark-circle" size={18} color="#fff" />
            <Text style={styles.rentedText}>Em aluguel</Text>
          </View>
        ) : (
          notifyButton
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 10,
    backgroundColor: "transparent",
  },

  inner: {
    backgroundColor: "#fff",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  innerColumn: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  flex: {
    flex: 1,
  },

  hint: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
    lineHeight: 18,
  },

  free: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2E7D32",
  },

  freeSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    marginTop: 2,
  },

  btn: {
    backgroundColor: "#0A1F5C",
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  notifyBtn: {
    backgroundColor: "#FBBC04",
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },

  notifyText: {
    color: "#111",
    fontWeight: "900",
    fontSize: 14,
  },

  rentedBtn: {
    backgroundColor: "#31358B",
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },

  rentedText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
});