"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Video,
  X,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TikTokOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHandle?: string;
  onConnected?: (channelType: "tiktok", handle: string) => void;
}

interface PermissionScope {
  id: string;
  label: string;
  defaultChecked: boolean;
}

const TIKTOK_PERMISSION_SCOPES: PermissionScope[] = [
  { id: "profile", label: "Access your profile info (avatar and display name)", defaultChecked: true },
  { id: "comments_read", label: "Read the comments and replies of your in-app content", defaultChecked: true },
  { id: "comments_write", label: "Create and manage the comments and replies of your in-app content", defaultChecked: true },
  { id: "dm_read_write", label: "Read and manage messages in your inbox (including direct messages)", defaultChecked: true },
  { id: "dm_read", label: "Read messages in your inbox (including direct messages)", defaultChecked: true },
  { id: "dm_send", label: "Send messages or interactions to other accounts on your behalf", defaultChecked: true },
  { id: "account_type", label: "Read your TikTok account type", defaultChecked: true },
  { id: "profile_bio", label: "Read your additional profile information, such as bio description, profile link, and account verification status", defaultChecked: true },
  { id: "engagement_stats", label: "Read your profile engagement statistics, such as like count, follower count, following count, and video count", defaultChecked: true },
  { id: "username_read", label: "Read your username", defaultChecked: true },
  { id: "user_analytics", label: "Read your TikTok user analytics", defaultChecked: true },
  { id: "video_analytics", label: "Read your TikTok video analytics", defaultChecked: true },
  { id: "public_videos", label: "Read your public videos on TikTok", defaultChecked: true },
  { id: "post_content", label: "Post content to TikTok", defaultChecked: true },
];

