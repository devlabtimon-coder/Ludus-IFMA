import HomeBackground from "@/src/components/Home/HomeBackground";
import {
  ABOUT_COLORS,
  ABOUT_ICON_NAMES,
  ABOUT_STATUS_COLORS,
  DEFAULT_ABOUT,
  type AboutColor,
  type AboutContent,
  type AboutIcon,
} from "@/src/constants/about";
import { fetchAbout, getCachedAbout } from "@/src/services/about.service";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const BLUE = "#31358B";
const DARK_BLUE = "#0A1F5C";
const YELLOW = "#FBBC04";

const LUDUS_LOGO = require("../../../assets/logo-dice.png");

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={{ marginTop: 24 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: AboutIcon;
  title: string;
  text: string;
  color: AboutColor;
}) {
  const palette = ABOUT_COLORS[color] ?? ABOUT_COLORS.blue;

  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIconWrap, { backgroundColor: palette.bg }]}>
        <Ionicons name={ABOUT_ICON_NAMES[icon] ?? "ellipse-outline"} size={20} color={palette.fg} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const palette = ABOUT_STATUS_COLORS[status] ?? ABOUT_STATUS_COLORS["Serviço configurável"];
  return (
    <View style={[styles.statusBadge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.statusBadgeText, { color: palette.fg }]}>{status}</Text>
    </View>
  );
}

function ProjectItem({
  icon,
  label,
  value,
  first,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  first?: boolean;
}) {
  return (
    <>
      {!first && <View style={styles.projectDivider} />}
      <View style={styles.projectRow}>
        <Ionicons name={icon} size={18} color={BLUE} />
        <Text style={styles.projectLabel}>{label}</Text>
      </View>
      <Text style={styles.projectValue}>{value}</Text>
    </>
  );
}

// "A, B e C"
function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}

