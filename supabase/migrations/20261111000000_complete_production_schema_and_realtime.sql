-- =============================================================================
-- OmniSales AI — Master Production Schema & Realtime WebSocket Activation
-- Target Supabase Project: gshdkflcrwjunltgythb (Nissi Exploits / Desmond Nkanyi)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1. ENUMS (Safe Idempotent Creation)
-- ---------------------------------------------------------------------------
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

do $$ begin
    create type contact_status as enum ('lead', 'prospect', 'customer', 'churned');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. CRM CORE: COMPANIES & CONTACTS (Linked to Tenants)
-- ---------------------------------------------------------------------------
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

create index if not exists idx_companies_tenant on public.companies(tenant_id);

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

create index if not exists idx_contacts_tenant on public.contacts(tenant_id);
create index if not exists idx_contacts_company on public.contacts(company_id);

-- ---------------------------------------------------------------------------
-- 3. WORKSPACES (Linked / Synced with Tenants)
-- ---------------------------------------------------------------------------
create table if not exists public.workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    owner_email text,
    plan text default 'Growth' not null,
    status workspace_status default 'active' not null,
    mrr numeric(12,2) default 150000.00 not null,
    ai_token_limit int default 100000 not null,
    ai_tokens_used int default 14200 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Ensure Nissi Exploits exists in workspaces
insert into public.workspaces (id, name, slug, owner_email, plan, status, mrr)
values (
    'f7d05015-fecc-4602-816c-ad5bf96e144f',
    'Nissi Exploits',
    'nissi-exploits-4e191215',
    'codercoderdev@gmail.com',
    'Enterprise',
    'active',
    250000.00
) on conflict (id) do update set
    name = excluded.name,
    owner_email = excluded.owner_email;

-- ---------------------------------------------------------------------------
-- 4. CHANNELS (WhatsApp, Instagram, Messenger, TikTok, Telegram)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 5. CUSTOMERS & AI MEMORY
-- ---------------------------------------------------------------------------
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
        "preferred_language": "fr"
    }'::jsonb,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_customers_workspace on public.customers(workspace_id);
create index if not exists idx_customers_channel on public.customers(workspace_id, channel_type);

-- ---------------------------------------------------------------------------
-- 6. CONVERSATIONS
-- ---------------------------------------------------------------------------
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
    claimed_by text,
    last_message_at timestamptz default now() not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_conversations_workspace on public.conversations(workspace_id);
create index if not exists idx_conversations_customer on public.conversations(customer_id);
create index if not exists idx_conversations_last_msg on public.conversations(workspace_id, last_message_at desc);

-- ---------------------------------------------------------------------------
-- 7. MESSAGES (Live Message Stream)
-- ---------------------------------------------------------------------------
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

create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at asc);
create index if not exists idx_messages_workspace on public.messages(workspace_id);

-- ---------------------------------------------------------------------------
-- 8. INVOICES
-- ---------------------------------------------------------------------------
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
create index if not exists idx_invoices_customer on public.invoices(customer_id);

