import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

/* ================= Types ================= */

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
}

/* ================= Helpers ================= */

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const lower = category?.toLowerCase() || "";

  if (lower.includes("shop")) return "bag-outline";
  if (lower.includes("food") || lower.includes("drink")) return "cafe-outline";
  if (lower.includes("transport") || lower.includes("uber") || lower.includes("ola"))
    return "car-outline";
  if (lower.includes("house") || lower.includes("rent")) return "home-outline";
  if (lower.includes("util") || lower.includes("bill") || lower.includes("recharge"))
    return "phone-portrait-outline";
  if (lower.includes("salary") || lower.includes("income"))
    return "arrow-up-outline";
  if (lower.includes("transfer")) return "arrow-down-outline";
  if (lower.includes("tax")) return "briefcase-outline";
  if (lower.includes("travel")) return "airplane-outline";
  if (lower.includes("invest")) return "cash-outline";

  return "card-outline";
};

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

/* ================= Component ================= */

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(5);

        if (error) throw error;

        const formatted: Transaction[] = (data || []).map((tx: any) => ({
          id: tx.id,
          name: tx.description,
          category: tx.category || "Uncategorized",
          amount: Math.abs(tx.amount),
          date: new Date(tx.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          type: tx.type,
        }));

        setTransactions(formatted);
      } catch (e) {
        console.error("Error fetching recent transactions:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      ) : transactions.length === 0 ? (
        <Text style={styles.empty}>No recent transactions</Text>
      ) : (
        transactions.map((tx) => {
          const icon = getCategoryIcon(tx.category);

          return (
            <TouchableOpacity
              key={tx.id}
              style={styles.row}
              activeOpacity={0.8}
            >
              {/* Left */}
              <View style={styles.left}>
                <View style={styles.iconBox}>
                  <Ionicons name={icon} size={18} color="#059669" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>
                    {(() => {
                      const parts = tx.name.split("/");
                      return parts.length >= 2
                        ? parts[1].trim()
                        : tx.name;
                    })()}
                  </Text>

                  <Text style={styles.meta} numberOfLines={1}>
                    {tx.category} • {tx.date}
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View style={styles.right}>
                <Text
                  style={[
                    styles.amount,
                    tx.type === "credit"
                      ? styles.credit
                      : styles.debit,
                  ]}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </Text>
                <Text style={styles.status}>Verified</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  viewAll: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },

  loaderWrap: {
    paddingVertical: 20,
    alignItems: "center",
  },

  empty: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    paddingVertical: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  meta: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  right: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 15,
    fontWeight: "800",
  },

  credit: {
    color: "#059669",
  },

  debit: {
    color: "#111827",
  },

  status: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 2,
  },
});
