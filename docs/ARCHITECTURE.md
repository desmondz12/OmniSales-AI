# OmniSales AI — Architecture

> Last updated: 2026-11-05 | Phase: 1 (Supabase & Authentication)

## Overview

OmniSales AI is a multi-tenant, AI-powered SaaS platform for sales, CRM, and
collections management. It follows a modular, layered architecture designed for
incremental development.

## Tech Stack

| Layer          | Technology                              | Status       |
| -------------- | --------------------------------------- | ------------ |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript | ✅ Configured |
| Styling        | Tailwind CSS v4 + Custom Tokens        | ✅ Configured |
| Auth           | Supabase Auth (SSR Cookies)             | ✅ Configured |
| Database       | Supabase PostgreSQL + RLS              | ✅ Configured |
| API            | Next.js Route Handlers + Server Actions | ✅ Configured |
| State          | React Context + Server State            | ⬜ Phase 2    |
| AI             | Gemini API                             | ⬜ Phase 6    |
| Payments       | Stripe                                 | ⬜ Phase 8    |

## Folder Structure

```
omnisales-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth route group (login, signup, forgot-password)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   └── dashboard/page.tsx
│   │   ├── auth/callback/      # OAuth & email verification handler
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Public landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Input, Card, Alert)
│   │   ├── layout/             # Shell, sidebar, header components (Phase 2)
│   │   └── shared/             # Shared components (SignOutButton, etc.)
│   ├── lib/
│   │   ├── supabase/           # Browser, Server, Admin clients & SSR Middleware
│   │   ├── utils/              # cn() Tailwind merger
│   │   └── constants/          # App constants and route paths
│   ├── types/                  # Global and database TypeScript definitions
│   ├── hooks/                  # Custom React hooks
│   └── middleware.ts           # Next.js request interceptor & session refresh
├── supabase/
│   └── migrations/             # SQL migrations (multi-tenant schema, RLS, triggers)
├── docs/                       # Project documentation
├── public/                     # Static assets
└── [config files]              # next.config.ts, tsconfig.json, etc.
```

## Architecture Principles

1. **Multi-tenancy** — Every business entity has a `tenant_id`. PostgreSQL Row Level
   Security (RLS) ensures tenant isolation at the database level.
2. **Modular UI** — Built using reusable primitives (`Button`, `Input`, `Card`, `Alert`)
   with explicit loading, error, and success states.
3. **Strict Type Safety** — TypeScript strict mode. Database types are defined in `src/types/database.ts`.
4. **Server-First Security** — Auth tokens are managed through secure HTTP-only cookies
   refreshed via Next.js middleware. The service-role key is isolated to `src/lib/supabase/admin.ts`
   and never accessible to the browser.
5. **No Mock Data** — Connected directly to live PostgreSQL on Supabase.
