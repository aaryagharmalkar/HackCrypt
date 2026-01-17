import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import CreditGauge from "@/components/CreditGauge";
import CreditRoadmap from "@/components/CreditRoadmap";

export default function CreditScreen() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("Good");

  useEffect(() => {
    fetchCibil();
  }, []);

  const fetchCibil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("cibil_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setScore(data.cibil_score);
      setDescription(
        data.description.replace(/^#+\s/gm, "").replace(/\*/g, "")
      );
      setTier(getTier(data.cibil_score));
    }
    setLoading(false);
  };

  const getTier = (s: number) => {
    if (s >= 800) return "Elite";
    if (s >= 700) return "Excellent";
    if (s >= 600) return "Good";
    if (s >= 500) return "Fair";
    return "Poor";
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Credit Analysis</Text>
      <Text style={styles.subtitle}>
        Understanding your financial trustworthiness
      </Text>

      {/* Gauge */}
      <View style={styles.card}>
        <CreditGauge score={score} />
        <Text style={styles.tier}>{tier}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Stat label="Payment History" value="Excellent" />
        <Stat label="Credit Usage" value="15%" />
        <Stat label="Credit Age" value="5.2 yrs" />
        <Stat label="Inquiries" value="High (4)" warn />
      </View>

      {/* Analysis */}
      <View style={styles.card}>
        <Text style={styles.section}>Personalized Analysis</Text>
        <Text style={styles.body}>{description}</Text>
      </View>

      {/* Factors */}
      <View style={styles.row}>
        <InfoCard
          icon="checkmark-circle-outline"
          title="Positive Factors"
          text="Consistent payment history and low utilization."
        />
        <InfoCard
          icon="trending-up-outline"
          title="Growth Potential"
          text="Longer credit history and consolidation help."
        />
      </View>

      {/* Roadmap */}
      <View style={styles.card}>
        <Text style={styles.section}>Credit Roadmap</Text>
        <CreditRoadmap cibilScore={score} />
      </View>
    </ScrollView>
  );
}

function Stat({ label, value, warn }: any) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, warn && { color: "#F97316" }]}>
        {value}
      </Text>
    </View>
  );
}

function InfoCard({ icon, title, text }: any) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={22} color="#059669" />
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#6B7280", marginBottom: 20 },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },

  tier: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "800",
    color: "#059669",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  stat: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 11, color: "#6B7280" },
  statValue: { fontWeight: "800", marginTop: 4 },

  section: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 14, color: "#374151" },

  row: { flexDirection: "row", gap: 10 },

  info: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 14,
  },
  infoTitle: { fontWeight: "700", marginTop: 6 },
  infoText: { fontSize: 12, color: "#374151", marginTop: 4 },
});
