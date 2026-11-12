import { NextResponse, type NextRequest } from "next/server";
import { processCustomerMessage } from "@/lib/ai/process-message-service";
import { dispatchOutboundMessage } from "@/lib/messaging/dispatcher";
import { persistInboundWebhookMessage } from "@/lib/messaging/inbound-handler";
import { checkRateLimit, verifyTelegramSecret } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (120 requests/minute)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "telegram-webhook";
    const rateLimit = checkRateLimit(`telegram:${clientIp}`, 120, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    // 2. Secret Token Verification (X-Telegram-Bot-Api-Secret-Token)
    const telegramBotSecret = process.env.TELEGRAM_BOT_SECRET;
    const incomingSecret = request.headers.get(
      "x-telegram-bot-api-secret-token"
    );

    if (telegramBotSecret) {
      if (!verifyTelegramSecret(incomingSecret, telegramBotSecret)) {
        console.warn("Telegram Webhook: Invalid secret token");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const update = await request.json();

    const message = update.message || update.edited_message || update.channel_post;
    if (!message) {
      return NextResponse.json({ ok: true, note: "No message payload found in update" });
    }

    const chatId = message.chat?.id;
    const senderName =
      [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") ||
      message.from?.username ||
      "Client Telegram";
    const senderHandle = message.from?.username ? `@${message.from.username}` : `tg_${chatId}`;
    const messageText = message.text || message.caption || "";

    // 3. Persist inbound message to Supabase & Realtime WebSocket
    const inboundRecord = await persistInboundWebhookMessage({
      channel: "telegram",
      senderId: String(chatId),
      senderName,
      senderHandle,
      text: messageText,
      workspaceId: "f7d05015-fecc-4602-816c-ad5bf96e144f",
    });

    // 4. In-process AI processing
    const aiResult = await processCustomerMessage({
      channel: "telegram",
      messageText,
      customerName: senderName,
      customerHandle: senderHandle,
      workspaceId: "f7d05015-fecc-4602-816c-ad5bf96e144f",
    });

    // 5. Live Outbound Message Dispatch: transmit AI reply back to Telegram chat
    let outboundResult = null;
    if (aiResult.replyText && chatId) {
      try {
        outboundResult = await dispatchOutboundMessage({
          channel: "telegram",
          recipient: String(chatId),
          text: aiResult.replyText,
          conversationId: inboundRecord.conversationId || undefined,
          workspaceId: "f7d05015-fecc-4602-816c-ad5bf96e144f",
          senderType: "ai",
          senderName: "Nathalie (IA)",
          metadata: {
            inbound_message_text: messageText,
            triage_tag: aiResult.triageTag,
            sentiment: aiResult.sentiment,
          },
        });
      } catch (dispatchErr) {
        console.error("Telegram Outbound Dispatch Error:", dispatchErr);
      }
    }

    return NextResponse.json({
      ok: true,
      channel: "telegram",
      chatId,
      senderName,
      senderHandle,
      aiTriage: aiResult.triageTag,
      replyText: aiResult.replyText,
      outboundDispatched: Boolean(outboundResult?.delivered),
      outboundResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process Telegram webhook", details: String(error) },
      { status: 500 }
    );
  }
}
