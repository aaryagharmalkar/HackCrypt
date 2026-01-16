"use client";

import React from "react";
import {
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowRight,
    Calculator,
    ShieldCheck,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function TaxPage() {
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
                <div className="lg:col-span-8 space-y-8">
                    {/* Summary Card */}
                    <Card className="border-none shadow-md overflow-hidden bg-slate-100 dark:bg-slate-900">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-2">Estimated Tax (FY 2025-26)</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black">₹48,500</span>
                                        <span className="text-sm font-bold text-secondary">Payable</span>
                                    </div>
                                    <p className="text-xs text-muted font-medium mt-4 flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-secondary" />
                                        Calculated based on linked bank and investment data.
                                    </p>
                                </div>
                                <div className="w-full md:w-auto flex flex-col gap-3">
                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border">
                                        <p className="text-[10px] font-bold text-muted uppercase">Taxable Income</p>
                                        <p className="text-lg font-bold">₹12,45,000</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-border">
                                        <p className="text-[10px] font-bold text-muted uppercase">Deductions Claimed</p>
                                        <p className="text-lg font-bold text-secondary">₹1,50,000</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tax Saving Options */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Tax Saving Opportunities (80C/80D)</h3>
                            <Badge variant="secondary">₹1,50,000 / ₹2,00,000 used</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: "Public Provident Fund", current: "₹80,000", limit: "₹1,50,000", action: "Invest More" },
                                { name: "Equity Linked (ELSS)", current: "₹45,000", limit: "₹1,50,000", action: "SIP Now" },
                                { name: "Health Insurance", current: "₹25,000", limit: "₹25,000", action: "Fully Utilized", status: "full" },
                                { name: "NPS (Section 80CCD)", current: "₹0", limit: "₹50,000", action: "Start Investing" },
                            ].map((item) => (
                                <Card key={item.name} className="border-none shadow-sm hover:shadow-md transition-all">
                                    <CardContent className="p-6">
                                        <p className="font-bold text-sm mb-1">{item.name}</p>
                                        <div className="flex justify-between items-end mt-4">
                                            <div>
                                                <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">Current</p>
                                                <p className="text-base font-bold">{item.current}</p>
                                            </div>
                                            <Button
                                                variant={item.status === 'full' ? 'ghost' : 'outline'}
                                                size="sm"
                                                disabled={item.status === 'full'}
                                                className="text-[10px] h-7 rounded-lg font-bold uppercase"
                                            >
                                                {item.action}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Status */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Tax Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { date: "July 31, 2026", label: "ITR Filing Deadline", status: "upcoming", icon: Clock },
                                { date: "Dec 31, 2025", label: "Belated Return Filing", status: "completed", icon: CheckCircle2 },
                                { date: "March 31, 2026", label: "Tax Saving Deadline", status: "urgent", icon: Calendar },
                            ].map((step) => (
                                <div key={step.label} className="flex gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                        step.status === 'upcoming' ? "bg-primary/10 text-primary" :
                                            step.status === 'urgent' ? "bg-accent/10 text-accent" : "bg-secondary/10 text-secondary"
                                    )}>
                                        <step.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{step.label}</p>
                                        <p className="text-xs text-muted font-medium">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-secondary text-white">
                        <CardContent className="p-6 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-xl font-bold italic">Save up to ₹25,000 more!</h4>
                            <p className="text-sm text-white/80 leading-relaxed">
                                Our AI analyzed your spending. If you move ₹50,000 to NPS before March, your tax liability drops by ₹15,450 instantly.
                            </p>
                            <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20">
                                Show Me How <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
