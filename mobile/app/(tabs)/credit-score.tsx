import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

type CibilData = {
  cibil_score: number;
  description: string;
  type: string;
};

export default function CreditScoreScreen() {
  const [data, setData] = useState<CibilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCibil();
  }, []);

  const fetchCibil = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("cibil_recommendations")
        .select("cibil_score, description, type")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) setData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const score = data?.cibil_score ?? 0;
  const status =
    score >= 750 ? "EXCELLENT" : score >= 650 ? "GOOD" : "NEEDS WORK";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Credit Analysis</Text>
        <Text style={styles.subtitle}>
          Understand your financial trustworthiness
        </Text>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <Ionicons name="shield-checkmark-outline" size={48} color="#059669" />
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.badge}>{status}</Text>
      </View>

      {/* Metrics */}
      <View style={styles.metrics}>
        <Metric label="Payment History" value="Excellent" />
        <Metric label="Credit Usage" value="15%" />
        <Metric label="Age of Credit" value="5.2 yrs" />
        <Metric label="Inquiries" value="High (4)" />
      </View>

      {/* Analysis */}
      <Card title="Personalized Analysis">
        <Text style={styles.description}>
          {cleanText(data?.description)}
        </Text>
      </Card>

      {/* Insights */}
      <Card title="Insights">
        <Insight
          icon="checkmark-circle-outline"
          title="Positive Factors"
          text="Consistent payments and low utilization are helping your score."
        />
        <Insight
          icon="trending-up-outline"
          title="Growth Potential"
          text="Reduce inquiries and maintain credit age to boost further."
        />
      </Card>

      {/* CTA */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Want to reach 850+?</Text>
        <Text style={styles.ctaText}>
          Get a personalized roadmap to optimize your credit profile.
        </Text>
        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Get My Roadmap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Insight({
  icon,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.insight}>
      <Ionicons name={icon} size={24} color="#059669" />
      <View>
        <Text style={styles.insightTitle}>{title}</Text>
        <Text style={styles.insightText}>{text}</Text>
      </View>
    </View>
  );
}

/* ---------------- HELPERS ---------------- */

function cleanText(text?: string) {
  if (!text) return "";
  return text.replace(/^#+\s/gm, "").replace(/\*/g, "");
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { color: "#6B7280", marginTop: 4 },

  scoreCard: {
    backgroundColor: "#F9FAFB",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  score: { fontSize: 48, fontWeight: "800", marginVertical: 6 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E0E7FF",
    fontWeight: "700",
  },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metric: { width: "48%", marginBottom: 12 },
  metricLabel: { fontSize: 12, color: "#6B7280" },
  metricValue: { fontWeight: "700" },

  card: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  description: { color: "#374151", lineHeight: 20 },

  insight: { flexDirection: "row", gap: 12, marginBottom: 12 },
  insightTitle: { fontWeight: "700" },
  insightText: { color: "#6B7280", fontSize: 12 },

  cta: {
    backgroundColor: "#059669",
    padding: 24,
    borderRadius: 20,
    marginBottom: 40,
  },
  ctaTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  ctaText: { color: "#E0E7FF", marginVertical: 8 },
  ctaBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  ctaBtnText: { textAlign: "center", fontWeight: "700", color: "#059669" },
});
