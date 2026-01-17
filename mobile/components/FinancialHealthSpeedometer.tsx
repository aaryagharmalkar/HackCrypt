import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";

type Props = {
  score: number;
  size?: "sm" | "md" | "lg";
};

export default function FinancialHealthSpeedometer({
  score,
  size = "md",
}: Props) {
  const clamped = Math.max(0, Math.min(100, score));

  const sizes = {
    sm: 140,
    md: 180,
    lg: 220,
  };

  const dimension = sizes[size];
  const radius = dimension / 2;
  const cx = radius;
  const cy = radius;
  const strokeWidth = 14;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clamped,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped]);

  const angle = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [-90, 90],
  });

  const arcPath = `
    M ${cx - radius + strokeWidth} ${cy}
    A ${radius - strokeWidth} ${radius - strokeWidth} 0 0 1
      ${cx + radius - strokeWidth} ${cy}
  `;

  const arcColor =
    clamped >= 75 ? "#10B981" : clamped >= 50 ? "#F59E0B" : "#EF4444";

  const needleRotate = angle.interpolate({
    inputRange: [-90, 90],
    outputRange: ["-90deg", "90deg"],
  });

  return (
    <View style={styles.container}>
      <Svg width={dimension} height={radius + 20}>
        {/* Background arc */}
        <Path
          d={arcPath}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Active arc */}
        <AnimatedPath
          d={arcPath}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={Math.PI * (radius - strokeWidth)}
          strokeDashoffset={animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: [
              Math.PI * (radius - strokeWidth),
              0,
            ],
          })}
        />

        {/* Needle */}
<Animated.View
  style={{
    position: "absolute",
    left: cx - 1,
    top: cy - 1,
    width: 2,
    height: radius - 18,
    transform: [
      { translateY: -(radius - 55) }, // move needle up
      { rotate: needleRotate },       // rotate from center dot
      { translateY: radius -125 },    // move back
    ],
  }}
>
  <View
    style={{
      width: 2,
      height: radius - 18,
      backgroundColor: "#111827",
      borderRadius: 2,
    }}
  />
</Animated.View>


        {/* Center hub */}
        <Circle cx={cx} cy={cy} r={6} fill="#111827" />
      </Svg>

      <Text style={[styles.score, { color: arcColor }]}>
        {clamped}
      </Text>
      <Text style={styles.label}>Financial Health</Text>
    </View>
  );
}

/* ================= Animated SVG Fix ================= */
const AnimatedPath = Animated.createAnimatedComponent(Path);

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  score: {
    fontSize: 34,
    fontWeight: "900",
    marginTop: -8,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "600",
  },
});
