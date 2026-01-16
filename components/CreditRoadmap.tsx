"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Target,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Star,
  X,
  ChevronDown,
} from "lucide-react";

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  timeline: string;
  impact: string;
  icon: any;
}

interface ScoreRoadmap {
  range: string;
  tier: string;
  targetScore: string;
  estimatedTime: string;
  steps: RoadmapStep[];
  keyFocus: string[];
  warnings: string[];
}

const roadmapData: Record<string, ScoreRoadmap> = {
  "700-800": {
    range: "700-800",
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
          "Keep your total credit usage under 7%. Pay balances before statement generation.",
        priority: "critical",
        timeline: "Ongoing",
        impact: "+20–35 points",
        icon: Target,
      },
      {
        id: 2,
        title: "Perfect Payment History",
        description:
          "Even a single late payment can drop 80+ points. Enable auto-pay.",
        priority: "critical",
        timeline: "Ongoing",
        impact: "+30–50 points",
        icon: CheckCircle2,
      },
      {
        id: 3,
        title: "Request Credit Limit Increases",
        description:
          "Request limit increases every 6 months without increasing spend.",
        priority: "high",
        timeline: "Every 6 months",
        impact: "+25–40 points",
        icon: TrendingUp,
      },
      {
        id: 4,
        title: "Preserve Credit Age",
        description:
          "Use your oldest cards monthly for small purchases.",
        priority: "medium",
        timeline: "Ongoing",
        impact: "+10–25 points",
        icon: Clock,
      },
      {
        id: 5,
        title: "Monitor Credit Report",
        description:
          "Check credit reports monthly for incorrect marks.",
        priority: "low",
        timeline: "Monthly",
        impact: "+5–15 points",
        icon: Shield,
      },
    ],
  },
};

const priorityColors = {
  critical: "bg-red-500/10 border-red-500/30 text-black",
  high: "bg-amber-500/10 border-amber-500/30 text-black",
  medium: "bg-emerald-500/10 border-emerald-500/30 text-black",
  low: "bg-slate-500/10 border-slate-500/30 text-black",
};

export default function CreditRoadmap({ cibilScore = 750 }: { cibilScore: number }) {
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const roadmap = roadmapData["700-800"];

  if (!showRoadmap) {
    return (
      <button
        onClick={() => setShowRoadmap(true)}
        className="w-full bg-white text-black rounded-2xl font-bold px-10 py-4 hover:shadow-lg transition-all"
      >
        Get My Personalized Roadmap
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 overflow-y-auto text-black">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 rounded-t-3xl relative text-black">
            <button
              onClick={() => setShowRoadmap(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/30 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/40 rounded-2xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  Your Credit Improvement Roadmap
                </h2>
                <p className="text-sm">
                  Current Score: {cibilScore} • {roadmap.tier}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                ["Target Score", roadmap.targetScore],
                ["Estimated Time", roadmap.estimatedTime],
                ["Action Steps", roadmap.steps.length],
                ["Priority", roadmap.tier.split(" ")[0]],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-white/40 rounded-xl p-4 border border-white"
                >
                  <p className="text-xs">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BODY */}
          <div className="p-8 space-y-10">

            <h3 className="text-2xl font-bold">Your Action Plan</h3>

            {roadmap.steps.map((step) => {
              const Icon = step.icon;
              const open = selectedStep === step.id;

              return (
                <div key={step.id} className="flex gap-6">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white border-4 border-emerald-500 shadow">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div
                    onClick={() => setSelectedStep(open ? null : step.id)}
                    className={`flex-1 p-6 rounded-2xl cursor-pointer border ${
                      open ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-bold text-lg">
                        Step {step.id}: {step.title}
                      </h4>
                      <ChevronDown className={open ? "rotate-180" : ""} />
                    </div>

                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[step.priority]}`}>
                        {step.priority.toUpperCase()}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {step.timeline}
                      </span>
                      <span className="text-xs font-bold">
                        {step.impact}
                      </span>
                    </div>

                    {open && (
                      <p className="mt-4 text-sm">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Key Focus Areas
              </h3>

              {roadmap.keyFocus.map((item, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 mt-1" />
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>

            {roadmap.warnings.length > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Important Warnings
                </h3>
                {roadmap.warnings.map((w, i) => (
                  <p key={i} className="text-sm">• {w}</p>
                ))}
              </div>
            )}

            <div className="bg-emerald-500 rounded-2xl p-8 text-center text-black">
              <h3 className="text-2xl font-bold mb-2">
                Ready to Transform Your Credit?
              </h3>
              <p className="mb-6">
                Start with critical steps and stay consistent.
              </p>
              <button
                onClick={() => setShowRoadmap(false)}
                className="bg-white px-8 py-3 rounded-xl font-bold hover:shadow-lg"
              >
                Start My Journey
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
