import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export function SavingsGoal() {
  const progress = 65;

  return (
    <View style={styles.card}>
      {/* Background Icon */}
      <View style={styles.bgIcon}>
        <Ionicons
  name={"target-outline" as IoniconName}
  size={120}
  color="#FFFFFF"
/>

      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons
  name={"target-outline" as IoniconName}
  size={16}
  color="#FFFFFF"
/>

          </View>
          <Text style={styles.headerText}>SAVINGS GOAL</Text>
        </View>

        {/* Goal Info */}
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>Dream House</Text>
          <Text style={styles.goalAmount}>
            ₹6,50,000 / ₹10,00,000
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Avatars */}
          <View style={styles.avatarStack}>
            {["J1", "J2", "J3"].map((t, i) => (
              <View key={i} style={styles.avatar}>
                <Text style={styles.avatarText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Growth Badge */}
          <View style={styles.growthBadge}>
            <Ionicons
              name="trending-up-outline"
              size={12}
              color="#059669"
            />
            <Text style={styles.growthText}>+12%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F172A", // slate-900
    borderRadius: 22,
    padding: 16,
    overflow: "hidden",
  },

  bgIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    opacity: 0.08,
  },

  content: {
    position: "relative",
    zIndex: 1,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  headerIcon: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  headerText: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 2,
  },

  /* Goal Info */
  goalInfo: {
    marginBottom: 16,
  },

  goalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  goalAmount: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.45)",
  },

  /* Progress */
  progressWrap: {
    gap: 6,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
  },

  progressValue: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981", // secondary
  },

  progressTrack: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 999,
    shadowColor: "#10B981",
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },

  /* Footer */
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatarStack: {
    flexDirection: "row",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -6,
  },

  avatarText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
  },

  growthText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10B981",
  },
});
