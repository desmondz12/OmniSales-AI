import type { ChannelType } from "@/types/database";

export interface AdminTenant {
  id: string;
  name: string;
  city: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  connectedChannels: ChannelType[];
  messagesToday: number;
  messagesThisMonth: number;
  tokenUsagePercent: number;
  plan: "Starter" | "Pro" | "Enterprise";
  mrrFCFA: number;
  status: "active" | "trial" | "suspended";
  joinedDate: string;
  lastActive: string;
  aiAutoReplyRate: number; // e.g. 96.5%
}

export interface AdminSystemHealth {
  service: string;
  provider: string;
  category: "messaging" | "ai" | "payments" | "infra";
  status: "operational" | "degraded" | "outage";
  latencyMs: number;
  uptime90d: string;
  lastIncident: string;
}

export interface AdminGlobalLog {
  id: string;
  timestamp: string;
  tenantName: string;
  tenantId: string;
  category: "webhook" | "ai_inference" | "channel_auth" | "payment" | "security";
  channel?: ChannelType;
  severity: "info" | "warning" | "error" | "success";
  event: string;
  message: string;
  latencyMs: number;
  payload: Record<string, unknown>;
}

export const ADMIN_TENANTS: AdminTenant[] = [
  {
    id: "ws-fotso-douala",
    name: "Fotso & Sons Commerce Douala",
    city: "Douala (Akwa)",
    ownerName: "Jean-Pierre Fotso",
    ownerEmail: "fotso@omnisales.ai",
    ownerPhone: "+237 671 23 45 67",
    connectedChannels: ["whatsapp", "instagram", "messenger", "tiktok", "telegram"],
    messagesToday: 482,
    messagesThisMonth: 14200,
    tokenUsagePercent: 68,
    plan: "Pro",
    mrrFCFA: 85000,
    status: "active",
    joinedDate: "2026-08-14",
    lastActive: "Just now",
    aiAutoReplyRate: 97.4,
  },
  {
    id: "ws-bastos-yaounde",
    name: "Bastos Luxury Boutique",
    city: "Yaoundé (Bastos)",
    ownerName: "Carine Mbianda",
    ownerEmail: "carine@bastos-luxury.cm",
    ownerPhone: "+237 699 12 34 56",
    connectedChannels: ["instagram", "whatsapp", "tiktok", "messenger"],
    messagesToday: 320,
    messagesThisMonth: 11400,
    tokenUsagePercent: 54,
    plan: "Pro",
    mrrFCFA: 85000,
    status: "active",
    joinedDate: "2026-09-02",
    lastActive: "4m ago",
    aiAutoReplyRate: 94.2,
  },
  {
    id: "ws-omniauto-bonaberi",
    name: "OmniAuto Pièces Bonabéri",
    city: "Douala (Bonabéri)",
    ownerName: "Paul Ngassa",
    ownerEmail: "contact@omniauto.cm",
    ownerPhone: "+237 677 88 99 00",
    connectedChannels: ["whatsapp", "telegram", "messenger", "instagram", "tiktok"],
    messagesToday: 890,
    messagesThisMonth: 28600,
    tokenUsagePercent: 88,
    plan: "Enterprise",
    mrrFCFA: 175000,
    status: "active",
    joinedDate: "2026-06-18",
    lastActive: "1m ago",
    aiAutoReplyRate: 98.9,
  },
  {
    id: "ws-limbe-beachwear",
    name: "Limbe Beach & Tourism Hub",
    city: "Limbe (Down Beach)",
    ownerName: "Brenda Ashu",
    ownerEmail: "brenda@limbe-hub.cm",
    ownerPhone: "+237 674 55 66 77",
    connectedChannels: ["instagram", "whatsapp", "tiktok"],
    messagesToday: 215,
    messagesThisMonth: 9800,
    tokenUsagePercent: 42,
    plan: "Pro",
    mrrFCFA: 85000,
    status: "active",
    joinedDate: "2026-09-20",
    lastActive: "18m ago",
    aiAutoReplyRate: 91.8,
  },
  {
    id: "ws-kribi-seafood",
    name: "Kribi Seafood Logistics",
    city: "Kribi (Port)",
    ownerName: "Samuel Eto",
    ownerEmail: "samuel@kribi-express.cm",
    ownerPhone: "+237 698 22 33 44",
    connectedChannels: ["whatsapp", "telegram"],
    messagesToday: 140,
    messagesThisMonth: 6200,
    tokenUsagePercent: 35,
    plan: "Starter",
    mrrFCFA: 45000,
    status: "active",
    joinedDate: "2026-10-01",
    lastActive: "35m ago",
    aiAutoReplyRate: 96.0,
  },
  {
    id: "ws-sawa-agro",
    name: "Sawa Agro & Spices Bafoussam",
    city: "Bafoussam",
    ownerName: "Michel Tchinda",
    ownerEmail: "michel@sawa-agro.cm",
    ownerPhone: "+237 673 44 55 66",
    connectedChannels: ["whatsapp", "messenger"],
    messagesToday: 85,
    messagesThisMonth: 4100,
    tokenUsagePercent: 28,
    plan: "Starter",
    mrrFCFA: 45000,
    status: "trial",
    joinedDate: "2026-10-28",
    lastActive: "2h ago",
    aiAutoReplyRate: 89.4,
  },
  {
    id: "ws-yaounde-tech",
    name: "Yaoundé Tech Gadgets",
    city: "Yaoundé (Mokolo)",
    ownerName: "Patrick Zambo",
    ownerEmail: "zambo@yaounde-tech.cm",
    ownerPhone: "+237 691 66 77 88",
    connectedChannels: ["whatsapp", "instagram", "tiktok"],
    messagesToday: 340,
    messagesThisMonth: 12100,
    tokenUsagePercent: 59,
    plan: "Pro",
    mrrFCFA: 85000,
    status: "active",
    joinedDate: "2026-07-15",
    lastActive: "8m ago",
    aiAutoReplyRate: 95.7,
  },
  {
    id: "ws-garoua-textile",
    name: "Garoua Cotton Crafts",
    city: "Garoua",
    ownerName: "Ahmadou Bello",
    ownerEmail: "ahmadou@garoua-crafts.cm",
    ownerPhone: "+237 670 99 88 11",
    connectedChannels: ["whatsapp", "telegram"],
    messagesToday: 0,
    messagesThisMonth: 3400,
    tokenUsagePercent: 19,
    plan: "Starter",
    mrrFCFA: 45000,
    status: "suspended",
    joinedDate: "2026-05-10",
    lastActive: "3d ago",
    aiAutoReplyRate: 88.0,
  },
];

