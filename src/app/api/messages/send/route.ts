import { NextResponse, type NextRequest } from "next/server";
import { dispatchOutboundMessage } from "@/lib/messaging/dispatcher";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/security";
import type { ChannelType } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (60 requests/minute per client IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "messages-send-client";
    const rateLimit = checkRateLimit(`send-message:${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const {
      conversationId,
      recipient,
      text,
      channel,
      workspaceId = "f7d05015-fecc-4602-816c-ad5bf96e144f",
      senderName = "Jean-Luc (Gérant)",
      senderType = "human",
    } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    if (!recipient || !recipient.trim()) {
      return NextResponse.json(
        { error: "Recipient handle or phone number is required" },
        { status: 400 }
      );
    }

    const validChannels: ChannelType[] = [
      "whatsapp",
      "instagram",
      "messenger",
      "tiktok",
      "telegram",
    ];
    if (!validChannels.includes(channel)) {
      return NextResponse.json(
        { error: `Invalid channel '${channel}'. Must be one of ${validChannels.join(", ")}` },
        { status: 400 }
      );
    }

    // 2. Dispatch outbound message via live API sender
    const dispatchResult = await dispatchOutboundMessage({
      channel,
      recipient,
      text: text.trim(),
      conversationId,
      workspaceId,
      senderType,
      senderName,
      metadata: { sent_via_api: true },
    });

    let messageId = dispatchResult.messageId || `msg-${Date.now()}`;

    // 3. Persist to live Supabase database
    try {
      const supabaseAdmin = createAdminClient();
      const { data: dbMsg, error: dbErr } = await supabaseAdmin
        .from("messages")
        .insert({
          conversation_id: conversationId,
          workspace_id: workspaceId,
          sender_type: senderType as "customer" | "ai" | "human",
          sender_name: senderName,
          content: text.trim(),
          channel_type: channel,
          metadata: {
            delivered: dispatchResult.delivered,
            simulated: dispatchResult.simulated,
            latencyMs: dispatchResult.latencyMs,
            messageId: dispatchResult.messageId,
          },
        })
        .select()
        .single();

      if (dbMsg?.id) {
        messageId = dbMsg.id;
        // Bump conversation timestamp
        await supabaseAdmin
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      } else if (dbErr) {
        console.warn("Supabase messages insert note:", dbErr.message);
      }
    } catch (dbErr) {
      console.warn("Supabase persistence note:", dbErr);
    }

    return NextResponse.json({
      success: dispatchResult.success,
      dispatchResult,
      message: {
        id: messageId,
        conversation_id: conversationId,
        workspace_id: workspaceId,
        sender_type: senderType,
        sender_name: senderName,
        content: text.trim(),
        channel_type: channel,
        created_at: dispatchResult.timestamp,
        metadata: {
          delivered: dispatchResult.delivered,
          simulated: dispatchResult.simulated,
          latencyMs: dispatchResult.latencyMs,
        },
      },
    });
  } catch (error) {
    console.error("Outbound Message Send Error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch outbound message", details: String(error) },
      { status: 500 }
    );
  }
}
