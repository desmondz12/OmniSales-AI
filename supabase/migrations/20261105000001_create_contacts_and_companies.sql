-- OmniSales AI: CRM Core - Companies & Contacts
-- Migration: 20261105000001_create_contacts_and_companies.sql

-- 1. Contact Status Enum
create type contact_status as enum ('lead', 'prospect', 'customer', 'churned');

-- 2. Companies Table (Accounts / Organizations)
create table if not exists public.companies (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    name text not null,
    domain text,
    industry text,
    phone text,
    address text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Performance indexes for companies
create index if not exists idx_companies_tenant on public.companies(tenant_id);
create index if not exists idx_companies_name on public.companies(tenant_id, name);

-- 3. Contacts Table
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    company_id uuid references public.companies(id) on delete set null,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text,
    job_title text,
    status contact_status default 'lead' not null,
    notes text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Performance indexes for contacts
create index if not exists idx_contacts_tenant on public.contacts(tenant_id);
create index if not exists idx_contacts_company on public.contacts(company_id);
create index if not exists idx_contacts_email on public.contacts(tenant_id, email);
create index if not exists idx_contacts_status on public.contacts(tenant_id, status);

-- 4. Enable Row Level Security (RLS)
alter table public.companies enable row level security;
alter table public.contacts enable row level security;

-- 5. RLS Policies for Companies
create policy "Users can view companies in their tenant"
    on public.companies for select
    using (public.is_tenant_member(tenant_id));

create policy "Users can create companies in their tenant"
    on public.companies for insert
    with check (public.is_tenant_member(tenant_id));

create policy "Users can update companies in their tenant"
    on public.companies for update
    using (public.is_tenant_member(tenant_id))
    with check (public.is_tenant_member(tenant_id));

create policy "Users can delete companies in their tenant"
    on public.companies for delete
    using (public.is_tenant_member(tenant_id));

-- 6. RLS Policies for Contacts
create policy "Users can view contacts in their tenant"
    on public.contacts for select
    using (public.is_tenant_member(tenant_id));

create policy "Users can create contacts in their tenant"
    on public.contacts for insert
    with check (public.is_tenant_member(tenant_id));

create policy "Users can update contacts in their tenant"
    on public.contacts for update
    using (public.is_tenant_member(tenant_id))
    with check (public.is_tenant_member(tenant_id));

create policy "Users can delete contacts in their tenant"
    on public.contacts for delete
    using (public.is_tenant_member(tenant_id));
