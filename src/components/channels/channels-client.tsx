"use client";

import * as React from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  MessageCircle,
  Smartphone,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppQRModal } from "./whatsapp-qr-modal";
import { TelegramTokenModal } from "./telegram-token-modal";
import { MetaOAuthModal } from "./meta-oauth-modal";
import { TikTokOAuthModal } from "./tiktok-oauth-modal";
import type { Channel, ChannelType } from "@/types/database";

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

interface ChannelsClientProps {
  initialChannels: Channel[];
}

interface AccountCardData {
  id: string;
  type: ChannelType;
  title: string;
  description: string;
  defaultHandle: string;
  handle: string;
  iconBg: string;
  iconColor: string;
  buttonClass: string;
  status: "connected" | "not_connected";
}

const ACCOUNT_CARDS: AccountCardData[] = [
  {
    id: "ch-wa",
    type: "whatsapp",
    title: "WhatsApp",
    description: "Reply to customer WhatsApp messages automatically.",
    defaultHandle: "+237 671 23 45 67",
    handle: "+237 671 23 45 67",
    iconBg: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    status: "not_connected",
  },
  {
    id: "ch-ig",
    type: "instagram",
    title: "Instagram",
    description: "Auto-reply to Instagram DMs and post comments.",
    defaultHandle: "@nissiexploits",
    handle: "@nissiexploits",
    iconBg: "bg-pink-50 border-pink-100",
    iconColor: "text-pink-600",
    buttonClass:
      "bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-95 text-white",
    status: "not_connected",
  },
  {
    id: "ch-fb",
    type: "messenger",
    title: "Facebook Messenger",
    description: "Connect your Facebook Page to reply in Messenger.",
    defaultHandle: "Nissi Exploits",
    handle: "Nissi Exploits",
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    buttonClass: "bg-[#1877F2] hover:bg-[#166FE5] text-white",
    status: "not_connected",
  },
  {
    id: "ch-tt",
    type: "tiktok",
    title: "TikTok",
    description: "Reply to TikTok DMs and shop inquiries automatically.",
    defaultHandle: "@nissiexploits",
    handle: "@nissiexploits",
    iconBg: "bg-slate-900 border-slate-800",
    iconColor: "text-white",
    buttonClass: "bg-slate-900 hover:bg-black text-white",
    status: "not_connected",
  },
  {
    id: "ch-tg",
    type: "telegram",
    title: "Telegram",
    description: "Connect your Telegram bot for instant customer chat.",
    defaultHandle: "@NissiExploits_bot",
    handle: "@NissiExploits_bot",
    iconBg: "bg-sky-50 border-sky-100",
    iconColor: "text-sky-600",
    buttonClass: "bg-sky-500 hover:bg-sky-600 text-white",
    status: "connected",
  },
];