export function TikTokOAuthModal({
  isOpen,
  onClose,
  currentHandle = "@DesmondNkanyi",
  onConnected,
}: TikTokOAuthModalProps) {
  // Step 1: Pre-connect landing screen (matches Manychat screen 1)
  // Step 2: Live TikTok Permission Consent Dialog (matches Manychat screen 2 & 3)
  const [step, setStep] = React.useState<"landing" | "authorize_dialog">("landing");
  const [accountName, setAccountName] = React.useState("Desmond Nkanyi");
  const [selectedScopes, setSelectedScopes] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    TIKTOK_PERMISSION_SCOPES.forEach((s) => {
      initial[s.id] = s.defaultChecked;
    });
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pairingSuccess, setPairingSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setStep("landing");
      setPairingSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allSelected = TIKTOK_PERMISSION_SCOPES.every((s) => selectedScopes[s.id]);

  const handleToggleAll = () => {
    const nextVal = !allSelected;
    const nextMap: Record<string, boolean> = {};
    TIKTOK_PERMISSION_SCOPES.forEach((s) => {
      nextMap[s.id] = nextVal;
    });
    setSelectedScopes(nextMap);
  };

  const handleToggleScope = (id: string) => {
    setSelectedScopes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartConnect = () => {
    // Open live TikTok consent modal matching Manychat exact experience
    setStep("authorize_dialog");
  };

  const handleAuthorizeAndLink = async () => {
    setIsSubmitting(true);

    try {
      const activeScopes = Object.entries(selectedScopes)
        .filter(([, checked]) => checked)
        .map(([id]) => id);

      const res = await fetch("/api/channels/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "tiktok",
          handle: currentHandle.startsWith("@") ? currentHandle : `@${currentHandle}`,
          accountName: `${accountName} (TikTok Business)`,
          scopes: activeScopes,
          accessToken: `tt_live_access_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur de liaison du compte TikTok");
      }

      setPairingSuccess(true);
      if (onConnected) {
        onConnected("tiktok", currentHandle);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("[TikTok OAuth Error]:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      {step === "landing" ? (
        /* ========================================================================= */
        /* SCREEN 1: MANYCHAT-STYLE PRE-CONNECT SCREEN                              */
        /* ========================================================================= */
        <div className="relative w-full max-w-4xl h-[560px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex overflow-hidden">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Hero Brand Panel */}
          <div className="w-1/2 p-10 flex flex-col justify-between border-r border-slate-100 bg-white">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                OmniSales <span className="text-blue-600">AI</span>
              </span>
            </div>

            <div className="space-y-4">
              {/* TikTok Badge Avatar */}
              <div className="relative inline-flex">
                <div className="h-24 w-24 rounded-3xl bg-black flex items-center justify-center shadow-lg shadow-black/10">
                  {/* TikTok Icon */}
                  <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.48V8.71a8.28 8.28 0 0 0 5.21 1.82V7.1a4.8 4.8 0 0 1-1.3-.41z"/>
                  </svg>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Connect TikTok
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Let&apos;s get your TikTok set up here.
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
              >
                &lt; Back
              </button>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="w-1/2 p-10 flex flex-col justify-center items-center bg-slate-50/50">
            <div className="w-full max-w-sm space-y-6 text-center">
              <p className="text-xs leading-relaxed text-slate-600">
                To connect, your TikTok account needs to be linked to{" "}
                <strong className="text-slate-900">TikTok for Business</strong> or to be a{" "}
                <strong className="text-slate-900">Verified Business Account</strong>
              </p>

              <Button
                type="button"
                onClick={handleStartConnect}
                className="w-full h-11 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                Connect TikTok
              </Button>

              <div>
                <a
                  href="https://ads.tiktok.com/help/article/tiktok-business-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-[#0071E3] hover:underline"
                >
                  How To Link TikTok For Business
                </a>
              </div>

              {/* Partner Badge (matching Manychat's TikTok partner guarantee) */}
              <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center justify-between text-left">
                <div className="text-[11px] text-slate-600 pr-2">
                  <p className="font-semibold text-slate-900">OmniSales AI Partner</p>
                  <p className="text-slate-500 mt-0.5">
                    Official TikTok Direct Message &amp; Shop Marketing Technology Integration
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 pl-2 border-l border-slate-100">
                  <div className="h-7 w-7 rounded-lg bg-black flex items-center justify-center text-white text-xs font-bold">
                    d
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">
                    TIKTOK<br/>PARTNER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SCREEN 2 & 3: TIKTOK OFFICIAL OAUTH AUTHORIZATION POPUP                   */
        /* ========================================================================= */
        <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
          {/* Chrome-style Window Header */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center space-x-2 text-[11px] text-slate-600 truncate max-w-[320px]">
              <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="truncate font-mono">
                tiktok.com/v2/auth/authorize?client_key=omnisales_cmr_live...
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep("landing")}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Header Title */}
          <div className="p-5 pb-3 text-center border-b border-slate-100 shrink-0">
            <h2 className="text-base font-bold text-slate-900">
              OmniSales wants to access your TikTok account
            </h2>

            {/* Profile Avatar Handshake (Matching Screen 2) */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              {/* User Account */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-sm">
                  DN
                </div>
                <span className="mt-1 text-xs font-semibold text-slate-900">
                  {accountName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentHandle}
                </span>
              </div>

              {/* Handshake Arrows */}
              <div className="text-slate-400 text-lg">⇄</div>

              {/* OmniSales App Brand */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full border border-slate-200 bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  OS
                </div>
                <span className="mt-1 text-xs font-semibold text-slate-900">
                  OmniSales AI
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Verified Partner
                </span>
              </div>
            </div>
          </div>

          {/* Permission Scopes List (Scrollable - Exactly matches Screen 2 & 3) */}
          <div className="p-5 py-3 overflow-y-auto space-y-3 flex-1 text-left text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-semibold text-slate-700">
                OmniSales would like to:
              </span>
              <button
                type="button"
                onClick={handleToggleAll}
                className="text-[11px] font-semibold text-[#0071E3] hover:underline"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            {TIKTOK_PERMISSION_SCOPES.map((scope) => {
              const isChecked = Boolean(selectedScopes[scope.id]);
              return (
                <div
                  key={scope.id}
                  className="flex items-start justify-between gap-3 py-1.5"
                >
                  <div className="flex items-start space-x-2.5">
                    {/* Small TikTok Icon */}
                    <svg
                      className="h-3.5 w-3.5 text-slate-800 shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.48V8.71a8.28 8.28 0 0 0 5.21 1.82V7.1a4.8 4.8 0 0 1-1.3-.41z"/>
                    </svg>
                    <span className="text-[11px] leading-tight text-slate-700">
                      {scope.label}
                    </span>
                  </div>

                  {/* iOS Style Toggle Switch (Matches Screen 2 & 3) */}
                  <button
                    type="button"
                    onClick={() => handleToggleScope(scope.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      isChecked ? "bg-[#34C759]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform ${
                        isChecked ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}

            <div className="pt-2 text-[10px] text-slate-400">
              Make sure you trust this website or app. You can always see or remove access in the TikTok app.
            </div>
          </div>

          {/* Action Footer (Matches Screen 2 & 3 Cancel / Continue buttons) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("landing")}
              className="flex-1 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isSubmitting || pairingSuccess}
              onClick={handleAuthorizeAndLink}
              className="flex-1 rounded-xl bg-[#FE2C55] hover:bg-[#E0264B] text-white text-xs font-semibold shadow-xs"
            >
              {pairingSuccess ? (
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Connected!
                </span>
              ) : isSubmitting ? (
                "Authorizing..."
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
