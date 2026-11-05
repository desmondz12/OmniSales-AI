# OmniSales AI — Database Schema

> Last updated: 2026-11-05 | Phase: 3 (CRM Core: Contacts & Companies)

## Status

✅ **Phase 1 & 3 Schemas Implemented**
- Phase 1 Migration: `supabase/migrations/20261105000000_init_multi_tenant_auth.sql`
- Phase 3 Migration: `supabase/migrations/20261105000001_create_contacts_and_companies.sql`

---

## Active Tables

### 1. `tenants`
Holds organizational workspaces.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique tenant identifier |
| `name` | `text` | NOT NULL | Organization / Company name |
| `slug` | `text` | NOT NULL, UNIQUE, Indexed | URL-safe workspace slug |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

### 2. `profiles`
User profiles linked to `auth.users(id)`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, References `auth.users(id)` ON DELETE CASCADE | Matches auth UID |
| `email` | `text` | NOT NULL | User email address |
| `full_name` | `text` | NULLABLE | Display name |
| `avatar_url` | `text` | NULLABLE | Avatar URL |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

### 3. `tenant_members`
Junction linking users to workspaces with roles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Membership ID |
| `tenant_id` | `uuid` | NOT NULL, References `tenants(id)` ON DELETE CASCADE | Associated tenant |
| `user_id` | `uuid` | NOT NULL, References `auth.users(id)` ON DELETE CASCADE | Associated user |
| `role` | `user_role` | NOT NULL, DEFAULT `'member'` | `'owner'`, `'admin'`, `'member'`, `'viewer'` |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

### 4. `companies` (Phase 3)
Accounts and organizations in the CRM.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Company ID |
| `tenant_id` | `uuid` | NOT NULL, References `tenants(id)` ON DELETE CASCADE | Workspace scope |
| `name` | `text` | NOT NULL | Company name |
| `domain` | `text` | NULLABLE | Website / domain |
| `industry` | `text` | NULLABLE | Industry category |
| `phone` | `text` | NULLABLE | Company phone |
| `address` | `text` | NULLABLE | Physical address |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

### 5. `contacts` (Phase 3)
Customer leads and account contacts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Contact ID |
| `tenant_id` | `uuid` | NOT NULL, References `tenants(id)` ON DELETE CASCADE | Workspace scope |
| `company_id` | `uuid` | NULLABLE, References `companies(id)` ON DELETE SET NULL | Associated company |
| `first_name` | `text` | NOT NULL | First name |
| `last_name` | `text` | NOT NULL | Last name |
| `email` | `text` | NOT NULL | Contact email address |
| `phone` | `text` | NULLABLE | Contact phone number |
| `job_title` | `text` | NULLABLE | Role / Job title |
| `status` | `contact_status` | NOT NULL, DEFAULT `'lead'` | `'lead'`, `'prospect'`, `'customer'`, `'churned'` |
| `notes` | `text` | NULLABLE | Context & meeting notes |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

---

## Enums

- **`user_role`**: `'owner'`, `'admin'`, `'member'`, `'viewer'`
- **`contact_status`**: `'lead'`, `'prospect'`, `'customer'`, `'churned'`

---

## Row Level Security (RLS) Policies

All tables have RLS enabled:
- **`companies`**: Team members can view, insert, update, and delete companies belonging to their active `tenant_id` (`is_tenant_member(tenant_id)`).
- **`contacts`**: Team members can view, insert, update, and delete contacts belonging to their active `tenant_id` (`is_tenant_member(tenant_id)`).
- **`tenants`** & **`profiles`** & **`tenant_members`**: Protected via Phase 1 policies.
