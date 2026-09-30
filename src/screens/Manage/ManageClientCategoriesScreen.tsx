import ManageBackground from "@/src/components/Manage/ManageBackground";
import { ManageContainer } from "@/src/components/Manage/ManageContainer";
import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList, Image, Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";



type ClientCategory = "STARTER" | "FAMILY" | "EXPERT" | "ULTRAGAMER";

type ClientUser = {
  id: string;
  name: string;
  email: string;
  clientCategory: ClientCategory;
  clientCategoryLabel: string;
  totalRentalsCount: number;
  level: number;
  points: number;

  avatar?: string | null;
  picture?: string | null;
  image?: string | null; 
};

const CATEGORY_META: Record<
  ClientCategory,
  { label: string; color: string; bg: string; icon: string; allowedTiers: string }
> = {
  STARTER: {
    label: "Starter",
    color: "#8B7355",
    bg: "#F5EFE6",
    icon: "person-outline",
    allowedTiers: "Latão e Bronze",
  },
  FAMILY: {
    label: "Family",
    color: "#2E7D32",
    bg: "#E8F5E9",
    icon: "people-outline",
    allowedTiers: "Latão, Bronze e Prata",
  },
  EXPERT: {
    label: "Expert",
    color: "#1565C0",
    bg: "#E3F2FD",
    icon: "trophy-outline",
    allowedTiers: "Latão, Bronze, Prata e Ouro",
  },
  ULTRAGAMER: {
    label: "Ultragamer",
    color: "#6A1B9A",
    bg: "#F3E5F5",
    icon: "diamond-outline",
    allowedTiers: "Todos os tiers",
  },
};

const CATEGORIES = (Object.keys(CATEGORY_META) as ClientCategory[]);

const LUDUS = {
  blue: "#31358B",
  yellow: "#FBBC04",
  red: "#E62325",
};


export default function ManageClientCategoriesScreen() {
  const router = useRouter();

  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filterCategory, setFilterCategory] = useState<ClientCategory | "ALL">("ALL");

  const [selected, setSelected] = useState<ClientUser | null>(null);
  const [saving, setSaving] = useState(false);


  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterCategory !== "ALL") params.category = filterCategory;
      if (q.trim()) params.q = q.trim();

      const res = await api.get<ClientUser[]>("/categories/users", { params });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, q]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 350);
    return () => clearTimeout(t);
  }, [fetchUsers]);

 
  async function handleSetCategory(userId: string, category: ClientCategory) {
    setSaving(true);
    try {
      await api.patch(`/categories/users/${userId}/category`, { clientCategory: category });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                clientCategory: category,
                clientCategoryLabel: CATEGORY_META[category].label,
              }
            : u
        )
      );
      setSelected(null);
    } catch (err) {
      console.error("Erro ao alterar categoria:", err);
    } finally {
      setSaving(false);
    }
  }


function renderUser({ item }: { item: ClientUser }) {
  const meta = CATEGORY_META[item.clientCategory];

  const imageUri = item.image || item.avatar || item.picture;

  const initials = item.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable style={styles.userRow} onPress={() => setSelected(item)}>
      
    
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <Text style={styles.userRentals}>
          {item.totalRentalsCount} aluguel{item.totalRentalsCount !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={[styles.categoryPill, { backgroundColor: meta.bg }]}>
        <Text style={[styles.categoryPillText, { color: meta.color }]}>
          {meta.label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#ccc" style={{ marginLeft: 4 }} />
    </Pressable>
  );
}
  return (
    <View style={{ flex: 1 }}>
      <ManageBackground />
      <ManageContainer>

        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={LUDUS.blue} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Categorias de Clientes</Text>
            <Text style={styles.subtitle}>Gerencie o acesso de cada cliente</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#535353" />
          <TextInput
            style={styles.input}
            placeholder="Buscar por nome ou e-mail..."
            placeholderTextColor="#666"
            value={q}
            onChangeText={setQ}
          />
        </View>


        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, filterCategory === "ALL" && styles.filterChipActive]}
            onPress={() => setFilterCategory("ALL")}
          >
            <Text style={[styles.filterChipText, filterCategory === "ALL" && styles.filterChipTextActive]}>
              Todos
            </Text>
          </Pressable>

          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = filterCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  active && { backgroundColor: meta.color, borderColor: meta.color },
                ]}
                onPress={() => setFilterCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && { color: "#fff" },
                  ]}
                >
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

    
        {loading ? (
          <View style={{ paddingTop: 24 }}>
            <ActivityIndicator size="large" color={LUDUS.blue} />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(u) => u.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Ionicons name="people-outline" size={46} color="#999" />
                <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
                <Text style={styles.emptySubtitle}>Ajuste o filtro ou a busca.</Text>
              </View>
            }
            renderItem={renderUser}
          />
        )}
      </ManageContainer>

    
      <CategoryEditModal
        visible={!!selected}
        user={selected}
        saving={saving}
        onClose={() => setSelected(null)}
        onSave={handleSetCategory}
      />
    </View>
  );
}


