"use client";

import * as React from "react";
import {
  Bot,
  Code2,
  MessageSquare,
  Radio,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppQRModal } from "./whatsapp-qr-modal";
import { TelegramTokenModal } from "./telegram-token-modal";
import { WebhookTestModal } from "./webhook-test-modal";
import type { Channel, ChannelType } from "@/types/database";

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

export function ChannelsClient({ initialChannels }: ChannelsClientProps) {
  const [globalAiEnabled, setGlobalAiEnabled] = React.useState(true);

  // Modal controls
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = React.useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = React.useState(false);
  const [webhookChannelTarget, setWebhookChannelTarget] = React.useState<ChannelType>("whatsapp");

  // Per-channel auto-reply map
  const [autoReplyMap, setAutoReplyMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialChannels.forEach((ch) => {
      map[ch.id] = ch.ai_auto_reply;
    });
    return map;
  });

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

  const channelCards: ChannelCardData[] = [
    {
      id: "ch-wa",
      type: "whatsapp",
      title: "WhatsApp Business Cloud",
      subtitle: "Meta Cloud API v20.0 & QR Pairing",
      handle: "+234 812 345 6789",
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
      subtitle: "Meta Graph API (IG DM Automation)",
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
      subtitle: "Musa Retail Hub Page (ID: 871263541)",
      handle: "Musa Retail Hub",
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
      subtitle: "TikTok Business Messaging API",
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

  const openTestWebhook = (channelType: ChannelType) => {
    setWebhookChannelTarget(channelType);
    setIsWebhookModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Connected Channels
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              5 of 5 Active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Manage your live messaging gateways, AI auto-reply toggles, and test incoming webhook listeners
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openTestWebhook("whatsapp")}
            className="rounded-full border-border-button-default bg-background-primary-default text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary-default shadow-2xs"
          >
            <Code2 className="mr-1.5 h-3.5 w-3.5 text-accent-600" />
            Send Test Webhook
          </Button>

          <button
            type="button"
            onClick={handleToggleGlobalAi}
            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-medium shadow-2xs transition-colors ${
              globalAiEnabled
                ? "bg-accent-600 text-white shadow-accent-600/20"
                : "bg-background-secondary-default text-text-secondary border border-border-button-default"
            }`}
          >
            <Bot className="mr-1.5 h-3.5 w-3.5" />
            <span>{globalAiEnabled ? "Global AI: Active" : "Global AI: Paused"}</span>
          </button>
        </div>
      </div>

      {/* Gateway Health Overview Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Gateway Uptime SLA</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-semibold text-text-primary">99.98%</div>
          <p className="mt-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            0 dropped webhook events this week
          </p>
        </div>

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Messages Processed Today</span>
            <MessageSquare className="h-4 w-4 text-accent-600" />
          </div>
          <div className="mt-2 text-xl font-semibold text-text-primary">58 Messages</div>
          <p className="mt-1 text-[11px] font-medium text-text-tertiary">
            52 handled autonomously • 6 escalated
          </p>
        </div>

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Average API Latency</span>
            <Radio className="h-4 w-4 text-accent-600" />
          </div>
          <div className="mt-2 text-xl font-semibold text-accent-700 dark:text-accent-400">138 ms</div>
          <p className="mt-1 text-[11px] font-medium text-text-tertiary">
            Meta Cloud • TikTok • Telegram Gateways
          </p>
        </div>
      </div>

      {/* Channel Connection Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {channelCards.map((ch) => {
          const isAiActive = autoReplyMap[ch.id] ?? true;

          return (
            <div
              key={ch.id}
              className="flex flex-col justify-between rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card transition-all hover:border-accent-500 hover:shadow-modal"
            >
              <div>
                {/* Card Top: Icon + Channel Status */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${ch.iconBg} ${ch.iconColor}`}
                  >
                    <Smartphone className="h-6 w-6" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-4 text-base font-semibold text-text-primary">
                  {ch.title}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">{ch.subtitle}</p>

                {/* Handle & ID Badge */}
                <div className="mt-3.5 inline-flex items-center rounded-xl bg-background-secondary-default border border-border-button-default px-3 py-1.5 text-xs font-mono font-semibold text-text-primary">
                  {ch.handle}
                </div>

                {/* Metrics Breakdown */}
                <div className="mt-4 rounded-2xl bg-background-secondary-default border border-border-button-default p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Overnight Traffic</span>
                    <span className="font-semibold text-text-primary">
                      {ch.messagesCount} inbound msgs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">AI Automation Rate</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {ch.automatedRate}% autonomous
                    </span>
                  </div>
                </div>

                {/* AI Auto-Reply Toggle Switch */}
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-border-button-default p-3 bg-background-primary-default">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">AI Auto-Replies</p>
                    <p className="text-[11px] text-text-secondary">
                      {isAiActive ? "Responding automatically" : "Human review only"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAutoReply(ch.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAiActive ? "bg-accent-600" : "bg-neutral-300 dark:bg-neutral-700"
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
              <div className="mt-5 flex items-center space-x-2 pt-4 border-t border-border-secondary">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openTestWebhook(ch.type)}
                  className="flex-1 rounded-full text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-background-secondary-default border-border-button-default"
                >
                  <Code2 className="mr-1.5 h-3.5 w-3.5 text-accent-600" />
                  Test Webhook
                </Button>

                {ch.type === "whatsapp" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsQrModalOpen(true)}
                    className="flex-1 rounded-full bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium shadow-xs"
                  >
                    Configure / QR
                  </Button>
                )}

                {ch.type === "telegram" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsTelegramModalOpen(true)}
                    className="flex-1 rounded-full bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium shadow-xs"
                  >
                    Bot Token & Ping
                  </Button>
                )}

                {ch.type !== "whatsapp" && ch.type !== "telegram" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => openTestWebhook(ch.type)}
                    className="flex-1 rounded-full bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium shadow-xs"
                  >
                    Gateway Settings
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <WhatsAppQRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        phoneNumber="+234 812 345 6789"
      />

      <TelegramTokenModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        botUsername="@MusaSalesAgentBot"
      />

      <WebhookTestModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        defaultChannel={webhookChannelTarget}
      />
    </div>
  );
}
