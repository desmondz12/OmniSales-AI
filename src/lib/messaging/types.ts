import type { ChannelType, MessageSender } from "@/types/database";

export type { ChannelType, MessageSender };

export interface OutboundDispatchInput {
  channel: ChannelType;
  recipient: string; // Phone number for WhatsApp, Telegram chatId, IG recipient id, etc.
  text: string;
  conversationId?: string;
  workspaceId?: string;
  senderType?: MessageSender;
  senderName?: string;
  metadata?: Record<string, unknown>;
}

export interface OutboundDispatchResult {
  success: boolean;
  messageId: string;
  channel: ChannelType;
  recipient: string;
  delivered: boolean;
  simulated: boolean;
  providerResponse?: unknown;
  error?: string;
  latencyMs: number;
  timestamp: string;
}