-- ---------------------------------------------------------------------------
-- 9. DEALS (Kanban Pipeline)
-- ---------------------------------------------------------------------------
create table if not exists public.deals (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    title text not null,
    amount_fcfa numeric(12,2) not null,
    stage text not null default 'lead',
    probability int not null default 30,
    customer_name text not null,
    customer_city text default 'Douala',
    company_name text,
    channel_type channel_type default 'whatsapp',
    assigned_to text default 'Jean-Luc Fotso',
    expected_close_date text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create index if not exists idx_deals_workspace on public.deals(workspace_id);

-- ---------------------------------------------------------------------------
-- 10. SYSTEM LOGS
-- ---------------------------------------------------------------------------
create table if not exists public.system_logs (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid references public.workspaces(id) on delete set null,
    level text not null,
    service text not null,
    message text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now() not null
);

create index if not exists idx_logs_created on public.system_logs(created_at desc);

-- ---------------------------------------------------------------------------
-- 11. ENABLE ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
alter table public.companies enable row level security;
alter table public.contacts enable row level security;
alter table public.workspaces enable row level security;
alter table public.channels enable row level security;
alter table public.customers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.invoices enable row level security;
alter table public.deals enable row level security;
alter table public.system_logs enable row level security;

-- Permissive authenticated read policies
create policy "Allow read workspaces" on public.workspaces for select using (true);
create policy "Allow read channels" on public.channels for select using (true);
create policy "Allow read customers" on public.customers for select using (true);
create policy "Allow read conversations" on public.conversations for select using (true);
create policy "Allow read messages" on public.messages for select using (true);
create policy "Allow read invoices" on public.invoices for select using (true);
create policy "Allow read deals" on public.deals for select using (true);
create policy "Allow read companies" on public.companies for select using (true);
create policy "Allow read contacts" on public.contacts for select using (true);
create policy "Allow read system_logs" on public.system_logs for select using (true);

-- Permissive insert/update for active clients
create policy "Allow insert messages" on public.messages for insert with check (true);
create policy "Allow update conversations" on public.conversations for update using (true);
create policy "Allow insert conversations" on public.conversations for insert with check (true);
create policy "Allow update customers" on public.customers for update using (true);

-- ---------------------------------------------------------------------------
-- 12. SUPABASE REALTIME WEBSOCKET REPLICATION ACTIVATION
-- ---------------------------------------------------------------------------
-- Ensure tables are added to supabase_realtime publication
do $$ begin
    alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

do $$ begin
    alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null; end $$;

do $$ begin
    alter publication supabase_realtime add table public.customers;
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 13. SEED LIVE STARTER CONVERSATIONS FOR NISSI EXPLOITS
-- ---------------------------------------------------------------------------
do $$
declare
    v_ws_id uuid := 'f7d05015-fecc-4602-816c-ad5bf96e144f';
    v_c1_id uuid := gen_random_uuid();
    v_c2_id uuid := gen_random_uuid();
    v_c3_id uuid := gen_random_uuid();
    v_c4_id uuid := gen_random_uuid();
    v_c5_id uuid := gen_random_uuid();
    v_conv1_id uuid := gen_random_uuid();
    v_conv2_id uuid := gen_random_uuid();
    v_conv3_id uuid := gen_random_uuid();
    v_conv4_id uuid := gen_random_uuid();
    v_conv5_id uuid := gen_random_uuid();
begin
    -- Only seed if customers table is currently empty
    if not exists (select 1 from public.customers where workspace_id = v_ws_id) then
        -- 1. Jean-Pierre Fotso (WhatsApp)
        insert into public.customers (id, workspace_id, name, phone, channel_type, total_owed, total_paid, payment_promise_date, payment_promise_amount, ai_memory)
        values (
            v_c1_id, v_ws_id, 'Jean-Pierre Fotso', '+237 671 23 45 67', 'whatsapp', 550000, 200000, now() + interval '2 days', 550000,
            '{"facts": ["Préfère MTN Mobile Money (*126#)", "Boutique à Akwa Douala", "Livraison souhaitée vendredi 14h"], "objections": ["Demande si la garantie Apple 1 an est valide à Douala"]}'::jsonb
        );

        insert into public.conversations (id, workspace_id, customer_id, channel_type, status, triage_tag, ai_context_summary, unread_count, is_ai_active, last_message_at)
        values (
            v_conv1_id, v_ws_id, v_c1_id, 'whatsapp', 'ready_to_pay', 'ready_to_pay',
            'Prêt à verser l''acompte de 550 000 FCFA par MTN MoMo. En attente de validation.',
            1, true, now()
        );

        insert into public.messages (conversation_id, workspace_id, sender_type, sender_name, content, channel_type, created_at)
        values
            (v_conv1_id, v_ws_id, 'customer', 'Jean-Pierre Fotso', 'Bonjour M. Fotso. Je suis prêt à payer l''acompte de 550 000 FCFA pour les 10 iPhone 15s. Préférez-vous MTN MoMo ou virement Afriland ?', 'whatsapp', now() - interval '25 minutes'),
            (v_conv1_id, v_ws_id, 'ai', 'OmniSales AI Agent', 'Bonjour M. Fotso ! Ravi de vous lire. Vous pouvez payer instantanément par MTN MoMo au 671 23 45 67 ou via notre lien sécurisé : https://pay.omnisales.ai/fotso/inv-081. Dès réception, votre commande sera priorisée pour livraison à Akwa ce vendredi !', 'whatsapp', now() - interval '24 minutes'),
            (v_conv1_id, v_ws_id, 'customer', 'Jean-Pierre Fotso', 'J''ai initié le paiement MoMo, pouvez-vous me confirmer que les 550 000 FCFA sont bien reçus ?', 'whatsapp', now() - interval '10 minutes'),
            (v_conv1_id, v_ws_id, 'ai', 'OmniSales AI Agent', 'Notre passerelle vérifie la notification push MTN MoMo. J''alerte également notre gérant en direct pour valider votre reçu sans délai !', 'whatsapp', now() - interval '9 minutes');

        -- 2. Boris Atangana (Instagram)
        insert into public.customers (id, workspace_id, name, phone, channel_type, handle, total_owed, total_paid, ai_memory)
        values (
            v_c2_id, v_ws_id, 'Boris Atangana', '+237 699 87 65 43', 'instagram', '@boris_yaounde', 0, 150000,
            '{"facts": ["Événement pro à Bastos Yaoundé à 14h", "Colis expédié par agence express"], "objections": ["Contrarié par le retard de livraison"]}'::jsonb
        );

        insert into public.conversations (id, workspace_id, customer_id, channel_type, status, triage_tag, ai_context_summary, unread_count, is_ai_active, last_message_at)
        values (
            v_conv2_id, v_ws_id, v_c2_id, 'instagram', 'upset', 'upset',
            'Colis retardé entre Douala et Yaoundé. Client exigeant une solution avant 14h.',
            2, false, now() - interval '1 hour'
        );

        -- 3. Marie-Claire Ngo (Telegram)
        insert into public.customers (id, workspace_id, name, phone, channel_type, handle, total_owed, total_paid, ai_memory)
        values (
            v_c3_id, v_ws_id, 'Marie-Claire Ngo', '+237 655 44 33 22', 'telegram', '@marie_ngo', 320000, 0,
            '{"facts": ["Grossiste tissus brodés Bonanjo", "Commande prévisionnelle de 50 pièces"], "objections": ["Négocie remise supérieure à 10%"]}'::jsonb
        );

        insert into public.conversations (id, workspace_id, customer_id, channel_type, status, triage_tag, ai_context_summary, unread_count, is_ai_active, last_message_at)
        values (
            v_conv3_id, v_ws_id, v_c3_id, 'telegram', 'needs_human', 'asked_for_person',
            'Demande à parler à un responsable pour négocier un tarif grossiste sur 320 000 FCFA de tissus.',
            1, false, now() - interval '2 hours'
        );
    end if;
end $$;
