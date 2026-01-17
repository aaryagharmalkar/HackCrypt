"use client";

import React, { useEffect, useState } from "react";
import {
    Target,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownCircle,
    Plus,
    Pencil,
    Trash2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Budget {
    id: string;
    name: string;
    limit_amount: number;
    spent?: number;
    color: string;
}

interface Goal {
    id: string;
    name: string;
    saved_amount: number;
    target_amount: number;
    target_date: string;
    color: string;
}

interface Transaction {
    amount: number;
    category: string;
    type: string;
}

const COLORS = [
    { label: "Primary", value: "bg-primary" },
    { label: "Secondary", value: "bg-secondary" },
    { label: "Accent", value: "bg-accent" },
    { label: "Slate", value: "bg-slate-400" },
    { label: "Amber", value: "bg-amber-500" },
    { label: "Emerald", value: "bg-emerald-500" },
    { label: "Rose", value: "bg-rose-500" },
    { label: "Violet", value: "bg-violet-500" },
];

export default function BudgetingPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        limit_amount: "",
        color: "bg-primary"
    });
    const [goalFormData, setGoalFormData] = useState({
        name: "",
        saved_amount: "",
        target_amount: "",
        target_date: "",
        color: "text-primary"
    });
    const [saving, setSaving] = useState(false);
    const [insights, setInsights] = useState({
        topSpendingCategory: "",
        topSpendingAmount: 0,
        nearLimitBudgets: [] as string[],
        totalBudget: 0,
        totalSpent: 0,
        savingPotential: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch budgets
            const { data: budgetsData, error: budgetsError } = await supabase
                .from('budgets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (budgetsError) throw budgetsError;

            // Fetch transactions for calculation
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('amount, category, type')
                .eq('user_id', user.id);

            if (transactionsError) throw transactionsError;

            console.log('Transactions:', transactionsData); // Debug log

            // Calculate spent amount per category
            const calculatedBudgets = budgetsData.map((budget: any) => {
                const categoryTransactions = transactionsData?.filter((t: any) => {
                    // Match category case-insensitively and only count debit transactions
                    const categoryMatch = t.category?.toLowerCase().trim() === budget.name.toLowerCase().trim();
                    const isDebit = t.type?.toLowerCase() === 'debit';
                    return categoryMatch && isDebit;
                }) || [];
                
                console.log(`Budget: ${budget.name}, Matching transactions:`, categoryTransactions); // Debug log
                
                const spent = categoryTransactions.reduce((acc: number, curr: any) => {
                    return acc + Math.abs(Number(curr.amount));
                }, 0);
                
                return {
                    ...budget,
                    spent: spent
                };
            });

            setBudgets(calculatedBudgets);

            // Fetch goals
            const { data: goalsData, error: goalsError } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (goalsError) throw goalsError;
            setGoals(goalsData || []);

            // Calculate insights
            if (calculatedBudgets.length > 0) {
                const totalBudget = calculatedBudgets.reduce((sum, b) => sum + b.limit_amount, 0);
                const totalSpent = calculatedBudgets.reduce((sum, b) => sum + (b.spent || 0), 0);
                
                // Find top spending category
                const topSpender = calculatedBudgets.reduce((max, b) => 
                    (b.spent || 0) > (max.spent || 0) ? b : max
                );
                
                // Find budgets near limit (>85%)
                const nearLimit = calculatedBudgets
                    .filter(b => ((b.spent || 0) / b.limit_amount) > 0.85)
                    .map(b => b.name);
                
                // Calculate saving potential (difference between budget and spent)
                const savingPotential = totalBudget - totalSpent;
                
                setInsights({
                    topSpendingCategory: topSpender.name,
                    topSpendingAmount: topSpender.spent || 0,
                    nearLimitBudgets: nearLimit,
                    totalBudget,
                    totalSpent,
                    savingPotential: savingPotential > 0 ? savingPotential : 0
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (budget?: Budget) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                name: budget.name,
                limit_amount: budget.limit_amount.toString(),
                color: budget.color
            });
        } else {
            setEditingBudget(null);
            setFormData({
                name: "",
                limit_amount: "",
                color: "bg-primary"
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.limit_amount) return;
        
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const budgetData = {
                name: formData.name,
                limit_amount: parseFloat(formData.limit_amount),
                color: formData.color,
                user_id: user.id
            };

            if (editingBudget) {
                const { error } = await supabase
                    .from('budgets')
                    .update(budgetData)
                    .eq('id', editingBudget.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('budgets')
                    .insert([budgetData]);
                if (error) throw error;
            }

            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving budget:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this budget?")) return;
        
        try {
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    const handleOpenGoalModal = (goal?: Goal) => {
        if (goal) {
            setEditingGoal(goal);
            setGoalFormData({
                name: goal.name,
                saved_amount: goal.saved_amount.toString(),
                target_amount: goal.target_amount.toString(),
                target_date: goal.target_date,
                color: goal.color
            });
        } else {
            setEditingGoal(null);
            setGoalFormData({
                name: "",
                saved_amount: "",
                target_amount: "",
                target_date: "",
                color: "text-primary"
            });
        }
        setIsGoalModalOpen(true);
    };

    const handleSaveGoal = async () => {
        if (!goalFormData.name || !goalFormData.saved_amount || !goalFormData.target_amount || !goalFormData.target_date) return;
        
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const goalData = {
                name: goalFormData.name,
                saved_amount: parseFloat(goalFormData.saved_amount),
                target_amount: parseFloat(goalFormData.target_amount),
                target_date: goalFormData.target_date,
                color: goalFormData.color,
                user_id: user.id
            };

            if (editingGoal) {
                const { error } = await supabase
                    .from('goals')
                    .update(goalData)
                    .eq('id', editingGoal.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('goals')
                    .insert([goalData]);
                if (error) throw error;
            }

            await fetchData();
            setIsGoalModalOpen(false);
        } catch (error) {
            console.error("Error saving goal:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGoal = async (id: string) => {
        if (!confirm("Are you sure you want to delete this goal?")) return;
        
        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            await fetchData();
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Budgets & Goals</h1>
                    <p className="text-muted font-medium mt-1">Plan your future and stay on track with your spending.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button size="sm" className="gap-2 shrink-0" onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        Create New Budget
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Budget Summary Card */}
                {budgets.length > 0 && (
                    <div className="lg:col-span-12">
                        <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Budget</p>
                                        <p className="text-2xl font-black">₹{insights.totalBudget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Spent</p>
                                        <p className="text-2xl font-black text-primary">₹{insights.totalSpent.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Remaining</p>
                                        <p className="text-2xl font-black text-secondary">₹{insights.savingPotential.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Active Budgets</p>
                                        <p className="text-2xl font-black">{budgets.length}</p>
                                        {insights.nearLimitBudgets.length > 0 && (
                                            <Badge variant="warning" className="mt-2 text-[10px]">
                                                {insights.nearLimitBudgets.length} Near Limit
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Monthly Budgets */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Monthly Category Budgets</CardTitle>
                            <CardDescription>Track your spending against your set limits.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-muted" />
                                </div>
                            ) : budgets.length === 0 ? (
                                <div className="text-center py-8 text-muted">
                                    <p>No budgets created yet. Start by creating one!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <div className="flex gap-2">
                                            <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div className="text-xs text-blue-800">
                                                <p className="font-bold mb-1">How Budget Tracking Works:</p>
                                                <p className="mb-2">Budget spending is automatically calculated from your transactions. The category in your transaction must match the budget name.</p>
                                                <p className="font-semibold">Example:</p>
                                                <ul className="list-disc ml-4 mt-1 space-y-1">
                                                    <li>Budget name: "Travel" → Counts transactions with category "Travel"</li>
                                                    <li>Budget name: "Food" → Counts transactions with category "Food"</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {budgets.map((budget) => {
                                        const spent = budget.spent || 0;
                                        const percentage = Math.min((spent / budget.limit_amount) * 100, 100);
                                        const isNearLimit = percentage > 85;

                                        return (
                                            <div key={budget.id} className="space-y-3 group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-sm">{budget.name}</span>
                                                        {isNearLimit && (
                                                            <Badge variant="warning" className="text-[10px] py-0">Near Limit</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs font-medium text-muted">
                                                            ₹{spent.toLocaleString()} / <span className="text-foreground">₹{budget.limit_amount.toLocaleString()}</span>
                                                        </span>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenModal(budget)}>
                                                                <Pencil size={12} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(budget.id)}>
                                                                <Trash2 size={12} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="h-2.5 w-full bg-muted/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full transition-all duration-700", budget.color)}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md bg-secondary/5 border border-secondary/10">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="font-bold">Budget Overview</h3>
                                </div>
                                {budgets.length === 0 ? (
                                    <p className="text-sm text-muted leading-relaxed">
                                        Create budgets to see your spending overview and track your financial health.
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-sm text-muted leading-relaxed">
                                            You've spent <span className="text-foreground font-bold">₹{insights.totalSpent.toLocaleString()}</span> out of <span className="text-foreground font-bold">₹{insights.totalBudget.toLocaleString()}</span> total budget.
                                            {insights.savingPotential > 0 && (
                                                <> You're on track to save <span className="text-secondary font-bold">₹{insights.savingPotential.toLocaleString()}</span> this month!</>
                                            )}
                                        </p>
                                        <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
                                            <p className="text-xs font-bold text-secondary">Budget Utilization</p>
                                            <p className="text-2xl font-black text-secondary mt-1">
                                                {((insights.totalSpent / insights.totalBudget) * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-primary/5 border border-primary/10">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="font-bold">Spending Alert</h3>
                                </div>
                                {budgets.length === 0 ? (
                                    <p className="text-sm text-muted leading-relaxed">
                                        Set up budgets to receive alerts when you're approaching your spending limits.
                                    </p>
                                ) : insights.nearLimitBudgets.length > 0 ? (
                                    <>
                                        <p className="text-sm text-muted leading-relaxed">
                                            You're near the limit on <span className="text-accent font-bold">{insights.nearLimitBudgets.join(", ")}</span>. Consider reviewing your spending in {insights.nearLimitBudgets.length > 1 ? 'these categories' : 'this category'}.
                                        </p>
                                        <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-primary hover:bg-primary/5">
                                            Review Spending
                                        </Button>
                                    </>
                                ) : insights.topSpendingCategory ? (
                                    <>
                                        <p className="text-sm text-muted leading-relaxed">
                                            Your highest spending is in <span className="text-primary font-bold">{insights.topSpendingCategory}</span> with <span className="text-foreground font-bold">₹{insights.topSpendingAmount.toLocaleString()}</span> spent.
                                        </p>
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                            <p className="text-xs font-bold text-green-700">✓ All budgets are healthy</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted leading-relaxed">
                                        No spending detected yet. Start adding transactions to track your budget usage.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Financial Goals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-muted" />
                                </div>
                            ) : goals.length === 0 ? (
                                <div className="text-center py-8 text-muted">
                                    <p className="text-sm">No goals created yet. Start by creating one!</p>
                                </div>
                            ) : (
                                goals.map((goal) => {
                                    const percentage = (goal.saved_amount / goal.target_amount) * 100;
                                    return (
                                        <div key={goal.id} className="space-y-4 group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm">{goal.name}</p>
                                                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">Target: {goal.target_date}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-lg font-black", goal.color)}>
                                                        {percentage.toFixed(1)}%
                                                    </span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleOpenGoalModal(goal)}>
                                                            <Pencil size={12} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteGoal(goal.id)}>
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                            <div className="flex justify-between text-[10px] font-bold text-muted uppercase">
                                                <span>Saved: ₹{goal.saved_amount.toLocaleString()}</span>
                                                <span>₹{goal.target_amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 hover:bg-muted/5 transition-all font-bold" onClick={() => handleOpenGoalModal()}>
                                <Plus size={16} className="mr-2" />
                                Add New Goal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Budget Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBudget ? "Edit Budget" : "Create New Budget"}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g., Food, Travel"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <p className="text-xs text-muted">This should match your transaction category.</p>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Monthly Limit (₹)</label>
                        <Input
                            type="number"
                            placeholder="e.g., 5000"
                            value={formData.limit_amount}
                            onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                            min="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color Label</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all",
                                        c.value,
                                        formData.color === c.value ? "border-foreground scale-110" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                    onClick={() => setFormData({ ...formData, color: c.value })}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Saving...
                                </>
                            ) : (
                                "Save Budget"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Goal Modal */}
            <Modal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                title={editingGoal ? "Edit Goal" : "Create New Goal"}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Goal Name</label>
                        <Input
                            placeholder="e.g., Emergency Fund, Dream House"
                            value={goalFormData.name}
                            onChange={(e) => setGoalFormData({ ...goalFormData, name: e.target.value })}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount Saved (₹)</label>
                        <Input
                            type="number"
                            placeholder="e.g., 50000"
                            value={goalFormData.saved_amount}
                            onChange={(e) => setGoalFormData({ ...goalFormData, saved_amount: e.target.value })}
                            min="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Amount (₹)</label>
                        <Input
                            type="number"
                            placeholder="e.g., 500000"
                            value={goalFormData.target_amount}
                            onChange={(e) => setGoalFormData({ ...goalFormData, target_amount: e.target.value })}
                            min="0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Date</label>
                        <Input
                            type="text"
                            placeholder="e.g., Dec 2026"
                            value={goalFormData.target_date}
                            onChange={(e) => setGoalFormData({ ...goalFormData, target_date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color Label</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Primary", value: "text-primary" },
                                { label: "Secondary", value: "text-secondary" },
                                { label: "Accent", value: "text-accent" },
                                { label: "Emerald", value: "text-emerald-500" },
                                { label: "Rose", value: "text-rose-500" },
                                { label: "Violet", value: "text-violet-500" },
                                { label: "Amber", value: "text-amber-500" },
                            ].map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    className={cn(
                                        "px-3 py-1.5 rounded-md border-2 text-xs font-bold transition-all",
                                        c.value,
                                        goalFormData.color === c.value ? "border-foreground bg-muted/30" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                    onClick={() => setGoalFormData({ ...goalFormData, color: c.value })}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsGoalModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveGoal} disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Saving...
                                </>
                            ) : (
                                "Save Goal"
                            )}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}