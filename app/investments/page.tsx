//investments page.tsx 
"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    PieChart,
    Activity,
    Plus,
    Briefcase,
    Layers,
    Globe,
    Shield,
    Lock,
    ArrowRight,
    CheckCircle2,
    Wallet,
    Building2,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const assets = [
    { name: "Global Equity Fund", type: "Mutual Fund", value: "₹4,50,000", change: "+12.4%", trend: "up", color: "text-secondary", quantity: "450 units", avgPrice: "₹1,000" },
    { name: "Reliance Industries", type: "Stock", value: "₹2,15,400", change: "-2.1%", trend: "down", color: "text-accent", quantity: "80 shares", avgPrice: "₹2,692.50" },
    { name: "Bitcoin", type: "Crypto", value: "₹1,85,000", change: "+45.2%", trend: "up", color: "text-secondary", quantity: "0.05 BTC", avgPrice: "₹37,00,000" },
    { name: "Digital Gold", type: "Commodity", value: "₹85,000", change: "+0.8%", trend: "up", color: "text-secondary", quantity: "14 grams", avgPrice: "₹6,071/g" },
];

const brokers = [
    { name: "Zerodha", logo: "🟢", popular: true },
    { name: "Groww", logo: "💚", popular: true },
    { name: "Upstox", logo: "🟣", popular: true },
    { name: "Angel One", logo: "🔴", popular: false },
    { name: "ICICI Direct", logo: "🟠", popular: false },
    { name: "HDFC Securities", logo: "🔵", popular: false },
];

