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
      title: "6 prospects qualifiés depuis TikTok & Instagram",
      description:
        "TikTok et Instagram ont généré 6 nouveaux leads cette nuit à Douala et Yaoundé, dont 4 demandant les tarifs de gros pour les packs revendeurs. Fadimatou Bello a promis de payer vendredi via MTN MoMo.",
      impact: "+320 000 FCFA de pipeline potentiel",
      actionLabel: "Envoyer catalogue & réduction",
      confidence: 96,
      icon: Megaphone,
      badgeBg: "bg-indigo-50",
      badgeText: "text-[#5856D6]",
      badgeBorder: "border-indigo-200/60",
    },
    {
      id: "task-2",
      category: "finance",
      title: "Deux impayés représentent 46% de vos créances",
      description:
        "Relancez Christian Kamga en priorité (250 000 FCFA dus à Bafoussam). Historiquement, il règle immédiatement suite à une note vocale WhatsApp personnalisée.",
      impact: "250 000 FCFA de recouvrement immédiat",
      actionLabel: "Déclencher relance auto WhatsApp",
      confidence: 98,
      icon: TrendingUp,
      badgeBg: "bg-amber-50",
      badgeText: "text-[#FF9500]",
      badgeBorder: "border-amber-200/60",
    },
    {
      id: "task-3",
      category: "risk",
      title: "Bordereau de virement bancaire en attente de vérification",
      description:
        "Un client a envoyé une capture d'écran d'un virement de 180 000 FCFA (Afriland First Bank) au lieu d'utiliser le paiement direct MoMo/Orange Money. Vérifiez le crédit effectif avant expédition.",
      impact: "Éviter une expédition non soldée",
      actionLabel: "Consulter la capture dans l'Inbox",
      confidence: 94,
      icon: ShieldAlert,
      badgeBg: "bg-rose-50",
      badgeText: "text-[#FF3B30]",
      badgeBorder: "border-rose-200/60",
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
    <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] select-none">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0071E3] to-[#5856D6] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                Recommandations Proactives de l&apos;Agente
              </h3>
              <span className="rounded-full bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-bold text-[#0071E3] border border-blue-200/50">
                Priorités du Jour
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 tracking-tight">
              Actions recommandées en temps réel d&apos;après les discussions et transactions enregistrées
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-400">
          {tasks.length - completedTaskIds.length} actions en attente
        </span>
      </div>

      {/* Task Cards Grid */}
      <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
        {tasks.map((task) => {
          const isDone = completedTaskIds.includes(task.id);
          const isBusy = executingTaskId === task.id;
          const Icon = task.icon;

          return (
            <div
              key={task.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                isDone
                  ? "border-emerald-200 bg-emerald-50/40 opacity-75"
                  : "border-slate-200/70 bg-white/95 shadow-2xs hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${task.badgeBg} ${task.badgeText} ${task.badgeBorder}`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="capitalize">{task.category}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDismissTask(task.id)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    title="Masquer cette suggestion"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="mt-2.5 text-xs font-bold text-slate-900 tracking-tight leading-snug">
                  {task.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed tracking-tight line-clamp-3">
                  {task.description}
                </p>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100/80">
                <p className="text-[11px] font-semibold text-emerald-700 tracking-tight">
                  {task.impact}
                </p>

                <div className="mt-2.5">
                  {isDone ? (
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 py-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Exécuté avec succès !</span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      disabled={isBusy}
                      size="sm"
                      onClick={() => handleExecuteTask(task.id)}
                      className="w-full rounded-xl bg-slate-900 hover:bg-[#0071E3] text-white text-xs font-semibold py-1.5 shadow-2xs transition-all active:scale-95"
                    >
                      {isBusy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      <span className="truncate">{task.actionLabel}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