export default function AboutScreen() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT);
  const [changelogOpen, setChangelogOpen] = useState(false);

  // Mostra a última versão salva no aparelho e atualiza com a publicada no painel.
  useEffect(() => {
    let alive = true;
    getCachedAbout().then((cached) => {
      if (alive && cached) setAbout(cached);
    });
    fetchAbout()
      .then((fresh) => {
        if (alive) setAbout(fresh);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const appVersion = Application.nativeApplicationVersion || "1.0.0";
  const { identity, features, mission, team, version, integrations } = about;

  const projectItems: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }[] = [];
  if (team?.institution) projectItems.push({ icon: "business-outline", label: "Instituição", value: team.institution });
  if (team && team.members.length > 0) {
    projectItems.push({
      icon: "people-outline",
      label: "Equipe",
      value: joinNames(team.members.map((m) => (m.role ? `${m.name} (${m.role})` : m.name))),
    });
  }
  if (team?.advisor) {
    projectItems.push({
      icon: "ribbon-outline",
      label: "Orientação",
      value: team.advisorTitle ? `${team.advisor} · ${team.advisorTitle}` : team.advisor,
    });
  }

  return (
    <View style={styles.root}>
      <HomeBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Sobre o {identity.appName}</Text>
            {!!identity.subtitle && <Text style={styles.headerSubtitle}>{identity.subtitle}</Text>}
          </View>
        </View>

        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroCard}>
              <View style={styles.logoWrap}>
                <Image source={LUDUS_LOGO} style={styles.logo} resizeMode="contain" />
              </View>

              <Text style={styles.appName}>{identity.appName}</Text>
              <Text style={styles.heroText}>{identity.description}</Text>

              {identity.chips.length > 0 && (
                <View style={styles.heroPills}>
                  {identity.chips.map((chip, i) => (
                    <View key={`${chip}-${i}`} style={styles.statPill}>
                      <Text style={styles.statPillText}>{chip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {features.length > 0 && (
              <>
                <SectionTitle title="O que o app oferece" />
                {features.map((f) => (
                  <FeatureCard key={f.id} icon={f.icon} title={f.title} text={f.description} color={f.color} />
                ))}
              </>
            )}

            {mission && (!!mission.mission || !!mission.vision) && (
              <>
                <SectionTitle title="Propósito" />
                <View style={styles.textBox}>
                  {!!mission.mission && <Text style={styles.textBoxText}>{mission.mission}</Text>}
                  {!!mission.vision && (
                    <Text style={[styles.textBoxText, !!mission.mission && { marginTop: 10 }]}>
                      <Text style={styles.visionLabel}>Visão: </Text>
                      {mission.vision}
                    </Text>
                  )}
                </View>
              </>
            )}

            {projectItems.length > 0 && (
              <>
                <SectionTitle title="Projeto" />
                <View style={styles.projectCard}>
                  {projectItems.map((item, i) => (
                    <ProjectItem key={item.label} {...item} first={i === 0} />
                  ))}
                </View>
              </>
            )}

            <SectionTitle title="Aplicativo" />

            <View style={styles.appMetaRow}>
              <View style={[styles.metaCard, styles.versionCard]}>
                <View>
                  <Text style={styles.metaTitle}>Versão</Text>
                  <Text style={styles.metaValue}>{appVersion}</Text>
                </View>
                <StatusBadge status={version.status} />
              </View>
            </View>

            {version.changelog.length > 0 && (
              <View style={styles.changelogCard}>
                <Pressable
                  onPress={() => setChangelogOpen((o) => !o)}
                  style={styles.changelogHeader}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: changelogOpen }}
                >
                  <Text style={styles.changelogTitle}>Histórico de versões</Text>
                  <Ionicons name={changelogOpen ? "chevron-up" : "chevron-down"} size={18} color={BLUE} />
                </Pressable>
                {changelogOpen &&
                  version.changelog.map((entry) => (
                    <View key={entry.id} style={styles.changelogItem}>
                      <View style={styles.changelogDot} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.changelogVersion}>
                          v{entry.version} · {entry.title}
                        </Text>
                        {!!entry.description && <Text style={styles.changelogText}>{entry.description}</Text>}
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {integrations.length > 0 && (
              <>
                <SectionTitle title="APIs e integrações" />
                {integrations.map((api) => (
                  <View key={api.id} style={styles.integrationCard}>
                    <View style={[styles.featureIconWrap, styles.integrationIcon]}>
                      <Ionicons name={ABOUT_ICON_NAMES[api.icon] ?? "ellipse-outline"} size={18} color={BLUE} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.integrationName}>{api.name}</Text>
                      <Text style={styles.integrationUsage}>{api.usage}</Text>
                    </View>
                    <StatusBadge status={api.status} />
                  </View>
                ))}
              </>
            )}

            <View style={styles.footerCard}>
              <Text style={styles.footerTitle}>{identity.appName} ©</Text>
              <Text style={styles.footerText}>
                Uma solução criada para fortalecer o acesso ao acervo de jogos e
                transformar a experiência de uso em algo mais organizado, moderno
                e significativo.
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BLUE,
  },

  header: {
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: DARK_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 22,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: "#F7F8FF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  logo: {
    width: 72,
    height: 72,
  },

  appName: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: "900",
    color: BLUE,
  },

  heroText: {
    marginTop: 10,
    textAlign: "center",
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  heroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
  },

  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  statPillText: {
    color: BLUE,
    fontWeight: "900",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: BLUE,
  },

  sectionLine: {
    marginTop: 10,
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },

  featureCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },

  featureIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: BLUE,
  },

  featureText: {
    marginTop: 6,
    color: "#666D7E",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 21,
  },

  textBox: {
    marginTop: 16,
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    padding: 16,
  },

  textBoxText: {
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  projectCard: {
    marginTop: 16,
    backgroundColor: "#F7F8FF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  projectLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: BLUE,
  },

  projectValue: {
    marginTop: 8,
    color: "#5F6475",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  projectDivider: {
    height: 1,
    backgroundColor: "rgba(49,53,139,0.10)",
    marginVertical: 14,
  },

  appMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  metaCard: {
    flex: 1,
    backgroundColor: "#F7F8FF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  metaTitle: {
    color: "#7A7E8B",
    fontSize: 13,
    fontWeight: "800",
  },

  metaValue: {
    marginTop: 6,
    color: BLUE,
    fontSize: 18,
    fontWeight: "900",
  },

  footerCard: {
    marginTop: 24,
    backgroundColor: BLUE,
    borderRadius: 22,
    padding: 18,
  },

  footerTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  footerText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.86)",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 20,
  },

  visionLabel: {
    color: BLUE,
    fontWeight: "900",
  },

  versionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "center",
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  changelogCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
  },

  changelogHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  changelogTitle: {
    color: BLUE,
    fontSize: 14,
    fontWeight: "900",
  },

  changelogItem: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  changelogDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2FA84F",
    marginTop: 6,
  },

  changelogVersion: {
    color: BLUE,
    fontSize: 13,
    fontWeight: "900",
  },

  changelogText: {
    marginTop: 4,
    color: "#666D7E",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  integrationCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(49,53,139,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  integrationIcon: {
    backgroundColor: "#EEF0FF",
    width: 38,
    height: 38,
    borderRadius: 12,
  },

  integrationName: {
    color: BLUE,
    fontSize: 14,
    fontWeight: "900",
  },

  integrationUsage: {
    marginTop: 3,
    color: "#666D7E",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
});
