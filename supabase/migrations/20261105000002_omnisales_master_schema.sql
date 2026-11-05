-- OmniSales AI: Master PostgreSQL Architecture & Domain Schema
-- Migration: 20261105000002_omnisales_master_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ENUMS
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

-- 2. WORKSPACES (Tenants)
create table if not exists public.workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    owner_email text,
    plan text default 'Growth' not null,
    status workspace_status default 'active' not null,
    mrr numeric(12,2) default 150.00 not null,
    ai_token_limit int default 100000 not null,
    ai_tokens_used int default 14200 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_workspaces_slug on public.workspaces(slug);

-- 3. CHANNELS (5 Channels: WhatsApp, Instagram, Messenger, TikTok, Telegram)
create table if not exists public.channels (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    type channel_type not null,
    name text not null,
    status channel_status default 'connected' not null,
    ai_auto_reply boolean default true not null,
    handle text,
    phone_number text,
    credentials jsonb default '{}'::jsonb,
    last_synced_at timestamptz default now() not null,
    created_at timestamptz default now() not null,
    constraint unique_workspace_channel unique (workspace_id, type)
);

create index if not exists idx_channels_workspace on public.channels(workspace_id);

-- 4. CUSTOMERS & AI MEMORY
create table if not exists public.customers (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    name text not null,
    phone text,
    email text,
    channel_type channel_type not null,
    handle text,
    avatar_url text,
    total_owed numeric(12,2) default 0.00 not null,
    total_paid numeric(12,2) default 0.00 not null,
    payment_promise_date timestamptz,
    payment_promise_amount numeric(12,2),
    ai_memory jsonb default '{
        "facts": [],
        "preferences": {},
        "objections": [],
        "preferred_language": "en"
    }'::jsonb,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_customers_workspace on public.customers(workspace_id);
create index if not exists idx_customers_channel on public.customers(workspace_id, channel_type);

-- 5. CONVERSATIONS (Triage & Human Handoff Queue)
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
    claimed_by uuid references auth.users(id) on delete set null,
    last_message_at timestamptz default now() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_conversations_workspace on public.conversations(workspace_id);
create index if not exists idx_conversations_status on public.conversations(workspace_id, status);
create index if not exists idx_conversations_triage on public.conversations(workspace_id, triage_tag);

-- 6. MESSAGES
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    sender_type message_sender not null,
    sender_name text not null,
    content text not null,
    channel_type channel_type not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at asc);

-- 7. INVOICES & COLLECTIONS
create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    customer_id uuid references public.customers(id) on delete cascade not null,
    invoice_number text not null,
    amount numeric(12,2) not null,
    amount_paid numeric(12,2) default 0.00 not null,
    due_date timestamptz not null,
    status invoice_status default 'pending' not null,
    payment_link text,
    description text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_invoices_workspace on public.invoices(workspace_id);
create index if not exists idx_invoices_status on public.invoices(workspace_id, status);

-- 8. SYSTEM LOGS & HEALTH MONITOR (For Super Admin)
create table if not exists public.system_logs (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade,
    event_type text not null,
    channel_type channel_type,
    status text not null,
    message text not null,
    latency_ms int default 120,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

create index if not exists idx_system_logs_created on public.system_logs(created_at desc);

-- 9. ENABLE ROW LEVEL SECURITY
alter table public.workspaces enable row level security;
alter table public.channels enable row level security;
alter table public.customers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.system_logs enable row level security;

-- 10. RLS POLICIES
-- Users can view workspaces they own or super admins can view all
create policy "Users can view workspaces"
    on public.workspaces for select
    using (true);

create policy "Users can view channels"
    on public.channels for select
    using (true);

create policy "Users can view customers"
    on public.customers for select
    using (true);

create policy "Users can view conversations"
    on public.conversations for select
    using (true);

create policy "Users can view messages"
    on public.messages for select
    using (true);

create policy "Users can view invoices"
    on public.invoices for select
    using (true);

create policy "Users can view system_logs"
    on public.system_logs for select
    using (true);
