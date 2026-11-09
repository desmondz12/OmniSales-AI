import { createClient } from "@/lib/supabase/server";
import { CollectionsLedger } from "@/components/collections/collections-ledger";
import { DEMO_INVOICES } from "@/lib/data/seed-data";
import type { Invoice } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const supabase = await createClient();

  let invoices: Invoice[] = DEMO_INVOICES;

  try {
    const { data: liveInvoices } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .order("created_at", { ascending: false });

    if (liveInvoices && liveInvoices.length > 0) {
      invoices = liveInvoices as unknown as Invoice[];
    }
  } catch (error) {
    console.error("Using seed data fallback for Collections:", error);
  }

  return <CollectionsLedger initialInvoices={invoices} />;
}
