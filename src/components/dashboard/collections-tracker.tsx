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
      <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white/85 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-[#0071E3]">
                  <CreditCard className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  Créances par Client • Recouvrement
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 tracking-tight">
                Soldes dus et promesses suivis par l&apos;IA via MTN MoMo et Orange Money
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-[#FF9500] border border-amber-200/60">
                <Clock className="mr-1 h-3 w-3 text-[#FF9500]" />
                {overdueCount} En retard
              </span>
              <span className="text-xs font-semibold text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">
                Total : <span className="text-slate-900 font-bold tracking-tight">{formatFCFA(totalOwed)}</span>
              </span>
            </div>
          </div>

          {/* Customer Debt Rows */}
          <div className="mt-4 divide-y divide-slate-100/80 space-y-3.5">
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
                <div key={customer.id} className="pt-3.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 text-xs font-bold text-slate-700 border border-slate-200/60 shadow-2xs">
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
                            className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0071E3] transition-colors text-left tracking-tight"
                          >
                            {customer.name}
                          </button>
                          <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                            {customer.channel_type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 tracking-tight">
                          {matchedInvoice?.description || "Paiement en attente"}
                        </p>
                      </div>
                    </div>

                    {/* Amounts and Status */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                          {formatFCFA(customer.total_owed)}
                        </span>
                        <span className="text-[10px] text-slate-400">dû</span>
                      </div>
                      <div className="mt-0.5">
                        {isReadyToday ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-[#34C759] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            Prêt à payer aujourd&apos;hui
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-[#FF3B30] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60">
                            En retard (3j)
                          </span>
                        ) : isFriday ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-[#FF9500] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            Promesse pour vendredi
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-semibold text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
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
                        Encaissé : <strong className="text-slate-700">{formatFCFA(customer.total_paid)}</strong>
                      </span>
                      <span>
                        {paidPercent}% encaissé
                      </span>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
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
                        className="inline-flex items-center text-[11px] font-medium text-slate-700 hover:text-[#0071E3] bg-slate-50/80 hover:bg-blue-50 px-2.5 py-1 rounded-xl border border-slate-200 transition-all active:scale-95"
                      >
                        {copiedInvoiceId === matchedInvoice.id ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3 text-[#34C759]" />
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
                      className="inline-flex items-center text-[11px] font-medium text-[#0071E3] hover:text-white bg-blue-50/70 hover:bg-[#0071E3] px-2.5 py-1 rounded-xl border border-blue-200/60 transition-all active:scale-95"
                    >
                      {nudgedCustomerId === customer.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3 text-[#34C759]" />
                          Relance IA envoyée !
                        </>
                      ) : (
                        <>
                          <Send className="mr-1 h-3 w-3 text-[#0071E3]" />
                          Envoyer relance IA
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
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="tracking-tight">Réconciliation auto MTN MoMo, Orange Money et virements</span>
          <span className="font-semibold text-[#0071E3]">4 Factures actives</span>
        </div>
      </div>

      {/* RIGHT COLUMN: OVERNIGHT BY CHANNEL (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white/85 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-[#34C759]">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  Activité Nocturne par Canal
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 tracking-tight">
                Flux et encaissements sur les 5 canaux au Cameroun
              </p>
            </div>

            <span className="text-[10px] font-bold text-[#34C759] bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
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
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition-all hover:bg-slate-50 hover:border-slate-200/80"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`inline-flex items-center justify-center h-6.5 w-6.5 rounded-lg border text-[10px] font-bold ${channel.bgColor} ${channel.color}`}
                      >
                        {channel.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 tracking-tight">{channel.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {channel.messagesCount} msgs • {channel.automatedRate}% IA
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 tracking-tight">
                        {channel.revenueCollected > 0
                          ? formatFCFA(channel.revenueCollected)
                          : "0 FCFA"}
                      </span>
                      <p className="text-[9px] text-slate-400">encaissé</p>
                    </div>
                  </div>

                  {/* Relative Volume Progress Bar */}
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
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
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
              </span>
              <span className="text-xs font-semibold text-slate-800 tracking-tight">
                5 passerelles en ligne (MTN &amp; Orange)
              </span>
            </div>
            <span className="text-xs font-bold text-[#0071E3]">99.8% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
