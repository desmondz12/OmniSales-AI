"use client";

import * as React from "react";
import {
  Bot,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Pause,
  Play,
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
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 select-none shadow-xs">
      {/* Top Header: Mascot Avatar + Context Date + Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0071E3] text-white shadow-xs">
            <Bot className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Brief commercial · Douala &amp; Yaoundé
              </h2>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                08:00
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Synthèse omnicanale pour {ownerName} • 5 canaux connectés
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Player & Ask Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
              isPlayingAudio
                ? "bg-[#0071E3] text-white"
                : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
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
                <span>Écouter le brief · 30s</span>
                <Volume2 className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenCopilot?.("Explique-moi ce que je dois faire avec Jean-Pierre et Boris aujourd'hui")}
            className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-[#0071E3] transition-colors shadow-2xs"
          >
            <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            <span>Consignes IA</span>
          </button>
        </div>
      </div>

      {/* The Natural Language Executive Summary */}
      <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
        <p className="text-sm font-normal leading-relaxed text-slate-800">
          <strong className="text-[#0071E3] font-medium">Trois clients ont besoin de vous aujourd&apos;hui :</strong>{" "}
          <span className="text-slate-900 font-medium">Jean-Pierre Fotso</span> est prêt à verser son acompte de{" "}
          <strong className="text-slate-900 font-medium tabular-nums">550 000 FCFA</strong> par MTN MoMo,{" "}
          <span className="text-slate-900 font-medium">Boris Atangana</span> est contrarié par son colis à Yaoundé, et{" "}
          <span className="text-slate-900 font-medium">Marie-Claire Ngo</span> souhaite négocier un tarif de gros pour Bonanjo.{" "}
          <strong className="text-slate-900 font-medium tabular-nums">1 200 000 FCFA</strong> restent dus sur quatre clients, dont deux en retard.{" "}
          <span className="text-emerald-700 font-medium">Danielle a versé 300 000 FCFA hier via Orange Money</span> et l&apos;encaissement a été réconcilié. Le système a traité{" "}
          <strong className="text-slate-900 font-medium tabular-nums">14 réponses cette nuit</strong> sur 5 canaux en français et anglais.
        </p>
      </div>

      {/* 4 Inline Metric Columns inside the brief card */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Créances clients</span>
            <DollarSign className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="mt-1.5 flex items-baseline">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
              1 200 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-amber-700">
            4 clients (2 en retard)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Encaissé hier</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5 flex items-baseline">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-emerald-700 tabular-nums">
              300 000 FCFA
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500 truncate">
            Danielle (Orange Money)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Conversations</span>
            <MessageSquare className="h-3.5 w-3.5 text-[#0071E3]" />
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
              8
            </span>
            <span className="text-xs text-slate-400">échanges</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Sur les 5 canaux actifs
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Automatisé IA</span>
            <Bot className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 tabular-nums">
              14
            </span>
            <span className="text-xs text-slate-400">réponses</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-rose-600">
            3 requièrent validation
          </p>
        </div>
      </div>
    </div>
  );
}
