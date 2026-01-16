import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

type Budget = {
  id: string;
  name: string;
  limit_amount: number;
  spent?: number;
  color: string;
};

const GOALS = [
  { name: "Emergency Fund", saved: 150000, target: 500000 },
  { name: "Dream House", saved: 650000, target: 10000000 },
  { name: "New Car", saved: 250000, target: 1500000 },
];

export default function BudgetingScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: budgetsData } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .select("amount, category")
        .eq("user_id", user.id)
        .eq("type", "debit");

      const enriched =
        budgetsData?.map((b: any) => {
          const spent =
            tx
              ?.filter(
                (t: any) =>
                  t.category?.toLowerCase() === b.name.toLowerCase()
              )
              .reduce((a: number, c: any) => a + Math.abs(c.amount), 0) || 0;

          return { ...b, spent };
        }) || [];

      setBudgets(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    if (!name || !limit) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      name,
      limit_amount: Number(limit),
      user_id: user.id,
      color: "#059669",
    };

    if (editing) {
      await supabase.from("budgets").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("budgets").insert(payload);
    }

    setModalOpen(false);
    setEditing(null);
    setName("");
    setLimit("");
    fetchBudgets();
  };

  const deleteBudget = (id: string) => {
    Alert.alert("Delete Budget?", "This action cannot be undone.", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await supabase.from("budgets").delete().eq("id", id);
          fetchBudgets();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Budgets & Goals</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalOpen(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}>New Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Budgets */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        budgets.map((b) => {
          const pct = Math.min(
            ((b.spent || 0) / b.limit_amount) * 100,
            100
          );
          return (
            <View key={b.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.cardTitle}>{b.name}</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditing(b);
                      setName(b.name);
                      setLimit(String(b.limit_amount));
                      setModalOpen(true);
                    }}
                  >
                    <Ionicons name="pencil" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteBudget(b.id)}>
                    <Ionicons
                      name="trash"
                      size={16}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.amount}>
                ₹{b.spent} / ₹{b.limit_amount}
              </Text>

              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progress,
                    { width: `${pct}%` },
                  ]}
                />
              </View>
            </View>
          );
        })
      )}

      {/* Goals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Financial Goals</Text>
        {GOALS.map((g) => {
          const pct = (g.saved / g.target) * 100;
          return (
            <View key={g.name} style={{ marginTop: 12 }}>
              <View style={styles.row}>
                <Text>{g.name}</Text>
                <Text>{pct.toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progress,
                    { width: `${pct}%` },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Modal */}
      <Modal visible={modalOpen} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {editing ? "Edit Budget" : "New Budget"}
          </Text>

          <TextInput
            placeholder="Category name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Monthly limit"
            style={styles.input}
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={saveBudget}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalOpen(false)}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "700" },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#059669",
    padding: 10,
    borderRadius: 12,
    gap: 6,
  },
  addText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  amount: { marginTop: 6, color: "#6B7280" },

  progressBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 6,
  },

  modal: { flex: 1, padding: 20, justifyContent: "center" },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  cancel: {
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
  },
});
