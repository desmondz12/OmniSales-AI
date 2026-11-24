# OmniSales AI — Live Production Architecture & Design Decisions

> **CRITICAL RULE: THIS APPLICATION IS IN LIVE PRODUCTION.**
> - **NO demo/simulated OAuth flows**, NO fake handles (e.g., `@musaretail_ng`, `Musa Retail Hub`), and NO silent fallbacks that pretend an account connected when credentials/tokens failed.
> - Every channel connection (Facebook Messenger, Instagram, TikTok, WhatsApp, Telegram) must use **real OAuth / real APIs** and fail loudly with an actionable error message if a key or permission is missing.
> - **Always update this file** when adding integrations, changing architecture, or making major design decisions.

---

## 1. Live Environment & Stack
- **Production URL:** `https://omni-sales-ai.vercel.app`
- **GitHub Repository:** `https://github.com/desmondz12/OmniSales-AI.git` (`main` branch, auto-deploys to Vercel)
- **Default Workspace UUID:** `f7d05015-fecc-4602-816c-ad5bf96e144f` (`DEFAULT_WORKSPACE_ID` in `src/lib/constants/app.ts`)
- **Database & Auth:** Supabase (`https://gshdkflcrwjunltgythb.supabase.co`)
  - Auth Providers: Email/Password, Google OAuth, Apple OAuth (`/auth/callback`)
  - Realtime: Enabled on `conversations`, `messages`, `invoices`
- **AI Engine:** Google **Gemini 2.5 Flash** (`GEMINI_API_KEY` via `src/lib/ai/process-message-service.ts`)
- **Payments (Cameroon):** **NotchPay** (`NOTCHPAY_PUBLIC_KEY`) & **Campay** (`CAMPAY_APP_TOKEN` / `CAMPAY_USERNAME`+`CAMPAY_PASSWORD`) in `src/lib/payments/cameroon-gateway.ts` (MTN MoMo `*126#`, Orange Money `#150*50#`, Afriland First Bank)
- **Analytics:** **PostHog** (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com`) in `src/components/providers/posthog-provider.tsx`

---

## 2. Channel Integrations (Live Plugin Architecture)

### UX Principle (Manychat-Style Simplicity)
- The sidebar & page are named **Connect Accounts** (`/dashboard/channels`).
- **No technical jargon** on merchant-facing cards (no `Test Webhook` buttons, no SLA/Latency stats, no API version strings).
- Merchants click **Connect `<Platform>`** &rarr; official OAuth consent screen &rarr; automatic webhook subscription &rarr; live in Inbox.

### Channel Status
| Channel | Auth / Connection Method | Live Webhook / Endpoint | Required Env Vars |
| :--- | :--- | :--- | :--- |
| **Telegram** | Bot Token (`@NissiExploits_bot`) | `/api/webhooks/telegram` (Live `setWebhook` registered) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` |
| **Facebook Messenger** | Meta OAuth (`/api/auth/meta/authorize?channel=messenger`) | `/api/auth/meta/callback` + `/api/webhooks/meta` | `META_APP_ID` (`3928037137326579`), `META_APP_SECRET`, `META_VERIFY_TOKEN`, `META_CONFIG_ID_MESSENGER` (`1533991485222574`) |
| **Instagram Direct** | Meta OAuth (`/api/auth/meta/authorize?channel=instagram`) | `/api/auth/meta/callback` + `/api/webhooks/meta` | `META_APP_ID`, `META_APP_SECRET`, `META_VERIFY_TOKEN`, `META_CONFIG_ID_INSTAGRAM` (`1881983053242613`) |
| **TikTok DMs** | TikTok OAuth v2 (`/api/auth/tiktok/authorize`) | `/api/auth/tiktok/callback` + `/api/webhooks/tiktok` | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET` (pending app creation) |
| **WhatsApp** | Cloud API / QR | `/api/webhooks/meta` | `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` (pending Meta WhatsApp setup) |

---

## 3. Key Architectural Decisions Log
- **2026-11-24 — Vercel Build Scripts:** `package.json` uses standard `next build` and `next start` for Linux/Vercel compatibility; `--use-system-ca` is kept only in `dev` for local Windows TLS.
- **2026-11-24 — Workspace UUID Consistency:** All API routes and webhooks must use `DEFAULT_WORKSPACE_ID` (`f7d05015-fecc-4602-816c-ad5bf96e144f`), never non-UUID strings like `"ws-fotso-douala"`.
- **2026-11-24 — Production-First Login:** `/login` prioritizes Google, Apple, and Email sign-in; demo quick-access is tucked into a subtle footer link.
- **2026-11-24 — Connect Accounts Simplification:** Rebuilt `/dashboard/channels` to **Connect Accounts** with Manychat-style 1-click OAuth and removed simulated OAuth fallbacks.
- **2026-11-25 — Meta OAuth config_id Support:** `src/app/api/auth/meta/authorize/route.ts` now supports Facebook Login for Business via `config_id` (set `META_CONFIG_ID_MESSENGER` / `META_CONFIG_ID_INSTAGRAM` env vars). Without config_id, falls back to raw scope parameters. Removed the simulated "seamless_connect" fallback when `META_APP_ID` is missing — now shows an actionable error.
- **2026-11-25 — TikTok OAuth Hardened:** Removed simulated token fallback (`simulated_tt_token_*`) and demo handles (`@musastore_deals`). Now fails loudly if `TIKTOK_CLIENT_KEY` / `TIKTOK_CLIENT_SECRET` are missing. Uses `DEFAULT_WORKSPACE_ID` constant instead of hardcoded string.
