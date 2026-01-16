"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Search,
    Filter,
    Download,
    Plus,
    ShoppingBag,
    Coffee,
    Car,
    Home,
    Smartphone,
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    MoreHorizontal,
    Loader2,
    DollarSign,
    Briefcase,
    Utensils,
    Plane,
    Zap,
    Gift,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { PDFHandler } from "@/lib/pdf-handler";
import { motion, AnimatePresence } from "framer-motion";

// Helper to map category to icon
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
    method: string;
    status: string;
    type: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [snackbar, setSnackbar] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const metadata = await PDFHandler.uploadPDF(file);
            showMessage(`Statement "${metadata.fileName}" uploaded and stored successfully`);
            
            // If the user wants to see the uploaded documents, we can redirect or show a link
            console.log('PDF Public URL:', metadata.publicUrl);
            
            // Optional: Refresh transactions if the upload triggers a background process to parse them
            // fetchTransactions(); 
        } catch (error: any) {
            console.error('Error uploading file:', error);
            showMessage(error.message || 'Error uploading file', 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const fetchTransactions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) return;

            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            const formattedTransactions = data.map((tx: any) => ({
                id: tx.id,
                name: tx.description,
                category: tx.category || 'Uncategorized',
                amount: tx.type === 'debit' ? -Math.abs(tx.amount) : Math.abs(tx.amount),
                date: new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                method: "Bank Account", // Default for now since we don't have method in table yet
                status: "completed",
                type: tx.type
            }));

            setTransactions(formattedTransactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" 
            ? true 
            : filterCategory === "Income" 
                ? tx.amount > 0 
                : tx.amount < 0; // Expense
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted font-medium mt-1">Monitor and manage all your financial activities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shrink-0">
                        <Download size={18} />
                        Export
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf"
                        className="hidden"
                    />
                    <Button 
                        className="gap-2 shrink-0" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Plus size={18} />
                        )}
                        {uploading ? "Uploading..." : "Upload Statement"}
                    </Button>
                </div>
            </header>

            {/* Filters */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted/5 border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
                            <Filter size={18} />
                            Filters
                        </Button>
                        <div className="h-8 w-px bg-border hidden md:block" />
                        <div className="flex gap-2">
                            {["All", "Income", "Expense"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterCategory(tab)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                                        filterCategory === tab ? "bg-primary text-background" : "hover:bg-muted/10 text-muted hover:text-foreground"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions List */}
            <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/5">
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Transaction</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <p>Loading transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => {
                                    const Icon = getCategoryIcon(tx.category);
                                    return (
                                        <tr key={tx.id} className="group hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                                        <Icon size={18} />
                                                    </div>
                                                    <span className="font-semibold text-sm">{tx.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="font-medium text-[10px] uppercase tracking-wide">
                                                    {tx.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted font-medium">{tx.date}</td>
                                            <td className="px-6 py-4 text-sm text-muted font-medium">{tx.method}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} className="capitalize">
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                            <td className={cn(
                                                "px-6 py-4 text-sm font-bold text-right",
                                                tx.amount > 0 ? "text-secondary" : "text-foreground"
                                            )}>
                                                {tx.amount > 0 ? "+" : ""}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="text-muted hover:text-foreground">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {snackbar.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-50"
                    >
                        <div className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg border backdrop-blur-md",
                            snackbar.type === 'success' 
                                ? "bg-secondary/10 border-secondary/20 text-secondary" 
                                : "bg-accent/10 border-accent/20 text-accent"
                        )}>
                            {snackbar.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                            <p className="font-semibold">{snackbar.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
