"use client";

import * as React from "react";
import {
  AlertCircle,
  Bot,
  Clock,
  CreditCard,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Conversation, Message, TriageTag } from "@/types/database";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

function getInitialMessages(conversation: Conversation): Message[] {
  const customer = conversation.customers;
  const channel = conversation.channel_type;

  if (customer?.name === "Jean-Pierre Fotso" || customer?.name === "Femi Adeleke") {
    return [
      {
        id: "m-101",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "customer",
        sender_name: customer.name,
        content:
          "Bonjour M. Fotso, je suis prêt à verser l'acompte de 550 000 FCFA pour les 10 iPhone 15. Vous préférez MTN MoMo ou virement Afriland?",
        channel_type: channel,
        metadata: { intent: "ready_to_pay", amount: 550000 },
        created_at: new Date(Date.now() - 25 * 60000).toISOString(),
      },
      {
        id: "m-102",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "ai",
        sender_name: "OmniSales AI Agent",
        content:
          "Bonjour M. Fotso ! Ravi de vous lire. Vous pouvez payer instantanément par MTN MoMo au 671 23 45 67 ou via notre lien sécurisé : https://pay.omnisales.ai/fotso/inv-081 (550 000 FCFA). Dès réception, votre commande sera priorisée pour la livraison à Akwa vendredi !",
        channel_type: channel,
        metadata: { is_automated: true },
        created_at: new Date(Date.now() - 24 * 60000).toISOString(),
      },
      {
        id: "m-103",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "customer",
        sender_name: customer.name,
        content:
          "J'ai initié le paiement MoMo, pouvez-vous me confirmer la bonne réception des 550 000 FCFA ?",
        channel_type: channel,
        metadata: { intent: "handoff_ready" },
        created_at: new Date(Date.now() - 8 * 60000).toISOString(),
      },
    ];
  } else if (customer?.name === "Boris Atangana" || customer?.name === "Obinna Eze") {
    return [
      {
        id: "m-201",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "customer",
        sender_name: customer.name,
        content:
          "Où est ma montre connectée achetée à 180 000 FCFA ?? Vous aviez promis livraison à Bastos (Yaoundé) hier ! J'ai un événement aujourd'hui à 14h !",
        channel_type: channel,
        metadata: { sentiment: "angry" },
        created_at: new Date(Date.now() - 40 * 60000).toISOString(),
      },
      {
        id: "m-202",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "ai",
        sender_name: "OmniSales AI Agent",
        content:
          "Toutes nos excuses pour ce désagrément, Boris. J'ai suspendu mes réponses automatiques et transmis votre dossier en urgence au responsable logistique pour contacter le transporteur Douala-Yaoundé immédiatement.",
        channel_type: channel,
        metadata: { handoff_triggered: true },
        created_at: new Date(Date.now() - 39 * 60000).toISOString(),
      },
    ];
  } else {
    return [
      {
        id: "m-301",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "customer",
        sender_name: customer?.name || "Customer",
        content:
          customer?.ai_memory?.facts?.[0] ||
          "Hello, I would like to speak directly with the sales manager regarding my order.",
        channel_type: channel,
        metadata: {},
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      },
      {
        id: "m-302",
        conversation_id: conversation.id,
        workspace_id: conversation.workspace_id,
        sender_type: "ai",
        sender_name: "OmniSales AI Agent",
        content:
          "Hello! I am alerting our human team now. The manager will be with you shortly to assist with your request.",
        channel_type: channel,
        metadata: { is_automated: true },
        created_at: new Date(Date.now() - 29 * 60000).toISOString(),
      },
    ];
  }
}

