import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "success" | "danger" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "border-transparent bg-primary text-background hover:opacity-80",
        secondary: "border-transparent bg-muted/20 text-foreground hover:bg-muted/30",
        outline: "text-foreground border border-border",
        success: "border-transparent bg-secondary/10 text-secondary",
        danger: "border-transparent bg-accent/10 text-accent",
        warning: "border-transparent bg-amber-500/10 text-amber-500",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
