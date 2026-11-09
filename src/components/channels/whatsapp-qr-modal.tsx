"use client";

import * as React from "react";
import {
  CheckCircle2,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string | null;
}

export function WhatsAppQRModal({
  isOpen,
  onClose,
  phoneNumber,
}: WhatsAppQRModalProps) {
  const [tab, setTab] = React.useState<"qr" | "cloud_api">("qr");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(20);

  // Cloud API inputs
  const [phoneId, setPhoneId] = React.useState("109847291039821");
  const [wabaId, setWabaId] = React.useState("871029384726190");
  const [bearerToken, setBearerToken] = React.useState(
    "EAAG...98xK1928_meta_cloud_token_prod"
  );
  const [isSaved, setIsSaved] = React.useState(false);

  // Countdown timer for QR code validity
  React.useEffect(() => {
    if (!isOpen || tab !== "qr") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 20; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSecondsLeft(20);
    }, 600);
  };

  const handleSaveCloudApi = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                WhatsApp Business Pairing
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active: {phoneNumber || "+234 812 345 6789"}
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

        {/* Tab switch */}
        <div className="mt-4 flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab("qr")}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              tab === "qr"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            QR Code Link (Web WhatsApp)
          </button>
          <button
            type="button"
            onClick={() => setTab("cloud_api")}
            className={`flex-1 rounded-lg py-1.5 transition-all ${
              tab === "cloud_api"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Meta Cloud API (v20.0)
          </button>
        </div>

        {/* Tab Content */}
        {tab === "qr" ? (
          <div className="mt-5 flex flex-col items-center text-center">
            {/* Visual Simulated QR Code */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4">
              <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-xl bg-white p-3 shadow-xs">
                {/* Simulated QR Pattern */}
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 opacity-90">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 || i % 5 === 0) && i !== 14
                          ? "bg-slate-900"
                          : "bg-emerald-600/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Center WhatsApp icon badge */}
                <div className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md ring-4 ring-white">
                  <Smartphone className="h-5 w-5" />
                </div>
              </div>

              {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/90 backdrop-blur-xs">
                  <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>QR code refreshes in {secondsLeft}s</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-blue-600 hover:underline font-medium"
              >
                Refresh now
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">
                How to link your WhatsApp:
              </p>
              <p>1. Open WhatsApp on your business phone</p>
              <p>2. Tap <strong>Settings &gt; Linked Devices &gt; Link a Device</strong></p>
              <p>3. Point your camera at this QR screen to sync OmniSales AI</p>
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
