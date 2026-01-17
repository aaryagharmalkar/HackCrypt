import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target_amount: number;
    saved_amount: number;
    target_date: string;
    color?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds?: () => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onAddFunds,
}: GoalCardProps) {
  const percentage = Math.min(
    (goal.saved_amount / goal.target_amount) * 100,
    100
  );

  const remaining = Math.max(
    goal.target_amount - goal.saved_amount,
    0
  );

  const isComplete = percentage >= 100;

  // Date calculations
  const targetDate = new Date(goal.target_date);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (targetDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const monthsRemaining = Math.max(
    Math.floor(daysRemaining / 30),
    0
  );

  const monthlyRequired =
    monthsRemaining > 0 ? remaining / monthsRemaining : remaining;

  return (
    <View style={styles.card}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{goal.name}</Text>

            {isComplete && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeText}>✓ Complete</Text>
              </View>
            )}
          </View>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={11}
              color="#6B7280"
            />
            <Text style={styles.dateText}>
              {goal.target_date}
            </Text>

            {!isComplete && daysRemaining > 0 && (
              <Text style={styles.monthsLeft}>
                • {monthsRemaining}mo left
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.percentText}>
            {percentage.toFixed(0)}%
          </Text>

          <View style={styles.iconActions}>
            <TouchableOpacity
              onPress={onEdit}
              style={styles.iconBtn}
            >
              <Ionicons
                name="pencil-outline"
                size={14}
                color="#065F46"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onDelete}
              style={[styles.iconBtn, styles.deleteBtn]}
            >
              <Ionicons
                name="close-outline"
                size={14}
                color="#DC2626"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== Progress ===== */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
            isComplete && styles.progressComplete,
          ]}
        />
      </View>

      {/* ===== Amounts ===== */}
      <View style={styles.amountRow}>
        <View>
          <Text style={styles.amountLabel}>Saved</Text>
          <Text style={styles.amountValue}>
            ₹{goal.saved_amount.toLocaleString()}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.amountLabel}>Target</Text>
          <Text style={styles.amountValue}>
            ₹{goal.target_amount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* ===== Monthly Required ===== */}
      {!isComplete && remaining > 0 && monthlyRequired > 0 && (
        <View style={styles.monthlyRow}>
          <Text style={styles.monthlyLabel}>
            Monthly target:
          </Text>
          <Text style={styles.monthlyValue}>
            ₹{Math.ceil(monthlyRequired).toLocaleString()}/mo
          </Text>
        </View>
      )}

      {/* ===== Add Funds ===== */}
      {!isComplete && onAddFunds && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddFunds}
        >
          <Ionicons
            name="trending-up-outline"
            size={14}
            color="#059669"
          />
          <Text style={styles.addButtonText}>
            Add Progress
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  headerLeft: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#064E3B",
  },

  completeBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },

  completeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#047857",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  dateText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "700",
  },

  monthsLeft: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
  },

  headerRight: {
    alignItems: "flex-end",
  },

  percentText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#059669",
    marginBottom: 4,
  },

  iconActions: {
    flexDirection: "row",
    gap: 6,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
  },

  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },

  /* Progress */
  progressTrack: {
    height: 10,
    backgroundColor: "#D1FAE5",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 14,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 999,
  },

  progressComplete: {
    backgroundColor: "#16A34A",
  },

  /* Amounts */
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  amountLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
  },

  amountValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#064E3B",
  },

  /* Monthly */
  monthlyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  monthlyLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  monthlyValue: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "800",
  },

  /* Add Button */
  addButton: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderStyle: "dashed",
    paddingVertical: 10,
    borderRadius: 12,
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#059669",
  },
});
