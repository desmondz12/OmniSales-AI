"use client";

import * as React from "react";
import {
  CheckCircle2,
  Loader2,
  Megaphone,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvisorTask {
  id: string;
  category: "marketing" | "finance" | "risk";
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  confidence: number;
  icon: typeof Sparkles;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export function AdvisorTasks() {
  const [tasks, setTasks] = React.useState<AdvisorTask[]>([
    {
      id: "task-1",
      category: "marketing",
      title: "6 High-Intent Leads from TikTok & Instagram",
      description:
        "Instagram and TikTok brought 6 new leads overnight, 4 asking about pricing for the bulk reseller pack. Sodiq Bello promised payment on Friday.",
      impact: "+₦320,000 potential pipeline",
      actionLabel: "Dispatch Catalog & Special Offer Link",
      confidence: 96,
      icon: Megaphone,
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-700",
      badgeBorder: "border-indigo-200",
    },
    {
      id: "task-2",
      category: "finance",
      title: "Two Overdue Debts Make Up 46% of Receivables",
      description:
        "Chase Chiamaka Nwosu first (₦250,000 overdue). She has a 100% historical response rate to morning WhatsApp voice notes.",
      impact: "₦250,000 immediate cash recovery",
      actionLabel: "Trigger WhatsApp Auto-Nudge",
      confidence: 98,
      icon: TrendingUp,
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200",
    },
    {
      id: "task-3",
      category: "risk",
      title: "Bank Transfer Slip Awaiting Manual Verification",
      description:
        "One customer sent a screenshot of a ₦180,000 transfer receipt instead of paying through the automated Paystack link. Verify bank credit before dispatch.",
      impact: "Prevent unauthorized goods dispatch",
      actionLabel: "Review Receipt in Live Inbox",
      confidence: 94,
      icon: ShieldAlert,
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-700",
      badgeBorder: "border-rose-200",
    },
  ]);

  const [executingTaskId, setExecutingTaskId] = React.useState<string | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = React.useState<string[]>([]);

  const handleExecuteTask = (taskId: string) => {
    setExecutingTaskId(taskId);
    setTimeout(() => {
      setExecutingTaskId(null);
      setCompletedTaskIds((prev) => [...prev, taskId]);
    }, 1200);
  };

  const handleDismissTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                Advisor Tasks
              </h3>
              <span className="inline-flex items-center rounded-full bg-blue-100/80 px-2 py-0.5 text-[11px] font-semibold text-blue-800">
                Proactive AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-leverage business actions generated from overnight message and invoice analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>{tasks.length} active opportunities</span>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isExecuting = executingTaskId === task.id;
          const isCompleted = completedTaskIds.includes(task.id);

          return (
            <div
              key={task.id}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 ${
                isCompleted
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div>
                {/* Top Row: Category Badge + Dismiss Button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border capitalize ${task.badgeBg} ${task.badgeText} ${task.badgeBorder}`}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {task.category}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-medium text-slate-400">
                      {task.confidence}% match
                    </span>
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleDismissTask(task.id)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200/60 transition-colors"
                        title="Dismiss recommendation"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>

                {/* Description */}
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </p>

                {/* Impact Highlight */}
                <div className="mt-3 inline-flex items-center rounded-lg bg-white/90 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {task.impact}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-200/60">
                {isCompleted ? (
                  <div className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-100/80 py-2 px-3 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Action Executed by AI</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isExecuting}
                    onClick={() => handleExecuteTask(task.id)}
                    className="w-full justify-center rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        {task.actionLabel}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
