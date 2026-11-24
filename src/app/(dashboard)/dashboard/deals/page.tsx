import { createClient } from "@/lib/supabase/server";
import { DealsKanban } from "@/components/deals/deals-kanban";
import { DEMO_DEALS } from "@/lib/data/deal-seed-data";
import type { Deal } from "@/types/deals";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = await createClient();
  let deals: Deal[] = DEMO_DEALS;

  try {
    const { data: liveDeals } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (liveDeals && liveDeals.length > 0) {
      deals = liveDeals as unknown as Deal[];
    }
  } catch (error) {
    console.error("Using seed fallback for Deals:", error);
  }

  return <DealsKanban initialDeals={deals} />;
}
