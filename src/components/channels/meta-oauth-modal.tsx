"use client";

import * as React from "react";
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  MessageCircle,
  RefreshCw,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function InstagramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface MetaOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: "instagram" | "messenger";
  currentHandle?: string;
  onConnected?: (channelType: "instagram" | "messenger", handle: string) => void;
}

export function MetaOAuthModal({
  isOpen,
  onClose,
  channel,
  currentHandle,
  onConnected,
}: MetaOAuthModalProps) {
  const isInstagram = channel === "instagram";
  const [selectedAccount, setSelectedAccount] = React.useState(
    currentHandle || (isInstagram ? "@musaretail_ng" : "Musa Retail Hub")
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
          channel,
          handle: targetHandle,
          accountName: isInstagram ? "Instagram Direct Inbox" : "Facebook Messenger",
          scopes: isInstagram
            ? [
                "instagram_basic",
                "instagram_manage_messages",
                "pages_show_list",
                "pages_manage_metadata",
              ]
            : [
                "pages_show_list",
                "pages_read_engagement",
                "pages_messaging",
                "pages_manage_metadata",
              ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to link account");
      }

      setStatus("success");
      if (onConnected) {
        onConnected(channel, targetHandle);
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
    window.location.href = `/api/auth/meta/authorize?channel=${channel}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isInstagram
                  ? "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-rose-500/20 shadow-md"
                  : "bg-blue-600 text-white shadow-blue-500/20 shadow-md"
              }`}
            >
              {isInstagram ? (
                <InstagramIcon className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">
                  {isInstagram
                    ? "Link Instagram Direct via Meta"
                    : "Link Facebook Messenger via Meta"}
                </h3>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  Meta Login
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorize OmniSales AI to send & receive customer direct messages
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
                <Shield className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
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
                  <strong>Read & Send Direct Messages:</strong> Enables instant AI
                  and agent responses to customer inquiries.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Identify Business Handle & Avatar:</strong> Syncs your
                  verified business identity automatically.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Realtime Webhooks:</strong> Immediate delivery when a
                  customer sends a new DM.
                </span>
              </li>
            </ul>
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              {isInstagram
                ? "Select Instagram Professional Account"
                : "Select Facebook Business Page"}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setSelectedAccount(
                    isInstagram ? "@musaretail_ng" : "Musa Retail Hub"
                  );
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  !useCustom &&
                  (selectedAccount === "@musaretail_ng" ||
                    selectedAccount === "Musa Retail Hub")
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="font-semibold text-slate-900">
                  {isInstagram ? "@musaretail_ng" : "Musa Retail Hub"}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Verified Business
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setSelectedAccount(
                    isInstagram ? "@fotso_deals_cmr" : "Fotso Electronics CMR"
                  );
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  !useCustom &&
                  (selectedAccount === "@fotso_deals_cmr" ||
                    selectedAccount === "Fotso Electronics CMR")
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="font-semibold text-slate-900">
                  {isInstagram ? "@fotso_deals_cmr" : "Fotso Electronics CMR"}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Douala Storefront
                </div>
              </button>
            </div>

            {/* Custom Handle Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 underline"
              >
                {useCustom
                  ? "← Pick from detected accounts"
                  : "+ Use another handle/page name"}
              </button>

              {useCustom && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder={
                      isInstagram
                        ? "e.g. @your_store_handle"
                        : "e.g. Your Store Page Name"
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                Account linked successfully! DM messaging permissions are now active.
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
            className={`w-full rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-all ${
              isInstagram
                ? "bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isSubmitting
              ? "Authorizing Permissions..."
              : `Authorize & Link ${
                  isInstagram ? "Instagram Account" : "Facebook Page"
                }`}
          </Button>

          <button
            type="button"
            onClick={handleOAuthRedirect}
            className="inline-flex items-center justify-center text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Lock className="mr-1 h-3 w-3 text-slate-400" />
            <span>Open Official Meta Login Window</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
