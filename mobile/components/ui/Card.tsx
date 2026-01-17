import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

/* ================= Card ================= */

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/* ================= Card Header ================= */

type CardHeaderProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

/* ================= Card Title ================= */

type CardTitleProps = {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
};

export function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

/* ================= Card Description ================= */

type CardDescriptionProps = {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
};

export function CardDescription({ children, style }: CardDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

/* ================= Card Content ================= */

type CardContentProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

/* ================= Card Footer ================= */

type CardFooterProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export function CardFooter({ children, style }: CardFooterProps) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // rounded-3xl
    borderWidth: 1,
    borderColor: "#E5E7EB", // border-border
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },

  header: {
    padding: 16,
    paddingBottom: 8,
    gap: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  description: {
    fontSize: 13,
    color: "#64748B",
  },

  content: {
    padding: 16,
    paddingTop: 0,
  },

  footer: {
    padding: 16,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
});
