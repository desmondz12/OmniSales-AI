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
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
            WhatsApp
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-semibold text-pink-700 border border-pink-200">
            Instagram
          </span>
        );
      case "messenger":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
            Messenger
          </span>
        );
      case "tiktok":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            TikTok
          </span>
        );
      case "telegram":
        return (
          <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200">
            Telegram
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
            {type}
          </span>
        );
    }
  };

  const getTriageBadge = (tag: string) => {
    switch (tag) {
      case "ready_to_pay":
        return (
          <Badge variant="ready_to_pay" className="capitalize">
            Ready to pay
          </Badge>
        );
      case "upset":
        return (
          <Badge variant="upset" className="capitalize">
            Upset Customer
          </Badge>
        );
      case "asked_for_person":
        return (
          <Badge variant="needs_human" className="capitalize">
            Asked for a person
          </Badge>
        );
      case "promise_due":
        return (
          <Badge variant="promise_due" className="capitalize">
            Promise due
          </Badge>
        );
      default:
        return <Badge variant="secondary">Needs Human</Badge>;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Needs You Now
            </h3>
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/60">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              {priorityQueue.length} Priority Escalations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Escalated conversations where AI detected high-value payment intent, distress, or human requests
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Avg. resolution target: &lt; 15 mins</span>
        </div>
      </div>

      {/* Escalation Queue Table / List */}
      <div className="mt-4 divide-y divide-slate-100">
        {priorityQueue.map((item) => {
          const customerName = item.customers?.name || "Customer";
          const isUpset = item.status === "upset";
          const isReadyToPay = item.status === "ready_to_pay";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 transition-colors hover:bg-slate-50/60 rounded-xl px-2.5 -mx-2.5"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                {/* Status Dot */}
                <span className="mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isReadyToPay
                        ? "bg-emerald-500"
                        : isUpset
                        ? "bg-rose-500"
                        : "bg-blue-500"
                    }`}
                  />
                </span>

                {/* Info block */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {customerName}
                    </span>
                    {getChannelBadge(item.channel_type)}
                    {getTriageBadge(item.triage_tag)}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 leading-relaxed">
                    {item.ai_context_summary}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3 sm:mt-0 flex items-center justify-end shrink-0 pl-6">
                <button
                  type="button"
                  onClick={() => onReviewHandoff(item)}
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200/60 transition-colors"
                >
                  <span>Review Handoff</span>
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
