"use client";

import * as React from "react";
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Shield,
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
}: MetaOAuthModalProps) {
  const isInstagram = channel === "instagram";
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  if (!isOpen) return null;

  const handleSignInWithFacebook = () => {
    setIsRedirecting(true);
    window.location.href = `/api/auth/meta/authorize?channel=${channel}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Manychat-style clean centered onboarding */}
        <div className="flex flex-col items-center text-center pt-2">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs ${
              isInstagram
                ? "bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white"
                : "bg-[#0084FF] text-white"
            }`}
          >
            {isInstagram ? (
              <InstagramIcon className="h-7 w-7" />
            ) : (
              <MessageCircle className="h-7 w-7" />
            )}
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            {isInstagram ? "Connect Instagram" : "Connect Facebook Page"}
          </h2>

          <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
            {isInstagram
              ? "Sign in with Facebook to choose the Instagram Business account you want OmniSales AI to manage."
              : "Sign in with your Facebook account to choose the Page you want to connect."}
          </p>

          <div className="mt-5 w-full rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-left space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Automatic message sync &amp; AI replies</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Select your Pages in one click</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Shield className="h-4 w-4 text-[#0071E3] shrink-0" />
              <span>Official Meta Login — revoke access anytime</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSignInWithFacebook}
            isLoading={isRedirecting}
            className="mt-6 w-full h-11 rounded-2xl bg-[#1877F2] hover:bg-[#166FE5] text-white text-sm font-semibold shadow-sm cursor-pointer"
          >
            <span>Sign in with Facebook</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
