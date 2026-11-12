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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "./qr-code-svg";

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
    botUsername || "@FotsoSalesAgentBot"
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

  // Dynamic Telegram deep link
  const cleanUsername = username.replace(/^@/, "");
  const deepLinkUrl = `https://t.me/${cleanUsername}?start=connect_omnisales_${Date.now()}`;

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateScan = async () => {
    setPairingState("scanning");

    setTimeout(() => {
      setPairingState("syncing");
    }, 900);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/channels/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel: "telegram",
            handle: username,
            accountName: "Telegram Sales Agent",
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
          }, 1400);
        } else {
          setPairingState("idle");
        }
      } catch (err) {
        console.error("Telegram connection error:", err);
        setPairingState("idle");
      }
    }, 1800);
  };

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairingState("syncing");

    try {
      const res = await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "telegram",
          handle: username,
          accountName: "Telegram Sales Bot (Token)",
          accessToken: token,
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
        }, 1200);
      } else {
        setPairingState("idle");
      }
    } catch {
      setPairingState("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Connexion Telegram Bot
                </h3>
                <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-200">
                  QR Direct
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scannez le QR code pour ouvrir et activer le bot dans Telegram
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
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
              <span>QR Code Deep Link (Recommandé)</span>
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
            Token BotFather
          </button>
        </div>

        {/* Tab Content */}
        {tab === "qr" ? (
          <div className="mt-5 flex flex-col items-center text-center">
            {/* Visual Crisp SVG QR Code */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <QRCodeSVG
                value={deepLinkUrl}
                size={180}
                fgColor="#0f172a"
                bgColor="#ffffff"
              />

              {/* Pairing Overlay states */}
              {pairingState !== "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xs p-4 text-center">
                  {pairingState === "scanning" && (
                    <>
                      <Smartphone className="h-8 w-8 text-sky-600 animate-bounce" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Scan Telegram reçu...
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Liaison du bot de vente
                      </p>
                    </>
                  )}

                  {pairingState === "syncing" && (
                    <>
                      <Send className="h-8 w-8 text-sky-600" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Configuration du Webhook...
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Synchronisation avec OmniSales
                      </p>
                    </>
                  )}

                  {pairingState === "success" && (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-sky-600" />
                      <p className="mt-2 text-xs font-bold text-sky-900">
                        Telegram Connecté !
                      </p>
                      <p className="text-[11px] text-sky-700 font-mono">
                        {username}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Timer info */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>Session active pendant {secondsLeft}s</span>
            </div>

            {/* Bot Username Editor */}
            <div className="mt-3 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-medium">Nom du Bot :</span>
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
                  title="Cliquer pour modifier le handle du bot"
                >
                  {username}
                </span>
              )}
            </div>

            {/* Copyable link fallback */}
            <div className="mt-2 w-full max-w-sm flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
              <span className="truncate font-mono text-[11px] text-sky-700 mr-2">
                {deepLinkUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 text-slate-500 hover:text-slate-800"
                title="Copier le lien direct Telegram"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Step instructions */}
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-left text-xs text-slate-600 space-y-1.5 w-full">
              <p className="font-bold text-slate-800 flex items-center">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-sky-600" />
                Instructions de connexion Telegram :
              </p>
              <p>1. Scannez ce QR code avec votre appareil photo</p>
              <p>2. L'application Telegram s'ouvre sur votre bot</p>
              <p>3. Appuyez sur <strong>Démarrer (Start)</strong> pour synchroniser</p>
            </div>

            {/* Instant Pairing Button */}
            <div className="mt-4 w-full">
              <Button
                type="button"
                disabled={pairingState !== "idle"}
                onClick={handleSimulateScan}
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-2.5 shadow-xs"
              >
                {pairingState === "idle"
                  ? "Valider la Connexion Telegram"
                  : "Connexion en cours..."}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveToken} className="mt-5 space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Identifiant du bot Telegram (@handle)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@MonBotVente_bot"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Token d'API Telegram BotFather
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800">
                Comment obtenir un token Telegram :
              </span>
              <p>1. Ouvrez Telegram et cherchez <span className="font-mono text-sky-700">@BotFather</span></p>
              <p>2. Envoyez la commande <span className="font-mono text-slate-800">/newbot</span> et suivez les instructions</p>
              <p>3. Collez la clé HTTP API délivrée ci-dessus</p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={pairingState !== "idle"}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 shadow-xs"
              >
                {pairingState === "syncing" ? "Enregistrement..." : "Enregistrer et Activer le Bot Telegram"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
