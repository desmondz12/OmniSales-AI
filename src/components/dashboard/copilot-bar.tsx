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
    "Follow up with overdue customers",
    "Send payment link to Femi",
    "Check TikTok reseller inquiries",
    "Summarize today's cash collections",
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
        currentQuery.toLowerCase().includes("follow up")
      ) {
        responseText =
          "Found 2 customers with overdue commitments: Chiamaka Nwosu (₦250,000) and Femi Adeleke (₦550,000 pending). Dispatched personalized payment reminders with Paystack links.";
        actionText = "Dispatched 2 WhatsApp & Messenger payment reminder messages.";
      } else if (currentQuery.toLowerCase().includes("femi")) {
        responseText =
          "Generated instant Paystack payment link for Femi Adeleke (₦550,000) and sent it to his WhatsApp chat.";
        actionText = "Sent invoice INV-2026-081 link to +234 803 111 2233.";
      } else if (currentQuery.toLowerCase().includes("tiktok")) {
        responseText =
          "Analyzed 14 TikTok comments and DMs from overnight. 6 leads inquired about the bulk electronics catalog; sent automatic PDF brochure link.";
        actionText = "Sent automated catalog link to 6 TikTok leads.";
      } else {
        responseText = `OmniSales AI executed: "${currentQuery}". All channel states and customer CRM profiles updated.`;
        actionText = "Instruction logged and executed successfully.";
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
                className="inline-flex shrink-0 items-center rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm border border-slate-200/90 backdrop-blur-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all cursor-pointer"
              >
                <Sparkles className="mr-1.5 h-3 w-3 text-blue-600" />
                {s}
              </button>
            ))}
          </div>

          {/* Main Floating Glassmorphic Bar */}
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full items-center rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
          >
            {/* AI Mascot Glow Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs ml-1">
              <Bot className="h-5 w-5" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or give an instruction (e.g., 'Follow up with everyone who promised to pay today')..."
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Microphone Toggle Button */}
            <button
              type="button"
              onClick={handleToggleMic}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-slate-900 ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse hover:text-white"
                  : "hover:bg-slate-100"
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
              className="ml-1.5 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 font-semibold text-xs shadow-xs"
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
          <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    OmniSales AI Co-Pilot
                  </h4>
                  <p className="text-[10px] text-slate-400">{activeResult.timestamp}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Instruction
              </p>
              <p className="text-xs font-medium text-slate-900 mt-0.5">
                &ldquo;{activeResult.query}&rdquo;
              </p>
            </div>

            <div className="mt-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeResult.response}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">
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
                className="text-xs"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
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
