# OmniSales AI — Architecture

> Last updated: 2026-11-05 | Phase: 3 (CRM Core: Contacts & Companies)

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
| Navigation     | Responsive Sidebar + Header + Mobile Drawer | ✅ Configured |
| CRM Core       | Contacts, Companies & Status Badges     | ✅ Configured |
| Pipeline       | Kanban Deals & Stages                   | ⬜ Phase 4    |
| Collections    | Receivables & Invoices                  | ⬜ Phase 5    |
| AI             | Gemini API                             | ⬜ Phase 6    |
| Payments       | Stripe                                 | ⬜ Phase 8    |

## Folder Structure

```
omnisales-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth route group (login, signup, forgot-password)
│   │   ├── (dashboard)/        # Protected dashboard route group
│   │   │   ├── layout.tsx      # Server layout fetching user & tenant
│   │   │   ├── dashboard/      # Overview with real live contact counters
│   │   │   ├── contacts/       # CRM Contacts table, search, filters & dialogs
│   │   │   ├── deals/          # Sales pipeline (Phase 4)
│   │   │   ├── collections/    # Collections & invoices (Phase 5)
│   │   │   └── settings/       # Workspace & Profile settings
│   │   ├── auth/callback/      # Auth exchange handler
│   │   ├── layout.tsx          # Root HTML layout
│   │   └── page.tsx            # Public landing page
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Input, Card, Alert, Badge, Dialog)
│   │   ├── layout/             # Sidebar, Header, MobileNav, DashboardShell
│   │   └── shared/             # SignOutButton, etc.
│   ├── lib/
│   │   ├── supabase/           # Browser, Server, Admin clients & SSR Middleware
│   │   ├── utils/              # cn() Tailwind merger
│   │   └── constants/          # App constants and route paths
│   ├── types/                  # Global and database TypeScript definitions
│   └── middleware.ts           # Next.js request interceptor & session refresh
├── supabase/
│   └── migrations/             # SQL migrations (multi-tenant schema, RLS, triggers)
├── docs/                       # Project documentation
└── [config files]              # next.config.ts, tsconfig.json, etc.
```

## Architecture Principles

1. **Multi-tenancy** — Every business entity (`companies`, `contacts`, etc.) has a `tenant_id`. PostgreSQL Row Level Security (RLS) ensures tenant isolation at the database level.
2. **Modular UI** — Built using reusable primitives (`Button`, `Input`, `Card`, `Alert`, `Badge`, `Dialog`) with explicit loading, error, and empty states.
3. **Strict Type Safety** — TypeScript strict mode. Database types are defined in `src/types/database.ts`.
4. **Server-First Security** — Layout data fetching runs server-side to prevent client-side layout shifts and unauthenticated flashes.
5. **No Mock Data** — All metrics display real counts directly from PostgreSQL.
