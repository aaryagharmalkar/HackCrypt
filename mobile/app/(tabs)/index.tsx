import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

// RN components you already have
import  OverviewCard  from "@/components/OverviewCard";
import { RecentTransactions } from "@/components/RecentTransactions";
import { SavingsGoal } from "@/components/SavingsGoal";
import FinancialHealthSpeedometer from "@/components/FinancialHealthSpeedometer";
// import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type CategoryItem = {
  name: string;
  val: number;
  color: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    netWorth: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [healthData, setHealthData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<CategoryItem[]>([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(" ")[0]);
      } else if (user.email) {
        setUserName(user.email.split("@")[0]);
      }

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, type, category")
        .eq("user_id", user.id);

      let income = 0;
      let expenses = 0;
      const categoryTotals: Record<string, number> = {};

      transactions?.forEach((tx: any) => {
        const amount = Number(tx.amount);
        if (tx.type === "credit") {
          income += amount;
        } else {
          expenses += amount;
          const cat = tx.category || "Other";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
        }
      });

      const colors = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#06B6D4",
        "#8B5CF6",
      ];

      const formatted = Object.entries(categoryTotals)
        .map(([name, total], i) => ({
          name,
          val: expenses ? Math.round((total / expenses) * 100) : 0,
          color: colors[i % colors.length],
        }))
        .sort((a, b) => b.val - a.val);

      setCategoryData(formatted);

      setStats({
        netWorth: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
      });

      const { data: health } = await supabase
        .from("financial_health_scores")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setHealthData(health || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
  <View style={styles.headerText}>
    <Text style={styles.title}>Financial Overview</Text>
    <Text style={styles.subtitle}>Welcome back, {userName}!</Text>
    <Text style={styles.subSubtitle}>Here’s what’s happening today.</Text>
  </View>

  <View style={styles.headerIcons}>
    <Ionicons name="calendar-outline" size={18} color="#64748B" />
    <Ionicons name="notifications-outline" size={20} color="#0F172A" />
  </View>
</View>


      {/* Overview Cards */}
      {loading ? (
        <ActivityIndicator size="large" color="#3B82F6" />
      ) : (
        <View style={styles.overviewRow}>
  <OverviewCard
    title="Total Net Change"
    amount={formatCurrency(stats.netWorth)}
    trend={stats.netWorth >= 0 ? "up" : "down"}
    icon="wallet-outline"
  />

  <OverviewCard
    title="Total Credited"
    amount={formatCurrency(stats.totalIncome)}
    trend="up"
    icon="arrow-up-circle-outline"
    variant="primary"
  />

  <OverviewCard
    title="Total Debited"
    amount={formatCurrency(stats.totalExpenses)}
    trend="down"
    icon="arrow-down-circle-outline"
    variant="accent"
  />
</View>

      )}

      <View>
  <Text style={styles.sectionTitle}>Financial Health</Text>

  <View style={styles.sectionCard}>
    <FinancialHealthSpeedometer
      score={healthData?.financial_health_score ?? 0}
    />

    {[
      { label: "Spending", val: healthData?.spending_score },
      { label: "Savings", val: healthData?.savings_score },
      { label: "Credit", val: healthData?.credit_score },
      { label: "EMI", val: healthData?.emi_score },
      { label: "Emergency", val: healthData?.emergency_score },
    ].map(
      (item) =>
        item.val !== undefined && (
          <View key={item.label} style={styles.healthRow}>
            <Text style={styles.healthLabel}>{item.label}</Text>

            <View style={styles.healthTrack}>
              <View
                style={[
                  styles.healthFill,
                  { width: `${item.val}%` },
                ]}
              />
            </View>

            <Text style={styles.healthScore}>{item.val}</Text>
          </View>
        )
    )}
  </View>
</View>


      {/* Spending by Category */}
<Card>
  <View style={styles.cardInner}>
    {/* Title */}
    <Text style={styles.cardTitle}>Spending by Category</Text>

    {/* Category grid */}
    <View style={styles.categoryRow}>
      {categoryData.slice(0, 4).map((item) => (
        <View key={item.name} style={styles.categoryItem}>
          <Text style={styles.categoryLabel} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.categoryValue}>
            <Text style={styles.categoryPercent}>{item.val}%</Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: item.color },
              ]}
            />
          </View>
        </View>
      ))}
    </View>

    {/* Progress bar */}
    <View style={styles.progressBarWrap}>
      <View style={styles.progressBar}>
        {categoryData.map((item, i) => (
          <View
            key={i}
            style={{
              width: `${item.val}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </View>
    </View>
  </View>
</Card>



      {/* Transactions */}
      <RecentTransactions />

      {/* Right column cards */}
      <SavingsGoal />
    </ScrollView>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },

  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 12,
    marginLeft: -130,
  },

  overviewGrid: {
    gap: 12,
    marginBottom: 20,
  },

  cardInner: {
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 18,
},


  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 12,
  },

  categoryItem: {
    width: "45%",
  },

  categoryLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  categoryValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  categoryPercent: {
    fontSize: 18,
    fontWeight: "800",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  overviewRow: {
  flexDirection: "row",
  gap: 12,
},


  progressBar: {
    height: 8,
    flexDirection: "row",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },

  progressBarWrap: {
  marginTop: 6, // 👈 subtle separation
},


  healthRow: {
    marginTop: 12,
  },

  healthLabel: {
    fontSize: 13,
    fontWeight: "700",
  },

  healthTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginVertical: 6,
  },

  healthFill: {
    height: "100%",
    backgroundColor: "#10B981",
  },

  healthScore: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },

  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 20,
  },
  cardTitle: {
  fontSize: 16,
  fontWeight: "800",
  color: "#0F172A",
  marginBottom: 12,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: "800",
  color: "#0F172A",
  marginBottom: 12,
},

sectionCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 16,
  elevation: 3,
},

headerText: {
  flex: 1,            // ⭐ prevents icon overflow
  paddingRight: 12,   // spacing from icons
},

subSubtitle: {
  fontSize: 13,
  color: "#94A3B8",
  marginTop: 2,
},



});
