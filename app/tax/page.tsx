"use client";

import React, { useEffect, useState } from "react";
import {
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowRight,
    Calculator,
    ShieldCheck,
    Plus,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { TaxChatbot } from "@/components/TaxChatbot";

interface TaxReport {
    id: string;
    financial_year: string;
    total_income: number;
    better_regime: string;
    investment_total: number;
    deduction_total: number;
    compliance_score: number;
    missing_documents: string[] | null;
    taxable_amount: number;
    calculated_at: string;
    updated_at: string;
    remaining_detections: {
        name: string;
        current: number;
        limit: number;
        status: string; // e.g., 'full', 'partial', 'none'
        action: string;
    }[];
}

export default function TaxPage() {
    const [report, setReport] = useState<TaxReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTaxReport = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('tax_reports')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) {
                    // console.error("Error fetching tax report", error);
                } else if (data) {
                    setReport(data);
                }
            } catch (error) {
                console.error("Failed to fetch tax data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaxReport();
    }, []);

    // Estimated Tax Calculation (Simplified for UI demo)
    // Old Regime Slab (approximate)
    const calculateTax = (taxable: number) => {
        const val = Number(taxable);
        if (val <= 250000) return 0;
        let tax = 0;
        if (val > 1000000) {
            tax += (val - 1000000) * 0.3;
            tax += 112500; // Tax for 10L
        } else if (val > 500000) {
            tax += (val - 500000) * 0.2;
            tax += 12500; // Tax for 5L
        } else {
            tax += (val - 250000) * 0.05;
        }
        return tax;
    };

    const estimatedTax = report ? calculateTax(report.taxable_amount) : 0;

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tax Center</h1>
                    <p className="text-muted font-medium mt-1">Automatic tax calculation, ITR readiness, and saving suggestions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shrink-0">
                        <Calculator size={18} />
                        Tax Calculator
                    </Button>
                    <Button className="gap-2 shrink-0">
                        <FileText size={18} />
                        Prepare ITR
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Summary Card */}
                    <Card className="border-none shadow-md overflow-hidden bg-slate-950 text-white">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Tax ({report?.financial_year || 'FY 2025-26'})</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-white">
                                            {report ? `₹${Math.round(estimatedTax).toLocaleString()}` : '₹0'}
                                        </span>
                                        <span className="text-sm font-bold text-emerald-400">Payable</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium mt-4 flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                        Calculated based on linked bank and investment data.
                                    </p>
                                </div>
                                <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                                    <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Income</p>
                                        <p className="text-base font-bold text-white">
                                            {report ? `₹${Number(report.total_income).toLocaleString()}` : '₹0'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Taxable Income</p>
                                        <p className="text-base font-bold text-white">
                                            {report ? `₹${Number(report.taxable_amount).toLocaleString()}` : '₹0'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/10 border border-white/10 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Deductions</p>
                                        <p className="text-base font-bold text-emerald-400">
                                            {report ? `₹${Number(report.deduction_total).toLocaleString()}` : '₹0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Missing Documents */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Missing Documents</h3>
                            <div className={cn(
                                "px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2",
                                report?.compliance_score && report.compliance_score >= 80 
                                    ? "bg-green-100 text-green-700 border border-green-200" 
                                    : report?.compliance_score && report.compliance_score >= 50
                                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                    : "bg-red-100 text-red-700 border border-red-200"
                            )}>
                                <ShieldCheck size={16} />
                                {report?.compliance_score ? `${Math.round(report.compliance_score)}%` : '0%'} Compliance
                            </div>
                        </div>
                        {report?.missing_documents && report.missing_documents.length > 0 ? (
                            <Card className="border-none shadow-md overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {report.missing_documents.map((docName, idx) => (
                                            <div 
                                                key={idx} 
                                                className="p-5 hover:bg-slate-50 transition-all group cursor-pointer flex items-center gap-4"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                    <FileText size={20} className="text-red-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-900 mb-0.5">{docName}</p>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Required for tax compliance
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs h-9 px-4 rounded-xl font-bold gap-2 shrink-0 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all"
                                                >
                                                    <Plus size={14} />
                                                    Upload
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <CheckCircle2 size={32} className="text-green-600" />
                                    </div>
                                    <p className="font-bold text-green-900 text-lg mb-1">All documents uploaded!</p>
                                    <p className="text-sm text-green-700 font-medium">Your tax compliance is at 100%</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* AI Tax Assistant Chatbot */}
                <div className="lg:col-span-5">
                    <TaxChatbot />
                </div>
            </div>
        </div>
    );
}
