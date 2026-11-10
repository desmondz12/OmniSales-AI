"use client";

import * as React from "react";
import {
  Bot,
  CheckCircle2,
  Code2,
  MessageCircle,
  MessageSquare,
  Radio,
  ShieldCheck,
  Smartphone,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppQRModal } from "./whatsapp-qr-modal";
import { TelegramTokenModal } from "./telegram-token-modal";
import { WebhookTestModal } from "./webhook-test-modal";
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

interface ChannelCardData {
  id: string;
  type: ChannelType;
  title: string;
  subtitle: string;
  handle: string;
  messagesCount: number;
  automatedRate: number;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  status: "connected" | "reconnect_needed";
}

const DEFAULT_CARDS: ChannelCardData[] = [
  {
    id: "ch-wa",
    type: "whatsapp",
    title: "WhatsApp Business Cloud",
    subtitle: "Meta Cloud API v21.0 & QR Pairing",
    handle: "+237 671 23 45 67",
    messagesCount: 18,
    automatedRate: 98,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    status: "connected",
  },
  {
    id: "ch-ig",
    type: "instagram",
    title: "Instagram Direct Inbox",
    subtitle: "Meta OAuth (Seamless DM Authorization)",
    handle: "@musaretail_ng",
    messagesCount: 12,
    automatedRate: 92,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-700",
    badgeBorder: "border-pink-200",
    status: "connected",
  },
  {
    id: "ch-fb",
    type: "messenger",
    title: "Facebook Messenger",
    subtitle: "Meta Page Login (Automated Replies)",
    handle: "Musa Retail Hub Page",
    messagesCount: 8,
    automatedRate: 88,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    status: "connected",
  },
  {
    id: "ch-tt",
    type: "tiktok",
    title: "TikTok Shop & DMs",
    subtitle: "TikTok Login Kit (Buyer DMs Authorization)",
    handle: "@musastore_deals",
    messagesCount: 14,
    automatedRate: 100,
    iconBg: "bg-slate-900",
    iconColor: "text-white",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-900",
    badgeBorder: "border-slate-300",
    status: "connected",
  },
  {
    id: "ch-tg",
    type: "telegram",
    title: "Telegram Sales Bot",
    subtitle: "Telegram Bot API Gateway",
    handle: "@MusaSalesAgentBot",
    messagesCount: 6,
    automatedRate: 85,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-200",
    status: "connected",
  },
];

