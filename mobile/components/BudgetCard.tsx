import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BudgetCardProps {
  budget: {
    id: string;
    name: string;
    limit_amount: number;
    spent: number;
    color?: string; // optional, handled via logic
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentage = Math.min(
    (budget.spent / budget.limit_amount) * 100,
    100
  );

  const isNearLimit = percentage > 85 && percentage < 100;
  const isOverLimit = percentage >= 100;

  const remaining = Math.max(
    budget.limit_amount - budget.spent,
    0
  );

  return (
    <View style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{budget.name}</Text>

          {isOverLimit && (
            <View style={[styles.badge, styles.badgeDanger]}>
              <Text style={styles.badgeText}>Over Limit!</Text>
            </View>
          )}

          {!isOverLimit && isNearLimit && (
            <View style={[styles.badge, styles.badgeWarning]}>
              <Text style={styles.badgeText}>Near Limit</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Text style={styles.amountText}>
            ₹{budget.spent.toLocaleString()} /{" "}
            <Text style={styles.amountStrong}>
              ₹{budget.limit_amount.toLocaleString()}
            </Text>
          </Text>

          <View style={styles.iconActions}>
            <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
              <Ionicons name="pencil-outline" size={14} color="#065F46" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              style={[styles.iconBtn, styles.deleteBtn]}
            >
              <Ionicons name="trash-outline" size={14} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== Progress Bar ===== */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            isOverLimit && styles.progressOver,
            !isOverLimit && styles.progressNormal,
            { width: `${percentage}%` },
          ]}
        />
      </View>

      {/* ===== Footer ===== */}
      {percentage > 0 && (
        <Text style={styles.footerText}>
          {percentage.toFixed(1)}% used • ₹
          {remaining.toLocaleString()} remaining
        </Text>
      )}
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  /* Header */
  header: {
    marginBottom: 10,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#064E3B",
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  badgeDanger: {
    backgroundColor: "#DC2626",
  },

  badgeWarning: {
    backgroundColor: "#F59E0B",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  amountText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#065F46",
  },

  amountStrong: {
    color: "#064E3B",
    fontWeight: "800",
  },

  iconActions: {
    flexDirection: "row",
    gap: 6,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
  },

  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },

  /* Progress */
  progressTrack: {
    height: 8,
    backgroundColor: "#D1FAE5",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 6,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  progressNormal: {
    backgroundColor: "#059669",
  },

  progressOver: {
    backgroundColor: "#DC2626",
  },

  /* Footer */
  footerText: {
    fontSize: 10,
    color: "#065F46",
    fontWeight: "600",
  },
});
