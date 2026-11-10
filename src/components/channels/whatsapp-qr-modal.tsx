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
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [secondsLeft, setSecondsLeft] = React.useState(25);
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

  // Countdown timer for QR code validity
  React.useEffect(() => {
    if (!isOpen || tab !== "qr" || pairingState !== "idle") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 25; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, tab, pairingState]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPairingState("idle");
    setTimeout(() => {
      setIsRefreshing(false);
      setSecondsLeft(25);
    }, 500);
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
            channel: "whatsapp",
            handle: phoneInput,
            accountName: "WhatsApp Business Cloud",
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
          }, 1500);
        } else {
          setPairingState("idle");
        }
      } catch {
        setPairingState("idle");
      }
    }, 2200);
  };

  const handleSaveCloudApi = async () => {
    setIsSaved(true);
    try {
      await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "whatsapp",
          handle: phoneInput,
          accessToken: bearerToken,
          accountName: "WhatsApp Business Cloud",
        }),
      });
      if (onConnected) {
        onConnected("whatsapp", phoneInput);
      }
    } catch {
      // Non-fatal
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  WhatsApp Business Pairing
                </h3>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  QR Link
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan QR code with your phone to link your WhatsApp Business device
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
              <QrCode className="h-3.5 w-3.5 text-emerald-600" />
              <span>QR Code Link (Instant)</span>
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
            {/* Visual High-Resolution QR Code */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4">
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
                  <rect x="38" y="8" width="5" height="5" />
                  <rect x="48" y="12" width="6" height="6" />
                  <rect x="58" y="6" width="5" height="5" />
                  <rect x="38" y="22" width="6" height="5" />
                  <rect x="50" y="26" width="5" height="6" />

                  <rect x="8" y="38" width="6" height="5" />
                  <rect x="18" y="48" width="5" height="6" />
                  <rect x="28" y="38" width="6" height="6" />
                  <rect x="8" y="52" width="5" height="5" />

                  <rect x="68" y="38" width="6" height="6" />
                  <rect x="80" y="45" width="5" height="5" />
                  <rect x="72" y="54" width="7" height="5" />
                  <rect x="86" y="52" width="6" height="6" />

                  <rect x="38" y="68" width="6" height="6" />
                  <rect x="48" y="78" width="6" height="5" />
                  <rect x="60" y="72" width="5" height="5" />
                  <rect x="54" y="85" width="6" height="6" />
                  <rect x="40" y="88" width="5" height="5" />

                  <rect x="68" y="68" width="6" height="6" />
                  <rect x="78" y="75" width="6" height="5" />
                  <rect x="88" y="68" width="5" height="5" />
                  <rect x="72" y="85" width="6" height="6" />
                  <rect x="85" y="82" width="6" height="6" />
                </svg>

                {/* Center WhatsApp icon badge */}
                <div className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md ring-4 ring-white">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>

              {/* Refreshing Overlay */}
              {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-xs">
                  <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              )}

              {/* Pairing In-Progress Overlay */}
              {pairingState !== "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-xs p-4 text-center">
                  {pairingState === "scanning" && (
                    <>
                      <Smartphone className="h-8 w-8 text-emerald-600 animate-bounce" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Camera Scan Detected
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Handshaking with WhatsApp...
                      </p>
                    </>
                  )}
                  {pairingState === "syncing" && (
                    <>
                      <Laptop className="h-8 w-8 text-blue-600 animate-pulse" />
                      <p className="mt-2 text-xs font-bold text-slate-900">
                        Pairing Web Client
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Linking {phoneInput}...
                      </p>
                    </>
                  )}
                  {pairingState === "success" && (
                    <>
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      <p className="mt-2 text-xs font-bold text-emerald-800">
                        Paired Successfully!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Device active on OmniSales AI
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Timer and Refresh */}
            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>QR code valid for {secondsLeft}s</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Refresh
              </button>
            </div>

            {/* Target Phone display / editor */}
            <div className="mt-3 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-slate-500 font-medium">Linking Phone:</span>
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
                  title="Click to edit phone number"
                >
                  {phoneInput}
                </span>
              )}
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-left text-xs text-slate-600 space-y-1.5 w-full">
              <p className="font-bold text-slate-800 flex items-center">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                How to link WhatsApp seamlessly:
              </p>
              <p>1. Open WhatsApp on your phone</p>
              <p>2. Tap <strong>Settings &gt; Linked Devices &gt; Link a Device</strong></p>
              <p>3. Point your camera at this QR screen to sync OmniSales AI</p>
            </div>

            {/* Instant Pairing Button */}
            <div className="mt-4 w-full">
              <Button
                type="button"
                disabled={pairingState !== "idle"}
                onClick={handleSimulateScan}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 shadow-sm"
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                {pairingState === "idle"
                  ? "Instant QR Scan & Pair Device"
                  : "Pairing in progress..."}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Phone Number ID
              </label>
              <input
                type="text"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                WhatsApp Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Meta System User Permanent Token
              </label>
              <input
                type="password"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-xs text-emerald-900">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Meta Webhook Target</span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-emerald-800 break-all">
                https://omnisales.ai/api/webhooks/meta
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

          {tab === "cloud_api" && (
            <Button
              type="button"
              size="sm"
              onClick={handleSaveCloudApi}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
            >
              {isSaved ? "Saved Successfully!" : "Save Meta Cloud Config"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
