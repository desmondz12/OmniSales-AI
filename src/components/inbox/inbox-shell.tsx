"use client";

import * as React from "react";
import {
  AlertCircle,
  Bot,
  Clock,
  CreditCard,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Send,
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

function ChannelBadgeIcon({ channel }: { channel: ChannelType }) {
  switch (channel) {
    case "whatsapp":
      return (
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#25D366] text-white ring-2 ring-white shadow-2xs"
          title="WhatsApp"
        >
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.12 8.12 0 0 1-1.25-4.29c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.11 8.11 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16z" />
          </svg>
        </span>
      );
    case "instagram":
      return (
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-linear-to-tr from-[#FD1D1D] to-[#833AB4] text-white ring-2 ring-white shadow-2xs"
          title="Instagram"
        >
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </span>
      );
    case "messenger":
      return (
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0084FF] text-white ring-2 ring-white shadow-2xs"
          title="Messenger"
        >
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.208V22l3.37-1.85c.91.25 1.88.39 2.895.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.443l-2.716-2.898-5.3 2.898 5.83-6.192 2.784 2.898 5.232-2.898-5.83 6.192z" />
          </svg>
        </span>
      );
    case "tiktok":
      return (
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 text-white ring-2 ring-white shadow-2xs"
          title="TikTok"
        >
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.86-4.49V8.78a8.18 8.18 0 0 0 3.91.98V6.69z" />
          </svg>
        </span>
      );
    case "telegram":
      return (
        <span
          className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0088cc] text-white ring-2 ring-white shadow-2xs"
          title="Telegram"
        >
          <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
        </span>
      );
  }
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
      if (
        conv.status !== "needs_human" &&
        conv.status !== "upset" &&
        conv.status !== "ready_to_pay"
      ) {
        return false;
      }
    } else if (selectedStatus === "ready_to_pay") {
      if (conv.triage_tag !== "ready_to_pay") return false;
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
      if (
        activeCustomer.name === "Jean-Pierre Fotso" ||
        activeCustomer.name === "Femi Adeleke"
      ) {
        setReplyText(
          "Bonjour M. Fotso, ici Jean-Luc ! Je viens de vérifier notre récapitulatif des transferts MTN MoMo et Afriland. Votre acompte de 550 000 FCFA est bien enregistré et la livraison à Akwa est réservée !"
        );
      } else if (
        activeCustomer.name === "Boris Atangana" ||
        activeCustomer.name === "Obinna Eze"
      ) {
        setReplyText(
          "Bonjour Boris, ici Jean-Luc personnellement. Je comprends parfaitement l'urgence pour votre événement de 14h à Bastos. Le transporteur express est déjà en route et livre avant 12h45. Code de suivi colis : CM-7821."
        );
      } else if (
        activeCustomer.name === "Marie-Claire Ngo" ||
        activeCustomer.name === "Amaka Johnson"
      ) {
        setReplyText(
          "Bonjour Marie-Claire, ici Jean-Luc ! Pour une commande de 50 pièces de pagnes / tissus brodés, nous offrons un tarif grossiste à 25 000 FCFA l'unité (soit 75 000 FCFA d'économie). Je peux vous envoyer les échantillons par WhatsApp dès maintenant."
        );
      } else if (
        activeCustomer.name === "Danielle Ewane" ||
        activeCustomer.name === "Chiamaka Nwosu"
      ) {
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
    <div className="flex h-full w-full overflow-hidden bg-white select-none">
      {/* ========================================================= */}
      {/* COL 2: UNIFIED INBOX LIST (Fixed 340px)                   */}
      {/* ========================================================= */}
      <aside className="w-[340px] shrink-0 border-r border-slate-200 flex flex-col h-full bg-white">
        {/* ROW 1: 60px Locked Header with Title, Badge, and Channel Dropdown */}
        <div className="h-[60px] shrink-0 border-b border-slate-200 px-4 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2 min-w-0">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight shrink-0">
              Unified Inbox
            </h2>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/80 whitespace-nowrap">
              3 Human Needs
            </span>
          </div>

          {/* Compact Channel Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="h-7.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Channels (5)</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="messenger">Messenger</option>
              <option value="tiktok">TikTok</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>
        </div>

        {/* ROW 2: Sticky Sub-Header with Compact Search & 4 Status Tabs */}
        <div className="px-3 py-2 border-b border-slate-200 space-y-2 bg-slate-50/60 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, customers..."
              className="h-7 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* 4 Status Tabs */}
          <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-200/60 rounded-lg text-center text-[10px] font-semibold text-slate-600">
            {[
              { id: "all", label: "All" },
              { id: "needs_human", label: "Urgent" },
              { id: "ready_to_pay", label: "To Pay" },
              { id: "ai_handling", label: "AI Auto" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`rounded-md py-1 transition-all ${
                  selectedStatus === st.id
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found for this filter.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const customer = conv.customers;
              const isAiActive = aiActiveMap[conv.id] ?? conv.is_ai_active;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`group relative flex cursor-pointer flex-col p-3 transition-colors ${
                    isSelected
                      ? "bg-blue-50/70 border-l-[3px] border-l-blue-600 pl-2.5"
                      : "hover:bg-slate-50/70"
                  }`}
                >
                  {/* Top row: Avatar + Name + Timestamp */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Avatar with anchored 14px channel badge */}
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
                        {customer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "C"}
                        {/* 14px channel badge anchored to bottom-right corner of avatar */}
                        <div className="absolute -bottom-1 -right-1">
                          <ChannelBadgeIcon channel={conv.channel_type} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {customer?.name}
                        </span>
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
                        <div className="mt-0.5 flex justify-end">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                            {conv.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Context Summary Preview */}
                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {conv.ai_context_summary}
                  </p>

                  {/* Badges footer */}
                  <div className="mt-2 flex items-center justify-between">
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
      {/* COL 3: ACTIVE CHAT CANVAS (Fluid 1fr, min-w-[420px])      */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-[420px] flex flex-col bg-slate-50/50 h-full overflow-hidden">
        {/* ROW 1: 60px Locked Header with Un-cramped Details */}
        <div className="h-[60px] shrink-0 border-b border-slate-200 px-4 flex items-center justify-between bg-white">
          {/* Left Side: Avatar + Name (no truncation) + Channel Badge + Triage Pill + Phone below */}
          <div className="flex items-center space-x-3 min-w-0 pr-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-xs text-slate-800 border border-slate-200">
              {activeCustomer?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "C"}
              {activeConversation && (
                <div className="absolute -bottom-1 -right-1">
                  <ChannelBadgeIcon channel={activeConversation.channel_type} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900 shrink-0 whitespace-nowrap">
                  {activeCustomer?.name}
                </h3>
                {activeConversation && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
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
                    className="capitalize text-[10px] font-semibold py-0.5 px-2 shrink-0 whitespace-nowrap"
                  >
                    {activeConversation.status === "ready_to_pay"
                      ? "Ready To Pay"
                      : activeConversation.status.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-normal whitespace-nowrap truncate mt-0.5">
                {activeCustomer?.phone || activeCustomer?.handle || "Customer Contact"} • Live channel connected
              </p>
            </div>
          </div>

          {/* Right Side: AI Agent toggle + Take over button + Panel toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* AI Toggle Button */}
            <button
              type="button"
              onClick={handleToggleAi}
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium shrink-0 whitespace-nowrap transition-colors ${
                aiActiveMap[activeConvId]
                  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
              }`}
              title="Toggle AI automated replies for this conversation"
            >
              <Bot className="mr-1.5 h-3.5 w-3.5" />
              <span>{aiActiveMap[activeConvId] ? "AI Agent: ON" : "AI Paused"}</span>
            </button>

            {/* Take Over Button */}
            <Button
              type="button"
              size="sm"
              variant={claimedMap[activeConvId] ? "secondary" : "default"}
              onClick={handleToggleClaim}
              className="text-xs font-medium h-8 rounded-lg shrink-0 whitespace-nowrap px-3 bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-xs"
            >
              <UserCheck className="mr-1.5 h-3.5 w-3.5" />
              <span>{claimedMap[activeConvId] ? "Assigné à Jean-Luc" : "Take over"}</span>
            </Button>

            {/* Toggle CRM Drawer Button */}
            <button
              type="button"
              onClick={() => setShowCrmPanel(!showCrmPanel)}
              className="hidden lg:flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
              title={showCrmPanel ? "Hide CRM context drawer" : "Show CRM context drawer"}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Context Escalation Card */}
          {activeConversation?.ai_context_summary && (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>AI Escalation Context</span>
              </div>
              <p className="mt-1 text-slate-700 leading-relaxed text-xs">
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

                {/* Message Content Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed ${
                    isCustomer
                      ? "bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-2xs"
                      : isAi
                      ? "bg-slate-100 text-slate-900 border border-slate-200/80 rounded-br-xs"
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

        {/* DOCKED CHAT COMPOSER TOOLBAR (Unified Structural Block) */}
        <form onSubmit={handleSendMessage} className="shrink-0 px-4 pb-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col focus-within:border-[#0071E3] focus-within:ring-1 focus-within:ring-[#0071E3]/20 transition-colors">
            {/* Merged Quick Action Toolbar Header */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex shrink-0 items-center rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0071E3] shadow-2xs transition-colors"
              >
                <CreditCard className="mr-1.5 h-3 w-3 text-[#0071E3]" />
                <span>Lien MoMo/OM</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="inline-flex shrink-0 items-center rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-2xs transition-colors"
              >
                <FileText className="mr-1.5 h-3 w-3 text-indigo-600" />
                <span>Facture</span>
              </button>

              <button
                type="button"
                disabled={isDraftingAi}
                onClick={handleAiDraftReply}
                className="inline-flex shrink-0 items-center rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-medium text-[#0071E3] hover:bg-blue-100 shadow-2xs transition-colors"
              >
                <Bot className="mr-1.5 h-3 w-3 text-[#0071E3]" />
                <span>{isDraftingAi ? "Rédaction..." : "Proposer réponse IA"}</span>
              </button>
            </div>

            {/* Composer Textarea */}
            <textarea
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Répondre à ${activeCustomer?.name || "Client"} sur ${activeConversation?.channel_type || "chat"}... (⌘ + Entrée pour envoyer)`}
              className="w-full resize-none bg-transparent p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-normal"
            />

            {/* Bottom Bar: Gateway tag + Send button */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Passerelle {activeConversation?.channel_type?.toUpperCase()}
              </span>

              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim()}
                className="rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white px-3.5 py-1 font-medium text-xs shadow-xs"
              >
                <span>Envoyer</span>
                <Send className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* ========================================================= */}
      {/* COL 4: RIGHT CRM CONTEXT DRAWER (Fixed 320px)             */}
      {/* ========================================================= */}
      {showCrmPanel && (
        <aside className="w-80 shrink-0 border-l border-slate-200 flex flex-col overflow-y-auto bg-white h-full">
          {/* ROW 1: 60px Locked Header with Compact Profile */}
          <div className="h-[60px] shrink-0 border-b border-slate-200 px-4 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-semibold text-xs text-[#0071E3] border border-blue-200">
                {activeCustomer?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "C"}
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-900 truncate">
                    {activeCustomer?.name}
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                    Client vérifié
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">
                  {activeCustomer?.phone || activeCustomer?.email || "Pas de coordonnées"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-[11px] font-medium text-[#0071E3] hover:text-[#0077ED] shrink-0"
            >
              + Lien
            </button>
          </div>

          {/* Body: Financial Profile, AI Customer Memory, Past Objections, Invoices */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Financial Profile */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-semibold text-slate-500">
                  Profil financier
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <span className="text-[10px] text-slate-500 font-medium">Restant dû</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5 tabular-nums">
                    {(activeCustomer?.total_owed || 0).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5">
                  <span className="text-[10px] text-emerald-700 font-medium">Déjà encaissé</span>
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5 tabular-nums">
                    {(activeCustomer?.total_paid || 0).toLocaleString("fr-FR")} FCFA
                  </p>
                </div>
              </div>

              {/* Active Promise */}
              {activeCustomer?.payment_promise_date && (
                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/60 p-2 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-medium">Promesse :</span>
                  </div>
                  <span className="font-semibold text-xs tabular-nums">
                    {(activeCustomer.payment_promise_amount || 0).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}
            </div>

            {/* AI Customer Memory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-semibold text-slate-500">
                  Mémoire client
                </h4>
              </div>

              <div className="space-y-1.5">
                {activeCustomer?.ai_memory?.facts && activeCustomer.ai_memory.facts.length > 0 ? (
                  activeCustomer.ai_memory.facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 leading-relaxed"
                    >
                      • {fact}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Aucune note enregistrée.</p>
                )}
              </div>
            </div>

            {/* Past Objections Noted */}
            {activeCustomer?.ai_memory?.objections &&
              activeCustomer.ai_memory.objections.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-500 mb-2">
                    Objections formulées
                  </h4>
                  <div className="space-y-1.5">
                    {activeCustomer.ai_memory.objections.map((obj, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-rose-200 bg-rose-50/50 p-2 text-xs text-rose-800"
                      >
                        • {obj}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Invoices List */}
            <div>
              <h4 className="text-[11px] font-semibold text-slate-500 mb-2">
                Factures ({activeInvoices.length})
              </h4>
              <div className="space-y-2">
                {activeInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune facture émise.</p>
                ) : (
                  activeInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{inv.invoice_number}</span>
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {inv.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {inv.amount.toLocaleString("fr-FR")} FCFA
                        </span>
                        <div className="mt-0.5">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-semibold capitalize ${
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
