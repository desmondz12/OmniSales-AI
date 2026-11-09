import { NextResponse, type NextRequest } from "next/server";
import { processCustomerMessage } from "@/lib/ai/process-message-service";
import { dispatchOutboundMessage } from "@/lib/messaging/dispatcher";
import { checkRateLimit, safeEqual } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (120 requests/minute)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "tiktok-webhook";
    const rateLimit = checkRateLimit(`tiktok:${clientIp}`, 120, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    // 2. Secret Verification (optional header validation)
    const tiktokSecret = process.env.TIKTOK_WEBHOOK_SECRET;
    const incomingSecret =
      request.headers.get("x-tiktok-signature") ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (tiktokSecret && incomingSecret) {
      if (!safeEqual(incomingSecret, tiktokSecret)) {
        return NextResponse.json({ error: "Invalid TikTok signature" }, { status: 401 });
      }
    }

    const body = await request.json();

    const event = body.event || "direct_message.receive";
    const senderId = body.sender_id || body.entry?.[0]?.sender_id || "tt_user_unknown";
    const messageContent =
      body.message?.content ||
      body.entry?.[0]?.message?.text ||
      body.text ||
      "";

    // 3. In-process AI processing
    const aiResult = await processCustomerMessage({
      channel: "tiktok",
      messageText: messageContent,
      customerName: "Acheteur TikTok",
      customerHandle: `@${senderId}`,
      workspaceId: "ws-fotso-douala",
    });

    // 4. Live Outbound Message Dispatch: transmit AI reply back to TikTok direct message
    let outboundResult = null;
    if (aiResult.replyText && senderId) {
      try {
        outboundResult = await dispatchOutboundMessage({
          channel: "tiktok",
          recipient: senderId,
          text: aiResult.replyText,
          workspaceId: "ws-fotso-douala",
          senderType: "ai",
          senderName: "Nathalie (IA)",
          metadata: {
            inbound_message_text: messageContent,
            triage_tag: aiResult.triageTag,
            sentiment: aiResult.sentiment,
          },
        });
      } catch (dispatchErr) {
        console.error("TikTok Outbound Dispatch Error:", dispatchErr);
      }
    }

    return NextResponse.json({
      code: 0,
      message: "ok",
      event,
      channel: "tiktok",
      senderId,
      aiTriage: aiResult.triageTag,
      replyText: aiResult.replyText,
      outboundDispatched: Boolean(outboundResult?.delivered),
      outboundResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("TikTok webhook error:", error);
    return NextResponse.json(
      { code: 500, error: "Failed to process TikTok webhook", details: String(error) },
      { status: 500 }
    );
  }
}
