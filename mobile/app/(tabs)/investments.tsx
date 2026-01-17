import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const assets = [
  {
    name: "Global Equity Fund",
    type: "Mutual Fund",
    value: "₹4,50,000",
    change: "+12.4%",
    trend: "up",
  },
  {
    name: "Reliance Industries",
    type: "Stock",
    value: "₹2,15,400",
    change: "-2.1%",
    trend: "down",
  },
  {
    name: "Bitcoin",
    type: "Crypto",
    value: "₹1,85,000",
    change: "+45.2%",
    trend: "up",
  },
  {
    name: "Digital Gold",
    type: "Commodity",
    value: "₹85,000",
    change: "+0.8%",
    trend: "up",
  },
];

export default function InvestmentsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Investment Portfolio</Text>
          <Text style={styles.subtitle}>
            Manage and grow your wealth with data-driven insights.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <ActionButton icon="pie-chart-outline" label="Allocation" />
          <ActionButton icon="add" label="Add" primary />
        </View>
      </View>

      {/* Portfolio Overview */}
      <View style={styles.overviewGrid}>
        <View style={[styles.card, styles.primaryCard]}>
          <Text style={styles.cardLabel}>Total Portfolio Value</Text>
          <Text style={styles.primaryValue}>₹9,35,400</Text>
          <View style={styles.gainBadge}>
            <Ionicons name="trending-up" size={14} color="#4ade80" />
            <Text style={styles.gainText}>+₹1,12,000 (13.6%)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Best Performing Asset</Text>
          <Text style={styles.cardValue}>Bitcoin</Text>
          <Text style={styles.positive}>+45.2% Overall</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Projected Annual Return</Text>
          <Text style={styles.cardValue}>₹1,45,000</Text>
          <Text style={styles.positive}>15.5% CAGR</Text>
        </View>
      </View>

      {/* Assets List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Individual Assets</Text>

        {assets.map((asset) => (
          <TouchableOpacity key={asset.name} style={styles.assetRow}>
            <View style={styles.assetLeft}>
              <View style={styles.assetIcon}>
                <MaterialCommunityIcons
                  name={
                    asset.type === "Mutual Fund"
                      ? "layers-outline"
                      : asset.type === "Stock"
                      ? "chart-line"
                      : asset.type === "Crypto"
                      ? "bitcoin"
                      : "gold"
                  }
                  size={20}
                  color="#6366f1"
                />
              </View>
              <View>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetType}>{asset.type} • Verified</Text>
              </View>
            </View>

            <View style={styles.assetRight}>
              <Text style={styles.assetValue}>{asset.value}</Text>
              <Text
                style={[
                  styles.assetChange,
                  asset.trend === "up"
                    ? styles.positive
                    : styles.negative,
                ]}
              >
                {asset.change}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Analytics */}
      <View style={[styles.card, styles.analyticsCard]}>
        <Text style={styles.analyticsTitle}>Portfolio Analytics</Text>

        {[
          { name: "Stocks", val: 45 },
          { name: "Mutual Funds", val: 30 },
          { name: "Crypto", val: 15 },
          { name: "Golds/Cash", val: 10 },
        ].map((item) => (
          <View key={item.name} style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{item.name}</Text>
              <Text style={styles.progressValue}>{item.val}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.val}%` }]} />
            </View>
          </View>
        ))}

        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>
            “Your portfolio is heavily weighted in Equity. Consider rebalancing
            into Bonds or Gold for lower volatility.”
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------------- Components ---------------- */

function ActionButton({
  icon,
  label,
  primary,
}: {
  icon: any;
  label: string;
  primary?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, primary && styles.primaryButton]}
    >
      <Ionicons name={icon} size={16} color={primary ? "#fff" : "#111"} />
      <Text style={[styles.actionText, primary && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- Styles ---------------- */



export const styles = StyleSheet.create({
  /* ================= Root ================= */
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0FDF4", // emerald-50
  },

  /* ================= Header ================= */
  header: {
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#064E3B", // emerald-900
  },
  subtitle: {
    color: "#065F46", // emerald-800
    marginTop: 4,
    fontSize: 13,
  },

  /* ================= Buttons ================= */
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A7F3D0", // emerald-200
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    backgroundColor: "#059669", // 🔥 primary
    borderColor: "#059669",
  },
  actionText: {
    fontWeight: "600",
    color: "#065F46",
    fontSize: 13,
  },

  /* ================= Overview ================= */
  overviewGrid: {
    gap: 16,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#064E3B",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  primaryCard: {
    backgroundColor: "#059669",
  },

  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D1FAE5",
  },

  primaryValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginVertical: 10,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
    color: "#064E3B",
  },

  gainBadge: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  gainText: {
    color: "#ECFDF5",
    fontWeight: "700",
    fontSize: 12,
  },

  /* ================= Text States ================= */
  positive: {
    color: "#059669",
    fontWeight: "700",
    marginTop: 4,
  },

  negative: {
    color: "#DC2626",
    fontWeight: "700",
    marginTop: 4,
  },

  /* ================= Sections ================= */
  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 12,
  },

  /* ================= Assets ================= */
  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#D1FAE5",
  },

  assetLeft: {
    flexDirection: "row",
    gap: 12,
  },

  assetIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  assetName: {
    fontWeight: "700",
    color: "#064E3B",
  },

  assetType: {
    fontSize: 12,
    color: "#065F46",
    marginTop: 2,
  },

  assetRight: {
    alignItems: "flex-end",
  },

  assetValue: {
    fontWeight: "700",
    color: "#064E3B",
  },

  assetChange: {
    fontSize: 12,
  },

  /* ================= Analytics ================= */
  analyticsCard: {
    backgroundColor: "#022C22", // deep emerald dark
    borderRadius: 26,
    padding: 20,
  },

  analyticsTitle: {
    color: "#ECFDF5",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  progressBlock: {
    marginBottom: 14,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  progressLabel: {
    color: "#A7F3D0",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "700",
  },

  progressValue: {
    color: "#ECFDF5",
    fontSize: 12,
    fontWeight: "700",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#064E3B",
    borderRadius: 6,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#34D399",
    borderRadius: 6,
  },

  /* ================= Advice ================= */
  adviceBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(16,185,129,0.15)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.35)",
  },

  adviceText: {
    color: "#D1FAE5",
    fontStyle: "italic",
    fontSize: 12,
    lineHeight: 18,
  },
});
