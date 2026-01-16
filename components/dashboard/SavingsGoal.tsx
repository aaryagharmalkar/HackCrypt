import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Target, TrendingUp } from "lucide-react";

export function SavingsGoal() {
    const progress = 65;

    return (
        <Card className="border-none shadow-md bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={120} />
            </div>
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-1.5 rounded-lg bg-white/20">
                        <Target size={18} />
                    </div>
                    <span className="text-sm font-medium text-white/80 tracking-wide">Savings Goal</span>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-1">Dream House</h3>
                    <p className="text-sm text-white/60">₹6,50,000 / ₹10,00,000</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                J{i}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary text-xs font-bold bg-secondary/10 px-3 py-1.5 rounded-full">
                        <TrendingUp size={12} />
                        +12% Monthly
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
