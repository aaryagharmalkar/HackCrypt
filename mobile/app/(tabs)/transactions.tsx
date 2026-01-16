import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

/* ---------------- TYPES ---------------- */

type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  method: string;
  status: string;
};

/* ---------------- ICON MAPPER ---------------- */

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const c = category.toLowerCase();
  if (c.includes("food")) return "restaurant-outline";
  if (c.includes("travel")) return "airplane-outline";
  if (c.includes("rent")) return "home-outline";
  if (c.includes("shop")) return "bag-outline";
  if (c.includes("salary") || c.includes("income"))
    return "arrow-up-circle-outline";
  return "card-outline";
};

/* ---------------- SCREEN ---------------- */

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");

  useFocusEffect(
  useCallback(() => {
    fetchTransactions();
  }, [])
);


  const fetchTransactions = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      const formatted =
        data?.map((tx: any) => ({
          id: tx.id,
          name: tx.description,
          category: tx.category || "Other",
          amount:
            tx.type === "debit"
              ? -Math.abs(tx.amount)
              : Math.abs(tx.amount),
          date: new Date(tx.date).toDateString(),
          method: "Bank",
          status: "completed",
        })) || [];

      setTransactions(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchSearch = tx.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "All"
        ? true
        : filter === "Income"
        ? tx.amount > 0
        : tx.amount < 0;

    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Transactions</Text>
      <Text style={styles.subtitle}>
        Monitor all your financial activity
      </Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#6B7280" />
        <TextInput
          placeholder="Search transactions"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {["All", "Income", "Expense"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f as any)}
            style={[
              styles.filterBtn,
              filter === f && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const icon = getCategoryIcon(item.category);
            return (
              <View style={styles.row}>
                <View style={styles.left}>
                  <View style={styles.iconBox}>
                    <Ionicons name={icon} size={18} />
                  </View>
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>
                      {item.category} • {item.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.right}>
                  <Text
                    style={[
                      styles.amount,
                      {
                        color:
                          item.amount > 0
                            ? "#22C55E"
                            : "#111827",
                      },
                    ]}
                  >
                    {item.amount > 0 ? "+" : ""}
                    ₹{Math.abs(item.amount).toLocaleString()}
                  </Text>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={16}
                    color="#9CA3AF"
                  />
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#6B7280", marginBottom: 14 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  searchInput: { flex: 1 },

  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  filterActive: { backgroundColor: "#059669" },
  filterText: { fontWeight: "700", color: "#374151" },
  filterTextActive: { color: "#fff" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  left: { flexDirection: "row", gap: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "700" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontWeight: "700" },
});
