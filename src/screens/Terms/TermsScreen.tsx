import HomeBackground from "@/src/components/Home/HomeBackground";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeTop } from "@/src/hooks/useSafeTop";

export default function TermsScreen() {
  const safeTop = useSafeTop(54);
  const router = useRouter();

  return (
    <View style={styles.root}>
      <HomeBackground />


      <View style={[styles.header, { paddingTop: safeTop }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#e80f0f" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Termos e Contrato</Text>

        
        <View style={{ width: 46 }} />
      </View>


      <View style={styles.sheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sheetContent}
        >
          <Text style={styles.title}>ANEXO A - TERMO DE COMPROMISSO</Text>
          <Text style={styles.subtitle}>Aluguel de jogos • App Ludus — Campus de Timon</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Termos de contrato</Text>
          <Text style={styles.paragraph}>
            O(a) usuário(a) cadastrado(a) no sistema do Campus de Timon — seja aluno(a)
            regularmente matriculado(a) ou servidor(a) ativo(a) — é responsável pela
            veracidade das informações fornecidas nesta ficha cadastral, respondendo civil
            e criminalmente por eventuais informações incorretas. O usuário(a) também é
            responsável por todas as obrigações assumidas no Contrato de Aluguel, detalhado
            abaixo (leitura obrigatória).
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            CONTRATO DE ALUGUEL DE JOGOS DO APP LUDUS – CAMPUS DE TIMON
          </Text>

          <Text style={styles.paragraph}>
            O App Ludus disponibiliza aos alunos regularmente matriculados e aos servidores
            ativos do Campus de Timon uma coleção de jogos para aluguel gratuito, com prazo
            de até 3 (três) dias. Abaixo, algumas informações importantes para quem está
            alugando um ou mais jogos:
          </Text>

          <View style={styles.bullets}>
            <Bullet>
              Você só poderá alugar jogos dentro da sua categoria de cadastro (aluno,
              servidor), conforme os Termos aceitos ao se cadastrar no sistema do App Ludus.
              Não há flexibilização do perfil do usuário;
            </Bullet>

            <Bullet>
              Não haverá entrega ou retirada dos jogos fora do Campus de Timon. O usuário
              se compromete a retirar e devolver o jogo no local indicado, até o prazo
              máximo de 3 dias;
            </Bullet>

            <Bullet>
              O aluguel dos jogos é gratuito. Não há cobrança pelo período de uso, desde
              que o jogo seja devolvido nas mesmas condições em que foi retirado;
            </Bullet>

            <Bullet>
              No ato da retirada, os componentes dos jogos devem ser conferidos na presença
              de um funcionário/monitor do App Ludus;
            </Bullet>

            <Bullet>
              O prazo de aluguel é de até 3 dias. Caso o usuário deseje renovar o empréstimo,
              deverá consultar a disponibilidade do jogo e, se possível, realizar nova
              retirada após a devolução;
            </Bullet>

            <Bullet>
              No momento da devolução, os componentes do jogo serão conferidos novamente
              por um funcionário/monitor do App Ludus. Em caso de ausência de peças ou cartas,
              sujeira excessiva ou avaria em qualquer componente do jogo (caixa, peças, manual,
              etc.), o usuário será responsável pela reposição ou pagamento do valor correspondente
              ao item danificado ou faltante, conforme tabela de preços do App Ludus;
            </Bullet>

            <Bullet>
              Em caso de atraso na devolução, o usuário poderá ter seu cadastro suspenso
              temporariamente, até regularizar a situação;
            </Bullet>

            <Bullet>
              A critério dos administradores do App Ludus, qualquer jogo pode ser retirado
              do catálogo de aluguel. Não insista em alugar jogos indisponíveis;
            </Bullet>

            <Bullet>
              O App Ludus pode, a qualquer momento, suspender o cadastro de um usuário,
              conforme as regras do sistema;
            </Bullet>

            <Bullet>
              O aluguel de jogos do App Ludus no Campus de Timon é uma iniciativa para ampliar
              o acesso aos jogos de tabuleiro e incentivar a cultura lúdica entre alunos e
              servidores. Por favor, cuide dos jogos como se fossem seus, para que mais pessoas
              possam aproveitar essa oportunidade;
            </Bullet>

            <Bullet>
              Se quiser compartilhar sua experiência, publique fotos das suas jogatinas nos
              grupos oficiais do App Ludus ou, se tiver Instagram, marque o perfil do App Ludus
              e use a hashtag #aluguelappludus.
            </Bullet>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footerNote}>
            Última atualização: v1.0 • Campus de Timon
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.dot} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

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
    backgroundColor: "rgb(255, 255, 255)",
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
    backgroundColor: "#FBBC04",
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