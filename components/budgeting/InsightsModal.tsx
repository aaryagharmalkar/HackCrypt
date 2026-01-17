"use client";

import React from "react";
import { Lightbulb, TrendingUp, AlertCircle, Target, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface InsightData {
  topCategory: string;
  topAmount: number;
  totalDiff: number;
  biggestSpike: string;
  savingPotential: number;
  overspending?: {
    category: string;
    percentHigher: number;
  };
}

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: InsightData | null;
}

export function InsightsModal({ isOpen, onClose, insights }: InsightsModalProps) {
  if (!insights) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Monthly Insights">
        <div className="py-10 flex justify-center">
          <Loader2 className="animate-spin text-muted" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Monthly Financial Insights">
      <div className="space-y-6">
        {/* Header Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Lightbulb size={32} />
          </div>
        </div>

        {/* Top Spending */}
        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg">Top Spending: {insights.topCategory}</h3>
          <p className="text-muted text-sm">
            You&apos;ve spent <span className="font-bold text-foreground">₹{insights.topAmount.toLocaleString()}</span> on {insights.topCategory} this month.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase font-bold text-muted mb-1">vs Last Month</p>
              <p className={cn(
                "font-bold text-lg",
                insights.totalDiff > 0 ? "text-red-500" : "text-emerald-500"
              )}>
                {insights.totalDiff > 0 ? "+" : ""}₹{Math.abs(insights.totalDiff).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase font-bold text-muted mb-1">Biggest Spike</p>
              <p className="font-bold text-lg text-foreground">{insights.biggestSpike}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          {insights.savingPotential > 0 && (
            <Card className="border-none shadow-sm bg-emerald-500/10 border border-emerald-500/20">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Target size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">Saving Opportunity</p>
                  <p className="text-xs text-muted">
                    You could save an additional <span className="font-bold text-emerald-600">₹{insights.savingPotential.toLocaleString()}</span> by optimizing your spending patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {insights.overspending && (
            <Card className="border-none shadow-sm bg-amber-500/10 border border-amber-500/20">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle size={18} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">Overspending Alert</p>
                  <p className="text-xs text-muted">
                    You&apos;re spending <span className="font-bold text-amber-600">{insights.overspending.percentHigher}% more</span> than usual on {insights.overspending.category}.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Button */}
        <Button className="w-full gap-2" onClick={onClose}>
          <TrendingUp size={16} />
          Got it! Let&apos;s improve
        </Button>
      </div>
    </Modal>
  );
}