function CategoryEditModal({
  visible,
  user,
  saving,
  onClose,
  onSave,
}: {
  visible: boolean;
  user: ClientUser | null;
  saving: boolean;
  onClose: () => void;
  onSave: (userId: string, category: ClientCategory) => void;
}) {
  const [picked, setPicked] = useState<ClientCategory>("STARTER");

  useEffect(() => {
    if (user) setPicked(user.clientCategory);
  }, [user]);

  if (!user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={ms.overlay}>
        <View style={ms.sheet}>
          <View style={ms.header}>
            <View style={{ flex: 1 }}>
              <Text style={ms.title}>Alterar categoria</Text>
              <Text style={ms.subtitle} numberOfLines={1}>
                {user.name}
              </Text>
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={26} color={LUDUS.blue} />
            </Pressable>
          </View>

          <View style={ms.infoRow}>
            <Ionicons name="mail-outline" size={15} color="#777" />
            <Text style={ms.infoText}>{user.email}</Text>
          </View>
          <View style={ms.infoRow}>
            <Ionicons name="repeat-outline" size={15} color="#777" />
            <Text style={ms.infoText}>
              {user.totalRentalsCount} aluguéis realizados
            </Text>
          </View>

          <Text style={ms.sectionLabel}>Selecione a categoria</Text>

          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = picked === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setPicked(cat)}
                style={[ms.catOption, active && { borderColor: meta.color, backgroundColor: meta.bg }]}
              >
                <View style={[ms.catIcon, { backgroundColor: meta.color }]}>
                  <Ionicons name={meta.icon as any} size={18} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[ms.catName, active && { color: meta.color }]}>
                    {meta.label}
                  </Text>
                  <Text style={ms.catTiers}>Acessa: {meta.allowedTiers}</Text>
                </View>

                {active && (
                  <Ionicons name="checkmark-circle" size={22} color={meta.color} />
                )}
              </Pressable>
            );
          })}

          <Pressable
            style={[ms.saveBtn, saving && { opacity: 0.6 }]}
            onPress={() => onSave(user.id, picked)}
            disabled={saving}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={ms.saveBtnText}>
              {saving ? "Salvando..." : "Confirmar categoria"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
     avatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginRight: 12,
},

avatarFallback: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: "#31358B",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

avatarText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 16,
}, 
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: LUDUS.blue,
  },

  subtitle: {
    fontSize: 13,
    color: "#535353",
    marginTop: 2,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F2FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 12,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#DDD",
    backgroundColor: "#F8F8F8",
  },

  filterChipActive: {
    backgroundColor: LUDUS.blue,
    borderColor: LUDUS.blue,
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },

  filterChipTextActive: {
    color: "#fff",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  categoryDot: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  userName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a1a",
  },

  userEmail: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  userRentals: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  categoryPillText: {
    fontSize: 12,
    fontWeight: "800",
  },

  emptyWrap: {
    alignItems: "center",
    paddingTop: 40,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: LUDUS.blue,
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: LUDUS.blue,
  },

  subtitle: {
    fontSize: 13,
    color: "#535353",
    marginTop: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: "#555",
  },

  sectionLabel: {
    marginTop: 20,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "900",
    color: LUDUS.blue,
  },

  catOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
  },

  catIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  catName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  catTiers: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  saveBtn: {
    marginTop: 20,
    height: 56,
    borderRadius: 18,
    backgroundColor: LUDUS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  saveBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});