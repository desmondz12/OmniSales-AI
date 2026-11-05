-- OmniSales AI: Multi-Tenant Authentication & Core Schema
-- Migration: 20261105000000_init_multi_tenant_auth.sql

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Roles Enum
create type user_role as enum ('owner', 'admin', 'member', 'viewer');

-- 2. Tenants Table (Organizations / Workspaces)
create table if not exists public.tenants (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Index for tenant lookup by slug
create index if not exists idx_tenants_slug on public.tenants(slug);

-- 3. Profiles Table (extends auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    avatar_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 4. Tenant Members Table (Junction between Users and Tenants)
create table if not exists public.tenant_members (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role user_role default 'member' not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null,
    constraint unique_tenant_user unique (tenant_id, user_id)
);

-- Indexes for performance
create index if not exists idx_tenant_members_tenant on public.tenant_members(tenant_id);
create index if not exists idx_tenant_members_user on public.tenant_members(user_id);

-- 5. Helper Functions for Row Level Security (RLS)

-- Check if current authenticated user belongs to tenant
create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.tenant_members
    where tenant_id = target_tenant_id
      and user_id = auth.uid()
  );
$$;

-- Check if current authenticated user is an owner or admin of tenant
create or replace function public.is_tenant_admin(target_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.tenant_members
    where tenant_id = target_tenant_id
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

-- 6. Enable Row Level Security (RLS) on all tables
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_members enable row level security;

-- 7. RLS Policies

-- PROFILES
-- Users can view their own profile
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

-- Users can view profiles of team members in same tenant
create policy "Users can view colleagues profiles"
    on public.profiles for select
    using (
        exists (
            select 1 from public.tenant_members my_m
            join public.tenant_members their_m on my_m.tenant_id = their_m.tenant_id
            where my_m.user_id = auth.uid()
              and their_m.user_id = public.profiles.id
        )
    );

-- Users can update their own profile
create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- TENANTS
-- Users can view tenants they are member of
create policy "Users can view their tenants"
    on public.tenants for select
    using (public.is_tenant_member(id));

-- Admins and owners can update their tenant details
create policy "Admins can update their tenant"
    on public.tenants for update
    using (public.is_tenant_admin(id))
    with check (public.is_tenant_admin(id));

-- TENANT MEMBERS
-- Users can view members of tenants they belong to
create policy "Users can view members of their tenants"
    on public.tenant_members for select
    using (public.is_tenant_member(tenant_id));

-- Admins can insert/invite members
create policy "Admins can add members"
    on public.tenant_members for insert
    with check (public.is_tenant_admin(tenant_id));

-- Admins can update roles of members
create policy "Admins can update members"
    on public.tenant_members for update
    using (public.is_tenant_admin(tenant_id))
    with check (public.is_tenant_admin(tenant_id));

-- Admins can remove members
create policy "Admins can delete members"
    on public.tenant_members for delete
    using (public.is_tenant_admin(tenant_id));

-- 8. Trigger: Handle new user signups
-- Automatically creates a profile and a default tenant workspace
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_full_name text;
    v_tenant_name text;
    v_tenant_slug text;
    v_tenant_id uuid;
begin
    -- Extract full name from metadata or fallback to email prefix
    v_full_name := coalesce(
        new.raw_user_meta_data->>'full_name',
        split_part(new.email, '@', 1)
    );

    -- Extract tenant/company name or fallback to workspace format
    v_tenant_name := coalesce(
        new.raw_user_meta_data->>'tenant_name',
        v_full_name || '''s Workspace'
    );

    -- Create profile
    insert into public.profiles (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        v_full_name,
        new.raw_user_meta_data->>'avatar_url'
    );

    -- Generate a simple unique slug for tenant
    v_tenant_slug := lower(regexp_replace(v_tenant_name, '[^a-zA-Z0-9]', '-', 'g')) 
                     || '-' || substr(gen_random_uuid()::text, 1, 8);

    -- Create initial tenant
    insert into public.tenants (name, slug)
    values (v_tenant_name, v_tenant_slug)
    returning id into v_tenant_id;

    -- Assign user as Owner of new tenant
    insert into public.tenant_members (tenant_id, user_id, role)
    values (v_tenant_id, new.id, 'owner');

    return new;
end;
$$;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
