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
  Sparkles,
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
      // Simulate speech recognition capture after 2.5 seconds
      setTimeout(() => {
        setInput("Follow up with all customers whose payment promises are overdue");
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

      let actionText = "Executed automated action across connected channels.";
      let responseText = `I have analyzed your instruction: "${currentQuery}".`;

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
      <div className="fixed bottom-6 left-0 right-0 z-40 mx-auto max-w-4xl px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center">
          {/* Quick Suggestion Chips (Fade-in / Floating above bar) */}
          <div className="mb-2.5 hidden sm:flex items-center space-x-2 overflow-x-auto py-1 px-2 no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setInput(s)}
                className="inline-flex shrink-0 items-center rounded-full bg-background-primary-default px-3 py-1 text-xs font-medium text-text-secondary shadow-xs border border-border-button-default backdrop-blur-md hover:bg-background-secondary-default hover:text-text-primary transition-all cursor-pointer"
              >
                <Sparkles className="mr-1.5 h-3 w-3 text-accent-600" />
                {s}
              </button>
            ))}
          </div>

          {/* Main Floating Glassmorphic Bar */}
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full items-center rounded-full border border-border-button-default bg-background-primary-default/95 p-1.5 sm:p-2 shadow-modal backdrop-blur-xl transition-all duration-300 focus-within:border-accent-600 focus-within:ring-4 focus-within:ring-accent-500/10"
          >
            {/* AI Mascot Glow Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white shadow-xs ml-1">
              <Bot className="h-5 w-5" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or give an instruction (e.g., 'Follow up with everyone who promised to pay today')..."
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none"
            />

            {/* Microphone Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:text-text-primary ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse hover:text-white"
                  : "hover:bg-background-secondary-default"
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
              className="ml-1.5 h-9 rounded-full bg-accent-600 hover:bg-accent-700 text-white px-4 font-medium text-xs shadow-xs"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline mr-1.5">Execute</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Execution Result Modal / Notification Card */}
      {activeResult && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-modal">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">
                    OmniSales AI Co-Pilot
                  </h4>
                  <p className="text-[10px] text-text-tertiary">{activeResult.timestamp}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-background-secondary-default"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 rounded-2xl bg-background-secondary-default p-2.5 border border-border-button-default">
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Instruction
              </p>
              <p className="text-xs font-medium text-text-primary mt-0.5">
                &ldquo;{activeResult.query}&rdquo;
              </p>
            </div>

            <div className="mt-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                {activeResult.response}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200/60 px-3 py-2 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">{activeResult.actionTaken}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveResult(null)}
                className="text-xs rounded-full border-border-button-default text-text-secondary hover:text-text-primary hover:bg-background-secondary-default"
              >
                Dismiss
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
                  className="bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium rounded-full"
                >
                  View in Inbox
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
