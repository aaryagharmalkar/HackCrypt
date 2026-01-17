import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  score: number; // out of 900
}

export default function CreditGauge({ score }: Props) {
  const radius = 90;
  const strokeWidth = 12;
  const size = 220;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false, // required for SVG
    }).start();
  }, [score]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 900],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="#059669"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center Text */}
      <View style={styles.center}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.label}>CIBIL SCORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  score: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 42,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#6B7280",
    marginTop: 4,
  },
});
