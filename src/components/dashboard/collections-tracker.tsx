"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Send,
  TrendingUp,
} from "lucide-react";
import type { Customer, Invoice } from "@/types/database";

interface CollectionsTrackerProps {
  customers: Customer[];
  invoices: Invoice[];
  onOpenCustomerChat?: (customerName: string) => void;
}

interface ChannelStat {
  name: string;
  type: "whatsapp" | "instagram" | "messenger" | "tiktok" | "telegram";
  messagesCount: number;
  revenueCollected: number;
  automatedRate: number;
  color: string;
  bgColor: string;
  barColor: string;
}

export function CollectionsTracker({
  customers,
  invoices,
  onOpenCustomerChat,
}: CollectionsTrackerProps) {
  const [copiedInvoiceId, setCopiedInvoiceId] = React.useState<string | null>(null);
  const [nudgedCustomerId, setNudgedCustomerId] = React.useState<string | null>(null);

  // Calculate totals
  const totalOwed = customers.reduce((sum, c) => sum + (c.total_owed || 0), 0);
  const overdueCount = customers.filter(
    (c) =>
      c.payment_promise_date &&
      new Date(c.payment_promise_date) < new Date() &&
      c.total_owed > 0
  ).length;

  // Filter customers with outstanding balances
  const debtorCustomers = customers
    .filter((c) => c.total_owed > 0)
    .sort((a, b) => b.total_owed - a.total_owed);

  // Channel revenue & message metrics
  const channelStats: ChannelStat[] = [
    {
      name: "WhatsApp Cloud",
      type: "whatsapp",
      messagesCount: 18,
      revenueCollected: 300000,
      automatedRate: 98,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
      barColor: "bg-emerald-500",
    },
    {
      name: "TikTok Shop & DMs",
      type: "tiktok",
      messagesCount: 14,
      revenueCollected: 0,
      automatedRate: 100,
      color: "text-slate-900",
      bgColor: "bg-slate-100 border-slate-300",
      barColor: "bg-slate-900",
    },
    {
      name: "Instagram Direct",
      type: "instagram",
      messagesCount: 12,
      revenueCollected: 0,
      automatedRate: 92,
      color: "text-pink-700",
      bgColor: "bg-pink-50 border-pink-200",
      barColor: "bg-pink-500",
    },
    {
      name: "Facebook Messenger",
      type: "messenger",
      messagesCount: 8,
      revenueCollected: 50000,
      automatedRate: 88,
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
      barColor: "bg-blue-600",
    },
    {
      name: "Telegram Bot",
      type: "telegram",
      messagesCount: 6,
      revenueCollected: 0,
      automatedRate: 85,
      color: "text-sky-700",
      bgColor: "bg-sky-50 border-sky-200",
      barColor: "bg-sky-500",
    },
  ];

  const maxVolume = Math.max(...channelStats.map((c) => c.messagesCount));

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG")}`;
  };

  const handleCopyPaymentLink = (invoiceId: string, link: string | null) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedInvoiceId(invoiceId);
    setTimeout(() => setCopiedInvoiceId(null), 2500);
  };

  const handleSendNudge = (customerId: string) => {
    setNudgedCustomerId(customerId);
    setTimeout(() => setNudgedCustomerId(null), 2500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: WHAT'S OWED BY CUSTOMER (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  What&apos;s Owed, by Customer
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Outstanding balances tracked by AI payment listeners
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/70">
                <Clock className="mr-1 h-3.5 w-3.5 text-amber-600" />
                {overdueCount} Overdue
              </span>
              <span className="text-xs font-semibold text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-700">
                Total: <span className="text-slate-900 font-bold">{formatNaira(totalOwed)}</span>
              </span>
            </div>
          </div>

          {/* Customer Debt Rows */}
          <div className="mt-5 divide-y divide-slate-100 space-y-4">
            {debtorCustomers.map((customer) => {
              const matchedInvoice = invoices.find((inv) => inv.customer_id === customer.id);
              const totalSum = customer.total_paid + customer.total_owed;
              const paidPercent =
                totalSum > 0 ? Math.round((customer.total_paid / totalSum) * 100) : 0;

              const isOverdue =
                customer.payment_promise_date &&
                new Date(customer.payment_promise_date) < new Date();

              const isReadyToday = customer.id === "cust-1"; // Femi Adeleke
              const isFriday = customer.id === "cust-6"; // Sodiq

              return (
                <div key={customer.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 text-xs font-bold text-slate-700 border border-slate-200/80">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => onOpenCustomerChat?.(customer.name)}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {customer.name}
                          </button>
                          {/* Channel Tag */}
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {customer.channel_type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {matchedInvoice?.description || "Pending invoice payment"}
                        </p>
                      </div>
                    </div>

                    {/* Amounts and Status */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className="text-sm font-bold text-slate-900">
                          {formatNaira(customer.total_owed)}
                        </span>
                        <span className="text-xs text-slate-400">owed</span>
                      </div>
                      <div className="mt-0.5">
                        {isReadyToday ? (
                          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Ready to pay today
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Overdue (3d ago)
                          </span>
                        ) : isFriday ? (
                          <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Promise due Friday
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Due next week
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar (Paid vs Owed) */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>
                        Paid: <strong className="text-slate-700">{formatNaira(customer.total_paid)}</strong>
                      </span>
                      <span>
                        {paidPercent}% collected
                      </span>
                    </div>

                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          paidPercent > 0 ? "bg-blue-600" : "bg-slate-300"
                        }`}
                        style={{ width: `${Math.max(paidPercent, 4)}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro Actions */}
                  <div className="mt-2.5 flex items-center justify-end space-x-2">
                    {matchedInvoice?.payment_link && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPaymentLink(matchedInvoice.id, matchedInvoice.payment_link)
                        }
                        className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        {copiedInvoiceId === matchedInvoice.id ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-1 h-3.5 w-3.5 text-slate-500" />
                            Copy Link
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendNudge(customer.id)}
                      className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg border border-blue-200/60 transition-colors"
                    >
                      {nudgedCustomerId === customer.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                          AI Nudge Sent!
                        </>
                      ) : (
                        <>
                          <Send className="mr-1 h-3.5 w-3.5 text-blue-600" />
                          Send AI Nudge
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info pill */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>AI automatically detects and matches bank transfer references</span>
          <span className="font-medium text-blue-600">4 Active Invoices</span>
        </div>
      </div>

      {/* RIGHT COLUMN: OVERNIGHT BY CHANNEL (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">
                  Overnight by Channel
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Volume and revenue collected across 5 channels
              </p>
            </div>

            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              +₦350,000 Total
            </span>
          </div>

          {/* Channel breakdown cards */}
          <div className="mt-5 space-y-3.5">
            {channelStats.map((channel) => {
              const volumePercentage = Math.round((channel.messagesCount / maxVolume) * 100);

              return (
                <div
                  key={channel.name}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50 hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border text-xs font-bold ${channel.bgColor} ${channel.color}`}
                      >
                        {channel.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{channel.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {channel.messagesCount} messages • {channel.automatedRate}% AI handled
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        {channel.revenueCollected > 0
                          ? formatNaira(channel.revenueCollected)
                          : "₦0"}
                      </span>
                      <p className="text-[10px] text-slate-400">collected</p>
                    </div>
                  </div>

                  {/* Relative Volume Progress Bar */}
                  <div className="mt-2.5">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${channel.barColor}`}
                        style={{ width: `${volumePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Health Bottom Banner */}
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-slate-800">
                All 5 channels connected & listening
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700">99.8% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
