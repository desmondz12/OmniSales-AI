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
