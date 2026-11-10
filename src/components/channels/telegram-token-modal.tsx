"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TelegramTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  botUsername?: string | null;
  onConnected?: (channelType: "telegram", handle: string) => void;
}

export function TelegramTokenModal({
  isOpen,
  onClose,
  botUsername,
  onConnected,
}: TelegramTokenModalProps) {
  const [tab, setTab] = React.useState<"qr" | "bot_token">("qr");
  const [username, setUsername] = React.useState(
    botUsername || "@MusaSalesAgentBot"
  );
  const [editUsername, setEditUsername] = React.useState(false);
  const [token, setToken] = React.useState(
    "7192830192:AAHs...992kL102mZ_telegram_bot_token"
  );
  const [pairingState, setPairingState] = React.useState<
    "idle" | "scanning" | "syncing" | "success"
  >("idle");
  const [secondsLeft, setSecondsLeft] = React.useState(30);
  const [isCopied, setIsCopied] = React.useState(false);

  // Countdown timer for QR code validity
  React.useEffect(() => {
    if (!isOpen || tab !== "qr" || pairingState !== "idle") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 30; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, tab, pairingState]);

  if (!isOpen) return null;

  const deepLinkUrl = `https://t.me/${username.replace(/^@/, "")}?start=connect_omnisales_${Date.now()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateScan = async () => {
    setPairingState("scanning");

    setTimeout(() => {
      setPairingState("syncing");
    }, 1000);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/channels/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel: "telegram",
            handle: username,
            accountName: "Telegram Sales Bot",
            scopes: ["bot_messages", "bot_commands"],
          }),
        });

        if (res.ok) {
          setPairingState("success");
          if (onConnected) {
            onConnected("telegram", username);
          }
          setTimeout(() => {
            onClose();
            setPairingState("idle");
          }, 1500);
        } else {
          setPairingState("idle");
        }
      } catch {
        setPairingState("idle");
      }
    }, 2200);
  };

  const handleSaveToken = async () => {
    setPairingState("syncing");
    try {
      await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "telegram",
          handle: username,
          accessToken: token,
          accountName: "Telegram Sales Bot",
        }),
      });

      setPairingState("success");
      if (onConnected) {
        onConnected("telegram", username);
      }
      setTimeout(() => {
        onClose();
        setPairingState("idle");
      }, 1000);
    } catch {
      setPairingState("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-sm border border-sky-100">
              <Send className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Telegram Sales Gateway
                </h3>
                <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-200">
                  QR Link
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan QR code with Telegram to pair your bot & chat channel instantly
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("qr")}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              tab === "qr"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="flex items-center justify-center space-x-1.5">
              <QrCode className="h-3.5 w-3.5 text-sky-600" />
              <span>QR Code Link (Instant)</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("bot_token")}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              tab === "bot_token"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bot Token (Advanced)
          </button>
        </div>

        {/* Tab Content */}
        {tab === "qr" ? (
          <div className="mt-5 flex flex-col items-center text-center">
            {/* Visual High-Resolution Telegram QR Code */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-4">
              <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                {/* SVG QR Pattern */}
                <svg
                  className="w-full h-full text-slate-900"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="28" height="28" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" />
                  <rect x="13" y="13" width="12" height="12" rx="2" />

                  <rect x="67" y="5" width="28" height="28" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" />
                  <rect x="75" y="13" width="12" height="12" rx="2" />

                  <rect x="5" y="67" width="28" height="28" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" />
                  <rect x="13" y="75" width="12" height="12" rx="2" />

                  {/* Dense data modules */}
                  <rect x="36" y="10" width="6" height="5" />
                  <rect x="46" y="8" width="5" height="6" />
                  <rect x="56" y="14" width="6" height="5" />
                  <rect x="42" y="24" width="5" height="5" />
                  <rect x="52" y="22" width="6" height="6" />

                  <rect x="10" y="38" width="5" height="6" />
                  <rect x="22" y="44" width="6" height="5" />
                  <rect x="12" y="54" width="6" height="5" />
                  <rect x="26" y="52" width="5" height="6" />

                  <rect x="68" y="38" width="6" height="6" />
                  <rect x="78" y="44" width="6" height="5" />
                  <rect x="88" y="38" width="5" height="6" />
                  <rect x="72" y="54" width="7" height="5" />

                  <rect x="38" y="68" width="6" height="6" />
                  <rect x="48" y="76" width="6" height="6" />
                  <rect x="58" y="70" width="5" height="5" />
                  <rect x="40" y="86" width="6" height="6" />
                  <rect x="54" y="84" width="6" height="6" />

                  <rect x="68" y="70" width="6" height="5" />
                  <rect x="78" y="78" width="6" height="6" />
                  <rect x="86" y="70" width="6" height="6" />
                  <rect x="70" y="86" width="6" height="6" />
                  <rect x="84" y="84" width="6" height="6" />
                </svg>

                {/* Center Telegram icon badge */}
                <div className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-white shadow-md ring-4 ring-white">
                  <Send className="h-5 w-5" />
                </div>
              </div>

              {/* Pairing In-Progress Overlay */}
              {pairingState !== "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xs p-4 text-center">
                  {pairingState === "scanning" && (
                    <>
                      <Smartphone className="h-8 w-8 text-sky-500 animate-bounce" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Telegram Scan Detected
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Authorizing session...
                      </p>
                    </>
                  )}
                  {pairingState === "syncing" && (
                    <>
                      <Send className="h-8 w-8 text-sky-600 animate-pulse" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Pairing Bot Gateway
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Linking {username}...
                      </p>
                    </>
                  )}
                  {pairingState === "success" && (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      <p className="mt-2 text-xs font-bold text-emerald-800">
                        Telegram Linked!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Bot messages active on OmniSales AI
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Timer and Refresh */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
              <span>QR code valid for {secondsLeft}s</span>
              <button
                type="button"
                onClick={() => setSecondsLeft(30)}
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Refresh
              </button>
            </div>

            {/* Bot Username Editor */}
            <div className="mt-3 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-medium">Linking Bot:</span>
              {editUsername ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setEditUsername(false)}
                  autoFocus
                  className="rounded border border-sky-400 bg-white px-2 py-0.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditUsername(true)}
                  className="font-mono font-bold text-slate-900 cursor-pointer hover:underline"
                  title="Click to edit bot username"
                >
                  {username}
                </span>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-left text-xs text-slate-600 space-y-1.5 w-full">
              <p className="font-bold text-slate-800 flex items-center">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-sky-600" />
                How to link Telegram via QR:
              </p>
              <p>1. Open Telegram on your phone or computer</p>
              <p>2. Scan this QR code with your camera or tap link below</p>
              <p>3. Tap <strong>Start</strong> to grant OmniSales AI message permissions</p>
            </div>

            {/* Direct Open Link & Copy */}
            <div className="mt-2.5 flex items-center justify-center space-x-3 text-[11px]">
              <a
                href={deepLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium underline"
              >
                <span>Open direct in Telegram</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-1 h-3 w-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    <span>Copy Deep Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Pairing Button */}
            <div className="mt-4 w-full">
              <Button
                type="button"
                disabled={pairingState !== "idle"}
                onClick={handleSimulateScan}
                className="w-full rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs py-2.5 shadow-sm"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                {pairingState === "idle"
                  ? "Instant QR Scan & Link Telegram"
                  : "Pairing in progress..."}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Telegram Bot API Token (from @BotFather)
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl bg-sky-50 border border-sky-200/80 p-3 text-xs text-sky-900">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                <span>Telegram Webhook Target</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-sky-800 break-all">
                https://omnisales.ai/api/webhooks/telegram
              </p>
            </div>
          </div>
        )}

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

          {tab === "bot_token" && (
            <Button
              type="button"
              size="sm"
              onClick={handleSaveToken}
              className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs"
            >
              Save Bot Token
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
