"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ReceiptIndianRupee,
    Wallet,
    TrendingUp,
    FileText,
    ShieldCheck,
    CreditCard,
    Target,
    Settings,
    HelpCircle,
    Menu,
    X,
    LogOut,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ReceiptIndianRupee, label: "Transactions", href: "/transactions" },
    { icon: Target, label: "Budgets & Goals", href: "/budgeting" },
    { icon: TrendingUp, label: "Investments", href: "/investments" },
    { icon: Wallet, label: "Loan Calculator", href: "/loans" },
    { icon: ShieldCheck, label: "Credit Score", href: "/credit-score" },
    { icon: FileText, label: "Tax Compliance", href: "/tax" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth');
        router.refresh();
    };

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Menu />}
            </Button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={cn(
                "fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-background transition-transform md:translate-x-0 md:static",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full px-4 py-6">
                    <div className="flex items-center gap-3 px-2 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                            <ShieldCheck className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Proof of Luck</h1>
                            <p className="text-[10px] text-muted font-medium uppercase tracking-widest">Financial Wellness</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                                    pathname === item.href
                                        ? "bg-primary text-background"
                                        : "text-muted hover:bg-muted/10 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    pathname === item.href ? "text-background" : "text-muted group-hover:text-foreground"
                                )} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-border space-y-1">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:bg-muted/10 hover:text-foreground transition-all"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </Link>
                        <Link
                            href="/help"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:bg-muted/10 hover:text-foreground transition-all"
                        >
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-medium">Help & Support</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:bg-red-500/10 hover:text-red-600 transition-all w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-3 px-2 py-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 flex items-center justify-center font-bold text-slate-700">
                            KK
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">Kaustubh K.</p>
                            <p className="text-[10px] text-muted font-medium truncate">PRO MEMBER</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
