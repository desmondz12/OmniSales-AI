"use client";

import * as React from "react";
import {
  Bot,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Pause,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";

interface MoneyBriefCardProps {
  ownerName: string;
  onOpenCopilot?: (query: string) => void;
}

export function MoneyBriefCard({ ownerName, onOpenCopilot }: MoneyBriefCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const briefText =
    "Three people need you today: Jean-Pierre is ready to pay his 550,000 FCFA deposit via MTN MoMo, Boris is upset about his order delivery in Yaoundé, and Marie-Claire wants to negotiate wholesale pricing for Douala. 1.2 million FCFA is still owed across four customers, two of them overdue. Danielle paid 300,000 FCFA yesterday via Orange Money and I matched it to her invoice automatically. I handled 14 replies overnight across 5 channels in English and French.";

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(briefText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-gradient-to-br from-background-primary-default via-background-primary-default to-accent-50/20 p-6 sm:p-8 shadow-card transition-all">
      {/* Decorative ambient background blur */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-accent-600/10 blur-3xl" />

      {/* Top Header: Mascot Avatar + Greeting + Tag */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-md shadow-accent-600/25 ring-4 ring-background-primary-default">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background-primary-default">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
                Good morning / Bonjour, {ownerName}.
              </h2>
              <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 text-[11px] font-medium text-accent-700 border border-accent-200/50">
                <Sparkles className="mr-1 h-3 w-3 text-accent-600" />
                The Morning Money Brief • Le Brief Matinal
              </span>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">
              Live executive synthesis across 5 channels (Cameroon • Douala &amp; Yaoundé) • 08:00 AM
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Player & Ask Button */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium shadow-xs transition-all ${
              isPlayingAudio
                ? "bg-accent-600 text-white shadow-accent-600/25 ring-2 ring-accent-400 ring-offset-1"
                : "bg-background-primary-default text-text-secondary border border-border-button-default hover:bg-background-secondary-default hover:text-text-primary"
            }`}
            title="Listen to 30s executive audio brief"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="mr-1.5 h-3.5 w-3.5 fill-current" />
                <span>Playing · 30s</span>
                <span className="ml-2 flex items-center space-x-0.5">
                  <span className="h-2 w-0.5 bg-white animate-[bounce_0.6s_infinite_100ms]" />
                  <span className="h-3 w-0.5 bg-white animate-[bounce_0.6s_infinite_200ms]" />
                  <span className="h-2 w-0.5 bg-white animate-[bounce_0.6s_infinite_300ms]" />
                </span>
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current text-accent-600" />
                <span>Écouter / Listen · 30s</span>
                <Volume2 className="ml-1.5 h-3.5 w-3.5 text-text-tertiary" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenCopilot?.("Explain what I need to do with Jean-Pierre and Boris today")}
            className="inline-flex items-center rounded-full bg-background-primary-default px-3.5 py-1.5 text-xs font-medium text-text-secondary border border-border-button-default hover:bg-background-secondary-default hover:text-text-primary transition-colors shadow-xs"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent-600" />
            Ask about this
          </button>
        </div>
      </div>

      {/* The Natural Language Executive Summary */}
      <div className="mt-5 rounded-2xl bg-background-primary-default/80 p-4 sm:p-5 backdrop-blur-xs border border-border-button-default shadow-xs">
        <p className="text-sm sm:text-[15px] font-normal leading-relaxed text-text-primary">
          <strong className="text-accent-700 font-semibold">Trois clients ont besoin de vous aujourd&apos;hui :</strong>{" "}
          <span className="text-text-primary font-semibold">Jean-Pierre Fotso</span> est prêt à verser son acompte de{" "}
          <strong className="text-text-primary font-semibold">550 000 FCFA</strong> par MTN MoMo,{" "}
          <span className="text-text-primary font-semibold">Boris Atangana</span> est contrarié par son colis à Yaoundé, et{" "}
          <span className="text-text-primary font-semibold">Marie-Claire Ngo</span> souhaite négocier un tarif de gros pour Bonanjo.{" "}
          <strong className="text-text-primary font-semibold">1 200 000 FCFA</strong> restent dus sur quatre clients, dont deux en retard.{" "}
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Danielle a payé 300 000 FCFA hier via Orange Money</span> et je l&apos;ai réconcilié automatiquement. J&apos;ai géré{" "}
          <strong className="text-text-primary font-semibold">14 réponses cette nuit</strong> sur 5 canaux en français et anglais.
        </p>
      </div>

      {/* 4 Inline Metric Columns inside the brief card */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Créances clients (Owed)</span>
            <DollarSign className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-text-primary">
              1 200 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
            4 clients (2 en retard)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Encaissé hier (Collected)</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
              300 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-text-tertiary">
            Danielle Ewane (Orange Money)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Conversations actives</span>
            <MessageSquare className="h-3.5 w-3.5 text-accent-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-text-primary">
              8
            </span>
            <span className="text-xs text-text-tertiary">échanges</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-text-tertiary">
            Sur les 5 canaux actifs
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Géré par l&apos;IA (Autonome)</span>
            <Bot className="h-3.5 w-3.5 text-accent-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-accent-700 dark:text-accent-400">
              14
            </span>
            <span className="text-xs text-text-tertiary">réponses</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
            3 requièrent votre validation
          </p>
        </div>
      </div>
    </div>
  );
}
