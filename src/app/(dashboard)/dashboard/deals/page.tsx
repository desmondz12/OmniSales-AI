import { DealsKanban } from "@/components/deals/deals-kanban";
import { DEMO_DEALS } from "@/lib/data/deal-seed-data";

export const dynamic = "force-dynamic";

export default function DealsPage() {
  return <DealsKanban initialDeals={DEMO_DEALS} />;
}
