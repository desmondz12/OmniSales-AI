import type { OutboundDispatchResult } from "./types";

/**
 * Format recipient phone number into E.164 without '+' or special characters.
 * Example: "+237 671 23 45 67" -> "237671234567"
 * Defaults to Cameroon country code 237 if local 9-digit number is provided.
 */
export function formatWhatsAppRecipient(raw: string): string {
  let cleaned = raw.replace(/\D/g, "");
  if (!cleaned) return "237671000000";

  // If starts with 00, strip leading 00
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }

  // If local 9-digit Cameroon number (e.g., 671234567 or 699876543)
  if (cleaned.length === 9 && (cleaned.startsWith("6") || cleaned.startsWith("2"))) {
    cleaned = `237${cleaned}`;
  }

  return cleaned;
}

/**
 * Send an outbound message via Meta WhatsApp Business Cloud API.
 */
export async function sendWhatsAppMessage(
  recipient: string,
  text: string
): Promise<OutboundDispatchResult> {
  const startTime = Date.now();
  const formattedTo = formatWhatsAppRecipient(recipient);

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN ||
    process.env.META_SYSTEM_USER_TOKEN ||
    process.env.META_ACCESS_TOKEN;

  // If credentials are not configured, perform high-fidelity simulation
  if (!phoneNumberId || !accessToken) {
    const simMessageId = `wamid.HBgM${Date.now()}SIMULATED`;
    console.log(
      `[WhatsApp Dispatcher (Simulated)] -> ${formattedTo}: "${text.slice(0, 80)}..."`
    );

    return {
      success: true,
      messageId: simMessageId,
      channel: "whatsapp",
      recipient: formattedTo,
      delivered: true,
      simulated: true,
      providerResponse: {
        messaging_product: "whatsapp",
        contacts: [{ input: formattedTo, wa_id: formattedTo }],
        messages: [{ id: simMessageId, message_status: "accepted" }],
      },
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  // Live Meta WhatsApp Cloud API call
  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedTo,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await res.json();

    if (!res.ok) {
      const errorMsg =
        data.error?.message || `WhatsApp API error: HTTP ${res.status}`;
      console.error(`WhatsApp Dispatch Error [${res.status}]:`, data.error);

      return {
        success: false,
        messageId: "",
        channel: "whatsapp",
        recipient: formattedTo,
        delivered: false,
        simulated: false,
        error: errorMsg,
        providerResponse: data,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }

    const messageId =
      data.messages?.[0]?.id || `wamid.HBgM${Date.now()}OK`;

    return {
      success: true,
      messageId,
      channel: "whatsapp",
      recipient: formattedTo,
      delivered: true,
      simulated: false,
      providerResponse: data,
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("WhatsApp Dispatch Network Exception:", error);
    return {
      success: false,
      messageId: "",
      channel: "whatsapp",
      recipient: formattedTo,
      delivered: false,
      simulated: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}
