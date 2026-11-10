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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] transition-all select-none">
      {/* Decorative ambient Apple aura */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Top Header: Mascot Avatar + Greeting + Tag */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071E3] via-[#0077ED] to-[#5856D6] text-white shadow-md shadow-blue-500/20 ring-4 ring-white">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#34C759] ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Bonjour, {ownerName}.
              </h2>
              <span className="inline-flex items-center rounded-full bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-bold text-[#0071E3] border border-blue-200/50 backdrop-blur-xs">
                <Sparkles className="mr-1 h-3 w-3 text-[#0071E3]" />
                Le Brief Matinal • Executive AI
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 tracking-tight">
              Synthèse intelligente omnicanale (Cameroun • Douala &amp; Yaoundé) • 08:00
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Player & Ask Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95 ${
              isPlayingAudio
                ? "bg-[#0071E3] text-white shadow-blue-500/25 ring-2 ring-blue-400 ring-offset-1"
                : "bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-50"
            }`}
            title="Listen to 30s executive audio brief"
          >
            {isPlayingAudio ? (
              <>
                <Pause className="mr-1.5 h-3.5 w-3.5 fill-current" />
                <span>Lecture · 30s</span>
                <span className="ml-2 flex items-center space-x-0.5">
                  <span className="h-2 w-0.5 bg-white animate-[bounce_0.6s_infinite_100ms]" />
                  <span className="h-3 w-0.5 bg-white animate-[bounce_0.6s_infinite_200ms]" />
                  <span className="h-2 w-0.5 bg-white animate-[bounce_0.6s_infinite_300ms]" />
                </span>
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current text-[#0071E3]" />
                <span>Écouter · 30s</span>
                <Volume2 className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenCopilot?.("Explique-moi ce que je dois faire avec Jean-Pierre et Boris aujourd'hui")}
            className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/80 hover:bg-blue-50 hover:text-[#0071E3] hover:border-blue-200 transition-all active:scale-95 shadow-xs"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#0071E3]" />
            Questions IA
          </button>
        </div>
      </div>

      {/* The Natural Language Executive Summary */}
      <div className="mt-5 rounded-2xl bg-slate-50/70 p-4 sm:p-5 backdrop-blur-md border border-slate-100">
        <p className="text-sm sm:text-[15px] font-normal leading-relaxed text-slate-800 tracking-tight">
          <strong className="text-[#0071E3] font-semibold">Trois clients ont besoin de vous aujourd&apos;hui :</strong>{" "}
          <span className="text-slate-900 font-semibold">Jean-Pierre Fotso</span> est prêt à verser son acompte de{" "}
          <strong className="text-slate-900 font-semibold">550 000 FCFA</strong> par MTN MoMo,{" "}
          <span className="text-slate-900 font-semibold">Boris Atangana</span> est contrarié par son colis à Yaoundé, et{" "}
          <span className="text-slate-900 font-semibold">Marie-Claire Ngo</span> souhaite négocier un tarif de gros pour Bonanjo.{" "}
          <strong className="text-slate-900 font-semibold">1 200 000 FCFA</strong> restent dus sur quatre clients, dont deux en retard.{" "}
          <span className="text-[#34C759] font-semibold">Danielle a payé 300 000 FCFA hier via Orange Money</span> et je l&apos;ai réconcilié automatiquement. J&apos;ai géré{" "}
          <strong className="text-slate-900 font-semibold">14 réponses cette nuit</strong> sur 5 canaux en français et anglais.
        </p>
      </div>

      {/* 4 Inline Metric Columns inside the brief card */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 backdrop-blur-xs shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Créances Clients</span>
            <DollarSign className="h-3.5 w-3.5 text-[#FF9500]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              1 200 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-[#FF9500]">
            4 clients (2 en retard)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 backdrop-blur-xs shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Encaissé Hier</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#34C759]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#34C759]">
              300 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 truncate">
            Danielle (Orange Money)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 backdrop-blur-xs shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Conversations</span>
            <MessageSquare className="h-3.5 w-3.5 text-[#0071E3]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              8
            </span>
            <span className="text-xs text-slate-400">échanges</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Sur les 5 canaux actifs
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-4 backdrop-blur-xs shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Géré par l&apos;IA</span>
            <Bot className="h-3.5 w-3.5 text-[#5856D6]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#5856D6]">
              14
            </span>
            <span className="text-xs text-slate-400">réponses</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-[#FF3B30]">
            3 requièrent validation
          </p>
        </div>
      </div>
    </div>
  );
}
