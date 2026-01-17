"use client";

import React, { useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Budget, Goal } from "@/lib/database.types";

interface FormData {
  name: string;
  amount: string;
  saved_amount: string;
  date: string;
  color: string;
  period: string;
}

interface BudgetGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'budget' | 'goal';
  item?: (Budget & { spent?: number }) | Goal | null;
  onSave: (data: FormData) => Promise<void>;
}

const COLORS = [
  { label: "Primary", value: "bg-primary" },
  { label: "Secondary", value: "bg-secondary" },
  { label: "Accent", value: "bg-accent" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Amber", value: "bg-amber-500" },
  { label: "Rose", value: "bg-rose-500" },
  { label: "Violet", value: "bg-violet-500" },
  { label: "Cyan", value: "bg-cyan-500" },
  { label: "Orange", value: "bg-orange-500" },
];

const BUDGET_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Travel",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Rent/Mortgage",
  "Transportation",
  "Groceries",
  "Custom"
];

export function BudgetGoalForm({ isOpen, onClose, type, item, onSave }: BudgetGoalFormProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    saved_amount: "",
    date: "",
    color: "bg-primary",
    period: "monthly"
  });

  React.useEffect(() => {
    if (item) {
      if (type === 'budget') {
        const b = item as Budget;
        setFormData({
          name: b.name,
          amount: b.limit_amount.toString(),
          saved_amount: "",
          date: "",
          color: b.color || "bg-primary",
          period: b.period || "monthly"
        });
      } else {
        const g = item as Goal;
        setFormData({
          name: g.name,
          amount: g.target_amount.toString(),
          saved_amount: g.saved_amount.toString(),
          date: g.target_date,
          color: g.color || "bg-primary",
          period: "monthly"
        });
      }
    } else {
      setFormData({
        name: "",
        amount: "",
        saved_amount: "",
        date: "",
        color: "bg-primary",
        period: "monthly"
      });
    }
  }, [item, type, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectCategory = (category: string) => {
    if (category === "Custom") {
      setFormData({ ...formData, name: "" });
    } else {
      setFormData({ ...formData, name: category });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? `Edit ${type === 'budget' ? 'Budget' : 'Goal'}` : `Create New ${type === 'budget' ? 'Budget' : 'Goal'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name/Category */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {type === 'budget' ? 'Category' : 'Goal Name'}
          </label>
          {type === 'budget' && !item && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {BUDGET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cn(
                    "px-3 py-2 text-xs font-medium rounded-xl border-2 transition-all",
                    formData.name === cat || (cat === "Custom" && !BUDGET_CATEGORIES.slice(0, -1).includes(formData.name))
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleSelectCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <Input
            placeholder={type === 'budget' ? "e.g., Food & Dining" : "e.g., Dream Vacation"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-bold">
            {type === 'budget' ? 'Monthly Limit (₹)' : 'Target Amount (₹)'}
          </label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Goal specific fields */}
        {type === 'goal' && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold">Currently Saved (₹)</label>
              <Input
                type="number"
                placeholder="Enter current savings"
                value={formData.saved_amount}
                onChange={(e) => setFormData({ ...formData, saved_amount: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Target Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </>
        )}

        {/* Budget period */}
        {type === 'budget' && (
          <div className="space-y-2">
            <label className="text-sm font-bold">Period</label>
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}

        {/* Color Selection */}
        <div className="space-y-2">
          <label className="text-sm font-bold">Color Theme</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={cn(
                  "w-10 h-10 rounded-xl border-2 transition-all",
                  c.value,
                  formData.color === c.value 
                    ? "border-foreground scale-110 ring-2 ring-foreground/20" 
                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                )}
                onClick={() => setFormData({ ...formData, color: c.value })}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                {item ? 'Update' : 'Create'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
