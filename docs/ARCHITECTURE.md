# OmniSales AI — Architecture

> Last updated: 2026-11-05 | Phase: 0 (Scaffolding)

## Overview

OmniSales AI is a multi-tenant, AI-powered SaaS platform for sales, CRM, and
collections management. It follows a modular, layered architecture designed for
incremental development.

## Tech Stack

| Layer          | Technology                              | Status       |
| -------------- | --------------------------------------- | ------------ |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript | ✅ Configured |
| Styling        | Tailwind CSS v4 + shadcn/ui            | ✅ Configured |
| Auth           | Supabase Auth                          | ⬜ Phase 1    |
| Database       | Supabase PostgreSQL + RLS              | ⬜ Phase 1    |
| API            | Next.js Route Handlers                 | ⬜ Phase 1    |
| State          | React Context + TanStack Query         | ⬜ Phase 2    |
| AI             | Gemini API                             | ⬜ Phase 6    |
| Payments       | Stripe                                 | ⬜ Phase 8    |

## Folder Structure

```
omnisales-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth route group (login, signup, forgot-password)
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── api/                # API route handlers
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Public landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitive components
│   │   ├── layout/             # Shell, sidebar, header components
│   │   └── shared/             # Reusable business components
│   ├── lib/
│   │   ├── supabase/           # Supabase client configuration
│   │   ├── utils/              # Utility functions (cn, formatters, etc.)
│   │   └── constants/          # App-wide constants and route paths
│   ├── types/                  # Global TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── supabase/
│   └── migrations/             # SQL migration files
├── docs/                       # Project documentation
├── public/                     # Static assets
└── [config files]              # next.config.ts, tsconfig.json, etc.
```

## Architecture Principles

1. **Multi-tenancy** — Every data table includes `tenant_id`. Row Level Security
   enforces isolation at the database level.
2. **Modular components** — UI is built from small, reusable components. Business
   logic lives in hooks and server actions, not in components.
3. **Type safety** — TypeScript strict mode. No `any` unless absolutely necessary.
4. **Server-first** — Default to Server Components. Use Client Components (`"use client"`)
   only when interactivity is required.
5. **Secure by default** — API keys stay server-side. RLS policies on every table.
   Auth middleware protects routes.

## Data Flow (planned)

```
Browser → Next.js App Router → Supabase Auth → PostgreSQL (RLS)
                              → Route Handlers → Supabase Admin
                              → Gemini API (Phase 6)
                              → Stripe API (Phase 8)
```
