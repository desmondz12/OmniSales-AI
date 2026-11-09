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
      name: "WhatsApp Cloud (MTN/Orange)",
      type: "whatsapp",
      messagesCount: 18,
      revenueCollected: 300000, // 300,000 FCFA
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
      name: "Instagram Direct Inbox",
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
      revenueCollected: 50000, // 50,000 FCFA
      automatedRate: 88,
      color: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200",
      barColor: "bg-blue-600",
    },
    {
      name: "Telegram Bot Gateway",
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
    <div className="grid gap-6 lg:grid-cols-12">
      {/* LEFT COLUMN: WHAT'S OWED BY CUSTOMER (7 Cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border-button-default bg-background-primary-default p-6 sm:p-7 shadow-card">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border-secondary">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <CreditCard className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                  Créances par client (What&apos;s Owed)
                </h3>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Soldes dus et promesses suivis par l&apos;IA via MTN MoMo et Orange Money
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40">
                <Clock className="mr-1 h-3.5 w-3.5 text-amber-600" />
                {overdueCount} En retard
              </span>
              <span className="text-xs font-semibold text-text-tertiary">•</span>
              <span className="text-xs font-medium text-text-secondary">
                Total : <span className="text-text-primary font-semibold">{formatFCFA(totalOwed)}</span>
              </span>
            </div>
          </div>

          {/* Customer Debt Rows */}
          <div className="mt-5 divide-y divide-border-secondary space-y-4">
            {debtorCustomers.map((customer) => {
              const matchedInvoice = invoices.find((inv) => inv.customer_id === customer.id);
              const totalSum = customer.total_paid + customer.total_owed;
              const paidPercent =
                totalSum > 0 ? Math.round((customer.total_paid / totalSum) * 100) : 0;

              const isOverdue =
                customer.payment_promise_date &&
                new Date(customer.payment_promise_date) < new Date();

              const isReadyToday = customer.id === "cust-1"; // Jean-Pierre Fotso
              const isFriday = customer.id === "cust-6"; // Fadimatou Bello

              return (
                <div key={customer.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-xs font-semibold text-text-primary border border-border-button-default">
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
                            className="text-sm font-semibold text-text-primary hover:text-accent-600 transition-colors text-left"
                          >
                            {customer.name}
                          </button>
                          <span className="text-[10px] uppercase font-semibold text-text-tertiary bg-background-secondary-default px-1.5 py-0.5 rounded-md border border-border-button-default">
                            {customer.channel_type}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {matchedInvoice?.description || "Paiement de facture en attente"}
                        </p>
                      </div>
                    </div>

                    {/* Amounts and Status */}
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <span className="text-sm font-semibold text-text-primary">
                          {formatFCFA(customer.total_owed)}
                        </span>
                        <span className="text-xs text-text-tertiary">dû</span>
                      </div>
                      <div className="mt-0.5">
                        {isReadyToday ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
                            Prêt à payer aujourd&apos;hui
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40">
                            En retard (depuis 3j)
                          </span>
                        ) : isFriday ? (
                          <span className="inline-flex items-center text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40">
                            Promesse pour vendredi
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-medium text-accent-700 bg-accent-50 px-2.5 py-0.5 rounded-full border border-accent-200 dark:bg-accent-950/40 dark:text-accent-300 dark:border-accent-900/40">
                            Échéance semaine prochaine
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar (Paid vs Owed) */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
                      <span>
                        Encaissé : <strong className="text-text-primary font-medium">{formatFCFA(customer.total_paid)}</strong>
                      </span>
                      <span>
                        {paidPercent}% encaissé
                      </span>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-background-secondary-default border border-border-button-default">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          paidPercent > 0 ? "bg-accent-600" : "bg-neutral-300"
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
                        className="inline-flex items-center text-xs font-medium text-text-secondary hover:text-text-primary bg-background-primary-default hover:bg-background-secondary-default px-3 py-1 rounded-full border border-border-button-default transition-colors shadow-2xs"
                      >
                        {copiedInvoiceId === matchedInvoice.id ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                            Lien copié !
                          </>
                        ) : (
                          <>
                            <ExternalLink className="mr-1 h-3.5 w-3.5 text-text-tertiary" />
                            Copier lien MoMo
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSendNudge(customer.id)}
                      className="inline-flex items-center text-xs font-medium text-accent-700 hover:text-accent-800 bg-accent-50 hover:bg-accent-100 px-3 py-1 rounded-full border border-accent-200/60 transition-colors shadow-2xs"
                    >
                      {nudgedCustomerId === customer.id ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                          Relance IA envoyée !
                        </>
                      ) : (
                        <>
                          <Send className="mr-1 h-3.5 w-3.5 text-accent-600" />
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
        <div className="mt-6 pt-4 border-t border-border-secondary flex items-center justify-between text-xs text-text-tertiary">
          <span>L&apos;IA détecte et réconcilie les SMS MTN MoMo, Orange Money et virements Afriland</span>
          <span className="font-medium text-accent-700">4 Factures actives</span>
        </div>
      </div>

      {/* RIGHT COLUMN: OVERNIGHT BY CHANNEL (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-border-button-default bg-background-primary-default p-6 sm:p-7 shadow-card">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-border-secondary">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <TrendingUp className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                  Activité nocturne par canal
                </h3>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Volume et encaissements sur les 5 canaux au Cameroun
              </p>
            </div>

            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
              +350 000 FCFA
            </span>
          </div>

          {/* Channel breakdown cards */}
          <div className="mt-5 space-y-3.5">
            {channelStats.map((channel) => {
              const volumePercentage = Math.round((channel.messagesCount / maxVolume) * 100);

              return (
                <div
                  key={channel.name}
                  className="rounded-2xl border border-border-button-default bg-background-secondary-default p-3.5 transition-all hover:bg-background-secondary-hover"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`inline-flex items-center justify-center h-7 w-7 rounded-lg border text-xs font-bold ${channel.bgColor} ${channel.color}`}
                      >
                        {channel.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-text-primary">{channel.name}</h4>
                        <p className="text-[11px] text-text-secondary">
                          {channel.messagesCount} messages • {channel.automatedRate}% gérés par l&apos;IA
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-text-primary">
                        {channel.revenueCollected > 0
                          ? formatFCFA(channel.revenueCollected)
                          : "0 FCFA"}
                      </span>
                      <p className="text-[10px] text-text-tertiary">encaissé</p>
                    </div>
                  </div>

                  {/* Relative Volume Progress Bar */}
                  <div className="mt-2.5">
                    <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
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
        <div className="mt-5 rounded-2xl bg-accent-50/50 border border-accent-200/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-text-primary">
                5 canaux connectés (Cameroun • MTN &amp; Orange)
              </span>
            </div>
            <span className="text-xs font-semibold text-accent-700">99.8% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
