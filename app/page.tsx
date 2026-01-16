"use client";

import React from "react";
import { OverviewCard } from "@/components/dashboard/OverviewCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SavingsGoal } from "@/components/dashboard/SavingsGoal";
import {
  Plus,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  Bell,
  Calendar,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted font-medium mt-1">Welcome back, Kaustubh! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-muted/5 border border-border px-4 py-2 rounded-xl text-sm font-medium">
            <Calendar size={16} className="text-muted" />
            <span>Jan 16, 2026</span>
          </div>
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>
          <Button size="sm" className="gap-2 shrink-0">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewCard
          title="Total Net Worth"
          amount="₹24,50,000"
          change="+₹45,200"
          trend="up"
          icon={Wallet}
          variant="primary"
        />
        <OverviewCard
          title="Total Income"
          amount="₹1,85,400"
          change="+12.5%"
          trend="up"
          icon={ArrowUpCircle}
        />
        <OverviewCard
          title="Total Expenses"
          amount="₹65,200"
          change="-2.4%"
          trend="down"
          icon={ArrowDownCircle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-10">
          <RecentTransactions />

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[
                  { name: "Shopping", val: 35, color: "bg-primary" },
                  { name: "Food", val: 25, color: "bg-secondary" },
                  { name: "Rent", val: 20, color: "bg-accent" },
                  { name: "Travel", val: 15, color: "bg-muted" },
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider">{item.name}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold">{item.val}%</span>
                      <div className={cn("w-2 h-2 rounded-full mb-1.5", item.color)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-4 w-full bg-muted/10 rounded-full flex overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "35%" }} />
                <div className="h-full bg-secondary" style={{ width: "25%" }} />
                <div className="h-full bg-accent" style={{ width: "20%" }} />
                <div className="h-full bg-muted" style={{ width: "15%" }} />
                <div className="h-full bg-slate-200" style={{ width: "5%" }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-10">
          <SavingsGoal />

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Financial Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Smart Move!</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    You saved ₹12,000 more than last month by reducing dining expenses.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <ArrowDownCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Alert: Budget Target</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    You've reached 85% of your entertainment budget for January.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-2xl h-12 text-sm">
                View Full Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

