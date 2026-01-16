"use client";

import React, { useState, useMemo } from 'react';
import { Wallet, TrendingDown, Calendar, Percent, IndianRupee } from 'lucide-react';

export default function LoansPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [roi, setRoi] = useState(8.5);
  const [years, setYears] = useState(5);
  const [loanType, setLoanType] = useState("Home Loan");
  const [startDate, setStartDate] = useState("");

  const monthlyRate = roi / 12 / 100;
  const months = years * 12;

  const emi = useMemo(() => {
    if (monthlyRate === 0) return loanAmount / months;
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  }, [loanAmount, roi, years, monthlyRate, months]);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  const principalPercentage = (loanAmount / totalPayment) * 100;
  const interestPercentage = (totalInterest / totalPayment) * 100;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Loan Management
          </h1>
          <p className="text-muted-foreground">
            Calculate EMI and manage your loans effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calculator Section */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold">EMI Calculator</h2>

            {/* Loan Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Loan Type
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option>Home Loan</option>
                <option>Personal Loan</option>
                <option>Education Loan</option>
                <option>Car Loan</option>
                <option>Business Loan</option>
              </select>
            </div>

            {/* Loan Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Loan Amount (₹)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(+e.target.value)}
                className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                min="10000"
                step="10000"
              />
              <input
                type="range"
                min="10000"
                max="10000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(+e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Rate of Interest (% p.a.)
              </label>
              <input
                type="number"
                step="0.1"
                value={roi}
                onChange={(e) => setRoi(+e.target.value)}
                className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                min="1"
                max="30"
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={roi}
                onChange={(e) => setRoi(+e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            {/* Loan Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Loan Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-border rounded-xl p-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Loan Tenure: {years} Year{years !== 1 ? 's' : ''}
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Results Section */}
<div className="space-y-6">
  {/* Monthly EMI Card */}
  <div className="bg-primary text-white rounded-2xl p-6 shadow-lg">
    <p className="text-sm opacity-90 mb-2">Monthly EMI</p>

    <p className="text-4xl font-bold mb-4">
      ₹ {emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </p>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="opacity-75">Tenure</p>
        <p className="font-semibold">{months} Months</p>
      </div>

      <div>
        <p className="opacity-75">Interest Rate</p>
        <p className="font-semibold">{roi}% p.a.</p>
      </div>
    </div>
  </div>
</div>


            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Principal Amount</p>
                <p className="text-xl font-bold text-foreground">
                  ₹ {loanAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {principalPercentage.toFixed(1)}% of total
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                <p className="text-xs text-muted-foreground">Total Interest</p>
                <p className="text-xl font-bold text-foreground">
                  ₹ {totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-orange-600 font-medium">
                  {interestPercentage.toFixed(1)}% of total
                </p>
              </div>
            </div>

            {/* Total Payment Card */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Payment</span>
                <TrendingDown className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                ₹ {totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${principalPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600 font-medium">
                  Principal: {principalPercentage.toFixed(1)}%
                </span>
                <span className="text-orange-600 font-medium">
                  Interest: {interestPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm">Loan Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Type</span>
                  <span className="font-medium">{loanType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payments</span>
                  <span className="font-medium">{months} EMIs</span>
                </div>
                {startDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {new Date(startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}