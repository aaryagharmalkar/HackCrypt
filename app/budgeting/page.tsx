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
import { Input } from "@/components/ui/Input"; // Assuming Input exists from previous check
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface Budget {
    id: string;
    name: string;
    limit_amount: number;
    spent?: number;
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

const goals = [
    { name: "Emergency Fund", saved: 150000, target: 500000, date: "Dec 2026", color: "text-secondary" },
    { name: "Dream House", saved: 650000, target: 10000000, date: "June 2030", color: "text-primary" },
    { name: "New Car", saved: 250000, target: 1500000, date: "Aug 2027", color: "text-accent" },
];

export default function BudgetingPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        limit_amount: "",
        color: "bg-primary"
    });
    const [saving, setSaving] = useState(false);

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
                .eq('user_id', user.id)
                .eq('type', 'debit');

            if (transactionsError) throw transactionsError;

            // Calculate spent amount per category
            const calculatedBudgets = budgetsData.map((budget: any) => {
                const spent = transactionsData
                    ?.filter((t: any) => t.category?.toLowerCase() === budget.name.toLowerCase())
                    .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
                
                return {
                    ...budget,
                    spent: Math.abs(spent)
                };
            });

            setBudgets(calculatedBudgets);
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
                                budgets.map((budget) => {
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
                                })
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
                                    <h3 className="font-bold">Saving Potential</h3>
                                </div>
                                <p className="text-sm text-muted leading-relaxed">
                                    Based on your current spending, you could save an additional <span className="text-foreground font-bold">₹8,500</span> this month by optimizing your utilities.
                                </p>
                                <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-secondary hover:bg-secondary/5">
                                    See Recommendations
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-primary/5 border border-primary/10">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="font-bold">Overspending Alert</h3>
                                </div>
                                <p className="text-sm text-muted leading-relaxed">
                                    You are tracking <span className="text-accent font-bold">12% higher</span> than usual on Dining. Consider cutting back for the next 5 days.
                                </p>
                                <Button variant="ghost" className="w-full mt-4 text-xs font-bold text-primary hover:bg-primary/5">
                                    Manage Dining Budget
                                </Button>
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
                            {goals.map((goal) => {
                                const percentage = (goal.saved / goal.target) * 100;
                                return (
                                    <div key={goal.name} className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-sm">{goal.name}</p>
                                                <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1">Target: {goal.date}</p>
                                            </div>
                                            <span className={cn("text-lg font-black", goal.color)}>
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={percentage} className="h-2" />
                                        <div className="flex justify-between text-[10px] font-bold text-muted uppercase">
                                            <span>Saved: ₹{goal.saved.toLocaleString()}</span>
                                            <span>₹{goal.target.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 hover:bg-muted/5 transition-all font-bold">
                                <Plus size={16} className="mr-2" />
                                Add New Goal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBudget ? "Edit Budget" : "Create New Budget"}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <Input
                            placeholder="e.g., Food, Travel"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
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
                            required
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
                                    // Make sure the color variable is valid in tailwind context or added to safelist if dynamic
                                    // For now relying on standard classes being picked up
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
                        <Button type="submit" disabled={saving}>
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
                </form>
            </Modal>
        </div>
    );
}


