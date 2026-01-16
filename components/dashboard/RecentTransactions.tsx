import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShoppingBag, Coffee, Car, Home, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
    {
        id: 1,
        name: "Apple Store",
        category: "Shopping",
        amount: "-₹1,29,900",
        date: "Today, 2:45 PM",
        icon: ShoppingBag,
        type: "expense",
    },
    {
        id: 2,
        name: "Salary Credit",
        category: "Income",
        amount: "+₹1,50,000",
        date: "Yesterday",
        icon: ArrowUpRight,
        type: "income",
    },
    {
        id: 3,
        name: "Starbucks",
        category: "Food & Drinks",
        amount: "-₹450",
        date: "Jan 12, 2026",
        icon: Coffee,
        type: "expense",
    },
    {
        id: 4,
        name: "Uber Pool",
        category: "Transport",
        amount: "-₹280",
        date: "Jan 11, 2026",
        icon: Car,
        type: "expense",
    },
    {
        id: 5,
        name: "Rent",
        category: "Housing",
        amount: "-₹35,000",
        date: "Jan 05, 2026",
        icon: Home,
        type: "expense",
    },
];

export function RecentTransactions() {
    return (
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Transactions</CardTitle>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted/10">View All</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group cursor-pointer hover:bg-muted/5 p-2 -m-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-muted/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all">
                                <tx.icon size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm leading-tight">{tx.name}</p>
                                <p className="text-xs text-muted mt-1">{tx.category} • {tx.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`font-bold text-sm ${tx.type === 'income' ? 'text-secondary' : 'text-foreground'}`}>
                                {tx.amount}
                            </p>
                            <p className="text-[10px] text-muted font-medium uppercase tracking-tighter">Verified</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
