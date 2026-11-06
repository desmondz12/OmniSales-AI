-- ==============================================================================
-- OMNISALES AI: COMPLETE POSTGRESQL MULTI-TENANT SCHEMA
-- Production Schema for Supabase (Auth, RLS, Storage & PostgreSQL)
-- Target Market: Cameroon (CEMAC Region - FCFA / XAF)
-- ==============================================================================

-- 0. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. CUSTOM ENUM TYPES
do $$ begin
    create type app_user_role as enum ('super_admin', 'business_client');
exception when duplicate_object then null; end $$;

do $$ begin
    create type workspace_status as enum ('active', 'trial', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
    create type channel_type as enum ('whatsapp', 'instagram', 'messenger', 'tiktok', 'telegram');
exception when duplicate_object then null; end $$;

do $$ begin
    create type channel_status as enum ('connected', 'reconnect_needed', 'disconnected');
exception when duplicate_object then null; end $$;

do $$ begin
    create type conversation_status as enum ('needs_human', 'ai_handling', 'ready_to_pay', 'upset', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
    create type triage_tag as enum ('ready_to_pay', 'upset', 'asked_for_person', 'promise_due', 'paid', 'none');
exception when duplicate_object then null; end $$;

do $$ begin
    create type message_sender as enum ('customer', 'ai', 'human');
exception when duplicate_object then null; end $$;

do $$ begin
    create type invoice_status as enum ('pending', 'paid', 'overdue', 'cancelled');
exception when duplicate_object then null; end $$;

-- 2. USERS & PROFILES (Linked to Supabase Auth)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    full_name text not null,
    role app_user_role default 'business_client' not null,
    phone text,
    avatar_url text,
    preferred_language text default 'fr' not null, -- 'fr' | 'en'
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_profiles_role on public.profiles(role);

-- 3. WORKSPACES (Client Businesses / Tenants)
create table if not exists public.workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    city text default 'Douala (Akwa)' not null,
    owner_id uuid references public.profiles(id) on delete set null,
    owner_email text not null,
    plan text default 'Pro' not null, -- 'Starter' | 'Pro' | 'Enterprise'
    status workspace_status default 'active' not null,
    currency text default 'XAF' not null,
    mrr_fcfa numeric(12,2) default 85000.00 not null,
    ai_token_limit int default 100000 not null,
    ai_tokens_used int default 14200 not null,
    agent_settings jsonb default '{
        "agent_name": "Nathalie (Conseillère Ventes)",
        "tone": "consultative",
        "languages": ["fr", "en", "camfranglais", "pidgin"],
        "payment_gateways": {
            "mtn_momo": true,
            "orange_money": true,
            "afriland_bank": true
        },
        "handoff_threshold_fcfa": 250000
    }'::jsonb not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_workspaces_slug on public.workspaces(slug);
create index if not exists idx_workspaces_status on public.workspaces(status);

-- 4. WORKSPACE MEMBERS (Team Access Control)
create table if not exists public.workspace_members (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    role text default 'owner' not null, -- 'owner', 'manager', 'sales_agent'
    created_at timestamptz default now() not null,
    constraint unique_workspace_member unique (workspace_id, user_id)
);

create index if not exists idx_workspace_members_user on public.workspace_members(user_id);

-- 5. CHANNELS (5 Channels: WhatsApp, Instagram, Messenger, TikTok, Telegram)
create table if not exists public.channels (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    type channel_type not null,
    name text not null,
    status channel_status default 'connected' not null,
    ai_auto_reply boolean default true not null,
    handle text,
    phone_number text,
    credentials jsonb default '{}'::jsonb not null,
    webhook_verified boolean default true not null,
    last_synced_at timestamptz default now() not null,
    created_at timestamptz default now() not null,
    constraint unique_workspace_channel unique (workspace_id, type)
);

create index if not exists idx_channels_workspace on public.channels(workspace_id);

-- 6. CUSTOMERS & AI MEMORY
create table if not exists public.customers (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    name text not null,
    phone text,
    email text,
    channel_type channel_type not null,
    handle text,
    city text default 'Douala',
    avatar_url text,
    total_owed numeric(12,2) default 0.00 not null,
    total_paid numeric(12,2) default 0.00 not null,
    payment_promise_date timestamptz,
    payment_promise_amount numeric(12,2),
    ai_memory jsonb default '{
        "facts": [],
        "preferences": {},
        "objections": [],
        "preferred_language": "fr"
    }'::jsonb not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_customers_workspace on public.customers(workspace_id);
create index if not exists idx_customers_channel on public.customers(workspace_id, channel_type);
create index if not exists idx_customers_phone on public.customers(phone);

-- 7. CONVERSATIONS (Triage & Human Handoff Queue)
create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    channel_type channel_type not null,
    status conversation_status default 'ai_handling' not null,
    triage_tag triage_tag default 'none' not null,
    ai_context_summary text,
    unread_count int default 0 not null,
    is_ai_active boolean default true not null,
    claimed_by uuid references public.profiles(id) on delete set null,
    last_message_at timestamptz default now() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_conversations_workspace on public.conversations(workspace_id);
create index if not exists idx_conversations_status on public.conversations(workspace_id, status);
create index if not exists idx_conversations_triage on public.conversations(workspace_id, triage_tag);

-- 8. MESSAGES (Live Thread between Customer, AI, and Human Staff)
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    sender_type message_sender not null,
    sender_name text not null,
    content text not null,
    channel_type channel_type not null,
    metadata jsonb default '{}'::jsonb not null,
    created_at timestamptz default now() not null
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at asc);

