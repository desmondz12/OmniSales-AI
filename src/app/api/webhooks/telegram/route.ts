import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    const message = update.message || update.edited_message || update.channel_post;
    if (!message) {
      return NextResponse.json({ ok: true, note: "No message payload found in update" });
    }

    const chatId = message.chat?.id;
    const senderName =
      [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") ||
      message.from?.username ||
      "Telegram User";
    const senderHandle = message.from?.username ? `@${message.from.username}` : `tg_${chatId}`;
    const messageText = message.text || message.caption || "";

    // Forward to unified AI processing route
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const aiProcessUrl = `${protocol}://${host}/api/ai/process-message`;

    let aiResult = null;
    try {
      const aiResponse = await fetch(aiProcessUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "telegram",
          messageText,
          customerName: senderName,
          customerHandle: senderHandle,
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
      ok: true,
      channel: "telegram",
      chatId,
      senderName,
      senderHandle,
      aiTriage: aiResult?.triageTag || "processed",
      replyText: aiResult?.replyText,
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
