import type { ChannelType, OutboundDispatchResult } from "./types";

/**
 * Send an outbound message via Meta Send API for Instagram or Messenger.
 */
export async function sendMetaSocialMessage(
  channel: "instagram" | "messenger",
  recipientId: string,
  text: string,
  customToken?: string
): Promise<OutboundDispatchResult> {
  const startTime = Date.now();
  const cleanRecipientId = recipientId.replace(/^@/, "").trim();

  const token =
    customToken ||
    (channel === "instagram"
      ? process.env.INSTAGRAM_ACCESS_TOKEN ||
        process.env.META_PAGE_ACCESS_TOKEN ||
        process.env.META_SYSTEM_USER_TOKEN
      : process.env.MESSENGER_ACCESS_TOKEN ||
        process.env.META_PAGE_ACCESS_TOKEN ||
        process.env.META_SYSTEM_USER_TOKEN);

  // Simulation mode when token is absent
  if (!token) {
    const simMessageId = `mid.${channel}.${Date.now()}`;
    console.log(
      `[${channel.toUpperCase()} Dispatcher (Simulated)] -> ${cleanRecipientId}: "${text.slice(0, 80)}..."`
    );

    return {
      success: true,
      messageId: simMessageId,
      channel,
      recipient: cleanRecipientId,
      delivered: true,
      simulated: true,
      providerResponse: {
        recipient_id: cleanRecipientId,
        message_id: simMessageId,
      },
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  // Live Meta Graph API Call
  try {
    const url = "https://graph.facebook.com/v21.0/me/messages";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: cleanRecipientId },
        message: { text },
        messaging_type: "RESPONSE",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok) {
      const errorMsg =
        data.error?.message || `${channel} API error: HTTP ${res.status}`;
      console.error(`${channel} Dispatch Error [${res.status}]:`, data.error);

      return {
        success: false,
        messageId: "",
        channel,
        recipient: cleanRecipientId,
        delivered: false,
        simulated: false,
        error: errorMsg,
        providerResponse: data,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const messageId = String(data.message_id || `mid.${channel}.${Date.now()}`);

    return {
      success: true,
      messageId,
      channel,
      recipient: cleanRecipientId,
      delivered: true,
      simulated: false,
      providerResponse: data,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`${channel} Dispatch Network Exception:`, error);
    return {
      success: false,
      messageId: "",
      channel,
      recipient: cleanRecipientId,
      delivered: false,
      simulated: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
