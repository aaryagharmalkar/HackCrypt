"use client";

import React, { useEffect, useState } from "react";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SavingsGoal } from "@/components/dashboard/SavingsGoal";
import { FinancialHealthSpeedometer } from "@/components/dashboard/FinancialHealthSpeedometer";
import {
  Plus,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  Bell,
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2,
  PiggyBank,
  CreditCard,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    netWorth: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [healthData, setHealthData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<{ name: string, val: number, color: string }[]>([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0]);
      } else if (user.email) {
        setUserName(user.email.split('@')[0]);
      }

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type, category')
        .eq('user_id', user.id);

      if (error) throw error;

      let income = 0;
      let expenses = 0;
      const categoryTotals: Record<string, number> = {};

      transactions?.forEach(tx => {
        const amount = Number(tx.amount);
        if (tx.type === 'credit') {
          income += amount;
        } else if (tx.type === 'debit') {
          expenses += amount;
          const category = tx.category || 'Other';
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });

      // Highly distinct but premium color mapping
      const categoryColors: Record<string, string> = {
        'Shopping': 'bg-blue-500',
        'Food & Drink': 'bg-emerald-500',
        'Food': 'bg-emerald-500',
        'Rent': 'bg-rose-500',
        'Travel': 'bg-cyan-500',
        'Bills': 'bg-amber-500',
        'Income': 'bg-secondary',
        'Uncategorised': 'bg-slate-400',
        'Other': 'bg-slate-400',
        'UPI Payments': 'bg-orange-400'
      };

      const fallbackColors = [
        'bg-blue-500',
        'bg-emerald-500',
        'bg-orange-400',
        'bg-rose-500',
        'bg-amber-500',
        'bg-cyan-500',
        'bg-indigo-500',
        'bg-teal-500'
      ];

      const formattedCategoryData = Object.entries(categoryTotals)
        .map(([name, total], index) => {
          const cleanName = name.split('/')[0].trim(); // Handle potential slashes from UPI decodings
          return {
            name: (name === 'Uncategorized' || name === 'uncategorised' || name === 'Uncategorised') ? 'Other' : name,
            val: expenses > 0 ? Math.round((total / expenses) * 100) : 0,
            color: categoryColors[name] || categoryColors[cleanName] || fallbackColors[index % fallbackColors.length]
          };
        })
        .sort((a, b) => b.val - a.val);

      setCategoryData(formattedCategoryData);

      setStats({
        netWorth: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
      });

      // Fetch financial health scores
      const { data: healthScores } = await supabase
        .from('financial_health_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (healthScores) {
        setHealthData(healthScores);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted font-medium mt-1">Welcome back, {userName}! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-muted/5 border border-border px-4 py-2 rounded-xl text-sm font-medium">
            <Calendar size={16} className="text-muted" />
            <span>Jan 17, 2026</span>
          </div>
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <OverviewCard
              title="Total Net Change"
              amount={formatCurrency(stats.netWorth)}
              change=""
              trend={stats.netWorth >= 0 ? "up" : "down"}
              icon={Wallet}
              variant="primary"
            />
            <OverviewCard
              title="Total Credited"
              amount={formatCurrency(stats.totalIncome)}
              change=""
              trend="up"
              icon={ArrowUpCircle}
            />
            <OverviewCard
              title="Total Debited"
              amount={formatCurrency(stats.totalExpenses)}
              change=""
              trend="down"
              icon={ArrowDownCircle}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-10">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {(categoryData.length > 0 ? categoryData.slice(0, 4) : [
                  { name: "Shopping", val: 0, color: "bg-primary" },
                  { name: "Food", val: 0, color: "bg-secondary" },
                  { name: "Rent", val: 0, color: "bg-accent" },
                  { name: "Travel", val: 0, color: "bg-muted" },
                ]).map((item) => (
                  <div key={item.name} className="space-y-2">
                    <p className="text-[11px] font-black text-muted uppercase tracking-widest truncate" title={item.name}>{item.name}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold">{item.val}%</span>
                      <div className={cn("w-2 h-2 rounded-full mb-1.5", item.color)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 h-4 w-full bg-muted/10 rounded-full flex overflow-hidden">
                {categoryData.length > 0 ? categoryData.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn("h-full transition-all duration-1000", item.color)}
                    style={{ width: `${item.val}%` }}
                  />
                )) : (
                  <div className="h-full bg-muted/20 w-full" />
                )}
              </div>
            </CardContent>
          </Card>

          <RecentTransactions />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-10">
          <SavingsGoal />

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Financial Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {healthData ? (
                <>
                  {/* Speedometer */}
                  <div className="-mt-4">
                    <FinancialHealthSpeedometer score={healthData.financial_health_score} size="md" />
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 gap-5">
                    {[
                      { label: "Spending", score: healthData.spending_score, icon: Wallet },
                      { label: "Savings", score: healthData.savings_score, icon: PiggyBank },
                      { label: "Credit", score: healthData.credit_score, icon: CreditCard },
                      { label: "EMI", score: healthData.emi_score, icon: TrendingDown },
                      { label: "Emergency", score: healthData.emergency_score, icon: ShieldAlert },
                    ].map((item) => {
                      const getThemeColor = (s: number) => {
                        if (s >= 80) return "text-secondary bg-secondary/10";
                        if (s >= 60) return "text-blue-500 bg-blue-500/10";
                        if (s >= 40) return "text-amber-500 bg-amber-500/10";
                        return "text-accent bg-accent/10";
                      };

                      const getProgressColor = (s: number) => {
                        if (s >= 80) return "bg-secondary";
                        if (s >= 60) return "bg-blue-500";
                        if (s >= 40) return "bg-amber-500";
                        return "bg-accent";
                      };

                      return (
                        <div key={item.label} className="group flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm", getThemeColor(item.score))}>
                                <item.icon size={20} />
                              </div>
                              <span className="text-sm font-bold text-foreground/90 tracking-tight">{item.label}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-black tracking-tighter">{item.score}</span>
                              <span className="text-[9px] font-bold text-muted/40 uppercase tracking-widest">Score</span>
                            </div>
                          </div>
                          <div className="h-2 w-full bg-muted/10 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-1000 ease-out rounded-full", getProgressColor(item.score))}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>


                </>
              ) : (
                <div className="text-center py-8">
                  <ShieldAlert className="w-10 h-10 text-muted/20 mx-auto mb-3" />
                  <p className="text-xs text-muted">No financial health data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

