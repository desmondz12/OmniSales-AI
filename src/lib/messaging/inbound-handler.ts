import { createAdminClient } from "@/lib/supabase/admin";
import type { ChannelType } from "@/types/database";

interface InboundWebhookMessageParams {
  channel: ChannelType;
  senderId: string;
  senderName: string;
  senderHandle?: string;
  senderPhone?: string;
  text: string;
  workspaceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Resolves or creates customer and conversation rows in Supabase,
 * records the inbound customer message, and triggers Supabase Realtime broadcast.
 */
export async function persistInboundWebhookMessage(params: InboundWebhookMessageParams) {
  const {
    channel,
    senderId,
    senderName,
    senderHandle,
    senderPhone,
    text,
    workspaceId = "f7d05015-fecc-4602-816c-ad5bf96e144f",
    metadata = {},
  } = params;

  try {
    const supabase = createAdminClient();

    // 1. Find or create customer
    let customerId: string | null = null;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, name")
      .or(`handle.eq."${senderHandle || senderId}",phone.eq."${senderPhone || senderId}"`)
      .limit(1)
      .maybeSingle();

    if (existingCustomer?.id) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          workspace_id: workspaceId,
          name: senderName || "Client Sans Nom",
          phone: senderPhone || (senderId.startsWith("+") || /^\d+$/.test(senderId) ? senderId : null),
          channel_type: channel,
          handle: senderHandle || senderId,
          total_owed: 0,
          total_paid: 0,
          ai_memory: {
            facts: [`Client contacté via canal ${channel}`],
            preferences: { channel },
            objections: [],
            preferred_language: "fr",
          },
        })
        .select("id")
        .maybeSingle();

      if (newCustomer?.id) {
        customerId = newCustomer.id;
      }
    }

    if (!customerId) {
      return {
        success: false,
        customerId: null,
        conversationId: null,
        messageId: null,
      };
    }

    // 2. Find or create conversation
    let conversationId: string | null = null;

    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("customer_id", customerId)
      .order("last_message_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingConv?.id) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          workspace_id: workspaceId,
          customer_id: customerId,
          channel_type: channel,
          status: "ai_handling",
          triage_tag: "none",
          unread_count: 1,
          is_ai_active: true,
          last_message_at: new Date().toISOString(),
        })
        .select("id")
        .maybeSingle();

      if (newConv?.id) {
        conversationId = newConv.id;
      }
    }

    // 3. Persist inbound message into Supabase
    if (conversationId) {
      const { data: messageRow } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          workspace_id: workspaceId,
          sender_type: "customer",
          sender_name: senderName,
          content: text,
          channel_type: channel,
          metadata: {
            ...metadata,
            inbound_channel_sender: senderId,
            received_at: new Date().toISOString(),
          },
        })
        .select()
        .maybeSingle();

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      return {
        success: true,
        customerId,
        conversationId,
        messageId: messageRow?.id,
      };
    }
  } catch (err) {
    console.warn(`[persistInboundWebhookMessage] Database write notice:`, err);
  }

  return {
    success: false,
    customerId: null,
    conversationId: null,
    messageId: null,
  };
}
