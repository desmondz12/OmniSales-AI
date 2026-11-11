import { createAdminClient } from "@/lib/supabase/admin";
import type { ChannelType, MessageSender, Json } from "@/types/database";

interface PersistMessageParams {
  conversationId: string;
  workspaceId?: string;
  senderType: MessageSender;
  senderName: string;
  content: string;
  channelType: ChannelType;
  metadata?: Record<string, Json>;
}

/**
 * Persists an inbound or outbound message into live Supabase PostgreSQL.
 * Triggers Supabase Realtime WebSocket broadcasts to all connected clients.
 */
export async function persistMessageToSupabase(params: PersistMessageParams) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: params.conversationId,
        workspace_id: params.workspaceId || "f7d05015-fecc-4602-816c-ad5bf96e144f",
        sender_type: params.senderType,
        sender_name: params.senderName,
        content: params.content,
        channel_type: params.channelType,
        metadata: params.metadata || {},
      })
      .select()
      .single();

    if (data?.id) {
      // Bump conversation last_message_at timestamp
      await supabase
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
        })
        .eq("id", params.conversationId);

      return data;
    } else if (error) {
      console.warn("Supabase messages insert note:", error.message);
    }
  } catch (err) {
    console.warn("Supabase persistence note:", err);
  }
  return null;
}
