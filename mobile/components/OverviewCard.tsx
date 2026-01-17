import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  amount: string;
  change?: string;
  trend?: "up" | "down";
  icon: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "primary" | "secondary" | "accent";
};

export default function OverviewCard({
  title,
  amount,
  change,
  trend = "up",
  icon,
  variant = "default",
}: Props) {
  const isUp = trend === "up";

  return (
    <View style={[styles.card, variantStyles[variant]]}>
      {/* Top row */}
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            variant !== "default" && styles.iconWrapAlt,
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={variant === "default" ? "#059669" : "#fff"}
          />
        </View>

        {change ? (
          <View style={styles.trend}>
            <Ionicons
              name={isUp ? "trending-up-outline" : "trending-down-outline"}
              size={14}
              color={isUp ? "#059669" : "#DC2626"}
            />
            <Text
              style={[
                styles.change,
                isUp ? styles.up : styles.down,
                variant !== "default" && styles.altText,
              ]}
            >
              {change}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Text */}
      <Text
        style={[
          styles.title,
          variant !== "default" && styles.altSubText,
        ]}
      >
        {title}
      </Text>
      <Text
  style={[styles.amount, variant !== "default" && styles.altText]}
  numberOfLines={1}
  adjustsFontSizeToFit
>
  {amount}
</Text>

    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  iconWrap: {
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 14,
  },
  iconWrapAlt: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  trend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
  },
  up: { color: "#059669" },
  down: { color: "#DC2626" },
  title: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  amount: {
  fontSize: 20,
  fontWeight: "800",
  color: "#111827",
  lineHeight: 24,
},

  altText: { color: "#fff" },
  altSubText: { color: "rgba(255,255,255,0.7)" },
});
const variantStyles = {
  default: { backgroundColor: "#FFFFFF" },
  primary: { backgroundColor: "#059669" },
  secondary: { backgroundColor: "#2563EB" },
  accent: { backgroundColor: "#DC2626" },
};
