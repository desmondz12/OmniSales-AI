"use client";

import * as React from "react";
import { CheckCircle2, ExternalLink, Shield, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TikTokOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHandle?: string;
  onConnected?: (channelType: "tiktok", handle: string) => void;
}

export function TikTokOAuthModal({ isOpen, onClose }: TikTokOAuthModalProps) {
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  if (!isOpen) return null;

  const handleConnectTikTok = () => {
    setIsRedirecting(true);
    window.location.href = "/api/auth/tiktok/authorize";
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

        <div className="flex flex-col items-center text-center pt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xs">
            <Video className="h-7 w-7 text-rose-400" />
          </div>

          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            Connect TikTok
          </h2>

          <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
            Sign in with your TikTok Business account to receive and reply to
            TikTok DMs automatically.
          </p>

          <div className="mt-5 w-full rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-left space-y-2">
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Automatic TikTok DM &amp; comment sync</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-700">
              <Shield className="h-4 w-4 text-[#0071E3] shrink-0" />
              <span>Official TikTok Login — revoke access anytime</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleConnectTikTok}
            isLoading={isRedirecting}
            className="mt-6 w-full h-11 rounded-2xl bg-slate-900 hover:bg-black text-white text-sm font-semibold shadow-sm cursor-pointer"
          >
            <span>Connect TikTok</span>
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
