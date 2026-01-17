"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Loader2,
  Lightbulb,
  Zap,
  TrendingUp,
  AlertCircle,
  Target,
  PiggyBank,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { Budget, Goal } from "@/lib/database.types";
import { BudgetCard } from "@/components/budgeting/BudgetCard";
import { GoalCard } from "@/components/budgeting/GoalCard";
import { BudgetGoalForm } from "@/components/budgeting/BudgetGoalForm";
import { IncomeCalculator } from "@/components/budgeting/IncomeCalculator";
import { StrategySelector } from "@/components/budgeting/StrategySelector";
import { InsightsModal } from "@/components/budgeting/InsightsModal";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

interface BudgetWithSpent extends Budget {
  spent: number;
}

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

export default function BudgetingPage() {
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'budget' | 'goal'>('budget');
  const [editingItem, setEditingItem] = useState<BudgetWithSpent | Goal | null>(null);
  
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [addFundsModalOpen, setAddFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [fundsAmount, setFundsAmount] = useState("");

  const [insights, setInsights] = useState<InsightData | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (budgetsError) throw budgetsError;

      // Fetch Goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (goalsError && goalsError.code !== 'PGRST116') throw goalsError;

      // Fetch Transactions (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('amount, category, type, date')
        .eq('user_id', user.id)
        .eq('type', 'debit')
        .gte('date', ninetyDaysAgo.toISOString());

      if (transactionsError) throw transactionsError;

      // Process budgets with spent amounts
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const processedBudgets = (budgetsData || []).map((budget: Budget) => {
        const spent = transactionsData
          ?.filter((t: any) => {
            const tDate = new Date(t.date);
            return (
              tDate.getMonth() === currentMonth &&
              tDate.getFullYear() === currentYear &&
              t.category?.toLowerCase().includes(budget.name.toLowerCase())
            );
          })
          .reduce((acc: number, curr: any) => acc + Math.abs(Number(curr.amount)), 0) || 0;

        return { ...budget, spent };
      });

      setBudgets(processedBudgets);
      setGoals(goalsData || []);

      // Process insights
      processInsights(transactionsData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const processInsights = (transactions: any[]) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = today.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    
    const lastMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    const thisMonthTotal = thisMonthTx.reduce((acc: number, t: any) => acc + Math.abs(t.amount), 0);
    const lastMonthTotal = lastMonthTx.reduce((acc: number, t: any) => acc + Math.abs(t.amount), 0);

    // Category analysis
    const catTotals: Record<string, number> = {};
    thisMonthTx.forEach((t: any) => {
      const cat = t.category || 'Uncategorised';
      catTotals[cat] = (catTotals[cat] || 0) + Math.abs(t.amount);
    });

    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
    const savingPotential = Math.round(thisMonthTotal * 0.1); // 10% potential savings

    // Overspending detection
    const lastMonthCats: Record<string, number> = {};
    lastMonthTx.forEach((t: any) => {
      const cat = t.category || 'Uncategorised';
      lastMonthCats[cat] = (lastMonthCats[cat] || 0) + Math.abs(t.amount);
    });

    let overspending;
    for (const [cat, amount] of Object.entries(catTotals)) {
      const lastAmount = lastMonthCats[cat] || 0;
      if (lastAmount > 0 && amount > lastAmount * 1.2) {
        const percentHigher = Math.round(((amount - lastAmount) / lastAmount) * 100);
        overspending = { category: cat, percentHigher };
        break;
      }
    }

    setInsights({
      topCategory: topCategory ? topCategory[0] : "None",
      topAmount: topCategory ? topCategory[1] : 0,
      totalDiff: thisMonthTotal - lastMonthTotal,
      biggestSpike: topCategory ? topCategory[0] : "None",
      savingPotential,
      overspending
    });
  };


  const handleOpenForm = (type: 'budget' | 'goal', item?: BudgetWithSpent | Goal) => {
    setFormType(type);
    setEditingItem(item || null);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (formData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const commonData = {
        name: formData.name,
        color: formData.color,
        user_id: user.id
      };

      if (formType === 'budget') {
        const budgetData = {
          ...commonData,
          limit_amount: parseFloat(formData.amount),
          period: formData.period
        };

        if (editingItem) {
          await supabase.from('budgets').update(budgetData).eq('id', editingItem.id);
        } else {
          await supabase.from('budgets').insert([budgetData]);
        }
      } else {
        const goalData = {
          ...commonData,
          target_amount: parseFloat(formData.amount),
          saved_amount: parseFloat(formData.saved_amount || '0'),
          target_date: formData.date
        };

        if (editingItem) {
          await supabase.from('goals').update(goalData).eq('id', editingItem.id);
        } else {
          await supabase.from('goals').insert([goalData]);
        }
      }

      await fetchData();
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving:", error);
      alert(`Failed to save ${formType}. Please ensure all tables exist in your database.`);
    }
  };

  const handleDelete = async (id: string, type: 'budget' | 'goal') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      await supabase.from(type === 'budget' ? 'budgets' : 'goals').delete().eq('id', id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSelectStrategy = (strategy: any) => {
    setStrategyModalOpen(false);
    setFormType(strategy.type);
    setEditingItem(null);
    
    // Pre-populate form through opening it
    setTimeout(() => {
      setIsFormOpen(true);
    }, 100);
  };

  const handleAddFunds = async () => {
    if (!selectedGoal || !fundsAmount) return;

    try {
      const newSavedAmount = selectedGoal.saved_amount + parseFloat(fundsAmount);
      
      await supabase
        .from('goals')
        .update({ saved_amount: newSavedAmount })
        .eq('id', selectedGoal.id);

      await fetchData();
      setAddFundsModalOpen(false);
      setSelectedGoal(null);
      setFundsAmount("");
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  const openAddFundsModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setAddFundsModalOpen(true);
  };

  // Calculate statistics
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.limit_amount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const budgetUtilization = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  
  const totalGoalTarget = goals.reduce((acc, g) => acc + g.target_amount, 0);
  const totalGoalSaved = goals.reduce((acc, g) => acc + g.saved_amount, 0);
  const goalProgress = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets & Goals</h1>
          <p className="text-muted font-medium mt-1">
            Plan your financial future and track your progress
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => setInsightModalOpen(true)}
          >
            <Lightbulb size={18} className="text-amber-500" />
            Insights
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-dashed border-primary/50 text-primary hover:bg-primary/5"
            onClick={() => setStrategyModalOpen(true)}
          >
            <Zap size={18} />
            Strategies
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => handleOpenForm('budget')}
          >
            <Plus size={18} />
            New Budget
          </Button>
        </div>
      </header>

      {/* Overview Stats */}
      {!loading && (budgets.length > 0 || goals.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Wallet size={20} className="text-blue-600" />
                </div>
                <span className="text-2xl font-black text-blue-600">
                  {budgetUtilization.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">Budget Used</p>
              <p className="text-xs text-muted mt-1">
                ₹{totalSpent.toLocaleString()} of ₹{totalBudgeted.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Target size={20} className="text-emerald-600" />
                </div>
                <span className="text-2xl font-black text-emerald-600">
                  {goalProgress.toFixed(0)}%
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">Goals Progress</p>
              <p className="text-xs text-muted mt-1">
                ₹{totalGoalSaved.toLocaleString()} of ₹{totalGoalTarget.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-violet-500/10 to-purple-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-violet-500/20 rounded-xl">
                  <PiggyBank size={20} className="text-violet-600" />
                </div>
                <span className="text-2xl font-black text-violet-600">
                  {goals.length}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">Active Goals</p>
              <p className="text-xs text-muted mt-1">
                {budgets.length} budget categories
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Budgets & Income */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Budgets */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Monthly Budgets</CardTitle>
              <CardDescription>Track spending against category limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-muted" />
                </div>
              ) : budgets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet size={32} className="text-muted" />
                  </div>
                  <p className="text-muted font-medium mb-4">No budgets created yet</p>
                  <Button 
                    onClick={() => handleOpenForm('budget')}
                    className="gap-2"
                  >
                    <Plus size={16} />
                    Create Your First Budget
                  </Button>
                </div>
              ) : (
                budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onEdit={() => handleOpenForm('budget', budget)}
                    onDelete={() => handleDelete(budget.id, 'budget')}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Smart Alerts */}
          {insights && insights.savingPotential > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-none shadow-md bg-secondary/5 border border-secondary/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                      <TrendingUp size={18} />
                    </div>
                    <h3 className="font-bold text-sm">Saving Potential</h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    You could save <span className="text-foreground font-bold">₹{insights.savingPotential.toLocaleString()}</span> more this month by optimizing spending.
                  </p>
                </CardContent>
              </Card>

              {insights.overspending && (
                <Card className="border-none shadow-md bg-amber-500/5 border border-amber-500/10">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600">
                        <AlertCircle size={18} />
                      </div>
                      <h3 className="font-bold text-sm">Alert</h3>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      <span className="text-amber-600 font-bold">{insights.overspending.percentHigher}% higher</span> spending on {insights.overspending.category} than usual.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Goals & Income */}
        <div className="lg:col-span-5 space-y-6">
          {/* Financial Goals */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Financial Goals</CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="gap-2"
                  onClick={() => handleOpenForm('goal')}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-muted" />
                </div>
              ) : goals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target size={24} className="text-muted" />
                  </div>
                  <p className="text-sm text-muted font-medium mb-3">No goals set yet</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenForm('goal')}
                    className="gap-2"
                  >
                    <Plus size={14} />
                    Add Your First Goal
                  </Button>
                </div>
              ) : (
                <>
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={() => handleOpenForm('goal', goal)}
                      onDelete={() => handleDelete(goal.id, 'goal')}
                      onAddFunds={() => openAddFundsModal(goal)}
                    />
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Income Calculator */}
          <IncomeCalculator onIncomeChange={setMonthlyIncome} />
        </div>
      </div>

      {/* Modals */}
      <BudgetGoalForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        type={formType}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <StrategySelector
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        onSelectStrategy={handleSelectStrategy}
        monthlyIncome={monthlyIncome}
      />

      <InsightsModal
        isOpen={insightModalOpen}
        onClose={() => setInsightModalOpen(false)}
        insights={insights}
      />

      {/* Add Funds Modal */}
      <Modal
        isOpen={addFundsModalOpen}
        onClose={() => {
          setAddFundsModalOpen(false);
          setSelectedGoal(null);
          setFundsAmount("");
        }}
        title="Add Progress to Goal"
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-xl">
              <p className="text-sm font-bold mb-1">{selectedGoal.name}</p>
              <p className="text-xs text-muted">
                Current: ₹{selectedGoal.saved_amount.toLocaleString()} / ₹{selectedGoal.target_amount.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Amount to Add (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1 gap-2" 
                onClick={handleAddFunds}
                disabled={!fundsAmount || parseFloat(fundsAmount) <= 0}
              >
                <TrendingUp size={16} />
                Add Funds
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setAddFundsModalOpen(false);
                  setSelectedGoal(null);
                  setFundsAmount("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
