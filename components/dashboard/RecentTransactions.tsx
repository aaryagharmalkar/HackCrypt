"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    ShoppingBag,
    Coffee,
    Car,
    Home,
    Smartphone,
    ArrowUpRight,
    ArrowDownLeft,
    Briefcase,
    Plane,
    DollarSign,
    CreditCard,
    Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Helper to map category to icon (matching transactions page)
const getCategoryIcon = (category: string) => {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('shop')) return ShoppingBag;
    if (lower.includes('food') || lower.includes('drink')) return Coffee;
    if (lower.includes('transport') || lower.includes('uber') || lower.includes('ola')) return Car;
    if (lower.includes('house') || lower.includes('rent')) return Home;
    if (lower.includes('util') || lower.includes('bill') || lower.includes('recharge')) return Smartphone;
    if (lower.includes('salary') || lower.includes('income')) return ArrowUpRight;
    if (lower.includes('transfer')) return ArrowDownLeft;
    if (lower.includes('tax')) return Briefcase;
    if (lower.includes('travel')) return Plane;
    if (lower.includes('invest')) return DollarSign;
    return CreditCard;
};

interface Transaction {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: string;
    type: string;
}

export function RecentTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })
                    .limit(5);

                if (error) throw error;

                const formatted = data.map((tx: any) => ({
                    id: tx.id,
                    name: tx.description,
                    category: tx.category || 'Uncategorized',
                    amount: tx.amount,
                    date: new Date(tx.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                    }),
                    type: tx.type
                }));

                setTransactions(formatted);
            } catch (error) {
                console.error('Error fetching recent transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <Link href="/transactions">
                    <Badge variant="outline" className="cursor-pointer hover:bg-muted/10">View All</Badge>
                </Link>
            </CardHeader>
            <CardContent>
                {/* Column Headers */}
                <div className="grid grid-cols-12 px-2 py-3 mb-2 border-b border-border/50 text-[11px] font-black text-muted uppercase tracking-widest">
                    <div className="col-span-6 md:col-span-5">Transaction</div>
                    <div className="hidden md:block md:col-span-3">Category</div>
                    <div className="hidden sm:block sm:col-span-3 md:col-span-2">Date</div>
                    <div className="col-span-6 sm:col-span-3 md:col-span-2 text-right">Amount</div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-muted" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="text-center text-muted text-sm py-8">No recent transactions</p>
                    ) : (
                        transactions.map((tx) => {
                            const Icon = getCategoryIcon(tx.category);
                            return (
                                <div key={tx.id} className="grid grid-cols-12 items-center group cursor-pointer hover:bg-muted/5 p-2 -mx-2 rounded-xl transition-colors">
                                    {/* Transaction Name Column */}
                                    <div className="col-span-6 md:col-span-5 flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all shrink-0">
                                            <Icon size={18} />
                                        </div>
                                        <div className="min-w-0 pr-2">
                                            <p className="font-bold text-[15px] leading-tight truncate">
                                                {(() => {
                                                    const parts = tx.name.split('/');
                                                    if (parts.length >= 2) return parts[1].trim();
                                                    return tx.name;
                                                })()}
                                            </p>
                                            <p className="text-[11px] text-muted mt-0.5 md:hidden truncate">{tx.category} • {tx.date}</p>
                                        </div>
                                    </div>

                                    {/* Category Column */}
                                    <div className="hidden md:block md:col-span-3">
                                        <Badge variant="secondary" className="text-[11px] font-bold uppercase tracking-tighter px-2.5 py-0.5">
                                            {tx.category}
                                        </Badge>
                                    </div>

                                    {/* Date Column */}
                                    <div className="hidden sm:block sm:col-span-3 md:col-span-2">
                                        <span className="text-sm font-medium text-muted">{tx.date}</span>
                                    </div>

                                    {/* Amount Column */}
                                    <div className="col-span-6 sm:col-span-3 md:col-span-2 text-right">
                                        <p className={cn(
                                            "font-bold text-[15px]",
                                            tx.type === 'credit' ? 'text-secondary' : 'text-foreground'
                                        )}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-tighter">Verified</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

