import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import TaxChatbot from "@/components/TaxChatbot";

/* ================= Types ================= */

interface TaxReport {
  financial_year: string;
  total_income: number;
  taxable_amount: number;
  deduction_total: number;
  compliance_score: number;
  missing_documents: string[] | null;
}

/* ================= Component ================= */

export default function TaxPage() {
    
  const [report, setReport] = useState<TaxReport | null>(null);
  const [loading, setLoading] = useState(true);
  const complianceScore = report?.compliance_score ?? 0;


  useEffect(() => {
    fetchTaxReport();
  }, []);

  const fetchTaxReport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("tax_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      setReport(data || null);
    } catch (e) {
      console.error("Tax fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const calculateTax = (taxable = 0) => {
    if (taxable <= 250000) return 0;
    if (taxable <= 500000) return (taxable - 250000) * 0.05;
    if (taxable <= 1000000) return 12500 + (taxable - 500000) * 0.2;
    return 112500 + (taxable - 1000000) * 0.3;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  const estimatedTax = report ? calculateTax(report.taxable_amount) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ================= Header ================= */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tax Center</Text>
          <Text style={styles.subtitle}>
            Automatic tax calculation & ITR readiness
          </Text>
        </View>

        <View style={styles.actions}>
          <HeaderButton icon="calculator-outline" label="Calculator" />
          <HeaderButton icon="document-text-outline" label="Prepare ITR" filled />
        </View>
      </View>

      {/* ================= Summary ================= */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>
          Estimated Tax ({report?.financial_year || "FY 2025–26"})
        </Text>

        <View style={styles.amountRow}>
          <Text style={styles.amount}>
            ₹{Math.round(estimatedTax).toLocaleString()}
          </Text>
          <Text style={styles.payable}>Payable</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle-outline" size={14} color="#34D399" />
          <Text style={styles.infoText}>
            Based on linked bank & investments
          </Text>
        </View>

        <View style={styles.metaRow}>
          <MetaBox label="Gross Income" value={report?.total_income} />
          <MetaBox label="Taxable" value={report?.taxable_amount} />
          <MetaBox
            label="Deductions"
            value={report?.deduction_total}
            highlight
          />
        </View>
      </View>

      {/* ================= Missing Docs ================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Missing Documents</Text>

        <View
  style={[
    styles.complianceBadge,
    complianceScore >= 80
      ? styles.good
      : complianceScore >= 50
      ? styles.warn
      : styles.bad,
  ]}
>

          <Ionicons name="shield-checkmark-outline" size={14} />
          <Text style={styles.complianceText}>
  {complianceScore}% Compliance
</Text>

        </View>
      </View>

      {report?.missing_documents?.length ? (
        report.missing_documents.map((doc, i) => (
          <View key={i} style={styles.docRow}>
            <View style={styles.docIcon}>
              <Ionicons name="document-text-outline" size={18} color="#DC2626" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.docTitle}>{doc}</Text>
              <Text style={styles.docSub}>Required for filing</Text>
            </View>

            <TouchableOpacity style={styles.uploadBtn}>
              <Ionicons name="add-outline" size={16} />
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.successCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={40}
            color="#10B981"
          />
          <Text style={styles.successTitle}>All documents uploaded!</Text>
          <Text style={styles.successSub}>100% tax compliance</Text>
        </View>
      )}

      {/* ================= Chatbot ================= */}
      <TaxChatbot />
    </ScrollView>
  );
}

/* ================= Small Components ================= */

function HeaderButton({ icon, label, filled }: any) {
  return (
    <TouchableOpacity
      style={[styles.headerBtn, filled && styles.headerBtnFilled]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={filled ? "#fff" : "#0F172A"}
      />
      <Text style={[styles.headerBtnText, filled && { color: "#fff" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function MetaBox({ label, value, highlight }: any) {
  return (
    <View style={styles.metaBox}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, highlight && { color: "#10B981" }]}>
        ₹{Number(value || 0).toLocaleString()}
      </Text>
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 13, color: "#64748B", marginTop: 4 },

  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  headerBtn: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerBtnFilled: { backgroundColor: "#0F172A", borderColor: "#0F172A" },
  headerBtnText: { fontSize: 12, fontWeight: "700" },

  summaryCard: {
    backgroundColor: "#020617",
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "800",
  },
  amountRow: { flexDirection: "row", gap: 8, alignItems: "baseline" },
  amount: { fontSize: 34, fontWeight: "900", color: "#fff" },
  payable: { fontSize: 12, color: "#34D399", fontWeight: "700" },

  infoRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  infoText: { fontSize: 12, color: "#94A3B8" },

  metaRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  metaBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 14,
  },
  metaLabel: { fontSize: 10, color: "#94A3B8", fontWeight: "700" },
  metaValue: { fontSize: 15, fontWeight: "800", color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800" },

  complianceBadge: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  complianceText: { fontSize: 11, fontWeight: "800" },
  good: { backgroundColor: "#DCFCE7", color: "#065F46" },
  warn: { backgroundColor: "#FEF3C7" },
  bad: { backgroundColor: "#FEE2E2" },

  docRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  docIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  docTitle: { fontSize: 14, fontWeight: "800" },
  docSub: { fontSize: 12, color: "#64748B" },

  uploadBtn: {
    flexDirection: "row",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  uploadText: { fontSize: 11, fontWeight: "700" },

  successCard: {
    padding: 24,
    borderRadius: 22,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: { fontSize: 16, fontWeight: "900", marginTop: 10 },
  successSub: { fontSize: 12, color: "#065F46", marginTop: 4 },
});
