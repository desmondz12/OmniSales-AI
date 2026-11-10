"use client";

import * as React from "react";
import {
  ArrowRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/types/database";

interface HandoffQueueProps {
  conversations: Conversation[];
  onReviewHandoff: (conversation: Conversation) => void;
}

export function HandoffQueue({ conversations, onReviewHandoff }: HandoffQueueProps) {
  // Filter conversations that need human attention
  const priorityQueue = conversations.filter(
    (c) =>
      c.status === "ready_to_pay" ||
      c.status === "upset" ||
      c.status === "needs_human"
  );

  const getChannelBadge = (type: string) => {
    switch (type) {
      case "whatsapp":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#34C759] border border-emerald-200/60">
            WhatsApp
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-600 border border-pink-200/60">
            Instagram
          </span>
        );
      case "messenger":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0071E3] border border-blue-200/60">
            Messenger
          </span>
        );
      case "tiktok":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            TikTok
          </span>
        );
      case "telegram":
        return (
          <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600 border border-sky-200/60">
            Telegram
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {type}
          </span>
        );
    }
  };

  const getTriageBadge = (tag: string) => {
    switch (tag) {
      case "ready_to_pay":
        return (
          <Badge variant="ready_to_pay" className="capitalize text-[10px] font-semibold rounded-full px-2 py-0.5">
            Paiement prêt
          </Badge>
        );
      case "upset":
        return (
          <Badge variant="upset" className="capitalize text-[10px] font-semibold rounded-full px-2 py-0.5">
            Client mécontent
          </Badge>
        );
      case "asked_for_person":
        return (
          <Badge variant="needs_human" className="capitalize text-[10px] font-semibold rounded-full px-2 py-0.5">
            Humain demandé
          </Badge>
        );
      case "promise_due":
        return (
          <Badge variant="promise_due" className="capitalize text-[10px] font-semibold rounded-full px-2 py-0.5">
            Promesse échue
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-[10px] rounded-full px-2 py-0.5">Relais Humain</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] select-none">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              À Traiter en Priorité
            </h3>
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-[#FF3B30] border border-rose-200/60">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
              {priorityQueue.length} Relais Urgents
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 tracking-tight">
            Conversations détectées par l&apos;IA nécessitant votre intervention (dépôt imminent, réclamation ou négociation)
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Objectif: &lt; 15 min</span>
        </div>
      </div>

      {/* Escalation Queue Table / List */}
      <div className="mt-3 divide-y divide-slate-100/80">
        {priorityQueue.map((item) => {
          const customerName = item.customers?.name || "Client";
          const isUpset = item.status === "upset";
          const isReadyToPay = item.status === "ready_to_pay";

          return (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between py-3.5 transition-all hover:bg-slate-50/80 rounded-2xl px-3 -mx-3"
            >
              <div className="flex items-start space-x-3 min-w-0">
                {/* Status Dot */}
                <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full">
                  <span
                    className={`h-2 w-2 rounded-full ring-2 ring-white shadow-2xs ${
                      isReadyToPay
                        ? "bg-[#34C759]"
                        : isUpset
                        ? "bg-[#FF3B30]"
                        : "bg-[#0071E3]"
                    }`}
                  />
                </span>

                {/* Info block */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                      {customerName}
                    </span>
                    {getChannelBadge(item.channel_type)}
                    {getTriageBadge(item.triage_tag)}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1 tracking-tight leading-relaxed">
                    {item.ai_context_summary}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 sm:mt-0 flex items-center justify-end shrink-0 pl-4">
                <button
                  type="button"
                  onClick={() => onReviewHandoff(item)}
                  className="inline-flex items-center text-xs font-semibold text-[#0071E3] hover:text-white bg-blue-50/80 hover:bg-[#0071E3] px-3 py-1.5 rounded-xl border border-blue-200/50 transition-all active:scale-95 shadow-2xs"
                >
                  <span className="tracking-tight">Ouvrir l&apos;Échange</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
