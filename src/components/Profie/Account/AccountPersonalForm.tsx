import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  name: string;
  phone: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
};

export function AccountPersonalForm({
  name,
  phone,
  onChangeName,
  onChangePhone,
}: Props) {
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.label}>Nome completo</Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder="Seu nome"
            placeholderTextColor="#8B8EA1"
            style={styles.input}
          />
          <Ionicons name="pencil-outline" size={18} color="#8B8EA1" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Telefone</Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={phone}
            onChangeText={onChangePhone}
            placeholder="(99) 99999-9999"
            placeholderTextColor="#8B8EA1"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Ionicons name="pencil-outline" size={18} color="#8B8EA1" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "900",
    color: "#31358B",
    marginBottom: 8,
  },
  inputWrap: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F3F5FF",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    fontWeight: "700",
  },
});