export const ADMIN_SYSTEM_HEALTH: AdminSystemHealth[] = [
  {
    service: "Meta Cloud API (WhatsApp)",
    provider: "Meta Graph API v21.0",
    category: "messaging",
    status: "operational",
    latencyMs: 94,
    uptime90d: "99.99%",
    lastIncident: "None in past 45 days",
  },
  {
    service: "Instagram Direct & Messenger",
    provider: "Meta Graph API v21.0",
    category: "messaging",
    status: "operational",
    latencyMs: 118,
    uptime90d: "99.95%",
    lastIncident: "Token refresh lag 12d ago (resolved)",
  },
  {
    service: "TikTok Business Messaging API",
    provider: "TikTok For Business",
    category: "messaging",
    status: "operational",
    latencyMs: 142,
    uptime90d: "99.92%",
    lastIncident: "Minor rate throttle 18d ago",
  },
  {
    service: "Telegram Bot Gateway",
    provider: "Telegram Bot API (SSL Webhook)",
    category: "messaging",
    status: "operational",
    latencyMs: 42,
    uptime90d: "100.0%",
    lastIncident: "No incidents recorded",
  },
  {
    service: "Gemini 2.5 Flash Sales Engine",
    provider: "Google Cloud / Gemini API",
    category: "ai",
    status: "operational",
    latencyMs: 245,
    uptime90d: "99.98%",
    lastIncident: "Quota spike handled smoothly",
  },
  {
    service: "Cameroon MoMo & OM Webhooks",
    provider: "MTN Cameroon & Orange Cameroun",
    category: "payments",
    status: "operational",
    latencyMs: 88,
    uptime90d: "99.91%",
    lastIncident: "Scheduled maintenance by telco 5d ago",
  },
];