function ChatDrawerContent({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  const [messages, setMessages] = React.useState<Message[]>(() => getInitialMessages(conversation));
  const [replyText, setReplyText] = React.useState("");
  const [isAiActive, setIsAiActive] = React.useState(conversation.is_ai_active);
  const [isClaimed, setIsClaimed] = React.useState(Boolean(conversation.claimed_by));
  const [isGeneratingAiDraft, setIsGeneratingAiDraft] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const customer = conversation.customers;

  // Auto-scroll on message updates
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const messageText = replyText.trim();
    const tempId = `msg-${Date.now()}`;

    const newMsg: Message = {
      id: tempId,
      conversation_id: conversation.id,
      workspace_id: conversation.workspace_id,
      sender_type: "human",
      sender_name: "Jean-Luc (Gérant)",
      content: messageText,
      channel_type: conversation.channel_type,
      metadata: { sent_by_owner: true, status: "sending" },
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setReplyText("");

    try {
      const recipient =
        customer?.phone ||
        customer?.handle?.replace(/^@/, "") ||
        "237671234567";

      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          recipient,
          text: messageText,
          channel: conversation.channel_type,
          workspaceId: conversation.workspace_id,
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

  const handleDraftAiReply = () => {
    setIsGeneratingAiDraft(true);
    setTimeout(() => {
      setIsGeneratingAiDraft(false);
      if (customer?.name === "Jean-Pierre Fotso" || customer?.name === "Femi Adeleke") {
        setReplyText(
          "Bonjour M. Fotso, ici Jean-Luc. Je vérifie les notifications de réception MTN MoMo et notre relevé Afriland First Bank à l'instant. Votre acompte sera validé d'ici 5 minutes !"
        );
      } else if (customer?.name === "Boris Atangana" || customer?.name === "Obinna Eze") {
        setReplyText(
          "Bonjour Boris, ici Jean-Luc personnellement. Toutes nos excuses pour le retard de livraison sur Yaoundé. L'agence de transport express vient de me confirmer l'arrivée à Bastos avant 13h30. Réf colis: CM-7821."
        );
      } else {
        setReplyText(
          `Bonjour ${customer?.name || "cher client"}, ici le service client OmniSales. Merci de votre patience ! Comment puis-je vous aider aujourd'hui ?`
        );
      }
    }, 800);
  };

  const handleSendPaymentLinkShortcut = () => {
    const linkMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversation.id,
      workspace_id: conversation.workspace_id,
      sender_type: "human",
      sender_name: "Jean-Luc (Gérant)",
      content: `Voici votre lien de paiement sécurisé MoMo / Orange Money de ${(customer?.total_owed || 550000).toLocaleString("fr-FR")} FCFA : https://pay.omnisales.ai/fotso/checkout. Reçu instantané généré dès confirmation.`,
      channel_type: conversation.channel_type,
      metadata: { payment_link: true },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, linkMsg]);
  };

  const triageVariant: Record<TriageTag, "ready_to_pay" | "upset" | "needs_human" | "promise_due" | "secondary"> = {
    ready_to_pay: "ready_to_pay",
    upset: "upset",
    asked_for_person: "needs_human",
    promise_due: "promise_due",
    paid: "ready_to_pay",
    none: "secondary",
  };

  return (
    <div className="relative flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-800 border border-slate-200">
            {customer?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "C"}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">{customer?.name}</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {conversation.channel_type}
              </span>
              <Badge variant={triageVariant[conversation.triage_tag] || "secondary"} className="capitalize text-[11px]">
                {conversation.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {customer?.phone || customer?.handle || "Customer contact"} • Last active just now
            </p>
          </div>
        </div>

        {/* Controls: AI switch + Claim button + Close */}
        <div className="flex items-center space-x-2.5">
          {/* AI Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAiActive(!isAiActive)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              isAiActive
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            <Bot className="mr-1.5 h-3.5 w-3.5" />
            {isAiActive ? "AI Agent: ON" : "AI Paused (Human Mode)"}
          </button>

          {/* Claim Handoff */}
          <Button
            type="button"
            size="sm"
            variant={isClaimed ? "secondary" : "default"}
            onClick={() => setIsClaimed(!isClaimed)}
            className="text-xs font-semibold h-8"
          >
            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
            {isClaimed ? "Assigné à Jean-Luc" : "Prendre en charge"}
          </Button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Body (2 Panes: Live Chat 65% + Customer CRM Facts 35%) */}
      <div className="grid flex-1 grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Live Chat Pane (8 Cols) */}
        <div className="md:col-span-8 flex flex-col justify-between border-r border-slate-100 bg-slate-50/40">
          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Live Escalation Banner */}
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-amber-900">
              <div className="flex items-center space-x-1.5 font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Escalation Context</span>
              </div>
              <p className="mt-1 text-slate-700">{conversation.ai_context_summary}</p>
            </div>

            {messages.map((msg) => {
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
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {msg.sender_name}
                    </span>
                    {isAi && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                        AI
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

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isCustomer
                        ? "bg-white text-slate-900 border border-slate-200/80 rounded-tl-sm"
                        : isAi
                        ? "bg-blue-50/80 text-blue-950 border border-blue-200/60 rounded-tr-sm"
                        : "bg-blue-600 text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Bar */}
          <div className="border-t border-slate-200/80 bg-white px-4 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={handleSendPaymentLinkShortcut}
              className="inline-flex shrink-0 items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <CreditCard className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              Send Payment Link
            </button>

            <button
              type="button"
              disabled={isGeneratingAiDraft}
              onClick={handleDraftAiReply}
              className="inline-flex shrink-0 items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
              {isGeneratingAiDraft ? "Drafting..." : "Let AI Draft Reply"}
            </button>
          </div>

          {/* Reply Input Form */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200/80 bg-white p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${customer?.name} on ${conversation.channel_type}...`}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!replyText.trim()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 font-semibold text-xs"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Customer Memory & CRM Pane (4 Cols) */}
        <div className="md:col-span-4 bg-white p-5 overflow-y-auto space-y-5">
          {/* Financial Status Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Financials
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500">Total Dû</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {(customer?.total_owed || 0).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100">
                <p className="text-[11px] text-emerald-700">Total Versé</p>
                <p className="text-sm font-bold text-emerald-900 mt-0.5">
                  {(customer?.total_paid || 0).toLocaleString("fr-FR")} FCFA
                </p>
              </div>
            </div>

            {customer?.payment_promise_date && (
              <div className="mt-2.5 rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Promesse :</span>
                </div>
                <span className="font-bold">
                  {(customer.payment_promise_amount || 0).toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            )}
          </div>

          {/* AI Extracted Customer Memory Facts */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Customer Memory
              </h4>
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            </div>

            <div className="mt-3 space-y-2">
              {customer?.ai_memory?.facts && customer.ai_memory.facts.length > 0 ? (
                customer.ai_memory.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-blue-50/50 border border-blue-100/70 p-2.5 text-xs text-slate-700 leading-relaxed"
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
          {customer?.ai_memory?.objections && customer.ai_memory.objections.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Past Objections
              </h4>
              <div className="mt-2 space-y-1.5">
                {customer.ai_memory.objections.map((obj, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-rose-50 border border-rose-100 p-2 text-xs text-rose-800"
                  >
                    ⚠ {obj}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Direct Channels
            </h4>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p>
                <strong className="text-slate-800">Phone:</strong> {customer?.phone || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Email:</strong> {customer?.email || "N/A"}
              </p>
              <p>
                <strong className="text-slate-800">Handle:</strong> {customer?.handle || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatDrawer({
  isOpen,
  onClose,
  conversation,
}: ChatDrawerProps) {
  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <ChatDrawerContent
        key={conversation.id}
        conversation={conversation}
        onClose={onClose}
      />
    </div>
  );
}
