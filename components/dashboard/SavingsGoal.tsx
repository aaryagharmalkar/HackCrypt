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
            <CardContent className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-white/20">
                        <Target size={16} />
                    </div>
                    <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Savings Goal</span>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-0.5">Dream House</h3>
                    <p className="text-xs text-white/50 font-medium">₹6,50,000 / ₹10,00,000</p>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/40">
                        <span>Progress</span>
                        <span className="text-secondary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(5,150,105,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[9px] font-black">
                                J{i}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-secondary text-[10px] font-black bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                        <TrendingUp size={10} />
                        +12%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
