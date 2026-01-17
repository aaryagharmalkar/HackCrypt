"use client";

import React from "react";
import { ShieldCheck, PieChart, Plane, Target, Home, GraduationCap } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface Strategy {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  type: 'goal' | 'budget';
  data: {
    name: string;
    amount: string;
    date?: string;
    color: string;
  };
  gradient: string;
}

const STRATEGIES: Strategy[] = [
  {
    id: 'emergency',
    title: 'Emergency Fund',
    icon: ShieldCheck,
    description: 'Build 3-6 months of expenses as emergency savings for financial security.',
    type: 'goal',
    data: { 
      name: 'Emergency Fund', 
      amount: '150000', 
      date: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString().split('T')[0],
      color: 'bg-emerald-500' 
    },
    gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
  },
  {
    id: '503020',
    title: '50/30/20 Rule',
    icon: PieChart,
    description: 'Allocate 50% to needs, 30% to wants, and 20% to savings for balanced finances.',
    type: 'budget',
    data: { 
      name: 'Monthly Savings', 
      amount: '20000', 
      color: 'bg-violet-500' 
    },
    gradient: 'from-violet-500/10 to-purple-500/10 border-violet-500/20'
  },
  {
    id: 'travel',
    title: 'Dream Vacation',
    icon: Plane,
    description: 'Save consistently for your dream trip. Start with ₹5,000/month.',
    type: 'goal',
    data: { 
      name: 'Vacation Fund', 
      amount: '100000', 
      date: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString().split('T')[0],
      color: 'bg-cyan-500' 
    },
    gradient: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
  },
  {
    id: 'house',
    title: 'Home Down Payment',
    icon: Home,
    description: 'Save for your dream home down payment. Typically 20% of home value.',
    type: 'goal',
    data: { 
      name: 'House Down Payment', 
      amount: '500000', 
      date: new Date(new Date().setMonth(new Date().getMonth() + 36)).toISOString().split('T')[0],
      color: 'bg-amber-500' 
    },
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20'
  },
  {
    id: 'education',
    title: 'Education Fund',
    icon: GraduationCap,
    description: 'Invest in yourself or your children\'s education for a better future.',
    type: 'goal',
    data: { 
      name: 'Education Fund', 
      amount: '300000', 
      date: new Date(new Date().setMonth(new Date().getMonth() + 24)).toISOString().split('T')[0],
      color: 'bg-indigo-500' 
    },
    gradient: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
  },
  {
    id: 'retirement',
    title: 'Retirement Savings',
    icon: Target,
    description: 'Start early for a comfortable retirement. Aim for 15% of monthly income.',
    type: 'goal',
    data: { 
      name: 'Retirement Fund', 
      amount: '5000000', 
      date: new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString().split('T')[0],
      color: 'bg-rose-500' 
    },
    gradient: 'from-rose-500/10 to-pink-500/10 border-rose-500/20'
  }
];

interface StrategySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrategy: (strategy: Strategy) => void;
  monthlyIncome?: number;
}

export function StrategySelector({ isOpen, onClose, onSelectStrategy, monthlyIncome }: StrategySelectorProps) {
  const handleSelect = (strategy: Strategy) => {
    // Adjust amounts based on monthly income if available
    if (monthlyIncome && monthlyIncome > 0) {
      const adjustedStrategy = { ...strategy };
      if (strategy.id === '503020') {
        adjustedStrategy.data.amount = Math.round(monthlyIncome * 0.2).toString();
      } else if (strategy.id === 'emergency') {
        adjustedStrategy.data.amount = Math.round(monthlyIncome * 6).toString();
      } else if (strategy.id === 'retirement') {
        adjustedStrategy.data.amount = Math.round(monthlyIncome * 0.15 * 12 * 20).toString();
      }
      onSelectStrategy(adjustedStrategy);
    } else {
      onSelectStrategy(strategy);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Strategies"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Choose a proven financial strategy to help you reach your goals faster.
        </p>
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {STRATEGIES.map((strategy) => (
            <div
              key={strategy.id}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br",
                strategy.gradient
              )}
              onClick={() => handleSelect(strategy)}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-background/80 backdrop-blur rounded-xl shadow-sm shrink-0">
                  <strategy.icon size={24} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground mb-1">{strategy.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {strategy.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
