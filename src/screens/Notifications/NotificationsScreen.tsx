import HomeBackground from "@/src/components/Home/HomeBackground";
import { NotificationsHeader } from "@/src/components/Notifications/NotificationHeader";
import { NotificationItem, type AppNotification } from "@/src/components/Notifications/NotificationItem";
import { NotificationsTabs } from "@/src/components/Notifications/NotificationsTabs";
import { NotificationsTypeFilter, type NotificationTypeFilterValue } from "@/src/components/Notifications/NotificationTypeFilter";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

type MeResponse = { notifications: AppNotification[]; nextCursor?: string };

export default function NotificationsScreen() {
  const router = useRouter();

  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [tab, setTab] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilterValue>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get<MeResponse>("/notifications/me");
      setItems(res.data?.notifications ?? []);
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Não foi possível carregar notificações.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
    try {
      await api.post(`/notifications/read-all`);
    } catch {}
  }, []);

  const baseFiltered = useMemo(() => {
    if (tab === "all") return items;
    return items.filter((n) => !n.readAt);
  }, [items, tab]);

  const filtered = useMemo(() => {
    if (typeFilter === "all") return baseFiltered;
    return baseFiltered.filter((n) => {
      const t = (n.type || "").toUpperCase();

      if (typeFilter === "rentals") return t.startsWith("RENTAL_");
      if (typeFilter === "ratings") return t.startsWith("RATING");
      if (typeFilter === "verify") return t.includes("VERIFY") || t.includes("EMAIL") || t.includes("PHONE");
      if (typeFilter === "progress") return t.includes("LEVEL") || t.includes("POINTS");
      if (typeFilter === "system") return t.includes("SYSTEM") || t.includes("ANNOUNCEMENT") || t.includes("GAME_BACK_AVAILABLE");

      return true;
    });
  }, [baseFiltered, typeFilter]);

  const countsByType = useMemo(() => {
    const c = {
      all: baseFiltered.length,
      rentals: 0,
      favorites: 0,
      ratings: 0,
      verify: 0,
      progress: 0,
      system: 0,
    };

    for (const n of baseFiltered) {
      const t = (n.type || "").toUpperCase();
      if (t.startsWith("RENTAL_")) c.rentals++;
      else if (t.startsWith("FAVORITE")) c.favorites++;
      else if (t.startsWith("RATING")) c.ratings++;
      else if (t.includes("VERIFY") || t.includes("EMAIL") || t.includes("PHONE")) c.verify++;
      else if (t.includes("LEVEL") || t.includes("POINTS")) c.progress++;
      else c.system++;
    }

    return c;
  }, [baseFiltered]);

  return (
    <View style={{ flex: 1 }}>
      <HomeBackground />

      <NotificationsHeader onBack={() => router.back()} onReadAll={markAllRead} />

      <View style={styles.sheet}>
        <NotificationsTabs tab={tab} onChange={setTab} />

        <NotificationsTypeFilter
          value={typeFilter}
          onChange={setTypeFilter}
          counts={countsByType}
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.subtle}>Carregando…</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={42} color={RED} />
            <Text style={styles.err}>{err}</Text>
            <Text onPress={load} style={styles.retry}>
              Tentar novamente
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="notifications-off-outline" size={44} color="#9AA0A6" />
            <Text style={styles.emptyTitle}>Sem notificações</Text>
            <Text style={styles.subtle}>Quando acontecer algo importante, vai aparecer aqui.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
            {filtered.map((n) => (
              <NotificationItem
                key={n.id}
                item={n}
                onOpen={async (item) => {
                  await markRead(item.id);
                  const route = item.data?.route;
                  if (route) router.push(route);
                }}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const BLUE = "#31358B";
const RED = "#B3193A";

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    overflow: "hidden",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  subtle: { marginTop: 10, color: "#7A7E8B", fontWeight: "700" },

  err: { marginTop: 10, color: RED, fontWeight: "900", textAlign: "center" },
  retry: { marginTop: 12, color: BLUE, fontWeight: "900" },

  emptyTitle: { marginTop: 10, fontWeight: "900", fontSize: 16, color: "#222" },
});