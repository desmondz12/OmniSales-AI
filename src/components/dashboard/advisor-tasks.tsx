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
      actionLabel: "Envoyer catalogue & lien de réduction",
      confidence: 96,
      icon: Megaphone,
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-700",
      badgeBorder: "border-indigo-200",
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
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200",
    },
    {
      id: "task-3",
      category: "risk",
      title: "Bordereau de virement bancaire en attente de vérification",
      description:
        "Un client a envoyé une capture d'écran d'un virement de 180 000 FCFA (Afriland First Bank) au lieu d'utiliser le paiement direct MoMo/Orange Money. Vérifiez le crédit effectif avant expédition.",
      impact: "Éviter une expédition non soldée",
      actionLabel: "Consulter la pièce jointe dans l'Inbox",
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
    <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 sm:p-7 shadow-card">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-border-secondary">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold tracking-tight text-text-primary">
                Tâches Conseiller IA (Advisor Tasks)
              </h3>
              <span className="inline-flex items-center rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-700 border border-accent-200/50 dark:bg-accent-950/40 dark:text-accent-300 dark:border-accent-900/40">
                Moteur Proactif Cameroun
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Recommandations commerciales et financières à fort impact générées par l&apos;analyse de nuit
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-text-tertiary">
          <span>{tasks.length} opportunités identifiées</span>
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
                  ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/40"
                  : "border-border-button-default bg-background-secondary-default hover:bg-background-primary-default hover:shadow-card"
              }`}
            >
              <div>
                {/* Top Row: Category Badge + Dismiss Button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border capitalize ${task.badgeBg} ${task.badgeText} ${task.badgeBorder}`}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {task.category}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-medium text-text-tertiary">
                      {task.confidence}% pertinence
                    </span>
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleDismissTask(task.id)}
                        className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-background-secondary-default transition-colors"
                        title="Ignorer la recommandation"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="mt-3 text-sm font-semibold text-text-primary group-hover:text-accent-600 transition-colors">
                  {task.title}
                </h4>

                {/* Description */}
                <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                  {task.description}
                </p>

                {/* Impact Highlight */}
                <div className="mt-3 inline-flex items-center rounded-lg bg-background-primary-default border border-border-button-default px-2.5 py-1 text-[11px] font-medium text-text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {task.impact}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-5 pt-3 border-t border-border-secondary">
                {isCompleted ? (
                  <div className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-100/80 py-2 px-3 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Action exécutée par l&apos;IA</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isExecuting}
                    onClick={() => handleExecuteTask(task.id)}
                    className="w-full justify-center rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Exécution en cours...
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
