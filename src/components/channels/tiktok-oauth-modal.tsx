"use client";

import * as React from "react";
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  RefreshCw,
  Shield,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TikTokOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHandle?: string;
  onConnected?: (channelType: "tiktok", handle: string) => void;
}

export function TikTokOAuthModal({
  isOpen,
  onClose,
  currentHandle,
  onConnected,
}: TikTokOAuthModalProps) {
  const [selectedAccount, setSelectedAccount] = React.useState(
    currentHandle || "@musastore_deals"
  );
  const [customHandle, setCustomHandle] = React.useState("");
  const [useCustom, setUseCustom] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  if (!isOpen) return null;

  const handleSeamlessConnect = async () => {
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    const targetHandle = useCustom
      ? customHandle.trim() || selectedAccount
      : selectedAccount;

    try {
      const res = await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "tiktok",
          handle: targetHandle,
          accountName: "TikTok Shop & DMs",
          scopes: [
            "user.info.basic",
            "direct_message.action",
            "direct_message.read",
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to link TikTok account");
      }

      setStatus("success");
      if (onConnected) {
        onConnected("tiktok", targetHandle);
      }
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 1500);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthRedirect = () => {
    window.location.href = "/api/auth/tiktok/authorize";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-slate-900/20 shadow-md">
              <Video className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  Link TikTok Direct Messages
                </h3>
                <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                  TikTok Login Kit
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your TikTok Shop or Creator account with 1-click authorization
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

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Permissions Overview Banner */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
              <span className="flex items-center">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-rose-600" />
                Permissions to Authorize
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Auto-Managed
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>direct_message.action:</strong> Send automated AI and
                  human agent responses to buyer inquiries.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>direct_message.read:</strong> Ingest incoming TikTok
                  messages directly into your Unified Inbox.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>user.info.basic:</strong> Securely link your TikTok handle
                  and avatar with zero API key entry.
                </span>
              </li>
            </ul>
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Select TikTok Account
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setSelectedAccount("@musastore_deals");
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  !useCustom && selectedAccount === "@musastore_deals"
                    ? "border-slate-900 bg-slate-50/70 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="font-semibold text-slate-900">
                  @musastore_deals
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  TikTok Shop Verified
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setSelectedAccount("@douala_fashion_hub");
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  !useCustom && selectedAccount === "@douala_fashion_hub"
                    ? "border-slate-900 bg-slate-50/70 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="font-semibold text-slate-900">
                  @douala_fashion_hub
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Creator Storefront
                </div>
              </button>
            </div>

            {/* Custom Handle Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="text-[11px] font-medium text-rose-600 hover:text-rose-700 underline"
              >
                {useCustom
                  ? "← Pick from detected accounts"
                  : "+ Use another TikTok username"}
              </button>

              {useCustom && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder="e.g. @your_tiktok_shop"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Feedback Status */}
          {status === "success" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                TikTok account linked successfully! DM permissions are active.
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              {errorMessage || "Failed to link account. Please try again."}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
          <Button
            type="button"
            disabled={isSubmitting || status === "success"}
            onClick={handleSeamlessConnect}
            className="w-full rounded-xl bg-slate-900 hover:bg-black text-white py-2.5 text-xs font-semibold shadow-sm transition-all"
          >
            {isSubmitting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-rose-400" />
            )}
            {isSubmitting
              ? "Authorizing TikTok Permissions..."
              : "Authorize & Link TikTok Account"}
          </Button>

          <button
            type="button"
            onClick={handleOAuthRedirect}
            className="inline-flex items-center justify-center text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Lock className="mr-1 h-3 w-3 text-slate-400" />
            <span>Open Official TikTok Login Dialog</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
