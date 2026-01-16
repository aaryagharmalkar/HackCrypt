"use client";

import React from "react";
import {
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart4,
    Activity,
    ArrowUpRight,
    Plus,
    Briefcase,
    Layers,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const assets = [
    { name: "Global Equity Fund", type: "Mutual Fund", value: "₹4,50,000", change: "+12.4%", trend: "up", color: "text-secondary" },
    { name: "Reliance Industries", type: "Stock", value: "₹2,15,400", change: "-2.1%", trend: "down", color: "text-accent" },
    { name: "Bitcoin", type: "Crypto", value: "₹1,85,000", change: "+45.2%", trend: "up", color: "text-secondary" },
    { name: "Digital Gold", type: "Commodity", value: "₹85,000", change: "+0.8%", trend: "up", color: "text-secondary" },
];

export default function InvestmentsPage() {
    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
                    <p className="text-muted font-medium mt-1">Manage and grow your wealth with data-driven insights.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shrink-0">
                        <PieChart size={18} />
                        Asset Allocation
                    </Button>
                    <Button className="gap-2 shrink-0">
                        <Plus size={18} />
                        Add Investment
                    </Button>
                </div>
            </header>

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-md bg-primary text-background dark:bg-slate-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Briefcase size={80} />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-sm font-medium text-white/70 mb-1">Total Portfolio Value</p>
                        <h4 className="text-3xl font-bold tracking-tight mb-4">₹9,35,400</h4>
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm bg-secondary/20 w-fit px-3 py-1 rounded-full">
                            <TrendingUp size={14} />
                            +₹1,12,000 (13.6%)
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-muted mb-1">Best Performing Asset</p>
                        <h4 className="text-xl font-bold tracking-tight mb-2">Bitcoin</h4>
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                            <TrendingUp size={14} />
                            +45.2% Overall
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">Crypto</Badge>
                            <Badge variant="secondary" className="text-[10px]">High Risk</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-muted mb-1">Projected Annual Return</p>
                        <h4 className="text-xl font-bold tracking-tight mb-2">₹1,45,000</h4>
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                            <TrendingUp size={14} />
                            15.5% CAGR
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">Growth</Badge>
                            <Badge variant="secondary" className="text-[10px]">Aggressive</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Assets List */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Individual Assets</CardTitle>
                            <Button variant="ghost" size="sm" className="text-muted font-bold">Manage All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-border">
                                {assets.map((asset) => (
                                    <div key={asset.name} className="py-5 flex items-center justify-between group cursor-pointer hover:bg-muted/5 transition-colors -mx-2 px-2 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                                {asset.type === "Mutual Fund" ? <Layers size={18} /> :
                                                    asset.type === "Stock" ? <Activity size={18} /> :
                                                        asset.type === "Crypto" ? <Globe size={18} /> : <TrendingUp size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-tight">{asset.name}</p>
                                                <p className="text-xs text-muted mt-1 font-medium">{asset.type} • Verified</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm">{asset.value}</p>
                                            <div className={cn("flex items-center justify-end gap-1 text-[11px] font-bold mt-1", asset.color)}>
                                                {asset.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {asset.change}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics & Advice */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="border-none shadow-md overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-lg">Portfolio Diversification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: "Stocks", val: 45, color: "bg-primary" },
                                    { name: "Mutual Funds", val: 30, color: "bg-secondary" },
                                    { name: "Crypto", val: 15, color: "bg-accent" },
                                    { name: "Golds/Cash", val: 10, color: "bg-muted" },
                                ].map((item) => (
                                    <div key={item.name} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <span>{item.name}</span>
                                            <span>{item.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                                            <div className={cn("h-full", item.color)} style={{ width: `${item.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-border">
                                <p className="text-xs text-muted italic font-medium leading-relaxed">
                                    "Your portfolio is heavily weighted in Equity. Consider rebalancing into Bonds or Gold for lower volatility."
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
