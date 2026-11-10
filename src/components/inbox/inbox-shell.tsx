"use client";

import * as React from "react";
import {
  AlertCircle,
  Bot,
  Clock,
  CreditCard,
  FileText,
  Inbox,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentLinkModal } from "./payment-link-modal";
import { InvoiceModal } from "./invoice-modal";
import type {
  ChannelType,
  Conversation,
  Customer,
  Invoice,
  Message,
  TriageTag,
} from "@/types/database";

interface InboxShellProps {
  initialConversations: Conversation[];
  initialCustomers: Customer[];
  initialMessages: Message[];
  initialInvoices: Invoice[];
}

export function InboxShell({
  initialConversations,
  initialCustomers,
  initialMessages,
  initialInvoices,
}: InboxShellProps) {
  // Navigation / Filter States
  const [selectedChannel, setSelectedChannel] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Active Selected Conversation
  const [activeConvId, setActiveConvId] = React.useState<string>(
    initialConversations[0]?.id || ""
  );

  // Messages Store (keyed by conversation_id)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);

  // Right CRM Sidebar Toggle
  const [showCrmPanel, setShowCrmPanel] = React.useState(true);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState(false);

  // Draft reply input & AI generation
  const [replyText, setReplyText] = React.useState("");
  const [isDraftingAi, setIsDraftingAi] = React.useState(false);

  // Auto-scroll ref
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Active Conversation Object
  const activeConversation =
    initialConversations.find((c) => c.id === activeConvId) || initialConversations[0];

  // Active Customer Object
  const activeCustomer =
    activeConversation?.customers ||
    initialCustomers.find((cust) => cust.id === activeConversation?.customer_id);

  // Local state for AI toggling per conversation
  const [aiActiveMap, setAiActiveMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialConversations.forEach((c) => {
      map[c.id] = c.is_ai_active;
    });
    return map;
  });

  // Local state for claim status per conversation
  const [claimedMap, setClaimedMap] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialConversations.forEach((c) => {
      map[c.id] = Boolean(c.claimed_by);
    });
    return map;
  });

  // Filter conversations
  const filteredConversations = initialConversations.filter((conv) => {
    // Channel filter
    if (selectedChannel !== "all" && conv.channel_type !== selectedChannel) {
      return false;
    }

    // Status filter
    if (selectedStatus === "needs_human") {
      if (conv.status !== "needs_human" && conv.status !== "upset" && conv.status !== "ready_to_pay") {
        return false;
      }
    } else if (selectedStatus === "ready_to_pay") {
      if (conv.triage_tag !== "ready_to_pay") return false;
    } else if (selectedStatus === "upset") {
      if (conv.status !== "upset") return false;
    } else if (selectedStatus === "ai_handling") {
      if (conv.status !== "ai_handling") return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const customerName = conv.customers?.name?.toLowerCase() || "";
      const summary = conv.ai_context_summary?.toLowerCase() || "";
      if (!customerName.includes(q) && !summary.includes(q)) {
        return false;
      }
    }

    return true;
  });

  // Active messages for this conversation
  const activeMessages = messages.filter((m) => m.conversation_id === activeConvId);

  // Auto-scroll on messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length, activeConvId]);

  // Handle Send message via Outbound API Dispatcher
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!replyText.trim() || !activeConversation) return;

    const messageText = replyText.trim();
    const tempId = `m-${Date.now()}`;

    const newMsg: Message = {
      id: tempId,
      conversation_id: activeConversation.id,
      workspace_id: activeConversation.workspace_id,
      sender_type: "human",
      sender_name: "Jean-Luc (Gérant)",
      content: messageText,
      channel_type: activeConversation.channel_type,
      metadata: { sent_via_inbox: true, status: "sending" },
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyText("");

    try {
      const recipient =
        activeCustomer?.phone ||
        activeCustomer?.handle?.replace(/^@/, "") ||
        "237671234567";

      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          recipient,
          text: messageText,
          channel: activeConversation.channel_type,
          workspaceId: activeConversation.workspace_id,
          senderName: "Jean-Luc (Gérant)",
          senderType: "human",
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  id: data.message.id || m.id,
                  metadata: {
                    ...m.metadata,
                    status: "delivered",
                    simulated: data.dispatchResult?.simulated,
                  },
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error("Outbound dispatch failed:", err);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle AI Draft reply
  const handleAiDraftReply = () => {
    if (!activeCustomer) return;
    setIsDraftingAi(true);

    setTimeout(() => {
      setIsDraftingAi(false);
      if (activeCustomer.name === "Jean-Pierre Fotso" || activeCustomer.name === "Femi Adeleke") {
        setReplyText(
          "Bonjour M. Fotso, ici Jean-Luc ! Je viens de vérifier notre récapitulatif des transferts MTN MoMo et Afriland. Votre acompte de 550 000 FCFA est bien enregistré et la livraison à Akwa est réservée !"
        );
      } else if (activeCustomer.name === "Boris Atangana" || activeCustomer.name === "Obinna Eze") {
        setReplyText(
          "Bonjour Boris, ici Jean-Luc personnellement. Je comprends parfaitement l'urgence pour votre événement de 14h à Bastos. Le transporteur express est déjà en route et livre avant 12h45. Code de suivi colis : CM-7821."
        );
      } else if (activeCustomer.name === "Marie-Claire Ngo" || activeCustomer.name === "Amaka Johnson") {
        setReplyText(
          "Bonjour Marie-Claire, ici Jean-Luc ! Pour une commande de 50 pièces de pagnes / tissus brodés, nous offrons un tarif grossiste à 25 000 FCFA l'unité (soit 75 000 FCFA d'économie). Je peux vous envoyer les échantillons par WhatsApp dès maintenant."
        );
      } else if (activeCustomer.name === "Danielle Ewane" || activeCustomer.name === "Chiamaka Nwosu") {
        setReplyText(
          "Bonjour Danielle, bien reçu pour votre promesse de paiement à 16h ! Voici votre lien rapide MoMo / OM pour solder dès réception : https://pay.omnisales.ai/fotso/inv-068. Excellente journée à vous !"
        );
      } else {
        setReplyText(
          `Bonjour ${activeCustomer.name}, ici l'équipe OmniSales Douala ! Merci de nous avoir contactés. En quoi puis-je vous aider aujourd'hui ?`
        );
      }
    }, 750);
  };

  const handleToggleAi = () => {
    if (!activeConversation) return;
    setAiActiveMap((prev) => ({
      ...prev,
      [activeConversation.id]: !prev[activeConversation.id],
    }));
  };

  const handleToggleClaim = () => {
    if (!activeConversation) return;
    setClaimedMap((prev) => ({
      ...prev,
      [activeConversation.id]: !prev[activeConversation.id],
    }));
  };

  const channelBadgeInfo: Record<
    ChannelType,
    { label: string; bg: string; text: string; border: string }
  > = {
    whatsapp: {
      label: "WhatsApp",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    instagram: {
      label: "Instagram",
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
    },
    messenger: {
      label: "Messenger",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    tiktok: {
      label: "TikTok",
      bg: "bg-slate-900",
      text: "text-white",
      border: "border-slate-800",
    },
    telegram: {
      label: "Telegram",
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
  };

  const triageVariantMap: Record<
    TriageTag,
    "ready_to_pay" | "upset" | "needs_human" | "promise_due" | "secondary"
  > = {
    ready_to_pay: "ready_to_pay",
    upset: "upset",
    asked_for_person: "needs_human",
    promise_due: "promise_due",
    paid: "ready_to_pay",
    none: "secondary",
  };

  const activeInvoices = initialInvoices.filter(
    (inv) => inv.customer_id === activeCustomer?.id
  );

  return (
    <div className="relative flex h-[calc(100vh-6.5rem)] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* ========================================================= */}
      {/* 1. LEFT PANE: CONVERSATION LIST (320px–360px)            */}
      {/* ========================================================= */}
      <aside className="flex w-full md:w-80 lg:w-96 shrink-0 flex-col border-r border-slate-200/80 bg-white">
        {/* Top Header: Title + Unread Count */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Inbox className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">Unified Inbox</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200/80">
              3 Needs Human
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, customers..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Channel Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto border-b border-slate-100 px-3 py-2 no-scrollbar bg-slate-50/50">
          {[
            { id: "all", label: "All Channels" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "instagram", label: "Instagram" },
            { id: "messenger", label: "Messenger" },
            { id: "tiktok", label: "TikTok" },
            { id: "telegram", label: "Telegram" },
          ].map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChannel(ch.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedChannel === ch.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs — Apple Segmented Control */}
        <div className="p-2 border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100/80 p-1 text-center text-[10px] font-bold text-slate-600">
            {[
              { id: "all", label: "Tous" },
              { id: "needs_human", label: "Urgents" },
              { id: "ready_to_pay", label: "À Payer" },
              { id: "ai_handling", label: "IA Auto" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`rounded-lg py-1 transition-all active:scale-95 ${
                  selectedStatus === st.id
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "hover:text-slate-900 text-slate-500"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Aucune conversation pour ce filtre.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const customer = conv.customers;
              const chInfo = channelBadgeInfo[conv.channel_type];
              const isAiActive = aiActiveMap[conv.id] ?? conv.is_ai_active;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`group relative flex cursor-pointer flex-col p-3.5 transition-all duration-120 ${
                    isSelected
                      ? "bg-blue-50/70 border-l-[3px] border-l-[#0071E3] pl-3"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Top row: Avatar + Name + Timestamp */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Avatar */}
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
                        {customer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "C"}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      </div>

                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {customer?.name}
                        </span>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${chInfo.bg} ${chInfo.text} ${chInfo.border}`}
                          >
                            {chInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(conv.last_message_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {conv.unread_count > 0 && (
                        <div className="mt-1 flex justify-end">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                            {conv.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary / Last Message Preview */}
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {conv.ai_context_summary}
                  </p>

                  {/* Badges footer */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <Badge
                      variant={triageVariantMap[conv.triage_tag] || "secondary"}
                      className="text-[10px] capitalize font-medium py-0 px-2"
                    >
                      {conv.status.replace("_", " ")}
                    </Badge>

                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-medium">
                      <Bot className="h-3 w-3 text-blue-500" />
                      <span>{isAiActive ? "AI Active" : "Human Only"}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. CENTER PANE: LIVE CHAT THREAD                         */}
      {/* ========================================================= */}
      <main className="flex flex-1 flex-col justify-between overflow-hidden bg-slate-50/40">
        {/* Center Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-3.5">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-800 border border-slate-200">
              {activeCustomer?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "C"}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {activeCustomer?.name}
                </h3>
                {activeConversation && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      channelBadgeInfo[activeConversation.channel_type].bg
                    } ${channelBadgeInfo[activeConversation.channel_type].text} ${
                      channelBadgeInfo[activeConversation.channel_type].border
                    }`}
                  >
                    {activeConversation.channel_type}
                  </span>
                )}
                {activeConversation && (
                  <Badge
                    variant={triageVariantMap[activeConversation.triage_tag] || "secondary"}
                    className="capitalize text-[11px]"
                  >
                    {activeConversation.status.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {activeCustomer?.phone || activeCustomer?.handle || "Customer Contact"} • Live channel connected
              </p>
            </div>
          </div>

          {/* Center Actions: AI Agent toggle + Claim handoff + CRM toggle */}
          <div className="flex items-center space-x-2">
            {/* AI Toggle */}
            <button
              type="button"
              onClick={handleToggleAi}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                aiActiveMap[activeConvId]
                  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              }`}
              title="Toggle AI automated replies for this conversation"
            >
              <Bot className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {aiActiveMap[activeConvId] ? "AI Agent: ON" : "AI Paused (Human)"}
              </span>
              <span className="sm:hidden">
                {aiActiveMap[activeConvId] ? "AI ON" : "Human"}
              </span>
            </button>

            {/* Claim Handoff */}
            <Button
              type="button"
              size="sm"
              variant={claimedMap[activeConvId] ? "secondary" : "default"}
              onClick={handleToggleClaim}
              className="text-xs font-semibold h-8 rounded-xl"
            >
              <UserCheck className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {claimedMap[activeConvId] ? "Assigné à Jean-Luc" : "Prendre le relais"}
              </span>
              <span className="sm:hidden">
                {claimedMap[activeConvId] ? "Assigné" : "Prendre"}
              </span>
            </Button>

            {/* Toggle CRM Sidebar Button */}
            <button
              type="button"
              onClick={() => setShowCrmPanel(!showCrmPanel)}
              className="hidden lg:flex items-center rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
              title={showCrmPanel ? "Hide Customer CRM profile" : "Show Customer CRM profile"}
            >
              {showCrmPanel ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Live Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Context Escalation Card */}
          {activeConversation?.ai_context_summary && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>AI Escalation Context</span>
              </div>
              <p className="mt-1 text-slate-700 leading-relaxed">
                {activeConversation.ai_context_summary}
              </p>
            </div>
          )}

          {activeMessages.map((msg) => {
            const isCustomer = msg.sender_type === "customer";
            const isAi = msg.sender_type === "ai";
            const isHuman = msg.sender_type === "human";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isCustomer ? "items-start" : "items-end"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center space-x-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-600">
                    {msg.sender_name}
                  </span>
                  {isAi && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                      AI Agent
                    </span>
                  )}
                  {isHuman && (
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-1.5 py-0.2 text-[9px] font-bold text-white">
                      Staff
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Message Content Bubble — Apple iMessage */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs tracking-tight ${
                    isCustomer
                      ? "bg-slate-100/90 text-slate-900 border border-slate-200/50 rounded-bl-xs"
                      : isAi
                      ? "bg-indigo-50/80 text-indigo-950 border border-indigo-200/50 rounded-br-xs"
                      : "bg-[#0071E3] text-white rounded-br-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Toolbar — Apple Sub-bar */}
        <div className="border-t border-slate-200/50 bg-white/80 backdrop-blur-md px-4 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0071E3] transition-all active:scale-95"
          >
            <CreditCard className="mr-1.5 h-3.5 w-3.5 text-[#0071E3]" />
            Lien MoMo / OM
          </button>

          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-[#5856D6] transition-all active:scale-95"
          >
            <FileText className="mr-1.5 h-3.5 w-3.5 text-[#5856D6]" />
            Générer Facture
          </button>

          <button
            type="button"
            disabled={isDraftingAi}
            onClick={handleAiDraftReply}
            className="inline-flex shrink-0 items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0071E3] hover:bg-blue-100 transition-all active:scale-95 border border-blue-200/60"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#0071E3]" />
            {isDraftingAi ? "Rédaction..." : "Proposer Réponse IA"}
          </button>
        </div>

        {/* Reply Input Box — Apple Floating Input */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-200/50 bg-white/90 backdrop-blur-md p-3 sm:p-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-100/60 p-2 focus-within:border-[#0071E3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0071E3]/20 transition-all">
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Répondre à ${activeCustomer?.name || "Client"} sur ${activeConversation?.channel_type || "chat"}... (⌘ + Entrée pour envoyer)`}
              className="w-full resize-none bg-transparent p-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none tracking-tight font-medium"
            />

            <div className="flex items-center justify-between border-t border-slate-200/40 pt-2 px-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Passerelle {activeConversation?.channel_type?.toUpperCase()}
              </span>

              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim()}
                className="rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 font-semibold text-xs shadow-xs active:scale-95"
              >
                <span>Envoyer</span>
                <Send className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* ========================================================= */}
      {/* 3. RIGHT PANE: CUSTOMER MEMORY & CRM PROFILE (320px–360px) */}
      {/* ========================================================= */}
      {showCrmPanel && (
        <aside className="hidden lg:flex w-80 lg:w-88 shrink-0 flex-col overflow-y-auto border-l border-slate-200/80 bg-white p-5 space-y-6 animate-in slide-in-from-right-4 duration-200">
          {/* Customer Avatar & Bio */}
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-lg font-bold text-blue-700 border-2 border-white shadow-sm ring-1 ring-slate-200">
              {activeCustomer?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "C"}
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-900">
              {activeCustomer?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeCustomer?.phone || activeCustomer?.email || "No contact"}
            </p>

            <div className="mt-2.5 flex items-center justify-center space-x-1.5">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                {activeCustomer?.channel_type?.toUpperCase()}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Verified Buyer
              </span>
            </div>
          </div>

          {/* Financials & Balances */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financial Profile
              </h4>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                + Link
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                <span className="text-[11px] text-slate-500">Total Dû</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {(activeCustomer?.total_owed || 0).toLocaleString("fr-FR")} FCFA
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                <span className="text-[11px] text-emerald-700">Total Versé</span>
                <p className="text-sm font-bold text-emerald-900 mt-0.5">
                  {(activeCustomer?.total_paid || 0).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            </div>

            {/* Active Promise */}
            {activeCustomer?.payment_promise_date && (
              <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-2.5 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Promesse :</span>
                </div>
                <span className="font-bold">
                  {(activeCustomer.payment_promise_amount || 0).toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            )}
          </div>

          {/* AI Customer Memory Facts */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Customer Memory
              </h4>
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            </div>

            <div className="mt-3 space-y-2">
              {activeCustomer?.ai_memory?.facts && activeCustomer.ai_memory.facts.length > 0 ? (
                activeCustomer.ai_memory.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-blue-100/80 bg-blue-50/40 p-2.5 text-xs text-slate-700 leading-relaxed"
                  >
                    • {fact}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No facts extracted yet.</p>
              )}
            </div>
          </div>

          {/* Customer Objections */}
          {activeCustomer?.ai_memory?.objections &&
            activeCustomer.ai_memory.objections.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Past Objections Noted
                </h4>
                <div className="mt-2 space-y-1.5">
                  {activeCustomer.ai_memory.objections.map((obj, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-rose-100 bg-rose-50/60 p-2.5 text-xs text-rose-800"
                    >
                      ⚠ {obj}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Recent Invoices */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Invoices ({activeInvoices.length})
            </h4>
            <div className="mt-2.5 space-y-2">
              {activeInvoices.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No invoices created yet.</p>
              ) : (
                activeInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{inv.invoice_number}</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {inv.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {inv.amount.toLocaleString("fr-FR")} FCFA
                      </span>
                      <div className="mt-0.5">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold capitalize ${
                            inv.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.status === "overdue"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Payment Link Modal */}
      <PaymentLinkModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customer={activeCustomer || null}
        onInsertIntoChat={(msg) => {
          setReplyText((prev) => (prev ? `${prev}\n\n${msg}` : msg));
        }}
      />

      {/* Invoice Generator Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        customer={activeCustomer || null}
        onInsertInvoice={(msg) => {
          setReplyText((prev) => (prev ? `${prev}\n\n${msg}` : msg));
        }}
      />
    </div>
  );
}
