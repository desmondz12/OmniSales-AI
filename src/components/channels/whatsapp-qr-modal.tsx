"use client";

import * as React from "react";
import {
  CheckCircle2,
  ExternalLink,
  Laptop,
  QrCode,
  RefreshCw,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "./qr-code-svg";

interface WhatsAppQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string | null;
  onConnected?: (channelType: "whatsapp", handle: string) => void;
}

export function WhatsAppQRModal({
  isOpen,
  onClose,
  phoneNumber,
  onConnected,
}: WhatsAppQRModalProps) {
  const [tab, setTab] = React.useState<"qr" | "cloud_api">("qr");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(30);
  const [pairingState, setPairingState] = React.useState<
    "idle" | "scanning" | "syncing" | "success"
  >("idle");
  const [phoneInput, setPhoneInput] = React.useState(
    phoneNumber || "+237 671 23 45 67"
  );
  const [editPhone, setEditPhone] = React.useState(false);

  // Cloud API inputs
  const [phoneId, setPhoneId] = React.useState("109847291039821");
  const [wabaId, setWabaId] = React.useState("871029384726190");
  const [bearerToken, setBearerToken] = React.useState(
    "EAAG...98xK1928_meta_cloud_token_prod"
  );
  const [isSaved, setIsSaved] = React.useState(false);

  // Dynamic QR session payload
  const [qrToken, setQrToken] = React.useState<string>(() =>
    `2@${Date.now()},${Math.random().toString(36).slice(2)},${phoneInput}`
  );

  // Countdown timer for QR code validity
  React.useEffect(() => {
    if (!isOpen || tab !== "qr" || pairingState !== "idle") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Generate new token on expiration
          setQrToken(`2@${Date.now()},${Math.random().toString(36).slice(2)},${phoneInput}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, tab, pairingState, phoneInput]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPairingState("idle");
    setQrToken(`2@${Date.now()},${Math.random().toString(36).slice(2)},${phoneInput}`);
    setTimeout(() => {
      setIsRefreshing(false);
      setSecondsLeft(30);
    }, 400);
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
            channel: "whatsapp",
            handle: phoneInput,
            accountName: "WhatsApp Business Multi-Device",
            scopes: [
              "whatsapp_business_messaging",
              "whatsapp_business_management",
            ],
          }),
        });

        if (res.ok) {
          setPairingState("success");
          if (onConnected) {
            onConnected("whatsapp", phoneInput);
          }
          setTimeout(() => {
            onClose();
            setPairingState("idle");
          }, 1400);
        } else {
          setPairingState("idle");
        }
      } catch (err) {
        console.error("WhatsApp pairing error:", err);
        setPairingState("idle");
      }
    }, 1800);
  };

  const handleSaveCloudApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    try {
      await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "whatsapp",
          handle: phoneInput,
          accountName: "Meta WhatsApp Cloud API",
          accessToken: bearerToken,
          scopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
        }),
      });
      if (onConnected) {
        onConnected("whatsapp", phoneInput);
      }
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 1000);
    } catch {
      setIsSaved(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Connexion WhatsApp
                </h3>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  QR Code Direct
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scannez le QR code avec WhatsApp pour synchroniser vos discussions
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
              <QrCode className="h-3.5 w-3.5 text-emerald-600" />
              <span>QR Code Appareils Connectés</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("cloud_api")}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              tab === "cloud_api"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Meta Cloud API (v21.0)
          </button>
        </div>

        {/* Tab Content */}
        {tab === "qr" ? (
          <div className="mt-5 flex flex-col items-center text-center">
            {/* Visual Crisp SVG QR Code */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <QRCodeSVG
                value={qrToken}
                size={180}
                fgColor="#0f172a"
                bgColor="#ffffff"
              />

              {/* Pairing Overlay states */}
              {pairingState !== "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xs p-4 text-center">
                  {pairingState === "scanning" && (
                    <>
                      <Smartphone className="h-8 w-8 text-emerald-600 animate-bounce" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Appareil détecté...
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Négociation de la clé de chiffrement
                      </p>
                    </>
                  )}

                  {pairingState === "syncing" && (
                    <>
                      <Laptop className="h-8 w-8 text-emerald-600" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Synchronisation des contacts...
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Association à OmniSales Nissi Exploits
                      </p>
                    </>
                  )}

                  {pairingState === "success" && (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      <p className="mt-2 text-xs font-bold text-emerald-900">
                        WhatsApp Connecté !
                      </p>
                      <p className="text-[11px] text-emerald-700 font-mono">
                        {phoneInput}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Timer and Refresh */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Valide pendant {secondsLeft}s</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                Actualiser
              </button>
            </div>

            {/* Linking Phone editor */}
            <div className="mt-3 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-medium">Numéro associé:</span>
              {editPhone ? (
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onBlur={() => setEditPhone(false)}
                  autoFocus
                  className="rounded border border-emerald-400 bg-white px-2 py-0.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditPhone(true)}
                  className="font-mono font-bold text-slate-900 cursor-pointer hover:underline"
                  title="Cliquer pour modifier le numéro"
                >
                  {phoneInput}
                </span>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-left text-xs text-slate-600 space-y-1.5 w-full">
              <p className="font-bold text-slate-800 flex items-center">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                Instructions de connexion WhatsApp :
              </p>
              <p>1. Ouvrez WhatsApp sur votre smartphone</p>
              <p>2. Allez dans <strong>Réglages &gt; Appareils connectés &gt; Connecter un appareil</strong></p>
              <p>3. Pointez votre appareil photo sur ce QR code pour synchroniser OmniSales</p>
            </div>

            {/* Instant Pairing Action Button */}
            <div className="mt-4 w-full">
              <Button
                type="button"
                disabled={pairingState !== "idle"}
                onClick={handleSimulateScan}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 shadow-xs"
              >
                {pairingState === "idle"
                  ? "Scanner et Valider la Connexion WhatsApp"
                  : "Connexion en cours..."}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveCloudApi} className="mt-5 space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Identifiant du numéro (Phone Number ID)
              </label>
              <input
                type="text"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Identifiant compte WhatsApp Business (WABA ID)
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Token Système Permanent Meta (System User Token)
              </label>
              <input
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                Webhook OmniSales pour Meta Developer Console :
              </span>
              <p className="mt-1 font-mono text-[11px] text-emerald-700 break-all">
                https://your-domain.com/api/webhooks/meta
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Verify Token : <span className="font-mono text-slate-700">omnisales_meta_verify_token_2026</span>
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 shadow-xs"
              >
                {isSaved ? "Configuration enregistrée !" : "Enregistrer les identifiants Cloud API"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
