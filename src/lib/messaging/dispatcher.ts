import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_WORKSPACE_ID } from "@/lib/constants";
import { sendWhatsAppMessage } from "./send-whatsapp";
import { sendTelegramMessage } from "./send-telegram";
import { sendMetaSocialMessage } from "./send-meta";
import { sendTikTokMessage } from "./send-tiktok";
import type { OutboundDispatchInput, OutboundDispatchResult } from "./types";
import type { ChannelType } from "@/types/database";

/**
 * Universal Outbound Messaging Dispatcher for OmniSales AI.
 * Routes message to the appropriate channel API (WhatsApp Cloud, Telegram Bot, Meta Graph, TikTok)
 * and safely persists the sent message to Supabase.
 */
export async function dispatchOutboundMessage(
  input: OutboundDispatchInput
): Promise<OutboundDispatchResult> {
  const {
    channel,
    recipient,
    text,
    conversationId,
    workspaceId = DEFAULT_WORKSPACE_ID,
    senderType = "human",
    senderName = senderType === "ai" ? "Nathalie (IA)" : "Jean-Luc (Gérant)",
    metadata = {},
  } = input;

  if (!text || !text.trim()) {
    return {
      success: false,
      messageId: "",
      channel,
      recipient,
      delivered: false,
      simulated: false,
      error: "Message text cannot be empty",
      latencyMs: 0,
      timestamp: new Date().toISOString(),
    };
  }

  // 1. Check for linked channel OAuth credentials in database if available
  let channelToken: string | undefined;
  try {
    const supabase = createAdminClient();
    const { data: channelRow } = await supabase
      .from("channels")
      .select("credentials")
      .eq("type", channel)
      .eq("status", "connected")
      .maybeSingle();

    if (channelRow?.credentials && typeof channelRow.credentials === "object") {
      const creds = channelRow.credentials as Record<string, unknown>;
      if (typeof creds.access_token === "string" && creds.access_token) {
        channelToken = creds.access_token;
      }
    }
  } catch {
    // Non-fatal if Supabase offline or credentials absent
  }

  let result: OutboundDispatchResult;

  // 2. Channel-specific live dispatch
  switch (channel) {
    case "whatsapp":
      result = await sendWhatsAppMessage(recipient, text);
      break;

    case "telegram":
      result = await sendTelegramMessage(recipient, text);
      break;

    case "instagram":
      result = await sendMetaSocialMessage("instagram", recipient, text, channelToken);
      break;

    case "messenger":
      result = await sendMetaSocialMessage("messenger", recipient, text, channelToken);
      break;

    case "tiktok":
      result = await sendTikTokMessage(recipient, text, channelToken);
      break;

    default: {
      const exhaustiveCheck: never = channel;
      result = {
        success: false,
        messageId: "",
        channel: channel as ChannelType,
        recipient,
        delivered: false,
        simulated: false,
        error: `Unsupported channel type: ${String(exhaustiveCheck)}`,
        latencyMs: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 2. Persist to Supabase if conversationId and workspaceId are provided
  if (conversationId && result.success) {
    try {
      const supabase = createAdminClient();
      const messageRow = {
        conversation_id: conversationId,
        workspace_id: workspaceId,
        sender_type: senderType,
        sender_name: senderName,
        content: text,
        channel_type: channel,
        metadata: {
          ...metadata,
          outbound_dispatch: {
            messageId: result.messageId,
            delivered: result.delivered,
            simulated: result.simulated,
            latencyMs: result.latencyMs,
            dispatched_at: result.timestamp,
          },
        },
      };

      await supabase.from("messages").insert(messageRow);

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    } catch (dbErr) {
      // Non-fatal if Supabase table is unreachable during local testing
      console.warn("Could not persist outbound message to database:", dbErr);
    }
  }

  return result;
}
