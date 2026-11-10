import type { OutboundDispatchResult } from "./types";

/**
 * Send an outbound direct message via TikTok Business Messaging API.
 */
export async function sendTikTokMessage(
  recipient: string,
  text: string,
  customToken?: string
): Promise<OutboundDispatchResult> {
  const startTime = Date.now();
  const cleanSenderId = recipient.replace(/^@/, "").trim();
  const token = customToken || process.env.TIKTOK_ACCESS_TOKEN;

  // Simulation mode
  if (!token) {
    const simMessageId = `tt_msg_${Date.now()}`;
    console.log(
      `[TikTok Dispatcher (Simulated)] -> ${cleanSenderId}: "${text.slice(0, 80)}..."`
    );

    return {
      success: true,
      messageId: simMessageId,
      channel: "tiktok",
      recipient: cleanSenderId,
      delivered: true,
      simulated: true,
      providerResponse: {
        code: 0,
        message: "ok",
        data: { message_id: simMessageId, recipient: cleanSenderId },
      },
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  // Live TikTok API
  try {
    const url = "https://open.tiktokapis.com/v2/message/send/";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_id: cleanSenderId,
        message: { text },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok || data.code !== 0) {
      const errorMsg =
        data.message || `TikTok API error: HTTP ${res.status}`;
      console.error(`TikTok Dispatch Error [${res.status}]:`, data);

      return {
        success: false,
        messageId: "",
        channel: "tiktok",
        recipient: cleanSenderId,
        delivered: false,
        simulated: false,
        error: errorMsg,
        providerResponse: data,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const messageId = String(data.data?.message_id || `tt_msg_${Date.now()}`);

    return {
      success: true,
      messageId,
      channel: "tiktok",
      recipient: cleanSenderId,
      delivered: true,
      simulated: false,
      providerResponse: data,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("TikTok Dispatch Network Exception:", error);
    return {
      success: false,
      messageId: "",
      channel: "tiktok",
      recipient: cleanSenderId,
      delivered: false,
      simulated: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