-- 9. INVOICES & PAYMENTS (Central African CFA Franc - FCFA / XAF)
create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    invoice_number text unique not null,
    currency text default 'XAF' not null,
    amount numeric(12,2) not null,
    amount_paid numeric(12,2) default 0.00 not null,
    due_date timestamptz not null,
    status invoice_status default 'pending' not null,
    payment_method text, -- 'MTN MoMo', 'Orange Money', 'Afriland First Bank'
    payment_link text,
    description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_invoices_workspace on public.invoices(workspace_id);
create index if not exists idx_invoices_status on public.invoices(workspace_id, status);

-- 10. SYSTEM LOGS & HEALTH MONITOR (Super Admin Live Audit Stream)
create table if not exists public.system_logs (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade,
    event_type text not null,
    channel_type channel_type,
    status text not null,
    message text not null,
    latency_ms int default 120,
    metadata jsonb default '{}'::jsonb not null,
    created_at timestamptz default now() not null
);

create index if not exists idx_system_logs_created on public.system_logs(created_at desc);
create index if not exists idx_system_logs_workspace on public.system_logs(workspace_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.channels enable row level security;
alter table public.customers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.system_logs enable row level security;

-- Profiles: Users can view their own profile or Super Admins can view all
create policy "Profiles are viewable by owner or super admin"
    on public.profiles for select
    using (auth.uid() = id or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Workspaces: Viewable by workspace members or super admins
create policy "Workspaces viewable by members or super admin"
    on public.workspaces for select
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.workspaces.id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Channels: Viewable by workspace members
create policy "Channels viewable by workspace members"
    on public.channels for select
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.channels.workspace_id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Customers: Viewable by workspace members
create policy "Customers viewable by workspace members"
    on public.customers for select
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.customers.workspace_id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Conversations: Viewable and updateable by workspace members
create policy "Conversations viewable by workspace members"
    on public.conversations for all
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.conversations.workspace_id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Messages: Viewable and insertable by workspace members
create policy "Messages manageable by workspace members"
    on public.messages for all
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.messages.workspace_id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- Invoices: Manageable by workspace members
create policy "Invoices manageable by workspace members"
    on public.invoices for all
    using (exists (
        select 1 from public.workspace_members where workspace_id = public.invoices.workspace_id and user_id = auth.uid()
    ) or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));

-- System Logs: Viewable by super admin
create policy "System logs viewable by super admin"
    on public.system_logs for select
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
    ));
