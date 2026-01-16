"use client";

import React, { useEffect, useState } from "react";
import {
    ShieldCheck,
    TrendingUp,
    CheckCircle2,
    History,
    Search,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface CibilData {
    cibil_score: number;
    description: string;
    type: string;
}

export default function CreditScorePage() {
    const [cibilData, setCibilData] = useState<CibilData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCibilData();
    }, []);

    const fetchCibilData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('cibil_recommendations')
                .select('cibil_score, description, type')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Demo: Insert a default record if none exists
                    const defaultData = {
                        user_id: user.id,
                        cibil_score: 750,
                        type: "CIBIL_IMPROVEMENT",
                        description: "### Credit Tier Summary\n**Tier:** Excellent (750+)\n\n### Why the score is at this level\nYour credit score indicates a healthy financial profile. You have demonstrated consistent repayment behavior and responsible credit usage.\n\n### What to do in the next 30 days\n1. Maintain low credit utilization.\n2. Keep paying bills on time.\n3. Avoid multiple new status inquiries.\n\n### Expected outcome\nMaintenance of excellent credit terms and lower interest rates."
                    };
                    
                    const { error: insertError } = await supabase
                        .from('cibil_recommendations')
                        .insert([defaultData]);
                        
                    if (!insertError) {
                        setCibilData(defaultData);
                    }
                } else {
                    console.error('Error fetching CIBIL data:', error);
                }
            } else {
                setCibilData(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const score = cibilData?.cibil_score || 0;
    const maxScore = 900;
    const percentage = (score / maxScore) * 100;
    const rawDescription = cibilData?.description || "No detailed context available.";
    const description = rawDescription.replace(/^#+\s/gm, '').replace(/\*/g, '');

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credit Analysis</h1>
                    <p className="text-muted font-medium mt-1">Understanding your financial trustworthiness and CIBIL score.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 shrink-0">
                        <History size={18} />
                        Score History
                    </Button>
                    <Button className="gap-2 shrink-0">
                        <ShieldCheck size={18} />
                        Request Full Report
                    </Button>
                </div>
            </header>

            {/* Credit Score Gauge */}
            <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <ShieldCheck size={200} />
                    </div>
                    <CardContent className="p-10 flex flex-col items-center">
                        <div className="relative w-64 h-64 mb-10">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-muted/10"
                                />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 110}
                                    strokeDashoffset={2 * Math.PI * 110 * (1 - percentage / 100)}
                                    className="text-secondary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-sm font-bold text-muted uppercase tracking-widest mb-1">CIBIL</span>
                                <span className="text-6xl font-black text-foreground">{score}</span>
                                <Badge variant={score >= 750 ? "success" : score >= 650 ? "warning" : "danger"} className="mt-2 px-4 py-1 font-bold">
                                    {score >= 750 ? "EXCELLENT" : score >= 650 ? "GOOD" : "NEEDS WORK"}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-border pt-10">
                            <div className="text-center">
                                <p className="text-xs font-bold text-muted uppercase mb-1">Payment History</p>
                                <p className="text-sm font-black text-secondary uppercase">Excellent</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-muted uppercase mb-1">Credit Usage</p>
                                <p className="text-sm font-black text-foreground uppercase">15%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-muted uppercase mb-1">Age of Credit</p>
                                <p className="text-sm font-black text-foreground uppercase">5.2 Years</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-muted uppercase mb-1">Recent Inquiries</p>
                                <p className="text-sm font-black text-accent uppercase">High (4)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Search className="text-primary" />
                                Detailed Credit Analysis
                            </CardTitle>
                            <CardDescription>
                                Insights and actionable tips to improve your financial standing
                            </CardDescription>
                        </div>
                        {cibilData?.type && (
                            <Badge variant="secondary" className="font-bold uppercase tracking-wider">
                                {cibilData.type.replace('_', ' ')}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Full Description Section */}
                    <div className="bg-muted/10 p-8 rounded-3xl border border-border/50">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-secondary rounded-full" />
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">
                                     Personalized Analysis
                                </h3>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-3.5">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-4 p-5 rounded-3xl bg-secondary/5 border border-secondary/10">
                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Positive Factors</p>
                                <p className="text-xs text-muted mt-1 leading-relaxed">
                                    Your consistent payment history and low debt utilization are your strongest assets.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-5 rounded-3xl bg-accent/5 border border-accent/10">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Growth Potential</p>
                                <p className="text-xs text-muted mt-1 leading-relaxed">
                                    Strategic debt consolidation and longer credit history will significantly boost your score.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-primary text-background dark:bg-slate-900">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Want to reach 850+?</h3>
                        <p className="text-white/70 leading-relaxed">
                            Unlock our Personalized Credit Roadmap. Get step-by-step instructions on how to optimize your credit mix and increase your limits safely.
                        </p>
                    </div>
                    <Button variant="secondary" size="lg" className="rounded-2xl font-bold px-10">
                        Get My Roadmap
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
