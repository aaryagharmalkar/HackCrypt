"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface SpeedometerProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function FinancialHealthSpeedometer({ score, size = "md" }: SpeedometerProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  // Needle angle: -90deg (left) to 90deg (right)
  const angle = (clampedScore / 100) * 180 - 90;

  const sizeConfig = {
    sm: { radius: 70, strokeWidth: 10, fontSize: "text-2xl", height: "h-24" },
    md: { radius: 90, strokeWidth: 12, fontSize: "text-4xl", height: "h-32" },
    lg: { radius: 110, strokeWidth: 14, fontSize: "text-5xl", height: "h-40" },
  };

  const config = sizeConfig[size];
  const { radius, strokeWidth } = config;
  const circumference = Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  const getTheme = () => {
    if (clampedScore >= 80) return { text: "text-secondary", stroke: "#059669", badge: "success" as const, label: "EXCELLENT" };
    if (clampedScore >= 60) return { text: "text-blue-600", stroke: "#2563eb", badge: "secondary" as const, label: "GOOD" };
    if (clampedScore >= 40) return { text: "text-amber-500", stroke: "#d97706", badge: "warning" as const, label: "AVERAGE" };
    return { text: "text-accent", stroke: "#e11d48", badge: "danger" as const, label: "AT RISK" };
  };

  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className={cn("relative flex items-end justify-center", config.height)}>
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius + strokeWidth + 10}
          className="overflow-visible"
          viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius + strokeWidth + 10}`}
        >
          {/* Background Track */}
          <path
            d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth} ${radius + strokeWidth}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-muted/10"
          />

          {/* Progress Track */}
          <path
            d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth} ${radius + strokeWidth}`}
            fill="none"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-in-out"
          />

          {/* Needle Hub */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r="8"
            className="fill-background stroke-muted/20"
            strokeWidth="2"
          />

          {/* Traditional Needle */}
          <line
            x1={radius + strokeWidth}
            y1={radius + strokeWidth}
            x2={radius + strokeWidth + Math.cos(((angle - 90) * Math.PI) / 180) * (radius - 5)}
            y2={radius + strokeWidth + Math.sin(((angle - 90) * Math.PI) / 180) * (radius - 5)}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-foreground transition-all duration-1000 ease-out"
          />

          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r="4"
            className="fill-foreground"
          />
        </svg>

        {/* Clear Center Score - Positioned below the hub for maximum legibility */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 pointer-events-none"> {/* Reduced pt-10 to pt-6 */}
          <span className={cn("font-black tracking-tighter leading-none mb-1", config.fontSize, theme.text)}>
            {clampedScore}
          </span>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
            Health Score
          </span>
        </div>
      </div>

      <div className="mt-8">
        <Badge variant={theme.badge} className="px-5 py-1 text-xs font-bold rounded-full">
          {theme.label}
        </Badge>
      </div>
    </div>
  );
}


