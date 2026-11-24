import { createClient } from "@/lib/supabase/server";
import { ChannelsClient } from "@/components/channels/channels-client";
import type { Channel } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const supabase = await createClient();

  let channels: Channel[] = [];

  try {
    const { data: liveChannels } = await supabase
      .from("channels")
      .select("*")
      .order("created_at", { ascending: true });

    if (liveChannels) {
      channels = liveChannels as unknown as Channel[];
    }
  } catch (error) {
    console.error("Failed to fetch live channels:", error);
  }

  return <ChannelsClient initialChannels={channels} />;
}
