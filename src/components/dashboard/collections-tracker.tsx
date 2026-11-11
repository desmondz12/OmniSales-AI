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

  // Channel revenue & message metrics (Cameroon)
  const channelStats: ChannelStat[] = [
    {
      name: "WhatsApp Business Cloud",
      type: "whatsapp",
      messagesCount: 18,
      revenueCollected: 300000,
      automatedRate: 98,
      color: "text-[#34C759]",
      bgColor: "bg-emerald-50 border-emerald-200/60",
      barColor: "bg-[#34C759]",
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
      name: "Instagram Direct Inbox",
      type: "instagram",
      messagesCount: 12,
      revenueCollected: 0,
      automatedRate: 92,
      color: "text-pink-600",
      bgColor: "bg-pink-50 border-pink-200/60",
      barColor: "bg-pink-500",
    },
    {
      name: "Facebook Messenger",
      type: "messenger",
      messagesCount: 8,
      revenueCollected: 50000,
      automatedRate: 88,
      color: "text-[#0071E3]",
      bgColor: "bg-blue-50 border-blue-200/60",
      barColor: "bg-[#0071E3]",
    },
    {
      name: "Telegram Bot Gateway",
      type: "telegram",
      messagesCount: 6,
      revenueCollected: 0,
      automatedRate: 85,
      color: "text-sky-600",
      bgColor: "bg-sky-50 border-sky-200/60",
      barColor: "bg-sky-500",
    },
  ];

  const maxVolume = Math.max(...channelStats.map((c) => c.messagesCount));

  const formatFCFA = (amount: number) => {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
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
    <div className="grid gap-6 lg:grid-cols-12 select-none">
      {/* LEFT COLUMN: WHAT'S OWED BY CUSTOMER (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0071E3]">
                  <CreditCard className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-slate-900">
                  Créances par client • Recouvrement
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Soldes dus et promesses suivis via MTN MoMo et Orange Money
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                <Clock className="mr-1 h-3 w-3 text-amber-600" />
                {overdueCount} en retard
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-600">
                Total : <span className="text-slate-900 font-semibold tabular-nums">{formatFCFA(totalOwed)}</span>
              </span>
            </div>
          </div>

          {/* Customer Debt Rows */}
          <div className="mt-4 divide-y divide-slate-100 space-y-3">
            {debtorCustomers.map((customer) => {
              const matchedInvoice = invoices.find((inv) => inv.customer_id === customer.id);
              const totalSum = customer.total_paid + customer.total_owed;
              const paidPercent =
                totalSum > 0 ? Math.round((customer.total_paid / totalSum) * 100) : 0;

              const isOverdue =
                customer.payment_promise_date &&
                new Date(customer.payment_promise_date) < new Date();

              const isReadyToday = customer.id === "cust-1";
              const isFriday = customer.id === "cust-6";

              return (
                <div key={customer.id} className="pt-3 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
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
                            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0071E3] transition-colors text-left"
                          >
                            {customer.name}
                          </button>
                          <span className="text-[9px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {customer.channel_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {matchedInvoice?.description || "Paiement en attente"}
                        </p>
                      </div>
                    </div>

                    {/* Amounts and Status */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 tabular-nums">
                          {formatFCFA(customer.total_owed)}
                        </span>
                        <span className="text-[10px] text-slate-400">dû</span>
                      </div>
                      <div className="mt-0.5">
                        {isReadyToday ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Prêt à payer aujourd&apos;hui
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            En retard (3j)
                          </span>
                        ) : isFriday ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Promesse pour vendredi
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-semibold text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                            Échéance prochaine
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>
                        Encaissé : <strong className="text-slate-700 tabular-nums">{formatFCFA(customer.total_paid)}</strong>
                      </span>
                      <span className="tabular-nums">
                        {paidPercent}% encaissé
                      </span>
                    </div>

                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-colors ${
                          paidPercent > 0 ? "bg-[#0071E3]" : "bg-slate-300"
                        }`}
                        style={{ width: `${Math.max(paidPercent, 4)}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro Actions */}
                  <div className="mt-2 flex items-center justify-end space-x-2">
                    {matchedInvoice?.payment_link && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPaymentLink(matchedInvoice.id, matchedInvoice.payment_link)
                        }
                        className="inline-flex items-center text-[11px] font-medium text-slate-700 hover:text-[#0071E3] bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
                      >
                        {copiedInvoiceId === matchedInvoice.id ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                            Lien copié !
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-1 h-3 w-3 text-slate-400" />
                            Copier lien MoMo
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendNudge(customer.id)}
                      className="inline-flex items-center text-[11px] font-medium text-[#0071E3] hover:text-white bg-blue-50 hover:bg-[#0071E3] px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                    >
                      {nudgedCustomerId === customer.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-600" />
                          Relance envoyée !
                        </>
                      ) : (
                        <>
                          <Send className="mr-1 h-3 w-3 text-[#0071E3]" />
                          Relancer par message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Réconciliation automatique MTN MoMo, Orange Money et virements</span>
          <span className="font-semibold text-slate-700">4 factures actives</span>
        </div>
      </div>

      {/* RIGHT COLUMN: OVERNIGHT BY CHANNEL (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold tracking-tight text-slate-900">
                  Activité des canaux
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Volumes et encaissements sur les 5 canaux au Cameroun
              </p>
            </div>

            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md tabular-nums">
              +350 000 FCFA
            </span>
          </div>

          {/* Channel breakdown cards */}
          <div className="mt-4 space-y-2.5">
            {channelStats.map((channel) => {
              const volumePercentage = Math.round((channel.messagesCount / maxVolume) * 100);

              return (
                <div
                  key={channel.name}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded border text-[10px] font-semibold ${channel.bgColor} ${channel.color}`}
                      >
                        {channel.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{channel.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {channel.messagesCount} msgs • {channel.automatedRate}% IA
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">
                        {channel.revenueCollected > 0
                          ? formatFCFA(channel.revenueCollected)
                          : "0 FCFA"}
                      </span>
                      <p className="text-[9px] text-slate-400">encaissé</p>
                    </div>
                  </div>

                  {/* Relative Volume Progress Bar */}
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/80 overflow-hidden">
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
        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-800">
                5 passerelles actives (MTN MoMo, Orange Money, Meta &amp; Telegram)
              </span>
            </div>
            <span className="text-xs font-semibold text-[#0071E3] tabular-nums">99.8% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
