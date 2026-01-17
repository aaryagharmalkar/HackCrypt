"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  budget: {
    id: string;
    name: string;
    limit_amount: number;
    spent: number;
    color: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const percentage = Math.min((budget.spent / budget.limit_amount) * 100, 100);
  const isNearLimit = percentage > 85;
  const isOverLimit = percentage >= 100;

  return (
    <div className="space-y-3 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm">{budget.name}</span>
          {isOverLimit && (
            <Badge variant="danger" className="text-[10px] py-0">Over Limit!</Badge>
          )}
          {!isOverLimit && isNearLimit && (
            <Badge variant="warning" className="text-[10px] py-0">Near Limit</Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted">
            ₹{budget.spent.toLocaleString()} / <span className="text-foreground">₹{budget.limit_amount.toLocaleString()}</span>
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
              <Pencil size={12} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" 
              onClick={onDelete}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-2.5 w-full bg-muted/10 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-700",
            budget.color,
            isOverLimit && "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage > 0 && (
        <p className="text-[10px] text-muted font-medium">
          {percentage.toFixed(1)}% used • ₹{(budget.limit_amount - budget.spent).toLocaleString()} remaining
        </p>
      )}
    </div>
  );
}
