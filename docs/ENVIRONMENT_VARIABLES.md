# OmniSales AI — Environment Variables

> Last updated: 2026-11-05 | Phase: 0 (Scaffolding)

## How to use

1. Copy `.env.local.example` to `.env.local` in the project root
2. Fill in the values for your environment
3. **Never** commit `.env.local` to version control

## Variable Reference

### Supabase (Phase 1)

| Variable | Prefix | Side | Required | Description |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_` | Client + Server | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_` | Client + Server | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Server only | Yes | Supabase service role key (admin) |

> [!CAUTION]
> `SUPABASE_SERVICE_ROLE_KEY` must **never** have the `NEXT_PUBLIC_` prefix.
> It bypasses Row Level Security and must only be used in server-side code.

### Application

| Variable | Prefix | Side | Required | Description |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `NEXT_PUBLIC_` | Client + Server | Yes | Application base URL |

### AI — Gemini API (Phase 6)

| Variable | Prefix | Side | Required | Description |
|---|---|---|---|---|
| `GEMINI_API_KEY` | — | Server only | Phase 6 | Google Gemini API key |

### Outbound Messaging Dispatchers (WhatsApp, Telegram, Meta, TikTok)

| Variable | Prefix | Side | Required | Description |
|---|---|---|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | — | Server only | Optional | Meta Cloud API WhatsApp Phone Number ID |
| `WHATSAPP_ACCESS_TOKEN` | — | Server only | Optional | WhatsApp Cloud API System User token (v21.0) |
| `META_APP_SECRET` | — | Server only | Optional | Meta App Secret for payload HMAC signature validation |
| `TELEGRAM_BOT_TOKEN` | — | Server only | Optional | Telegram Bot API token from @BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | — | Server only | Optional | Secret token header for Telegram webhook validation |
| `INSTAGRAM_ACCESS_TOKEN` | — | Server only | Optional | Meta Graph Send API token for Instagram Direct |
| `MESSENGER_ACCESS_TOKEN` | — | Server only | Optional | Meta Graph Send API token for Facebook Messenger |
| `TIKTOK_ACCESS_TOKEN` | — | Server only | Optional | TikTok Business Suite Access Token for Direct Messages |

> [!NOTE]
> When live credentials are not provided, the dispatchers automatically run in high-fidelity simulation mode with realistic latency and provider IDs (`wamid...`, `tg_msg...`), allowing development and staging workflows without requiring active paid accounts.

### Payments — Stripe (Phase 8)

| Variable | Prefix | Side | Required | Description |
|---|---|---|---|---|
| `STRIPE_SECRET_KEY` | — | Server only | Phase 8 | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | — | Server only | Phase 8 | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `NEXT_PUBLIC_` | Client | Phase 8 | Stripe publishable key |

## Security Rules

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser — only use
  for non-secret values.
- All secret keys (`SERVICE_ROLE`, `STRIPE_SECRET`, `GEMINI_API_KEY`) must
  **never** have the `NEXT_PUBLIC_` prefix.
- The `.gitignore` already excludes `.env.local` and `.env.*.local`.
