import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TaxScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tax Center</Text>
        <Text style={styles.subtitle}>
          Automatic tax calculation and saving insights
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.outlineBtn}>
            <Ionicons name="calculator-outline" size={16} />
            <Text style={styles.outlineText}>Calculator</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="document-text-outline" size={16} color="#fff" />
            <Text style={styles.primaryText}>Prepare ITR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tax Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          Estimated Tax (FY 2025–26)
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryValue}>₹48,500</Text>
          <Text style={styles.summaryStatus}>Payable</Text>
        </View>

        <Text style={styles.summaryNote}>
          ✓ Calculated using linked bank and investment data
        </Text>

        <View style={styles.summaryBoxes}>
          <InfoBox label="Taxable Income" value="₹12,45,000" />
          <InfoBox label="Deductions Claimed" value="₹1,50,000" highlight />
        </View>
      </View>

      {/* Tax Saving */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Tax Saving Opportunities
          </Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              ₹1.5L / ₹2L used
            </Text>
          </View>
        </View>

        {[
          {
            name: "Public Provident Fund",
            current: "₹80,000",
            action: "Invest More",
          },
          {
            name: "ELSS Mutual Funds",
            current: "₹45,000",
            action: "Start SIP",
          },
          {
            name: "Health Insurance",
            current: "₹25,000",
            action: "Completed",
            disabled: true,
          },
          {
            name: "NPS (80CCD)",
            current: "₹0",
            action: "Start Investing",
          },
        ].map((item) => (
          <View key={item.name} style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.amount}>{item.current}</Text>
              <TouchableOpacity
                disabled={item.disabled}
                style={[
                  styles.actionBtn,
                  item.disabled && styles.disabledBtn,
                ]}
              >
                <Text style={styles.actionText}>{item.action}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tax Timeline</Text>

        <Timeline
          icon="time-outline"
          label="ITR Filing Deadline"
          date="July 31, 2026"
          color="#059669"
        />
        <Timeline
          icon="checkmark-circle-outline"
          label="Belated Return Filing"
          date="Dec 31, 2025"
          color="#22C55E"
        />
        <Timeline
          icon="calendar-outline"
          label="Tax Saving Deadline"
          date="March 31, 2026"
          color="#F59E0B"
        />
      </View>

      {/* AI Tip */}
      <View style={styles.aiCard}>
        <Ionicons
          name="shield-checkmark-outline"
          size={28}
          color="#fff"
        />
        <Text style={styles.aiTitle}>
          Save up to ₹25,000 more!
        </Text>
        <Text style={styles.aiText}>
          Move ₹50,000 into NPS before March to reduce tax by
          ₹15,450 instantly.
        </Text>
        <TouchableOpacity style={styles.aiBtn}>
          <Text style={styles.aiBtnText}>Show Me How →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function InfoBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.infoBox, highlight && styles.highlight]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Timeline({
  icon,
  label,
  date,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  date: string;
  color: string;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={[styles.timelineIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View>
        <Text style={styles.timelineLabel}>{label}</Text>
        <Text style={styles.timelineDate}>{date}</Text>
      </View>
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
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  summaryRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  summaryValue: { fontSize: 32, fontWeight: "800" },
  summaryStatus: { color: "#22C55E", fontWeight: "700" },
  summaryNote: { fontSize: 12, color: "#6B7280", marginTop: 6 },

  summaryBoxes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  infoBox: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  highlight: { borderColor: "#22C55E" },
  infoLabel: { fontSize: 10, color: "#6B7280", fontWeight: "700" },
  infoValue: { fontSize: 16, fontWeight: "700", marginTop: 4 },

  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },

  pill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pillText: { fontSize: 10, fontWeight: "700", color: "#059669" },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { fontWeight: "700" },

  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledBtn: { opacity: 0.5 },
  actionText: { fontSize: 10, fontWeight: "700" },

  timelineRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLabel: { fontWeight: "700" },
  timelineDate: { fontSize: 12, color: "#6B7280" },

  aiCard: {
    backgroundColor: "#22C55E",
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
  aiText: {
    fontSize: 13,
    color: "#ECFDF5",
    marginVertical: 8,
  },
  aiBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
    borderRadius: 12,
  },
  aiBtnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
