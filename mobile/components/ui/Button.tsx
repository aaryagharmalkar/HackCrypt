import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

/* ================= Types ================= */

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}

/* ================= Component ================= */

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, textVariants[variant]]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  /* Variants */
  primary: {
    backgroundColor: "#2563EB", // primary
  },
  secondary: {
    backgroundColor: "#10B981", // secondary
  },
  outline: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "transparent",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "#EF4444", // accent
  },

  /* Sizes */
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
  },
  lg: {
    height: 48,
    paddingHorizontal: 32,
  },
  icon: {
    height: 40,
    width: 40,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },

  disabled: {
    opacity: 0.4,
  },

  text: {
    fontWeight: "600",
    fontSize: 14,
  },
});

/* ================= Text Variants ================= */

const textVariants: Record<ButtonVariant, TextStyle> = {
  primary: { color: "#FFFFFF" },
  secondary: { color: "#FFFFFF" },
  outline: { color: "#0F172A" },
  ghost: { color: "#0F172A" },
  danger: { color: "#FFFFFF" },
};
