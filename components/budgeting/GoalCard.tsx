"use client";

import React from "react";
import { Pencil, X, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target_amount: number;
    saved_amount: number;
    target_date: string;
    color: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds?: () => void;
}

export function GoalCard({ goal, onEdit, onDelete, onAddFunds }: GoalCardProps) {
  const percentage = Math.min((goal.saved_amount / goal.target_amount) * 100, 100);
  const remaining = goal.target_amount - goal.saved_amount;
  const isComplete = percentage >= 100;

  // Calculate days remaining
  const targetDate = new Date(goal.target_date);
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const monthsRemaining = Math.floor(daysRemaining / 30);

  // Calculate monthly required savings
  const monthlyRequired = monthsRemaining > 0 ? remaining / monthsRemaining : remaining;

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow group">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base">{goal.name}</h3>
              {isComplete && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  ✓ Complete
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted font-bold uppercase tracking-wider">
              <Calendar size={10} />
              <span>{goal.target_date}</span>
              {daysRemaining > 0 && !isComplete && (
                <span className="text-accent">• {monthsRemaining}mo left</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-xl font-black", goal.color.replace('bg-', 'text-'))}>
              {percentage.toFixed(0)}%
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onEdit}>
                <Pencil size={10} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 text-red-500" 
                onClick={onDelete}
              >
                <X size={10} />
              </Button>
            </div>
          </div>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase">Saved</p>
            <p className="text-lg font-bold text-foreground">₹{goal.saved_amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted uppercase">Target</p>
            <p className="text-lg font-bold text-foreground">₹{goal.target_amount.toLocaleString()}</p>
          </div>
        </div>

        {!isComplete && remaining > 0 && monthlyRequired > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Monthly target:</span>
              <span className="font-bold text-accent">₹{Math.ceil(monthlyRequired).toLocaleString()}/mo</span>
            </div>
          </div>
        )}

        {onAddFunds && !isComplete && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 gap-2 border-dashed"
            onClick={onAddFunds}
          >
            <TrendingUp size={14} />
            Add Progress
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
