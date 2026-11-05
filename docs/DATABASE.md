# OmniSales AI — Database Schema

> Last updated: 2026-11-05 | Phase: 0 (Scaffolding)

## Status

⬜ **Not yet configured.** The database schema will be created in Phase 1.

## Planned Tables (Phase 1)

| Table       | Purpose                              | Phase |
| ----------- | ------------------------------------ | ----- |
| `tenants`   | Organisations / workspaces           | 1     |
| `profiles`  | User profiles linked to auth.users   | 1     |
| `roles`     | Role definitions per tenant          | 1     |

## Planned Tables (Later Phases)

| Table           | Purpose                          | Phase |
| --------------- | -------------------------------- | ----- |
| `contacts`      | CRM contacts                     | 3     |
| `companies`     | CRM companies                    | 3     |
| `deals`         | Sales pipeline deals             | 4     |
| `pipeline_stages` | Kanban stage definitions       | 4     |
| `invoices`      | Collection invoices              | 5     |
| `payments`      | Payment records                  | 5     |
| `ai_logs`       | AI interaction history           | 6     |
| `subscriptions` | Billing subscriptions            | 8     |

## Multi-Tenancy Strategy

Every data table will include a `tenant_id` column referencing `tenants.id`.
Row Level Security (RLS) policies will enforce that users can only access data
belonging to their tenant.

## Migrations

All schema changes will be managed via SQL migration files in `supabase/migrations/`.
Each migration is timestamped and applied in order.
