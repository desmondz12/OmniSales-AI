import { NextResponse, type NextRequest } from "next/server";
import { processCustomerMessage } from "@/lib/ai/process-message-service";
import { dispatchOutboundMessage } from "@/lib/messaging/dispatcher";
import { checkRateLimit, verifyMetaSignature } from "@/lib/security";
import type { ChannelType } from "@/types/database";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken =
    process.env.META_VERIFY_TOKEN || "omnisales_meta_verify_token_2026";

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    { error: "Verification token mismatch" },
    { status: 403 }
  );
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (120 requests/minute per client IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "meta-webhook";
    const rateLimit = checkRateLimit(`meta:${clientIp}`, 120, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    // 2. Read raw payload for HMAC verification
    const rawBody = await request.text();

    // 3. Signature verification (X-Hub-Signature-256)
    const appSecret = process.env.META_APP_SECRET;
    const signature = request.headers.get("x-hub-signature-256");

    if (appSecret) {
      if (!signature || !verifyMetaSignature(rawBody, signature, appSecret)) {
        console.warn("Meta Webhook: Invalid or missing X-Hub-Signature-256");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const body = rawBody ? JSON.parse(rawBody) : {};

    // 4. Determine channel type
    const isWhatsApp =
      body.object === "whatsapp_business_account" ||
      Boolean(body.entry?.[0]?.changes?.[0]?.value?.messages);

    const isInstagram = body.object === "instagram";
    const isMessenger = body.object === "page";

    let channel: ChannelType = "whatsapp";
    let senderId = "";
    let senderName = "Client";
    let messageText = "";

    if (isWhatsApp) {
      channel = "whatsapp";
      const messageObj = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      const contactObj = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
      senderId = messageObj?.from || "+237 671 23 45 67";
      senderName = contactObj?.profile?.name || "Client WhatsApp";
      messageText = messageObj?.text?.body || messageObj?.caption || "";
    } else if (isInstagram) {
      channel = "instagram";
      const messaging = body.entry?.[0]?.messaging?.[0];
      senderId = messaging?.sender?.id || "@instagram_user";
      senderName = "Client Instagram";
      messageText = messaging?.message?.text || "";
    } else if (isMessenger) {
      channel = "messenger";
      const messaging = body.entry?.[0]?.messaging?.[0];
      senderId = messaging?.sender?.id || "fb_user_101";
      senderName = "Client Messenger";
      messageText = messaging?.message?.text || "";
    }

    // 5. In-process AI processing (Safe, high-performance, no deadlock)
    const aiResult = await processCustomerMessage({
      channel,
      messageText,
      customerName: senderName,
      customerHandle: senderId,
      customerPhone: senderId.startsWith("+") ? senderId : undefined,
      workspaceId: "ws-fotso-douala",
    });

    // 6. Live Outbound Message Dispatch: transmit AI reply back to the customer's phone/app
    let outboundResult = null;
    if (aiResult.replyText && senderId) {
      try {
        outboundResult = await dispatchOutboundMessage({
          channel,
          recipient: senderId,
          text: aiResult.replyText,
          workspaceId: "ws-fotso-douala",
          senderType: "ai",
          senderName: "Nathalie (IA)",
          metadata: {
            inbound_message_text: messageText,
            triage_tag: aiResult.triageTag,
            sentiment: aiResult.sentiment,
          },
        });
      } catch (dispatchErr) {
        console.error("Meta Outbound Dispatch Error:", dispatchErr);
      }
    }

    return NextResponse.json({
      success: true,
      channel,
      senderId,
      messageText,
      aiTriage: aiResult.triageTag,
      replyGenerated: Boolean(aiResult.replyText),
      replyText: aiResult.replyText,
      sentiment: aiResult.sentiment,
      outboundDispatched: Boolean(outboundResult?.delivered),
      outboundResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Meta webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process Meta webhook", details: String(error) },
      { status: 500 }
    );
  }
}
