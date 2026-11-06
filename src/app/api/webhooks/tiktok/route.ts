import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = body.event || "direct_message.receive";
    const senderId = body.sender_id || body.entry?.[0]?.sender_id || "tt_user_unknown";
    const messageContent =
      body.message?.content ||
      body.entry?.[0]?.message?.text ||
      body.text ||
      "";

    // Call unified AI processing pipeline
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const aiProcessUrl = `${protocol}://${host}/api/ai/process-message`;

    let aiResult = null;
    try {
      const aiResponse = await fetch(aiProcessUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "tiktok",
          messageText: messageContent,
          customerName: "TikTok Buyer",
          customerHandle: `@${senderId}`,
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
      code: 0,
      message: "ok",
      event,
      channel: "tiktok",
      senderId,
      aiTriage: aiResult?.triageTag || "processed",
      replyText: aiResult?.replyText,
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