export function ChannelsClient({ initialChannels }: ChannelsClientProps) {
  const [globalAiEnabled, setGlobalAiEnabled] = React.useState(true);

  const [cards, setCards] = React.useState<AccountCardData[]>(() => {
    return ACCOUNT_CARDS.map((card) => {
      const match = initialChannels.find((c) => c.type === card.type);
      if (match) {
        return {
          ...card,
          handle: match.handle || card.defaultHandle,
          status: match.status === "connected" ? "connected" : "not_connected",
        };
      }
      return card;
    });
  });

  // Modal controls
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = React.useState(false);
  const [isMetaModalOpen, setIsMetaModalOpen] = React.useState(false);
  const [metaChannelTarget, setMetaChannelTarget] = React.useState<
    "instagram" | "messenger"
  >("messenger");
  const [isTikTokModalOpen, setIsTikTokModalOpen] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);
  const [errorBanner, setErrorBanner] = React.useState<string | null>(null);

  const [autoReplyMap, setAutoReplyMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    ACCOUNT_CARDS.forEach((card) => {
      const match = initialChannels.find((c) => c.type === card.type);
      map[card.id] = match ? match.ai_auto_reply : true;
    });
    return map;
  });

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connectedParam = params.get("connected");
    const handleParam = params.get("handle");
    const errorParam = params.get("error");
    const errorDescParam = params.get("error_description");
    const seamlessParam = params.get("seamless_connect");

    if (errorParam) {
      setErrorBanner(
        errorDescParam || `Connection failed (${errorParam}). Please try again.`
      );
    }

    if (connectedParam) {
      setSuccessBanner(
        `${connectedParam.toUpperCase()} account connected${handleParam ? ` (${handleParam})` : ""}!`
      );
      setTimeout(() => setSuccessBanner(null), 5000);
    }

    if (seamlessParam === "instagram" || seamlessParam === "messenger") {
      setMetaChannelTarget(seamlessParam);
      const timer = setTimeout(() => setIsMetaModalOpen(true), 50);
      return () => clearTimeout(timer);
    } else if (seamlessParam === "tiktok") {
      const timer = setTimeout(() => setIsTikTokModalOpen(true), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleToggleAutoReply = (channelId: string) => {
    setAutoReplyMap((prev) => ({
      ...prev,
      [channelId]: !prev[channelId],
    }));
  };

  const handleToggleGlobalAi = () => {
    const nextState = !globalAiEnabled;
    setGlobalAiEnabled(nextState);
    setAutoReplyMap((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        updated[k] = nextState;
      });
      return updated;
    });
  };

  const handleAccountConnected = (
    channelType: ChannelType,
    newHandle: string
  ) => {
    setCards((prev) =>
      prev.map((c) =>
        c.type === channelType
          ? { ...c, handle: newHandle, status: "connected" }
          : c
      )
    );
    setSuccessBanner(`${channelType.toUpperCase()} connected (${newHandle})!`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleConnectClick = (type: ChannelType) => {
    if (type === "whatsapp") {
      setIsQrModalOpen(true);
    } else if (type === "telegram") {
      setIsTelegramModalOpen(true);
    } else if (type === "instagram") {
      setMetaChannelTarget("instagram");
      setIsMetaModalOpen(true);
    } else if (type === "messenger") {
      setMetaChannelTarget("messenger");
      setIsMetaModalOpen(true);
    } else if (type === "tiktok") {
      setIsTikTokModalOpen(true);
    }
  };

  const connectedCount = cards.filter((c) => c.status === "connected").length;

  return (
    <div className="space-y-6 pb-16">
      {errorBanner && (
        <div className="flex items-center space-x-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800 shadow-xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {successBanner && (
        <div className="flex items-center space-x-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Simple Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Connect Accounts
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
              {connectedCount} of {cards.length} connected
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Click Connect on any platform to link your account in one step.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleGlobalAi}
          className={`inline-flex items-center rounded-xl px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
            globalAiEnabled
              ? "bg-[#0071E3] text-white"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          <Bot className="mr-1.5 h-3.5 w-3.5" />
          <span>{globalAiEnabled ? "AI Auto-Reply: On" : "AI Auto-Reply: Paused"}</span>
        </button>
      </div>

      {/* Simple Account Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((ch) => {
          const isAiActive = autoReplyMap[ch.id] ?? true;
          const isConnected = ch.status === "connected";

          return (
            <div
              key={ch.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/70 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${ch.iconBg} ${ch.iconColor}`}
                  >
                    {ch.type === "instagram" ? (
                      <InstagramIcon className="h-5 w-5" />
                    ) : ch.type === "messenger" ? (
                      <MessageCircle className="h-5 w-5" />
                    ) : ch.type === "tiktok" ? (
                      <Video className="h-5 w-5 text-rose-400" />
                    ) : (
                      <Smartphone className="h-5 w-5" />
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        isConnected ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {isConnected ? "Connected" : "Not connected"}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {ch.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {ch.description}
                </p>

                {isConnected && (
                  <div className="mt-3 inline-flex items-center rounded-xl bg-slate-50 border border-slate-200/70 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {ch.handle}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">
                    AI Auto-Reply
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleAutoReply(ch.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      isAiActive ? "bg-[#0071E3]" : "bg-slate-300"
                    }`}
                    aria-label={`Toggle AI auto-reply for ${ch.title}`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isAiActive ? "translate-x-4.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleConnectClick(ch.type)}
                  className={`w-full h-9 rounded-xl text-xs font-semibold shadow-2xs cursor-pointer ${ch.buttonClass}`}
                >
                  {isConnected ? `Manage ${ch.title}` : `Connect ${ch.title}`}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals rendered post-hydration */}
      {mounted && (
        <div id="channels-portal-container">
          <WhatsAppQRModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            phoneNumber="+237 671 23 45 67"
            onConnected={(type, handle) => handleAccountConnected(type, handle)}
          />

          <TelegramTokenModal
            isOpen={isTelegramModalOpen}
            onClose={() => setIsTelegramModalOpen(false)}
            botUsername="@NissiExploits_bot"
            onConnected={(type, handle) => handleAccountConnected(type, handle)}
          />

          <MetaOAuthModal
            isOpen={isMetaModalOpen}
            onClose={() => setIsMetaModalOpen(false)}
            channel={metaChannelTarget}
            onConnected={(type, handle) => handleAccountConnected(type, handle)}
          />

          <TikTokOAuthModal
            isOpen={isTikTokModalOpen}
            onClose={() => setIsTikTokModalOpen(false)}
            onConnected={(type, handle) => handleAccountConnected(type, handle)}
          />
        </div>
      )}
    </div>
  );
}
