# OmniSales AI — Database Schema

> Last updated: 2026-11-05 | Phase: 1 (Supabase & Authentication)

## Status

✅ **Phase 1 Schema Created**: SQL migration located at `supabase/migrations/20261105000000_init_multi_tenant_auth.sql`.

---

## Active Tables (Phase 1)

### 1. `tenants`
Holds organizational workspaces. Every company or organization has a tenant account.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Unique tenant identifier |
| `name` | `text` | NOT NULL | Organization / Company name |
| `slug` | `text` | NOT NULL, UNIQUE, Indexed | URL-safe workspace slug |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Last update timestamp |

### 2. `profiles`
Extends Supabase `auth.users` with user metadata and profile information.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, References `auth.users(id)` ON DELETE CASCADE | Matches auth user UID |
| `email` | `text` | NOT NULL | User email address |
| `full_name` | `text` | NULLABLE | User display name |
| `avatar_url` | `text` | NULLABLE | User avatar image URL |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Profile creation date |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Profile update date |

### 3. `tenant_members`
Multi-tenant junction linking users to tenants with specific permissions.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | Primary Key, `default gen_random_uuid()` | Membership record ID |
| `tenant_id` | `uuid` | NOT NULL, References `tenants(id)` ON DELETE CASCADE | Associated tenant |
| `user_id` | `uuid` | NOT NULL, References `auth.users(id)` ON DELETE CASCADE | Associated user |
| `role` | `user_role` | NOT NULL, DEFAULT `'member'` | `'owner'`, `'admin'`, `'member'`, or `'viewer'` |
| `created_at` | `timestamptz` | NOT NULL, `default now()` | Date added |
| `updated_at` | `timestamptz` | NOT NULL, `default now()` | Date updated |

**Unique constraint:** `(tenant_id, user_id)` ensures a user cannot have duplicate memberships in the same tenant.

---

## Enums

### `user_role`
- `owner`: Full control over workspace, billing, and member management.
- `admin`: Can manage team members, deals, and settings.
- `member`: Standard workspace user (can create and edit CRM records).
- `viewer`: Read-only access to tenant data.

---

## Row Level Security (RLS) Policies

All tables have RLS enabled (`alter table ... enable row level security;`).

### Helper Functions:
1. `is_tenant_member(target_tenant_id uuid)`: Returns `true` if `auth.uid()` has an entry in `tenant_members` for the given tenant.
2. `is_tenant_admin(target_tenant_id uuid)`: Returns `true` if `auth.uid()` is an `owner` or `admin` in `tenant_members` for the given tenant.

### Table Policies:
- **`profiles`**:
  - `Users can view own profile`: `auth.uid() = id`
  - `Users can view colleagues profiles`: Can view profiles of users who share a tenant.
  - `Users can update own profile`: `auth.uid() = id`
- **`tenants`**:
  - `Users can view their tenants`: `is_tenant_member(id)`
  - `Admins can update their tenant`: `is_tenant_admin(id)`
- **`tenant_members`**:
  - `Users can view members of their tenants`: `is_tenant_member(tenant_id)`
  - `Admins can add/update/delete members`: `is_tenant_admin(tenant_id)`

---

## Database Triggers

### `handle_new_user()`
Fires `AFTER INSERT` on `auth.users`:
1. Extracts `full_name` and `tenant_name` from signup user metadata.
2. Creates a row in `public.profiles`.
3. Creates a new workspace in `public.tenants`.
4. Creates a row in `public.tenant_members` with `role = 'owner'`.

---

## Planned Tables (Later Phases)

| Table | Purpose | Phase |
|---|---|---|
| `contacts` | CRM contacts linked to `tenant_id` | 3 |
| `companies` | CRM accounts/companies linked to `tenant_id` | 3 |
| `deals` | Sales pipeline opportunities | 4 |
| `pipeline_stages` | Customizable Kanban stages | 4 |
| `invoices` | Collections and receivables | 5 |
| `payments` | Recorded transaction history | 5 |
| `ai_logs` | Audit trail of AI agent actions | 6 |
| `subscriptions` | Stripe billing integration | 8 |
