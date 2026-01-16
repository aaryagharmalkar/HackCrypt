import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

/* -------------------- SCREEN -------------------- */

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  const [stats, setStats] = useState({
    netWorth: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Username logic (same as web)
      if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(" ")[0]);
      } else if (user.email) {
        setUserName(user.email.split("@")[0]);
      }

      // Fetch transactions
      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", user.id);

      if (error) throw error;

      let income = 0;
      let expenses = 0;

      transactions?.forEach((tx) => {
        const amt = Number(tx.amount);
        if (tx.type === "credit") income += amt;
        if (tx.type === "debit") expenses += amt;
      });

      setStats({
        netWorth: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Needed because Drawer keeps screens mounted
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const formatCurrency = (n: number) =>
    `₹${n.toLocaleString("en-IN")}`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Financial Overview</Text>
          <Text style={styles.subtitle}>
            Welcome back, {userName}! Here's what's happening today.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} />
            <View style={styles.dot} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview Cards */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 40 }} />
      ) : (
        <View style={styles.cardsRow}>
          <OverviewCard
            title="Total Net Worth"
            amount={formatCurrency(stats.netWorth)}
            change=""
            icon="wallet-outline"
          />
          <OverviewCard
            title="Total Income"
            amount={formatCurrency(stats.totalIncome)}
            change=""
            icon="arrow-up-circle-outline"
          />
          <OverviewCard
            title="Total Expenses"
            amount={formatCurrency(stats.totalExpenses)}
            change=""
            icon="arrow-down-circle-outline"
          />
        </View>
      )}

      {/* Spending by Category (static for now) */}
      <Card title="Spending by Category">
        {[
          { name: "Shopping", val: 35 },
          { name: "Food", val: 25 },
          { name: "Rent", val: 20 },
          { name: "Travel", val: 15 },
        ].map((item) => (
          <View key={item.name} style={styles.categoryRow}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryVal}>{item.val}%</Text>
          </View>
        ))}

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "35%", backgroundColor: "#059669" }]} />
          <View style={[styles.progress, { width: "25%", backgroundColor: "#22C55E" }]} />
          <View style={[styles.progress, { width: "20%", backgroundColor: "#F59E0B" }]} />
          <View style={[styles.progress, { width: "15%", backgroundColor: "#94A3B8" }]} />
        </View>
      </Card>

      {/* Insights */}
      <Card title="Financial Insights">
        <Insight
          icon="trending-up-outline"
          title="Smart Move!"
          text="You saved ₹12,000 more than last month by reducing dining expenses."
        />
        <Insight
          icon="alert-circle-outline"
          title="Budget Alert"
          text="You've reached 85% of your entertainment budget."
        />
      </Card>
    </ScrollView>
  );
}

/* -------------------- COMPONENTS -------------------- */

function OverviewCard({
  title,
  amount,
  change,
  icon,
}: {
  title: string;
  amount: string;
  change: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.overviewCard}>
      <Ionicons name={icon} size={24} color="#059669" />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardAmount}>{amount}</Text>
      {change ? <Text style={styles.cardChange}>{change}</Text> : null}
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>{title}</Text>
      {children}
    </View>
  );
}

function Insight({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.insight}>
      <Ionicons name={icon} size={22} color="#059669" />
      <View>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightText}>{text}</Text>
      </View>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { marginTop: 4, color: "#6B7280" },

  headerActions: { flexDirection: "row", marginTop: 16, gap: 12 },
  iconBtn: { padding: 10, borderRadius: 12, backgroundColor: "#F3F4F6" },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
    position: "absolute",
    top: 6,
    right: 6,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },

  cardsRow: { flexDirection: "row", marginBottom: 24 },
  overviewCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 4,
  },

  cardTitle: { fontSize: 12, color: "#6B7280", marginTop: 6 },
  cardAmount: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  cardChange: { fontSize: 12, color: "#22C55E", marginTop: 2 },

  card: { backgroundColor: "#F9FAFB", borderRadius: 16, padding: 16, marginBottom: 24 },
  cardHeader: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  categoryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  categoryName: { color: "#6B7280" },
  categoryVal: { fontWeight: "700" },

  progressBar: { flexDirection: "row", height: 10, borderRadius: 6, overflow: "hidden", marginTop: 12 },
  progress: { height: "100%" },

  insight: { flexDirection: "row", gap: 12, marginBottom: 12 },
  insightTitle: { fontWeight: "700" },
  insightText: { fontSize: 12, color: "#6B7280", marginTop: 2 },
});
