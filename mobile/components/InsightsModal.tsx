import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ================= Types ================= */

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

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: InsightData | null;
}

/* ================= Component ================= */

export function InsightsModal({
  isOpen,
  onClose,
  insights,
}: InsightsModalProps) {
  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Monthly Financial Insights
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {!insights ? (
            <View style={styles.loader}>
              <ActivityIndicator color="#059669" />
            </View>
          ) : (
            <>
              {/* ===== Icon ===== */}
              <View style={styles.iconWrap}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="bulb-outline"
                    size={32}
                    color="#D97706"
                  />
                </View>
              </View>

              {/* ===== Top Spending ===== */}
              <View style={styles.centerBlock}>
                <Text style={styles.topTitle}>
                  Top Spending: {insights.topCategory}
                </Text>
                <Text style={styles.topDesc}>
                  You’ve spent{" "}
                  <Text style={styles.bold}>
                    ₹{insights.topAmount.toLocaleString()}
                  </Text>{" "}
                  on {insights.topCategory} this month.
                </Text>
              </View>

              {/* ===== Stats ===== */}
              <View style={styles.statsRow}>
                <StatCard
                  label="vs Last Month"
                  value={`₹${Math.abs(
                    insights.totalDiff
                  ).toLocaleString()}`}
                  negative={insights.totalDiff > 0}
                />
                <StatCard
                  label="Biggest Spike"
                  value={insights.biggestSpike}
                />
              </View>

              {/* ===== Recommendations ===== */}
              <View style={styles.recoWrap}>
                {insights.savingPotential > 0 && (
                  <RecoCard
                    icon="target-outline"
                    color="#059669"
                    title="Saving Opportunity"
                    text={`You could save an additional ₹${insights.savingPotential.toLocaleString()} by optimizing your spending patterns.`}
                  />
                )}

                {insights.overspending && (
                  <RecoCard
                    icon="alert-circle-outline"
                    color="#D97706"
                    title="Overspending Alert"
                    text={`You're spending ${insights.overspending.percentHigher}% more than usual on ${insights.overspending.category}.`}
                  />
                )}
              </View>

              {/* ===== Action ===== */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={onClose}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={16}
                  color="#FFFFFF"
                />
                <Text style={styles.actionText}>
                  Got it! Let’s improve
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ================= Sub Components ================= */

function StatCard({
  label,
  value,
  negative,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          negative ? styles.red : styles.green,
        ]}
      >
        {negative ? "+" : ""}
        {value}
      </Text>
    </View>
  );
}

function RecoCard({
  icon,
  title,
  text,
  color,
}: {
  icon: string;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <View
      style={[
        styles.recoCard,
        { backgroundColor: `${color}15`, borderColor: `${color}40` },
      ]}
    >
      <View
        style={[
          styles.recoIcon,
          { backgroundColor: `${color}30` },
        ]}
      >
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recoTitle}>{title}</Text>
        <Text style={styles.recoText}>{text}</Text>
      </View>
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#064E3B",
  },
  loader: {
    paddingVertical: 40,
    alignItems: "center",
  },
  iconWrap: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  centerBlock: {
    alignItems: "center",
    marginBottom: 16,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 4,
  },
  topDesc: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  bold: {
    fontWeight: "800",
    color: "#064E3B",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  green: {
    color: "#059669",
  },
  red: {
    color: "#DC2626",
  },
  recoWrap: {
    gap: 10,
    marginBottom: 16,
  },
  recoCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  recoIcon: {
    padding: 8,
    borderRadius: 10,
  },
  recoTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 2,
  },
  recoText: {
    fontSize: 12,
    color: "#374151",
  },
  actionBtn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
