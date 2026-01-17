import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ================= ICON TYPE (FIX) ================= */

/**
 * Explicit union of icons actually used.
 * This bypasses Expo's outdated Ionicons typings safely.
 */
type StrategyIcon =
  | "shield-checkmark-outline"
  | "pie-chart-outline"
  | "airplane-outline"
  | "home-outline"
  | "school-outline"
  | "target-outline";

/* ================= TYPES ================= */

interface Strategy {
  id: string;
  title: string;
  icon: StrategyIcon; // ✅ FIXED
  description: string;
  type: "goal" | "budget";
  data: {
    name: string;
    amount: string;
    date?: string;
    color: string;
  };
  tint: string;
}

interface StrategySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: Strategy) => void;
  monthlyIncome?: number;
}

/* ================= STRATEGIES ================= */

const STRATEGIES: Strategy[] = [
  {
    id: "emergency",
    title: "Emergency Fund",
    icon: "shield-checkmark-outline",
    description:
      "Build 3–6 months of expenses as emergency savings for financial security.",
    type: "goal",
    data: {
      name: "Emergency Fund",
      amount: "150000",
      date: new Date(
        new Date().setMonth(new Date().getMonth() + 12)
      )
        .toISOString()
        .split("T")[0],
      color: "#10B981",
    },
    tint: "#ECFDF5",
  },
  {
    id: "503020",
    title: "50/30/20 Rule",
    icon: "pie-chart-outline",
    description:
      "Allocate 50% to needs, 30% to wants, and 20% to savings for balance.",
    type: "budget",
    data: {
      name: "Monthly Savings",
      amount: "20000",
      color: "#7C3AED",
    },
    tint: "#F5F3FF",
  },
  {
    id: "travel",
    title: "Dream Vacation",
    icon: "airplane-outline",
    description:
      "Save consistently for your dream trip. Start with ₹5,000/month.",
    type: "goal",
    data: {
      name: "Vacation Fund",
      amount: "100000",
      date: new Date(
        new Date().setMonth(new Date().getMonth() + 10)
      )
        .toISOString()
        .split("T")[0],
      color: "#06B6D4",
    },
    tint: "#ECFEFF",
  },
  {
    id: "house",
    title: "Home Down Payment",
    icon: "home-outline",
    description:
      "Save for your dream home down payment. Typically 20% of value.",
    type: "goal",
    data: {
      name: "House Down Payment",
      amount: "500000",
      date: new Date(
        new Date().setMonth(new Date().getMonth() + 36)
      )
        .toISOString()
        .split("T")[0],
      color: "#F59E0B",
    },
    tint: "#FFFBEB",
  },
  {
    id: "education",
    title: "Education Fund",
    icon: "school-outline",
    description:
      "Invest in education for a better future for you or your children.",
    type: "goal",
    data: {
      name: "Education Fund",
      amount: "300000",
      date: new Date(
        new Date().setMonth(new Date().getMonth() + 24)
      )
        .toISOString()
        .split("T")[0],
      color: "#6366F1",
    },
    tint: "#EEF2FF",
  },
  {
    id: "retirement",
    title: "Retirement Savings",
    icon: "target-outline",
    description:
      "Start early for a comfortable retirement. Aim for 15% of income.",
    type: "goal",
    data: {
      name: "Retirement Fund",
      amount: "5000000",
      date: new Date(
        new Date().setFullYear(new Date().getFullYear() + 20)
      )
        .toISOString()
        .split("T")[0],
      color: "#F43F5E",
    },
    tint: "#FFF1F2",
  },
];

/* ================= COMPONENT ================= */

export function StrategySelector({
  isOpen,
  onClose,
  onSelectStrategy,
  monthlyIncome,
}: StrategySelectorProps) {
  const handleSelect = (strategy: Strategy) => {
    const adjusted = { ...strategy };

    if (monthlyIncome && monthlyIncome > 0) {
      if (strategy.id === "503020") {
        adjusted.data.amount = Math.round(
          monthlyIncome * 0.2
        ).toString();
      } else if (strategy.id === "emergency") {
        adjusted.data.amount = Math.round(
          monthlyIncome * 6
        ).toString();
      } else if (strategy.id === "retirement") {
        adjusted.data.amount = Math.round(
          monthlyIncome * 0.15 * 12 * 20
        ).toString();
      }
    }

    onSelectStrategy(adjusted);
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Financial Strategies</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Choose a proven financial strategy to reach your goals faster.
          </Text>

          <ScrollView
            style={{ marginTop: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {STRATEGIES.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.card, { backgroundColor: s.tint }]}
                onPress={() => handleSelect(s)}
                activeOpacity={0.9}
              >
                <View style={styles.cardRow}>
                  <View style={styles.iconWrap}>
                    {/* SINGLE SAFE CAST */}
                    <Ionicons
                      name={s.icon as any}
                      size={24}
                      color="#064E3B"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{s.title}</Text>
                    <Text style={styles.cardDesc}>{s.description}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

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
    maxHeight: "90%",
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
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  iconWrap: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#064E3B",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
  },
});
