import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ================= Types ================= */

interface FormData {
  name: string;
  amount: string;
  saved_amount: string;
  date: string;
  color: string;
  period: string;
}

interface BudgetGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: "budget" | "goal";
  item?: any | null;
  onSave: (data: FormData) => Promise<void>;
}

/* ================= Constants ================= */

const COLORS = [
  { label: "Primary", value: "#059669" },
  { label: "Blue", value: "#2563EB" },
  { label: "Emerald", value: "#10B981" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Rose", value: "#F43F5E" },
  { label: "Violet", value: "#7C3AED" },
  { label: "Cyan", value: "#06B6D4" },
  { label: "Orange", value: "#F97316" },
];

const BUDGET_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Rent/Mortgage",
  "Transportation",
  "Groceries",
  "Custom",
];

/* ================= Component ================= */

export function BudgetGoalForm({
  isOpen,
  onClose,
  type,
  item,
  onSave,
}: BudgetGoalFormProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    amount: "",
    saved_amount: "",
    date: "",
    color: "#059669",
    period: "monthly",
  });

  useEffect(() => {
    if (item) {
      if (type === "budget") {
        setFormData({
          name: item.name,
          amount: String(item.limit_amount),
          saved_amount: "",
          date: "",
          color: item.color || "#059669",
          period: item.period || "monthly",
        });
      } else {
        setFormData({
          name: item.name,
          amount: String(item.target_amount),
          saved_amount: String(item.saved_amount),
          date: item.target_date,
          color: item.color || "#059669",
          period: "monthly",
        });
      }
    } else {
      setFormData({
        name: "",
        amount: "",
        saved_amount: "",
        date: "",
        color: "#059669",
        period: "monthly",
      });
    }
  }, [item, type, isOpen]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setFormData({
      ...formData,
      name: cat === "Custom" ? "" : cat,
    });
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {item
                  ? `Edit ${type === "budget" ? "Budget" : "Goal"}`
                  : `Create New ${type === "budget" ? "Budget" : "Goal"}`}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Category / Name */}
            <Label text={type === "budget" ? "Category" : "Goal Name"} />

            {type === "budget" && !item && (
              <View style={styles.categoryGrid}>
                {BUDGET_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      formData.name === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => handleSelectCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        formData.name === cat &&
                          styles.categoryTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder={
                type === "budget"
                  ? "e.g. Food & Dining"
                  : "e.g. Dream Vacation"
              }
              value={formData.name}
              onChangeText={(v) =>
                setFormData({ ...formData, name: v })
              }
            />

            {/* Amount */}
            <Label
              text={
                type === "budget"
                  ? "Monthly Limit (₹)"
                  : "Target Amount (₹)"
              }
            />
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(v) =>
                setFormData({ ...formData, amount: v })
              }
            />

            {/* Goal Fields */}
            {type === "goal" && (
              <>
                <Label text="Currently Saved (₹)" />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={formData.saved_amount}
                  onChangeText={(v) =>
                    setFormData({ ...formData, saved_amount: v })
                  }
                />

                <Label text="Target Date (YYYY-MM-DD)" />
                <TextInput
                  style={styles.input}
                  placeholder="2026-12-31"
                  value={formData.date}
                  onChangeText={(v) =>
                    setFormData({ ...formData, date: v })
                  }
                />
              </>
            )}

            {/* Period */}
            {type === "budget" && (
              <>
                <Label text="Period" />
                <View style={styles.periodRow}>
                  {["weekly", "monthly", "yearly"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.periodChip,
                        formData.period === p &&
                          styles.periodChipActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, period: p })
                      }
                    >
                      <Text
                        style={[
                          styles.periodText,
                          formData.period === p &&
                            styles.periodTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Color */}
            <Label text="Color Theme" />
            <View style={styles.colorRow}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c.value },
                    formData.color === c.value &&
                      styles.colorActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, color: c.value })
                  }
                />
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="trending-up-outline"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.saveText}>
                      {item ? "Update" : "Create"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ================= Helpers ================= */

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    maxHeight: "90%",
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
    color: "#064E3B",
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 6,
    color: "#065F46",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  categoryTextActive: {
    color: "#059669",
    fontWeight: "800",
  },
  periodRow: {
    flexDirection: "row",
    gap: 8,
  },
  periodChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
  },
  periodChipActive: {
    backgroundColor: "#059669",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },
  periodTextActive: {
    color: "#FFFFFF",
  },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  colorActive: {
    borderWidth: 2,
    borderColor: "#064E3B",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  saveBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#059669",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },
});
