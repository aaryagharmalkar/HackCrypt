import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Asset = {
  name: string;
  type: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

const ASSETS: Asset[] = [
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
        <Text style={styles.title}>Investment Portfolio</Text>
        <Text style={styles.subtitle}>
          Manage and grow your wealth with insights
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.outlineBtn}>
            <Ionicons name="pie-chart-outline" size={16} />
            <Text style={styles.outlineText}>Allocation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.primaryText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Portfolio Summary */}
      <View style={styles.summaryCard}>
        <Ionicons name="briefcase-outline" size={36} color="#fff" />
        <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
        <Text style={styles.summaryValue}>₹9,35,400</Text>

        <View style={styles.summaryChange}>
          <Ionicons name="trending-up-outline" size={14} />
          <Text style={styles.summaryChangeText}>
            +₹1,12,000 (13.6%)
          </Text>
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.row}>
        <MiniCard
          title="Best Asset"
          value="Bitcoin"
          sub="+45.2%"
          icon="trending-up-outline"
        />
        <MiniCard
          title="Projected Return"
          value="₹1,45,000"
          sub="15.5% CAGR"
          icon="bar-chart-outline"
        />
      </View>

      {/* Assets */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Individual Assets</Text>

        {ASSETS.map((a) => (
          <View key={a.name} style={styles.assetRow}>
            <View style={styles.assetLeft}>
              <View style={styles.assetIcon}>
                <Ionicons
                  name={
                    a.type === "Crypto"
                      ? "globe-outline"
                      : a.type === "Stock"
                      ? "analytics-outline"
                      : "layers-outline"
                  }
                  size={18}
                />
              </View>
              <View>
                <Text style={styles.assetName}>{a.name}</Text>
                <Text style={styles.assetType}>{a.type}</Text>
              </View>
            </View>

            <View style={styles.assetRight}>
              <Text style={styles.assetValue}>{a.value}</Text>
              <View style={styles.assetChange}>
                <Ionicons
                  name={
                    a.trend === "up"
                      ? "trending-up-outline"
                      : "trending-down-outline"
                  }
                  size={12}
                  color={a.trend === "up" ? "#22C55E" : "#EF4444"}
                />
                <Text
                  style={[
                    styles.assetChangeText,
                    { color: a.trend === "up" ? "#22C55E" : "#EF4444" },
                  ]}
                >
                  {a.change}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Diversification */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Portfolio Diversification</Text>

        {[
          { name: "Stocks", val: 45 },
          { name: "Mutual Funds", val: 30 },
          { name: "Crypto", val: 15 },
          { name: "Gold / Cash", val: 10 },
        ].map((d) => (
          <View key={d.name} style={{ marginBottom: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.small}>{d.name}</Text>
              <Text style={styles.small}>{d.val}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[styles.progress, { width: `${d.val}%` }]}
              />
            </View>
          </View>
        ))}

        <View style={styles.tip}>
          <Text style={styles.tipText}>
            Your portfolio is equity-heavy. Consider adding Gold or
            Bonds to reduce volatility.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function MiniCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.miniCard}>
      <Ionicons name={icon} size={20} />
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniSub}>{sub}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#6B7280", marginTop: 4 },

  headerActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  outlineText: { fontWeight: "600" },

  primaryBtn: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#059669",
  },
  primaryText: { color: "#fff", fontWeight: "600" },

  summaryCard: {
    backgroundColor: "#059669",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryLabel: { color: "#E0E7FF", marginTop: 6 },
  summaryValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginVertical: 6,
  },
  summaryChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  summaryChangeText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  row: { flexDirection: "row", gap: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  miniCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  miniTitle: { fontSize: 12, color: "#6B7280", marginTop: 6 },
  miniValue: { fontWeight: "700", marginTop: 4 },
  miniSub: { fontSize: 12, color: "#22C55E", marginTop: 2 },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  assetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  assetLeft: { flexDirection: "row", gap: 12 },
  assetIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  assetName: { fontWeight: "700" },
  assetType: { fontSize: 12, color: "#6B7280" },

  assetRight: { alignItems: "flex-end" },
  assetValue: { fontWeight: "700" },
  assetChange: { flexDirection: "row", gap: 4, marginTop: 2 },
  assetChangeText: { fontSize: 12, fontWeight: "700" },

  progressBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginTop: 4,
  },
  progress: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 4,
  },

  small: { fontSize: 12, fontWeight: "600" },

  tip: {
    marginTop: 14,
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 12,
  },
  tipText: { fontSize: 12, color: "#059669", fontStyle: "italic" },
});
