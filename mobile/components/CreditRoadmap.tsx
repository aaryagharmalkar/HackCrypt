import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ---------------- TYPES ---------------- */

type Priority = "critical" | "high" | "medium" | "low";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  timeline: string;
  impact: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ScoreRoadmap {
  tier: string;
  targetScore: string;
  estimatedTime: string;
  steps: RoadmapStep[];
  keyFocus: string[];
  warnings: string[];
}

/* ---------------- DATA ---------------- */

const roadmap: ScoreRoadmap = {
  tier: "Excellent Credit",
  targetScore: "850+",
  estimatedTime: "6–12 months",
  keyFocus: [
    "Maintain utilization under 7%",
    "Never miss a payment",
    "Increase credit limits strategically",
    "Preserve oldest accounts",
  ],
  warnings: [
    "Returns diminish beyond 780",
    "Avoid unnecessary credit applications",
  ],
  steps: [
    {
      id: 1,
      title: "Maintain Ultra-Low Utilization",
      description:
        "Keep total credit usage below 7%. Pay balances before statement generation.",
      priority: "critical",
      timeline: "Ongoing",
      impact: "+20–35 points",
      icon: "radio-button-on-outline",
    },
    {
      id: 2,
      title: "Perfect Payment History",
      description:
        "Even one late payment can drop 80+ points. Enable autopay everywhere.",
      priority: "critical",
      timeline: "Ongoing",
      impact: "+30–50 points",
      icon: "checkmark-circle-outline",
    },
    {
      id: 3,
      title: "Request Credit Limit Increases",
      description:
        "Ask for limit increases every 6 months without increasing spend.",
      priority: "high",
      timeline: "Every 6 months",
      impact: "+25–40 points",
      icon: "trending-up-outline",
    },
    {
      id: 4,
      title: "Preserve Credit Age",
      description:
        "Use your oldest cards monthly for small purchases to keep them active.",
      priority: "medium",
      timeline: "Ongoing",
      impact: "+10–25 points",
      icon: "time-outline",
    },
    {
      id: 5,
      title: "Monitor Credit Report",
      description:
        "Check reports monthly and dispute incorrect marks immediately.",
      priority: "low",
      timeline: "Monthly",
      impact: "+5–15 points",
      icon: "shield-checkmark-outline",
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

export default function CreditRoadmap({ cibilScore }: { cibilScore: number }) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <>
      {/* OPEN BUTTON */}
      <TouchableOpacity style={styles.openBtn} onPress={() => setOpen(true)}>
        <Text style={styles.openBtnText}>Get My Credit Roadmap</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={open} animationType="slide">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Credit Improvement Roadmap
            </Text>
            <Text style={styles.headerSub}>
              Current Score: {cibilScore} • {roadmap.tier}
            </Text>

            <View style={styles.statsRow}>
              <Stat label="Target" value={roadmap.targetScore} />
              <Stat label="Time" value={roadmap.estimatedTime} />
              <Stat label="Steps" value={`${roadmap.steps.length}`} />
            </View>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            <Text style={styles.sectionTitle}>Your Action Plan</Text>

            {roadmap.steps.map((step) => {
              const openStep = activeStep === step.id;

              return (
                <TouchableOpacity
                  key={step.id}
                  style={[
                    styles.stepCard,
                    openStep && styles.stepCardActive,
                  ]}
                  onPress={() =>
                    setActiveStep(openStep ? null : step.id)
                  }
                >
                  <View style={styles.stepHeader}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name={step.icon}
                        size={22}
                        color="#059669"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepTitle}>
                        Step {step.id}: {step.title}
                      </Text>
                      <View style={styles.metaRow}>
                        <Text style={[styles.badge, styles[step.priority]]}>
                          {step.priority.toUpperCase()}
                        </Text>
                        <Text style={styles.meta}>{step.timeline}</Text>
                        <Text style={styles.meta}>{step.impact}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={openStep ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#6B7280"
                    />
                  </View>

                  {openStep && (
                    <Text style={styles.stepDesc}>{step.description}</Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* KEY FOCUS */}
            <View style={styles.focusCard}>
              <Text style={styles.focusTitle}>Key Focus Areas</Text>
              {roadmap.keyFocus.map((item, i) => (
                <View key={i} style={styles.focusRow}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#059669"
                  />
                  <Text style={styles.focusText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* WARNINGS */}
            <View style={styles.warnCard}>
              <Text style={styles.warnTitle}>Important Warnings</Text>
              {roadmap.warnings.map((w, i) => (
                <Text key={i} style={styles.warnText}>
                  • {w}
                </Text>
              ))}
            </View>

            {/* CTA */}
            <View style={styles.finalCard}>
              <Text style={styles.finalTitle}>
                Ready to Improve Your Credit?
              </Text>
              <Text style={styles.finalText}>
                Start with critical steps and stay consistent.
              </Text>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.startBtnText}>Start My Journey</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  openBtn: {
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  openBtnText: { color: "#fff", fontWeight: "800" },

  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    backgroundColor: "#059669",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeBtn: { position: "absolute", top: 50, right: 20 },

  headerTitle: { fontSize: 22, fontWeight: "800", color: "#fff" },
  headerSub: { color: "#D1FAE5", marginTop: 6 },

  statsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  statBox: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    flex: 1,
  },
  statLabel: { color: "#D1FAE5", fontSize: 11 },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "800" },

  body: { padding: 20 },

  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 16 },

  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  stepCardActive: {
    borderWidth: 1,
    borderColor: "#059669",
    backgroundColor: "#ECFDF5",
  },

  stepHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  stepTitle: { fontWeight: "700", fontSize: 15 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  meta: { fontSize: 11, color: "#374151" },

  badge: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  critical: { backgroundColor: "#FEE2E2" },
  high: { backgroundColor: "#FEF3C7" },
  medium: { backgroundColor: "#D1FAE5" },
  low: { backgroundColor: "#E5E7EB" },

  stepDesc: { marginTop: 12, fontSize: 13, color: "#374151" },

  focusCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  focusTitle: { fontWeight: "800", marginBottom: 10 },
  focusRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  focusText: { fontSize: 13 },

  warnCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  warnTitle: { fontWeight: "800", marginBottom: 8 },
  warnText: { fontSize: 13 },

  finalCard: {
    backgroundColor: "#059669",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },
  finalTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  finalText: { color: "#D1FAE5", marginVertical: 10 },
  startBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  startBtnText: { fontWeight: "800", color: "#059669" },
});
