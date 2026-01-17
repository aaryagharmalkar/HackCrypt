import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

import { BudgetCard } from "@/components/BudgetCard";
import { GoalCard } from "@/components/GoalCard";
import { BudgetGoalForm } from "@/components/BudgetGoalForm";
import { IncomeCalculator } from "@/components/IncomeCalculator";
import { StrategySelector } from "@/components/StratergySelector";
import { InsightsModal } from "@/components/InsightsModal";

/* ================= Types ================= */

interface BudgetWithSpent {
  id: string;
  name: string;
  limit_amount: number;
  spent: number;
  color: string;
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string;
  color: string;
}

interface InsightData {
  topCategory: string;
  topAmount: number;
  totalDiff: number;
  biggestSpike: string;
  savingPotential: number;
  overspending?: {
    category: string;
    percentHigher: number;
  };
}

/* ================= Screen ================= */

export default function BudgetingScreen() {
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"budget" | "goal">("budget");
  const [editingItem, setEditingItem] = useState<any>(null);

  const [strategyOpen, setStrategyOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const [insights, setInsights] = useState<InsightData | null>(null);

  /* ================= Fetch ================= */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: budgetsData } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id);

      const { data: goalsData } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id);

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, category, date")
        .eq("user_id", user.id)
        .gte("date", ninetyDaysAgo.toISOString());

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const processedBudgets = (budgetsData || []).map((b: any) => {
        const spent =
          transactions
            ?.filter((t: any) => {
              const d = new Date(t.date);
              return (
                d.getMonth() === currentMonth &&
                d.getFullYear() === currentYear &&
                t.category?.toLowerCase().includes(b.name.toLowerCase())
              );
            })
            .reduce((a: number, c: any) => a + Math.abs(c.amount), 0) || 0;

        return { ...b, spent };
      });

      setBudgets(processedBudgets);
      setGoals(goalsData || []);
      processInsights(transactions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Insights ================= */

  const processInsights = (tx: any[]) => {
    const catTotals: Record<string, number> = {};
    tx.forEach((t) => {
      const c = t.category || "Other";
      catTotals[c] = (catTotals[c] || 0) + Math.abs(t.amount);
    });

    const top = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    setInsights({
      topCategory: top?.[0] || "None",
      topAmount: top?.[1] || 0,
      totalDiff: 0,
      biggestSpike: top?.[0] || "None",
      savingPotential: Math.round((top?.[1] || 0) * 0.1),
    });
  };

  /* ================= Actions ================= */

  const openForm = (type: "budget" | "goal", item?: any) => {
    setFormType(type);
    setEditingItem(item || null);
    setFormOpen(true);
  };

  const deleteItem = async (id: string, type: "budget" | "goal") => {
    Alert.alert(
      "Confirm Delete",
      `Delete this ${type}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await supabase.from(type === "budget" ? "budgets" : "goals").delete().eq("id", id);
            fetchData();
          },
        },
      ]
    );
  };

  /* ================= Render ================= */

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budgets & Goals</Text>
        <Text style={styles.subtitle}>
          Plan your financial future
        </Text>

        <View style={styles.headerActions}>
          <ActionButton icon="bulb-outline" label="Insights" onPress={() => setInsightsOpen(true)} />
          <ActionButton icon="flash-outline" label="Strategies" onPress={() => setStrategyOpen(true)} />
          <ActionButton icon="add" label="New Budget" primary onPress={() => openForm("budget")} />
        </View>
      </View>

      {/* Budgets */}
      <Section title="Monthly Budgets">
        {loading ? (
          <Text style={styles.muted}>Loading…</Text>
        ) : budgets.length === 0 ? (
          <Text style={styles.muted}>No budgets yet</Text>
        ) : (
          budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={() => openForm("budget", b)}
              onDelete={() => deleteItem(b.id, "budget")}
            />
          ))
        )}
      </Section>

      {/* Goals */}
      <Section title="Goals">
        {goals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            onEdit={() => openForm("goal", g)}
            onDelete={() => deleteItem(g.id, "goal")}
          />
        ))}
      </Section>

      {/* Income */}
      <IncomeCalculator onIncomeChange={setMonthlyIncome} />

      {/* Modals */}
      <BudgetGoalForm
        isOpen={formOpen}
        type={formType}
        item={editingItem}
        onClose={() => setFormOpen(false)}
        onSave={fetchData}
      />

      <StrategySelector
        isOpen={strategyOpen}
        onClose={() => setStrategyOpen(false)}
        onSelectStrategy={() => {
          setStrategyOpen(false);
          setFormOpen(true);
        }}
        monthlyIncome={monthlyIncome}
      />

      <InsightsModal
        isOpen={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        insights={insights}
      />
    </ScrollView>
  );
}

/* ================= Helpers ================= */

function Section({ title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ActionButton({ icon, label, onPress, primary }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.actionBtn,
        primary && styles.primaryBtn,
      ]}
    >
      <Ionicons name={icon} size={16} color={primary ? "#fff" : "#064E3B"} />
      <Text style={[styles.actionText, primary && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#064E3B",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
  },
  primaryBtn: {
    backgroundColor: "#059669",
  },
  actionText: {
    fontWeight: "700",
    color: "#064E3B",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    color: "#064E3B",
  },
  muted: {
    color: "#9CA3AF",
  },
});
