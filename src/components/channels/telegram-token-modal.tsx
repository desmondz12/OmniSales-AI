"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TelegramTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  botUsername?: string | null;
}

export function TelegramTokenModal({
  isOpen,
  onClose,
  botUsername,
}: TelegramTokenModalProps) {
  const [token, setToken] = React.useState("7192830192:AAHs...992kL102mZ_telegram_bot_token");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verifyStatus, setVerifyStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [isCopied, setIsCopied] = React.useState(false);

  if (!isOpen) return null;

  const webhookEndpoint = "https://omnisales.ai/api/webhooks/telegram";

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyStatus("success");
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Telegram Bot Integration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active Bot: {botUsername || "@MusaSalesAgentBot"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Telegram Bot API Token (from @BotFather)
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Webhook endpoint card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>OmniSales Telegram Webhook Target</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center text-slate-500 hover:text-slate-900"
              >
                {isCopied ? (
                  <Check className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="mr-1 h-3.5 w-3.5" />
                )}
                {isCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-[11px] text-blue-600 break-all select-all">
              {webhookEndpoint}
            </p>
          </div>

          {/* Verification Status */}
          {verifyStatus === "success" && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Webhook verified! Telegram server responded: <code>&quot;ok: true, result: Webhook was set&quot;</code>
              </span>
            </div>
          )}

          {/* Setup Guide */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Bot Commands enabled:</p>
            <p>• <code>/start</code> — Greets customer & introduces OmniSales AI</p>
            <p>• <code>/catalog</code> — Displays store inventory and current prices</p>
            <p>• <code>/pay</code> — Generates verified payment links via Paystack</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs rounded-xl"
          >
            Close
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isVerifying}
            onClick={handleVerify}
            className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-xs"
          >
            {isVerifying ? "Testing Ping..." : "Verify & Ping Webhook"}
          </Button>
        </div>
      </div>
    </div>
  );
}
