import { createClient } from "@/lib/supabase/server";
import { ChannelsClient } from "@/components/channels/channels-client";
import { DEMO_CHANNELS } from "@/lib/data/seed-data";
import type { Channel } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const supabase = await createClient();

  let channels: Channel[] = DEMO_CHANNELS;

  try {
    const { data: liveChannels } = await supabase
      .from("channels")
      .select("*")
      .order("created_at", { ascending: true });

    if (liveChannels && liveChannels.length > 0) {
      channels = liveChannels as unknown as Channel[];
    }
  } catch (error) {
    console.error("Using seed fallback for Channels:", error);
  }

  return <ChannelsClient initialChannels={channels} />;
}