export default function InvestmentsPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [showConnectForm, setShowConnectForm] = useState(false);
    const [selectedBroker, setSelectedBroker] = useState("");
    const [clientId, setClientId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);

        // Simulate API login
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsConnected(true);
        setShowConnectForm(false);
        setLoading(false);
    };

    /* =======================
       CONNECT LANDING SCREEN
    ======================= */
    if (!isConnected && !showConnectForm) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <Card className="border-none shadow-xl max-w-2xl w-full">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Wallet className="w-10 h-10 text-primary" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-3">Connect Your Demat Account</h2>
                            <p className="text-muted text-lg">
                                Link your broker account to track all your investments in one place
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 max-w-md mx-auto">
                            {[
                                { icon: Shield, text: "Bank-grade security" },
                                { icon: Lock, text: "Data encrypted" },
                                { icon: RefreshCw, text: "Real-time sync" },
                                { icon: CheckCircle2, text: "Read-only access" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <item.icon className="w-4 h-4 text-secondary" />
                                    <span className="text-muted font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => setShowConnectForm(true)}
                            className="gap-2 px-8 py-6 text-lg"
                            size="lg"
                        >
                            Connect Demat Account
                            <ArrowRight size={20} />
                        </Button>

                        <p className="text-xs text-muted pt-4">
                            We never store your password. All connections are secure and read-only.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    /* =======================
       CONNECT FORM (NO 2FA)
    ======================= */
    if (showConnectForm && !isConnected) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="border-none shadow-xl max-w-xl w-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">Connect Demat Account</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConnectForm(false)}
                            >
                                ✕
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Select Your Broker</label>
                            <div className="grid grid-cols-2 gap-3">
                                {brokers.map((broker) => (
                                    <button
                                        key={broker.name}
                                        onClick={() => setSelectedBroker(broker.name)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 transition-all text-left hover:border-primary",
                                            selectedBroker === broker.name
                                                ? "border-primary bg-primary/5"
                                                : "border-border"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{broker.logo}</span>
                                            <div>
                                                <p className="font-bold text-sm">{broker.name}</p>
                                                {broker.popular && (
                                                    <Badge variant="secondary" className="text-[9px] mt-1">
                                                        Popular
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Client ID / User ID</label>
                                <input
                                    type="text"
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    placeholder="Enter your client ID"
                                    className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="text-xs text-amber-900 dark:text-amber-200">
                                        <p className="font-semibold mb-1">Your credentials are secure</p>
                                        <p>
                                            We use end-to-end encryption and never store your password.
                                            Access is strictly read-only.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleConnect}
                                className="w-full gap-2"
                                disabled={!selectedBroker || !clientId || !password || loading}
                            >
                                {loading ? "Connecting..." : "Login & Continue"}
                                {!loading && <ArrowRight size={18} />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }


    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">Investment Portfolio</h1>
                        <Badge variant="secondary" className="gap-1.5">
                            <Building2 className="w-3 h-3" />
                            {selectedBroker || "Zerodha"}
                        </Badge>
                    </div>
                    <p className="text-muted font-medium">Last synced: Just now • Real-time data</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shrink-0">
                        <RefreshCw size={18} />
                        Sync Now
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
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs">
                                <span className="text-white/60">Invested</span>
                                <span className="font-semibold">₹8,23,400</span>
                            </div>
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
                        <p className="text-sm font-medium text-muted mb-1">Day's Gain/Loss</p>
                        <h4 className="text-xl font-bold tracking-tight mb-2 text-secondary">+₹4,250</h4>
                        <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                            <TrendingUp size={14} />
                            +0.45% Today
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Badge variant="secondary" className="text-[10px]">Live</Badge>
                            <Badge variant="secondary" className="text-[10px]">Market Hours</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Assets List */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Holdings</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-xs">
                                    <PieChart size={14} className="mr-1" />
                                    View Analytics
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-border">
                                {assets.map((asset) => (
                                    <div key={asset.name} className="py-5 group cursor-pointer hover:bg-muted/5 transition-colors -mx-2 px-2 rounded-xl">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-10 h-10 rounded-xl bg-muted/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all shrink-0">
                                                    {asset.type === "Mutual Fund" ? <Layers size={18} /> :
                                                        asset.type === "Stock" ? <Activity size={18} /> :
                                                            asset.type === "Crypto" ? <Globe size={18} /> : <TrendingUp size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <p className="font-bold text-sm leading-tight">{asset.name}</p>
                                                            <p className="text-xs text-muted mt-1 font-medium">{asset.type}</p>
                                                            <div className="flex gap-4 mt-2 text-xs text-muted">
                                                                <span>Qty: {asset.quantity}</span>
                                                                <span>Avg: {asset.avgPrice}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="font-bold text-sm">{asset.value}</p>
                                                            <div className={cn("flex items-center justify-end gap-1 text-[11px] font-bold mt-1", asset.color)}>
                                                                {asset.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                                {asset.change}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                </div>
                                <p className="font-semibold">View P&L Statement</p>
                                <p className="text-xs text-muted">Detailed profit/loss report</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                    <Activity className="w-6 h-6 text-primary" />
                                </div>
                                <p className="font-semibold">Transaction History</p>
                                <p className="text-xs text-muted">All buy/sell orders</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Analytics & Advice */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-lg">Asset Allocation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { name: "Equity", val: 48, color: "bg-primary", amount: "₹4,49,000" },
                                    { name: "Mutual Funds", val: 28, color: "bg-secondary", amount: "₹2,62,000" },
                                    { name: "Crypto", val: 20, color: "bg-accent", amount: "₹1,87,000" },
                                    { name: "Gold/Commodities", val: 4, color: "bg-muted", amount: "₹37,400" },
                                ].map((item) => (
                                    <div key={item.name} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span>{item.name}</span>
                                            <span className="text-muted">{item.amount}</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                            <div className={cn("h-full", item.color)} style={{ width: `${item.val}%` }} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-muted font-semibold">{item.val}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Shield className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm mb-1">Portfolio Health Score</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold">8.5</span>
                                        <span className="text-xs text-muted">/10</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-secondary">
                                    <CheckCircle2 size={14} />
                                    <span>Well diversified portfolio</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary">
                                    <CheckCircle2 size={14} />
                                    <span>Good risk-return balance</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-sm">AI Recommendation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted leading-relaxed">
                                Your equity exposure is optimal. Consider adding more debt instruments for stability. The crypto allocation seems aggressive - monitor closely.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}