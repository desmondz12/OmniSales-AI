import { NextResponse, type NextRequest } from "next/server";

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

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp webhook
    const isWhatsApp =
      body.object === "whatsapp_business_account" ||
      Boolean(body.entry?.[0]?.changes?.[0]?.value?.messages);

    // Check if it's an Instagram or Messenger webhook
    const isInstagram = body.object === "instagram";
    const isMessenger = body.object === "page";

    let channel = "whatsapp";
    let senderId = "";
    let senderName = "Customer";
    let messageText = "";

    if (isWhatsApp) {
      channel = "whatsapp";
      const messageObj = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
      const contactObj = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
      senderId = messageObj?.from || "+237 671 23 45 67";
      senderName = contactObj?.profile?.name || "WhatsApp Client";
      messageText = messageObj?.text?.body || messageObj?.caption || "";
    } else if (isInstagram) {
      channel = "instagram";
      const messaging = body.entry?.[0]?.messaging?.[0];
      senderId = messaging?.sender?.id || "@instagram_user";
      senderName = "Instagram User";
      messageText = messaging?.message?.text || "";
    } else if (isMessenger) {
      channel = "messenger";
      const messaging = body.entry?.[0]?.messaging?.[0];
      senderId = messaging?.sender?.id || "fb_user_101";
      senderName = "Messenger Client";
      messageText = messaging?.message?.text || "";
    }

    // Call unified AI process message route
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const aiProcessUrl = `${protocol}://${host}/api/ai/process-message`;

    let aiResult = null;
    try {
      const aiResponse = await fetch(aiProcessUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          messageText,
          customerName: senderName,
          customerHandle: senderId,
          customerPhone: senderId.startsWith("+") ? senderId : undefined,
          workspaceId: "ws-fotso-douala",
        }),
      });
      if (aiResponse.ok) {
        aiResult = await aiResponse.json();
      }
    } catch (err) {
      console.warn("AI pipeline call skipped or local fallback:", err);
    }

    return NextResponse.json({
      success: true,
      channel,
      senderId,
      messageText,
      aiTriage: aiResult?.triageTag || "processed",
      replyGenerated: Boolean(aiResult?.replyText),
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
