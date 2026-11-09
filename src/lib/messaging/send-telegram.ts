import type { OutboundDispatchResult } from "./types";

/**
 * Format recipient for Telegram.
 * Strips leading '@' if a username was passed, or keeps numeric chat ID.
 */
export function formatTelegramRecipient(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("tg_")) {
    cleaned = cleaned.slice(3);
  }
  return cleaned;
}

/**
 * Send an outbound message via Telegram Bot API.
 */
export async function sendTelegramMessage(
  recipient: string,
  text: string
): Promise<OutboundDispatchResult> {
  const startTime = Date.now();
  const formattedChatId = formatTelegramRecipient(recipient);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // If bot token is not set, simulate delivery
  if (!botToken) {
    const simMessageId = `tg_msg_${Date.now()}`;
    console.log(
      `[Telegram Dispatcher (Simulated)] -> Chat ${formattedChatId}: "${text.slice(0, 80)}..."`
    );

    return {
      success: true,
      messageId: simMessageId,
      channel: "telegram",
      recipient: formattedChatId,
      delivered: true,
      simulated: true,
      providerResponse: {
        ok: true,
        result: {
          message_id: Date.now(),
          chat: { id: formattedChatId, type: "private" },
          text,
          date: Math.floor(Date.now() / 1000),
        },
      },
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  // Live Telegram Bot API call
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: formattedChatId,
        text,
        parse_mode: "HTML",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok || !data.ok) {
      const errorMsg =
        data.description || `Telegram API error: HTTP ${res.status}`;
      console.error(`Telegram Dispatch Error [${res.status}]:`, data);

      return {
        success: false,
        messageId: "",
        channel: "telegram",
        recipient: formattedChatId,
        delivered: false,
        simulated: false,
        error: errorMsg,
        providerResponse: data,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const messageId = String(data.result?.message_id || Date.now());

    return {
      success: true,
      messageId,
      channel: "telegram",
      recipient: formattedChatId,
      delivered: true,
      simulated: false,
      providerResponse: data,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Telegram Dispatch Network Exception:", error);
    return {
      success: false,
      messageId: "",
      channel: "telegram",
      recipient: formattedChatId,
      delivered: false,
      simulated: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
