import { NextResponse, type NextRequest } from "next/server";
import { processCustomerMessage } from "@/lib/ai/process-message-service";
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

    // 3. In-process AI processing
    const aiResult = await processCustomerMessage({
      channel: "telegram",
      messageText,
      customerName: senderName,
      customerHandle: senderHandle,
      workspaceId: "ws-fotso-douala",
    });

    return NextResponse.json({
      ok: true,
      channel: "telegram",
      chatId,
      senderName,
      senderHandle,
      aiTriage: aiResult.triageTag,
      replyText: aiResult.replyText,
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
