import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

/* ================= Types ================= */

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: "monthly" | "weekly" | "yearly";
}

interface IncomeCalculatorProps {
  onIncomeChange?: (monthlyIncome: number) => void;
}

/* ================= Component ================= */

export function IncomeCalculator({ onIncomeChange }: IncomeCalculatorProps) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newSource, setNewSource] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as "monthly" | "weekly" | "yearly",
  });

  useEffect(() => {
    fetchIncomeSources();
  }, []);

  useEffect(() => {
    if (onIncomeChange) {
      onIncomeChange(calculateMonthlyIncome());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeSources]);

  /* ================= Data ================= */

  const fetchIncomeSources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("income_sources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setIncomeSources(data || []);
    } catch (e) {
      console.error("Error fetching income sources:", e);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyIncome = () => {
    return incomeSources.reduce((total, src) => {
      let monthly = src.amount;
      if (src.frequency === "weekly") monthly = src.amount * 4.33;
      if (src.frequency === "yearly") monthly = src.amount / 12;
      return total + monthly;
    }, 0);
  };

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.amount) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("income_sources")
        .insert({
          user_id: user.id,
          name: newSource.name,
          amount: parseFloat(newSource.amount),
          frequency: newSource.frequency,
        })
        .select()
        .single();

      if (error) throw error;

      setIncomeSources([...incomeSources, data]);
      setNewSource({ name: "", amount: "", frequency: "monthly" });
      setAdding(false);
    } catch (e) {
      console.error("Error adding income source:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("income_sources")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setIncomeSources(incomeSources.filter((s) => s.id !== id));
    } catch (e) {
      console.error("Error deleting income source:", e);
    }
  };

  const monthlyIncome = calculateMonthlyIncome();

  /* ================= UI ================= */

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTitle}>
            <Ionicons name="cash-outline" size={20} color="#059669" />
            <Text style={styles.title}>Monthly Income</Text>
          </View>
          <Text style={styles.subtitle}>
            Track all your income sources
          </Text>
        </View>

        {!adding && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setAdding(true)}
          >
            <Ionicons name="add" size={16} color="#059669" />
            <Text style={styles.addText}>Add Source</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#059669" />
        </View>
      ) : (
        <>
          {/* Total Income */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>
              Total Monthly Income
            </Text>
            <Text style={styles.totalValue}>
              ₹{Math.round(monthlyIncome).toLocaleString()}
            </Text>
            <Text style={styles.totalSub}>
              ₹{Math.round(monthlyIncome * 12).toLocaleString()}
              /year
            </Text>
          </View>

          {/* Sources */}
          <View style={{ marginTop: 12 }}>
            {incomeSources.map((src) => {
              const monthly =
                src.frequency === "weekly"
                  ? src.amount * 4.33
                  : src.frequency === "yearly"
                  ? src.amount / 12
                  : src.amount;

              return (
                <View key={src.id} style={styles.sourceRow}>
                  <View style={styles.sourceLeft}>
                    <View style={styles.sourceIcon}>
                      <Ionicons
                        name="briefcase-outline"
                        size={16}
                        color="#059669"
                      />
                    </View>
                    <View>
                      <Text style={styles.sourceName}>
                        {src.name}
                      </Text>
                      <Text style={styles.sourceMeta}>
                        ₹{src.amount.toLocaleString()}/{src.frequency}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sourceRight}>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.sourceMonthly}>
                        ₹{Math.round(monthly).toLocaleString()}
                      </Text>
                      <Text style={styles.sourceSmall}>
                        per month
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleDelete(src.id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Add Form */}
            {adding && (
              <View style={styles.addForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Income source name"
                  value={newSource.name}
                  onChangeText={(v) =>
                    setNewSource({ ...newSource, name: v })
                  }
                />

                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                    placeholder="Amount"
                    value={newSource.amount}
                    onChangeText={(v) =>
                      setNewSource({ ...newSource, amount: v })
                    }
                  />

                  <View style={styles.freqRow}>
                    {["monthly", "weekly", "yearly"].map((f) => (
                      <TouchableOpacity
                        key={f}
                        style={[
                          styles.freqChip,
                          newSource.frequency === f &&
                            styles.freqChipActive,
                        ]}
                        onPress={() =>
                          setNewSource({
                            ...newSource,
                            frequency: f as any,
                          })
                        }
                      >
                        <Text
                          style={[
                            styles.freqText,
                            newSource.frequency === f &&
                              styles.freqTextActive,
                          ]}
                        >
                          {f}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleAddSource}
                  >
                    <Text style={styles.saveText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setAdding(false);
                      setNewSource({
                        name: "",
                        amount: "",
                        frequency: "monthly",
                      });
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {incomeSources.length === 0 && !adding && (
              <Text style={styles.emptyText}>
                No income sources added yet
              </Text>
            )}
          </View>

          {/* Allocation */}
          {incomeSources.length > 0 && (
            <View style={styles.alloc}>
              <Text style={styles.allocTitle}>
                Recommended Allocation (50 / 30 / 20)
              </Text>

              <View style={styles.allocRow}>
                <AllocCard
                  label="NEEDS (50%)"
                  value={monthlyIncome * 0.5}
                  color="#2563EB"
                />
                <AllocCard
                  label="WANTS (30%)"
                  value={monthlyIncome * 0.3}
                  color="#7C3AED"
                />
                <AllocCard
                  label="SAVINGS (20%)"
                  value={monthlyIncome * 0.2}
                  color="#059669"
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

/* ================= Helpers ================= */

function AllocCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[styles.allocCard, { backgroundColor: `${color}20` }]}>
      <Text style={styles.allocLabel}>{label}</Text>
      <Text style={[styles.allocValue, { color }]}>
        ₹{Math.round(value).toLocaleString()}
      </Text>
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#064E3B",
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  loader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  totalCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#059669",
  },
  totalSub: {
    fontSize: 11,
    color: "#6B7280",
  },
  sourceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    marginBottom: 8,
  },
  sourceLeft: {
    flexDirection: "row",
    gap: 10,
  },
  sourceIcon: {
    padding: 8,
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
  },
  sourceName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#064E3B",
  },
  sourceMeta: {
    fontSize: 11,
    color: "#6B7280",
  },
  sourceRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  sourceMonthly: {
    fontSize: 13,
    fontWeight: "800",
    color: "#064E3B",
  },
  sourceSmall: {
    fontSize: 10,
    color: "#6B7280",
  },
  deleteBtn: {
    padding: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  addForm: {
    padding: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A7F3D0",
    borderRadius: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
  },
  formRow: {
    gap: 8,
  },
  freqRow: {
    flexDirection: "row",
    gap: 6,
  },
  freqChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
  },
  freqChipActive: {
    backgroundColor: "#059669",
  },
  freqText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  freqTextActive: {
    color: "#FFFFFF",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelText: {
    fontWeight: "700",
    color: "#374151",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    paddingVertical: 12,
  },
  alloc: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  allocTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  allocRow: {
    flexDirection: "row",
    gap: 6,
  },
  allocCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
  },
  allocLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#6B7280",
  },
  allocValue: {
    fontSize: 13,
    fontWeight: "900",
  },
});
