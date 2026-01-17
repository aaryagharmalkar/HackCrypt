"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, DollarSign, Briefcase, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
}

interface IncomeCalculatorProps {
  onIncomeChange?: (monthlyIncome: number) => void;
}

export function IncomeCalculator({ onIncomeChange }: IncomeCalculatorProps) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    amount: "",
    frequency: "monthly" as 'monthly' | 'weekly' | 'yearly'
  });

  useEffect(() => {
    fetchIncomeSources();
  }, []);

  useEffect(() => {
    if (onIncomeChange) {
      const monthly = calculateMonthlyIncome();
      onIncomeChange(monthly);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomeSources]);

  const fetchIncomeSources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('income_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setIncomeSources(data || []);
    } catch (error) {
      console.error("Error fetching income sources:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyIncome = () => {
    return incomeSources.reduce((total, source) => {
      let monthlyAmount = source.amount;
      if (source.frequency === 'weekly') {
        monthlyAmount = source.amount * 4.33; // Average weeks per month
      } else if (source.frequency === 'yearly') {
        monthlyAmount = source.amount / 12;
      }
      return total + monthlyAmount;
    }, 0);
  };

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.amount) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('income_sources')
        .insert([{
          user_id: user.id,
          name: newSource.name,
          amount: parseFloat(newSource.amount),
          frequency: newSource.frequency
        }])
        .select()
        .single();

      if (error) throw error;

      setIncomeSources([...incomeSources, data]);
      setNewSource({ name: "", amount: "", frequency: "monthly" });
      setAdding(false);
    } catch (error) {
      console.error("Error adding income source:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('income_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIncomeSources(incomeSources.filter(s => s.id !== id));
    } catch (error) {
      console.error("Error deleting income source:", error);
    }
  };

  const monthlyIncome = calculateMonthlyIncome();

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-500" />
              Monthly Income
            </CardTitle>
            <CardDescription>Track all your income sources</CardDescription>
          </div>
          {!adding && (
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2"
              onClick={() => setAdding(true)}
            >
              <Plus size={16} />
              Add Source
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-muted" />
          </div>
        ) : (
          <>
            {/* Total Monthly Income */}
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="text-xs font-bold text-muted uppercase mb-2">Total Monthly Income</p>
              <p className="text-3xl font-black text-emerald-600">₹{Math.round(monthlyIncome).toLocaleString()}</p>
              <p className="text-xs text-muted mt-2">
                ₹{Math.round(monthlyIncome * 12).toLocaleString()}/year
              </p>
            </div>

            {/* Income Sources */}
            <div className="space-y-3">
              {incomeSources.map((source) => {
                const monthlyAmount = source.frequency === 'weekly' 
                  ? source.amount * 4.33 
                  : source.frequency === 'yearly' 
                  ? source.amount / 12 
                  : source.amount;

                return (
                  <div 
                    key={source.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-xl group hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{source.name}</p>
                        <p className="text-xs text-muted">
                          ₹{source.amount.toLocaleString()}/{source.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{Math.round(monthlyAmount).toLocaleString()}</p>
                        <p className="text-[10px] text-muted">per month</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        onClick={() => handleDelete(source.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Add New Source Form */}
              {adding && (
                <div className="p-4 bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl space-y-3">
                  <Input
                    placeholder="Income source name (e.g., Salary)"
                    value={newSource.name}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newSource.amount}
                      onChange={(e) => setNewSource({ ...newSource, amount: e.target.value })}
                    />
                    <select
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newSource.frequency}
                      onChange={(e) => setNewSource({ ...newSource, frequency: e.target.value as 'monthly' | 'weekly' | 'yearly' })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={handleAddSource}
                    >
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setAdding(false);
                        setNewSource({ name: "", amount: "", frequency: "monthly" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {incomeSources.length === 0 && !adding && (
                <p className="text-center text-sm text-muted py-4">
                  No income sources added yet
                </p>
              )}
            </div>

            {/* Income Breakdown */}
            {incomeSources.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-bold text-muted uppercase mb-3">Recommended Allocation (50/30/20)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <p className="text-[10px] text-muted font-bold">NEEDS (50%)</p>
                    <p className="text-sm font-black text-blue-600">₹{Math.round(monthlyIncome * 0.5).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-violet-500/10 rounded-xl">
                    <p className="text-[10px] text-muted font-bold">WANTS (30%)</p>
                    <p className="text-sm font-black text-violet-600">₹{Math.round(monthlyIncome * 0.3).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <p className="text-[10px] text-muted font-bold">SAVINGS (20%)</p>
                    <p className="text-sm font-black text-emerald-600">₹{Math.round(monthlyIncome * 0.2).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