export const ADMIN_GLOBAL_LOGS: AdminGlobalLog[] = [
  {
    id: "log-adm-101",
    timestamp: "2026-11-06T09:41:12Z",
    tenantName: "Fotso & Sons Commerce Douala",
    tenantId: "ws-fotso-douala",
    category: "payment",
    channel: "whatsapp",
    severity: "success",
    event: "momo_payment_confirmed",
    message: "Verified MTN MoMo inbound transaction (550 000 FCFA) from Jean-Pierre Fotso. Auto-receipt emitted.",
    latencyMs: 112,
    payload: {
      provider: "MTN MoMo Cameroun",
      tx_id: "CM-MOMO-8829104",
      amount: 550000,
      currency: "XAF",
      status: "SUCCESS",
    },
  },
  {
    id: "log-adm-102",
    timestamp: "2026-11-06T09:39:45Z",
    tenantName: "Bastos Luxury Boutique",
    tenantId: "ws-bastos-yaounde",
    category: "ai_inference",
    channel: "instagram",
    severity: "info",
    event: "gemini_triage_completed",
    message: "Gemini 2.5 Flash identified purchase intent for Gucci leather bag. Auto-quoted 280 000 FCFA.",
    latencyMs: 238,
    payload: {
      model: "gemini-2.5-flash",
      tokens_used: 412,
      triage: "ready_to_pay",
      confidence: 0.98,
    },
  },
  {
    id: "log-adm-103",
    timestamp: "2026-11-06T09:32:04Z",
    tenantName: "OmniAuto Pièces Bonabéri",
    tenantId: "ws-omniauto-bonaberi",
    category: "webhook",
    channel: "tiktok",
    severity: "info",
    event: "tiktok_dm_received",
    message: "Inbound DM regarding Toyota Land Cruiser brake pads. Auto-replied with price catalogue.",
    latencyMs: 148,
    payload: {
      sender_id: "tt_user_9921",
      city: "Douala",
      part_sku: "TOY-BRK-LC300",
    },
  },
  {
    id: "log-adm-104",
    timestamp: "2026-11-06T09:20:18Z",
    tenantName: "Garoua Cotton Crafts",
    tenantId: "ws-garoua-textile",
    category: "channel_auth",
    channel: "instagram",
    severity: "warning",
    event: "token_expiration_warning",
    message: "Client Instagram Graph token expires in 48 hours. Auto-renewal webhook dispatched.",
    latencyMs: 82,
    payload: {
      app_id: "meta_graph_cm_09",
      expires_in_hours: 48,
      action_needed: "re_auth",
    },
  },
  {
    id: "log-adm-105",
    timestamp: "2026-11-06T09:05:52Z",
    tenantName: "Fotso & Sons Commerce Douala",
    tenantId: "ws-fotso-douala",
    category: "security",
    channel: "whatsapp",
    severity: "info",
    event: "fake_transfer_receipt_caught",
    message: "AI computer vision detected doctored bank slip. Auto-paused order confirmation and alerted staff.",
    latencyMs: 310,
    payload: {
      file_type: "image/jpeg",
      ocr_match: "Afriland Slip",
      anomaly: "Font mismatch on transaction reference",
      action: "human_review_required",
    },
  },
  {
    id: "log-adm-106",
    timestamp: "2026-11-06T08:52:10Z",
    tenantName: "Limbe Beach & Tourism Hub",
    tenantId: "ws-limbe-beachwear",
    category: "ai_inference",
    channel: "telegram",
    severity: "success",
    event: "telegram_bot_lead_converted",
    message: "AI agent negotiated weekend hotel villa reservation for 180 000 FCFA. Orange Money link generated.",
    latencyMs: 195,
    payload: {
      user: "@tourist_douala",
      package: "VIP Sea Villa 2N",
      channel: "telegram",
    },
  },
];
