import { createClient } from "@/lib/supabase/server";
import { InboxShell } from "@/components/inbox/inbox-shell";
import {
  DEMO_CONVERSATIONS,
  DEMO_CUSTOMERS,
  DEMO_INVOICES,
  DEMO_MESSAGES,
} from "@/lib/data/seed-data";
import type { Conversation, Customer, Invoice, Message } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const supabase = await createClient();

  let conversations: Conversation[] = DEMO_CONVERSATIONS;
  let customers: Customer[] = DEMO_CUSTOMERS;
  let messages: Message[] = DEMO_MESSAGES;
  let invoices: Invoice[] = DEMO_INVOICES;

  try {
    const { data: liveCustomers } = await supabase
      .from("customers")
      .select("*")
      .limit(50);

    if (liveCustomers && liveCustomers.length > 0) {
      customers = liveCustomers as unknown as Customer[];
    }

    const { data: liveConversations } = await supabase
      .from("conversations")
      .select("*, customers(*)")
      .order("last_message_at", { ascending: false })
      .limit(50);

    if (liveConversations && liveConversations.length > 0) {
      conversations = liveConversations as unknown as Conversation[];
    }

    const { data: liveMessages } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);

    if (liveMessages && liveMessages.length > 0) {
      messages = liveMessages as unknown as Message[];
    }

    const { data: liveInvoices } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (liveInvoices && liveInvoices.length > 0) {
      invoices = liveInvoices as unknown as Invoice[];
    }
  } catch (error) {
    console.error("Using seed fallback for Inbox:", error);
  }

  return (
    <div className="h-full w-full">
      <InboxShell
        initialConversations={conversations}
        initialCustomers={customers}
        initialMessages={messages}
        initialInvoices={invoices}
      />
    </div>
  );
}
