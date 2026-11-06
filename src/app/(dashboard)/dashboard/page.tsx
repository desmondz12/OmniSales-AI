import { createClient } from "@/lib/supabase/server";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import {
  DEMO_CONVERSATIONS,
  DEMO_CUSTOMERS,
  DEMO_INVOICES,
} from "@/lib/data/seed-data";
import type { Conversation, Customer, Invoice } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .single();

  const rawName = profile?.full_name || user?.email?.split("@")[0] || "Musa";
  const ownerFirstName = rawName.split(" ")[0];

  // Try to fetch live conversations from Supabase
  let conversations: Conversation[] = DEMO_CONVERSATIONS;
  let customers: Customer[] = DEMO_CUSTOMERS;
  let invoices: Invoice[] = DEMO_INVOICES;

  try {
    const { data: liveCustomers } = await supabase
      .from("customers")
      .select("*")
      .limit(20);

    if (liveCustomers && liveCustomers.length > 0) {
      customers = liveCustomers as unknown as Customer[];
    }

    const { data: liveConversations } = await supabase
      .from("conversations")
      .select("*, customers(*)")
      .order("last_message_at", { ascending: false })
      .limit(20);

    if (liveConversations && liveConversations.length > 0) {
      conversations = liveConversations as unknown as Conversation[];
    }

    const { data: liveInvoices } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (liveInvoices && liveInvoices.length > 0) {
      invoices = liveInvoices as unknown as Invoice[];
    }
  } catch (error) {
    // Graceful fallback to demo data
    console.error("Using seed data fallback for dashboard view:", error);
  }

  return (
    <DashboardView
      ownerName={ownerFirstName}
      initialConversations={conversations}
      initialCustomers={customers}
      initialInvoices={invoices}
    />
  );
}
