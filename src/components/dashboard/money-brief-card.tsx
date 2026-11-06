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
    "Three people need you today: Femi is ready to pay his 550,000 naira deposit, Obinna is upset about his order, and Amaka wants to talk to a person. 1.2 million naira is still owed across four customers, two of them overdue. Dele paid 300,000 naira yesterday and I matched it to his invoice. I handled 14 replies overnight across 5 channels.";

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(briefText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Stop speech when component unmounts
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 p-6 sm:p-8 shadow-xs transition-all hover:shadow-sm">
      {/* Decorative ambient background blur */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Top Header: Mascot Avatar + Greeting + Tag */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-4 ring-white">
            <Bot className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Good morning, {ownerName}.
              </h2>
              <span className="inline-flex items-center rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800">
                <Sparkles className="mr-1 h-3 w-3 text-blue-600" />
                The Morning Money Brief
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live executive synthesis across 5 channels • Today at 08:00 AM
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Player & Ask Button */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all ${
              isPlayingAudio
                ? "bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-400 ring-offset-1"
                : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
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
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current text-blue-600" />
                <span>Listen · 30s</span>
                <Volume2 className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onOpenCopilot?.("Explain what I need to do with Femi and Obinna today")}
            className="inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/90 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-xs"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
            Ask about this
          </button>
        </div>
      </div>

      {/* The Natural Language Executive Summary */}
      <div className="mt-5 rounded-2xl bg-white/80 p-4 sm:p-5 backdrop-blur-xs border border-white/80 shadow-2xs">
        <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-slate-800">
          <strong className="text-blue-700 font-semibold">Three people need you today:</strong>{" "}
          <span className="text-slate-900 font-semibold">Femi</span> is ready to pay his ₦550k deposit,{" "}
          <span className="text-slate-900 font-semibold">Obinna</span> is upset about his order delivery, and{" "}
          <span className="text-slate-900 font-semibold">Amaka</span> wants to talk to a person regarding wholesale pricing.{" "}
          <strong className="text-slate-900 font-semibold">₦1,200,000</strong> is still owed across four customers, two of them overdue.{" "}
          <span className="text-emerald-700 font-semibold">Dele paid ₦300k yesterday</span> and I matched it to his invoice automatically. I handled{" "}
          <strong className="text-slate-900 font-semibold">14 replies overnight</strong> across 5 channels.
        </p>
      </div>

      {/* 4 Inline Metric Columns inside the brief card */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 backdrop-blur-xs shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Owed by customers</span>
            <DollarSign className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              ₦1,200,000
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-amber-700">
            4 customers (2 overdue)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 backdrop-blur-xs shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Collected yesterday</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-700">
              ₦300,000
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Dele Akin (Paystack matched)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 backdrop-blur-xs shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Conversations</span>
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              8
            </span>
            <span className="text-xs text-slate-400">threads</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Across all 5 channels
          </p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-4 backdrop-blur-xs shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Handled by AI Agent</span>
            <Bot className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-indigo-700">
              14
            </span>
            <span className="text-xs text-slate-400">replies</span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-rose-600">
            3 need your review now
          </p>
        </div>
      </div>
    </div>
  );
}
