"use client";

import * as React from "react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopilotBarProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
  onNavigateInbox?: () => void;
}

interface ExecutionResult {
  query: string;
  response: string;
  actionTaken: string;
  timestamp: string;
}

export function CopilotBar({
  initialPrompt,
  onClearInitialPrompt,
  onNavigateInbox,
}: CopilotBarProps) {
  const [input, setInput] = React.useState("");
  const [isListening, setIsListening] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeResult, setActiveResult] = React.useState<ExecutionResult | null>(null);

  // Synchronize initialPrompt if it changed, without triggering cascading renders in effect
  const [lastInitialPrompt, setLastInitialPrompt] = React.useState<string | undefined>(undefined);
  if (initialPrompt && initialPrompt !== lastInitialPrompt) {
    setLastInitialPrompt(initialPrompt);
    setInput(initialPrompt);
    onClearInitialPrompt?.();
  }

  // Quick suggestion chips
  const suggestions = [
    "Relancer les clients en retard de paiement (MoMo/OM)",
    "Envoyer lien de paiement 550 000 FCFA à Jean-Pierre Fotso",
    "Consulter les demandes de prix TikTok (Garoua/Yaoundé)",
    "Faire le point des encaissements du jour en FCFA",
  ];

  const handleToggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setInput("Relancer tous les clients dont les promesses de paiement sont échues aujourd'hui");
        setIsListening(false);
      }, 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const currentQuery = input.trim();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setInput("");

      let actionText = "Action automatisée exécutée sur les canaux connectés.";
      let responseText = `J'ai analysé votre consigne : "${currentQuery}".`;

      if (
        currentQuery.toLowerCase().includes("overdue") ||
        currentQuery.toLowerCase().includes("retard") ||
        currentQuery.toLowerCase().includes("relance") ||
        currentQuery.toLowerCase().includes("follow up")
      ) {
        responseText =
          "J'ai identifié 2 clients avec des échéances dépassées : Christian Kamga (250 000 FCFA à Bafoussam) et Jean-Pierre Fotso (acompte de 550 000 FCFA en attente). J'ai envoyé des rappels personnalisés avec les liens de paiement MTN MoMo et Orange Money.";
        actionText = "2 rappels WhatsApp & Messenger envoyés avec liens MoMo/Orange Money.";
      } else if (currentQuery.toLowerCase().includes("fotso") || currentQuery.toLowerCase().includes("jean-pierre") || currentQuery.toLowerCase().includes("550")) {
        responseText =
          "Lien de paiement instantané MTN MoMo généré pour Jean-Pierre Fotso (550 000 FCFA) et envoyé sur sa discussion WhatsApp.";
        actionText = "Lien de la facture INV-2026-081 transmis au +237 677 11 22 33.";
      } else if (currentQuery.toLowerCase().includes("tiktok")) {
        responseText =
          "Analyse de 14 interactions TikTok cette nuit. 6 prospects ont demandé les tarifs du pack créateur pour Douala et Garoua ; catalogue PDF et modalités d'expédition envoyés.";
        actionText = "Lien catalogue et expédition transmis à 6 prospects TikTok.";
      } else {
        responseText = `OmniSales AI a exécuté votre consigne : "${currentQuery}". Tous les canaux et fiches clients sont à jour.`;
        actionText = "Instruction traitée et enregistrée avec succès.";
      }

      setActiveResult({
        query: currentQuery,
        response: responseText,
        actionTaken: actionText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }, 1100);
  };

  return (
    <>
      {/* Floating Bottom Dock Container */}
      <div className="fixed bottom-6 left-0 right-0 z-40 mx-auto max-w-3xl px-4 sm:px-6 pointer-events-none select-none">
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Quick Suggestion Chips */}
          <div className="mb-2 hidden sm:flex items-center space-x-1.5 overflow-x-auto py-1 px-1 no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="inline-flex shrink-0 items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs border border-slate-200 hover:bg-slate-50 hover:text-[#0071E3] transition-colors cursor-pointer"
              >
                <span>{s}</span>
              </button>
            ))}
          </div>

          {/* Main Floating Capsule */}
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full items-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg transition-colors focus-within:border-[#0071E3] focus-within:ring-1 focus-within:ring-[#0071E3]"
          >
            {/* AI Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0071E3] text-white shadow-2xs ml-0.5">
              <Bot className="h-4 w-4" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consigne commerciale IA (ex: 'Relancer les impayés de plus de 48h')..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-normal"
            />

            {/* Microphone Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors ${
                isListening
                  ? "bg-rose-600 text-white"
                  : "hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={isListening ? "Listening... click to cancel" : "Voice instruction"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>

            {/* Submit / Send Button */}
            <Button
              type="submit"
              disabled={!input.trim() || isProcessing}
              size="sm"
              className="ml-1 h-8 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white px-3 font-medium text-xs shadow-xs"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <span>Exécuter</span>
                  <Send className="ml-1.5 h-3 w-3" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Execution Result Modal / Notification Card */}
      {activeResult && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0071E3]">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
                    OmniSales AI Co-Pilot
                  </h4>
                  <p className="text-[10px] text-slate-400 font-normal">{activeResult.timestamp}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 rounded-2xl bg-slate-50/80 p-3 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Consigne Demandée
              </p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5 tracking-tight">
                &ldquo;{activeResult.query}&rdquo;
              </p>
            </div>

            <div className="mt-3">
              <p className="text-xs text-slate-700 leading-relaxed tracking-tight">
                {activeResult.response}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50/80 border border-emerald-200/70 px-3 py-2 text-xs font-semibold text-emerald-800">
              <div className="flex items-center space-x-1.5 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-[#34C759] shrink-0" />
                <span className="truncate tracking-tight">{activeResult.actionTaken}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveResult(null)}
                className="text-xs rounded-xl"
              >
                Fermer
              </Button>
              {onNavigateInbox && (
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setActiveResult(null);
                    onNavigateInbox();
                  }}
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-xl"
                >
                  <span className="tracking-tight">Voir dans la Boîte</span>
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
