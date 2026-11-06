"use client";

import * as React from "react";
import { MoneyBriefCard } from "./money-brief-card";
import { HandoffQueue } from "./handoff-queue";
import { CollectionsTracker } from "./collections-tracker";
import { AdvisorTasks } from "./advisor-tasks";
import { CopilotBar } from "./copilot-bar";
import { ChatDrawer } from "./chat-drawer";
import type { ChannelType, Conversation, Customer, Invoice } from "@/types/database";

interface DashboardViewProps {
  ownerName: string;
  initialConversations: Conversation[];
  initialCustomers: Customer[];
  initialInvoices: Invoice[];
}

export function DashboardView({
  ownerName,
  initialConversations,
  initialCustomers,
  initialInvoices,
}: DashboardViewProps) {
  const conversations = initialConversations;
  const customers = initialCustomers;
  const invoices = initialInvoices;

  // Active conversation for slide-over Chat Drawer
  const [activeConversation, setActiveConversation] = React.useState<Conversation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Copilot query state
  const [copilotQuery, setCopilotQuery] = React.useState<string>("");

  const handleReviewHandoff = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setIsDrawerOpen(true);
  };

  const handleOpenCustomerChatByName = (customerName: string) => {
    const found = conversations.find(
      (c) => c.customers?.name?.toLowerCase() === customerName.toLowerCase()
    );
    if (found) {
      setActiveConversation(found);
      setIsDrawerOpen(true);
    } else {
      // Create a temporary conversation view for this customer
      const customer = customers.find(
        (c) => c.name.toLowerCase() === customerName.toLowerCase()
      );
      if (customer) {
        const tempConv: Conversation = {
          id: `conv-temp-${customer.id}`,
          workspace_id: customer.workspace_id,
          customer_id: customer.id,
          channel_type: customer.channel_type as ChannelType,
          status: "needs_human",
          triage_tag: "none",
          ai_context_summary: `Direct conversation with ${customer.name}`,
          unread_count: 0,
          is_ai_active: true,
          claimed_by: null,
          last_message_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          customers: customer,
        };
        setActiveConversation(tempConv);
        setIsDrawerOpen(true);
      }
    }
  };

  const handleBriefAskAboutThis = (query: string) => {
    setCopilotQuery(query);
  };

  return (
    <div className="space-y-8 pb-28">
      {/* 1. THE MORNING "MONEY BRIEF" HERO CARD */}
      <section aria-label="Morning Money Brief">
        <MoneyBriefCard
          ownerName={ownerName}
          onOpenCopilot={handleBriefAskAboutThis}
        />
      </section>

      {/* 2. "NEEDS YOU NOW" (Priority Human Handoff Queue) */}
      <section aria-label="Priority Human Handoffs">
        <HandoffQueue
          conversations={conversations}
          onReviewHandoff={handleReviewHandoff}
        />
      </section>

      {/* 3. "MONEY" (Collections & Channel Revenue Tracker) */}
      <section aria-label="Collections and Channel Revenue Tracker">
        <CollectionsTracker
          customers={customers}
          invoices={invoices}
          onOpenCustomerChat={handleOpenCustomerChatByName}
        />
      </section>

      {/* 4. "ADVISOR TASKS" (Proactive AI Recommendations) */}
      <section aria-label="Proactive Advisor Tasks">
        <AdvisorTasks />
      </section>

      {/* 5. SLIDE-OVER LIVE CHAT DRAWER */}
      <ChatDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        conversation={activeConversation}
      />

      {/* 6. FLOATING BOTTOM AI CO-PILOT BAR */}
      <CopilotBar
        initialPrompt={copilotQuery}
        onClearInitialPrompt={() => setCopilotQuery("")}
        onNavigateInbox={() => {
          if (conversations.length > 0) {
            handleReviewHandoff(conversations[0]);
          }
        }}
      />
    </div>
  );
}
