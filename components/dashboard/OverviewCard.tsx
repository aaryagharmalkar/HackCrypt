import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface OverviewCardProps {
    title: string;
    amount: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    variant?: "primary" | "secondary" | "accent" | "default";
}

export function OverviewCard({
    title,
    amount,
    change,
    trend,
    icon: Icon,
    variant = "default"
}: OverviewCardProps) {
    const variants = {
        default: "bg-background",
        primary: "bg-primary text-background dark:bg-slate-900",
        secondary: "bg-secondary text-white",
        accent: "bg-accent text-white",
    };

    return (
        <Card className={cn("overflow-hidden border-none shadow-md", variants[variant])}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                        "p-2.5 rounded-xl",
                        variant === "default" ? "bg-muted/10 text-primary" : "bg-white/20 text-white"
                    )}>
                        <Icon size={20} />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        trend === "up" ? (variant === "default" ? "text-secondary" : "text-white/80") : (variant === "default" ? "text-accent" : "text-white/80")
                    )}>
                        {trend === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {change}
                    </div>
                </div>
                <div>
                    <p className={cn(
                        "text-sm font-medium leading-none mb-1 text-muted",
                        variant !== "default" && "text-white/70"
                    )}>{title}</p>
                    <h4 className="text-2xl font-bold tracking-tight">{amount}</h4>
                </div>
            </CardContent>
        </Card>
    );
}