export function ChannelsClient({ initialChannels }: ChannelsClientProps) {
  const [globalAiEnabled, setGlobalAiEnabled] = React.useState(true);

  // Dynamic cards state reflecting live handles
  const [cards, setCards] = React.useState<ChannelCardData[]>(() => {
    return DEFAULT_CARDS.map((card) => {
      const match = initialChannels.find((c) => c.type === card.type);
      if (match) {
        return {
          ...card,
          handle: match.handle || card.handle,
          status: match.status === "connected" ? "connected" : "reconnect_needed",
        };
      }
      return card;
    });
  });

  // Modal controls
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = React.useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = React.useState(false);
  const [webhookChannelTarget, setWebhookChannelTarget] = React.useState<ChannelType>("whatsapp");

  // Meta & TikTok OAuth Linking Modals
  const [isMetaModalOpen, setIsMetaModalOpen] = React.useState(false);
  const [metaChannelTarget, setMetaChannelTarget] = React.useState<"instagram" | "messenger">("instagram");
  const [isTikTokModalOpen, setIsTikTokModalOpen] = React.useState(false);

  // Success Notification Banner
  const [successBanner, setSuccessBanner] = React.useState<string | null>(null);

  // Per-channel auto-reply map
  const [autoReplyMap, setAutoReplyMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialChannels.forEach((ch) => {
      map[ch.id] = ch.ai_auto_reply;
    });
    return map;
  });

  const [mounted, setMounted] = React.useState(false);

  // Handle URL query parameters for OAuth returns
  React.useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connectedParam = params.get("connected");
    const seamlessParam = params.get("seamless_connect");

    if (connectedParam) {
      setSuccessBanner(
        `${connectedParam.toUpperCase()} linked successfully via OAuth! Customer DM permissions are now active.`
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

  const openTestWebhook = (channelType: ChannelType) => {
    setWebhookChannelTarget(channelType);
    setIsWebhookModalOpen(true);
  };

  const handleChannelConnected = (
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
    setSuccessBanner(
      `${channelType.toUpperCase()} linked successfully (${newHandle}) with messaging permissions!`
    );
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Success Banner */}
      {successBanner && (
        <div className="flex items-center space-x-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Top Page Header — Apple Minimalist Display */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between select-none">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Passerelles Omnicanales
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#34C759] border border-emerald-200/60">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse" />
              5 sur 5 Actifs
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 tracking-tight">
            Connectez WhatsApp, Instagram, Messenger, TikTok & Telegram en 1 clic sans copier de clés d&apos;API
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openTestWebhook("whatsapp")}
            className="rounded-xl border-slate-200/80 bg-white/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs active:scale-95 transition-all"
          >
            <Code2 className="mr-1.5 h-3.5 w-3.5 text-[#0071E3]" />
            Test Webhook
          </Button>

          <button
            type="button"
            onClick={handleToggleGlobalAi}
            className={`inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-95 ${
              globalAiEnabled
                ? "bg-[#0071E3] text-white shadow-blue-500/25"
                : "bg-slate-100 text-slate-600 border border-slate-200/70"
            }`}
          >
            <Bot className="mr-1.5 h-3.5 w-3.5" />
            <span className="tracking-tight">{globalAiEnabled ? "IA Globale: Active" : "IA Globale: En pause"}</span>
          </button>
        </div>
      </div>

      {/* Gateway Health Overview Banner — Apple Glass Surface */}
      <div className="grid gap-4 sm:grid-cols-3 select-none">
        <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-5 backdrop-blur-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Disponibilité SLA Passerelle</span>
            <ShieldCheck className="h-4 w-4 text-[#34C759]" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-slate-900">99.98%</div>
          <p className="mt-1 text-[11px] font-semibold text-[#34C759]">
            0 webhook manqué cette semaine
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-5 backdrop-blur-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Messages Traités Aujourd&apos;hui</span>
            <MessageSquare className="h-4 w-4 text-[#0071E3]" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-slate-900">58 Messages</div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            52 autonomes • 6 en attente humaine
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/85 p-5 backdrop-blur-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="tracking-tight">Latence Moyenne Passerelles</span>
            <Radio className="h-4 w-4 text-[#5856D6]" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-[#5856D6]">138 ms</div>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Meta Cloud • TikTok • Telegram
          </p>
        </div>
      </div>

      {/* Channel Connection Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 select-none">
        {cards.map((ch) => {
          const isAiActive = autoReplyMap[ch.id] ?? true;

          return (
            <div
              key={ch.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/60 bg-white/85 p-6 backdrop-blur-2xl shadow-[0_2px_16px_rgba(0,0,0,0.02)] transition-all hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            >
              <div>
                {/* Card Top: Icon + Channel Status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${ch.iconBg} ${ch.iconColor}`}
                  >
                    {ch.type === "instagram" ? (
                      <InstagramIcon className="h-6 w-6" />
                    ) : ch.type === "messenger" ? (
                      <MessageCircle className="h-6 w-6" />
                    ) : ch.type === "tiktok" ? (
                      <Video className="h-6 w-6 text-rose-400" />
                    ) : (
                      <Smartphone className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{ch.subtitle}</p>

                {/* Handle & ID Badge */}
                <div className="mt-3.5 inline-flex items-center rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-xs font-mono font-semibold text-slate-800">
                  {ch.handle}
                </div>

                {/* Metrics Breakdown */}
                <div className="mt-4 rounded-2xl bg-slate-50/60 border border-slate-100 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Overnight Traffic</span>
                    <span className="font-bold text-slate-800">
                      {ch.messagesCount} inbound msgs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">AI Automation Rate</span>
                    <span className="font-bold text-emerald-700">
                      {ch.automatedRate}% autonomous
                    </span>
                  </div>
                </div>

                {/* AI Auto-Reply Toggle Switch */}
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200/70 p-3 bg-white">
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Auto-Replies</p>
                    <p className="text-[11px] text-slate-500">
                      {isAiActive ? "Responding automatically" : "Human review only"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAutoReply(ch.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAiActive ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAiActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 flex items-center space-x-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openTestWebhook(ch.type)}
                  className="flex-1 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Code2 className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                  Test Webhook
                </Button>

                {ch.type === "whatsapp" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsQrModalOpen(true)}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Link WhatsApp QR
                  </Button>
                )}

                {ch.type === "telegram" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsTelegramModalOpen(true)}
                    className="flex-1 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs"
                  >
                    Link Telegram QR
                  </Button>
                )}

                {ch.type === "instagram" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setMetaChannelTarget("instagram");
                      setIsMetaModalOpen(true);
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:opacity-95 text-white text-xs font-semibold shadow-xs"
                  >
                    Link Instagram
                  </Button>
                )}

                {ch.type === "messenger" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setMetaChannelTarget("messenger");
                      setIsMetaModalOpen(true);
                    }}
                    className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Link Page (FB)
                  </Button>
                )}

                {ch.type === "tiktok" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsTikTokModalOpen(true)}
                    className="flex-1 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs"
                  >
                    Link TikTok DMs
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals rendered safely post-hydration */}
      {mounted && (
        <div id="channels-portal-container">
          <WhatsAppQRModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            phoneNumber="+237 671 23 45 67"
            onConnected={(type, handle) => handleChannelConnected(type, handle)}
          />

          <TelegramTokenModal
            isOpen={isTelegramModalOpen}
            onClose={() => setIsTelegramModalOpen(false)}
            botUsername="@MusaSalesAgentBot"
            onConnected={(type, handle) => handleChannelConnected(type, handle)}
          />

          <WebhookTestModal
            isOpen={isWebhookModalOpen}
            onClose={() => setIsWebhookModalOpen(false)}
            defaultChannel={webhookChannelTarget}
          />

          <MetaOAuthModal
            isOpen={isMetaModalOpen}
            onClose={() => setIsMetaModalOpen(false)}
            channel={metaChannelTarget}
            onConnected={(type, handle) => handleChannelConnected(type, handle)}
          />

          <TikTokOAuthModal
            isOpen={isTikTokModalOpen}
            onClose={() => setIsTikTokModalOpen(false)}
            onConnected={(type, handle) => handleChannelConnected(type, handle)}
          />
        </div>
      )}
    </div>
  );
}
