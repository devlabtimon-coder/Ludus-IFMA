import HomeBackground from "@/src/components/Home/HomeBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

const BLUE = "#31358B";
const DARK_BLUE = "#0A1F5C";
const YELLOW = "#FBBC04";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const safeTop = useSafeTop(54);
  const router = useRouter();

  return (
    <View style={styles.root}>
      <HomeBackground />

      <View style={[styles.header, { paddingTop: safeTop }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Política de Privacidade</Text>

        <View style={{ width: 50 }} />
      </View>

      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <Text style={styles.title}>POLÍTICA DE PRIVACIDADE</Text>
          <Text style={styles.subtitle}>App Ludus • IFMA Campus Timon</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>1. Finalidade</Text>
          <Text style={styles.paragraph}>
            Esta política descreve como o Ludus coleta, utiliza e protege os
            dados fornecidos pelos usuários durante o uso da aplicação.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>2. Dados que podem ser utilizados</Text>
          <View style={styles.bullets}>
            <Bullet>Nome, e-mail institucional, telefone e matrícula.</Bullet>
            <Bullet>Foto de perfil, quando enviada.</Bullet>
            <Bullet>Documento de identidade e comprovante de matrícula, usados só para aprovar o cadastro e apagados depois da aprovação (fica registrado apenas quem aprovou e quando).</Bullet>
            <Bullet>Informações relacionadas ao cadastro e autenticação.</Bullet>
            <Bullet>Dados de uso do sistema, como histórico de empréstimos, reservas e interações no app.</Bullet>
            <Bullet>Informações necessárias para notificações, segurança e funcionamento da aplicação.</Bullet>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>3. Uso das informações</Text>
          <View style={styles.bullets}>
            <Bullet>Permitir autenticação e acesso seguro à conta.</Bullet>
            <Bullet>Gerenciar empréstimos, devoluções, reservas e notificações.</Bullet>
            <Bullet>Melhorar a experiência do usuário dentro do sistema.</Bullet>
            <Bullet>Garantir organização, segurança e integridade do acervo e das operações do Ludus.</Bullet>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>4. Proteção de dados</Text>
          <Text style={styles.paragraph}>
            O Ludus adota medidas de segurança para proteger os dados dos usuários
            contra acessos não autorizados, uso indevido, perda ou alteração.
            Informações sensíveis não devem ser expostas publicamente.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>5. Compartilhamento</Text>
          <Text style={styles.paragraph}>
            Os dados não devem ser compartilhados com terceiros fora das
            finalidades institucionais e operacionais do sistema, exceto quando
            necessário para autenticação, comunicação ou cumprimento de exigências legais.
            Para funcionar, o Ludus usa serviços de terceiros: Google e Firebase
            (login e verificação do telefone), Cloudinary (armazenamento de fotos
            e documentos), Expo (notificações), Resend (envio de e-mails), Railway
            (hospedagem do servidor e do banco de dados) e Sentry (registro de erros técnicos).
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>6. Direitos do usuário</Text>
          <View style={styles.bullets}>
            <Bullet>Consultar os dados vinculados à própria conta.</Bullet>
            <Bullet>Solicitar atualização de informações cadastrais.</Bullet>
            <Bullet>Entender como o sistema utiliza suas informações.</Bullet>
            <Bullet>Excluir a própria conta em Perfil › Conta › Excluir minha conta. Os dados pessoais, documentos e a foto são apagados; os aluguéis já feitos ficam no histórico da biblioteca sem identificar o usuário.</Bullet>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>7. Atualizações</Text>
          <Text style={styles.paragraph}>
            Esta política pode ser atualizada para refletir melhorias no sistema,
            ajustes legais ou mudanças no funcionamento do aplicativo.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.footerNote}>
            Última atualização: v1.1 • App Ludus • IFMA Campus Timon
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BLUE },

  header: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: DARK_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 18,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    paddingTop: 8,
  },

  sheetContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 60,
  },

  title: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1C1C1C",
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#6B6B6B",
  },

  divider: {
    marginVertical: 14,
    height: 1,
    backgroundColor: "#EFEFEF",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#2C2C2C",
    marginBottom: 8,
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4A4A4A",
    fontWeight: "600",
  },

  bullets: {
    marginTop: 10,
    gap: 10,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginTop: 7,
    backgroundColor: YELLOW,
  },

  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#4A4A4A",
    fontWeight: "600",
  },

  footerNote: {
    fontSize: 12,
    color: "#8A8A8A",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
});