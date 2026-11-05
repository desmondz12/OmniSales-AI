export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppUserRole = "super_admin" | "business_client";
export type UserRole = "owner" | "admin" | "member" | "viewer";
export type WorkspaceStatus = "active" | "trial" | "suspended";
export type ChannelType = "whatsapp" | "instagram" | "messenger" | "tiktok" | "telegram";
export type ChannelStatus = "connected" | "reconnect_needed" | "disconnected";
export type ConversationStatus = "needs_human" | "ai_handling" | "ready_to_pay" | "upset" | "closed";
export type TriageTag = "ready_to_pay" | "upset" | "asked_for_person" | "promise_due" | "paid" | "none";
export type MessageSender = "customer" | "ai" | "human";
export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";
export type ContactStatus = "lead" | "prospect" | "customer" | "churned";

export interface CustomerMemory {
  facts: string[];
  preferences: Record<string, string>;
  objections: string[];
  preferred_language: string;
}

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tenant_members: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tenant_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      companies: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          domain: string | null;
          industry: string | null;
          phone: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          domain?: string | null;
          industry?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          domain?: string | null;
          industry?: string | null;
          phone?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "companies_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          id: string;
          tenant_id: string;
          company_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          job_title: string | null;
          status: ContactStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          company_id?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          job_title?: string | null;
          status?: ContactStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          company_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          job_title?: string | null;
          status?: ContactStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contacts_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_email: string | null;
          plan: string;
          status: WorkspaceStatus;
          mrr: number;
          ai_token_limit: number;
          ai_tokens_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_email?: string | null;
          plan?: string;
          status?: WorkspaceStatus;
          mrr?: number;
          ai_token_limit?: number;
          ai_tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          owner_email?: string | null;
          plan?: string;
          status?: WorkspaceStatus;
          mrr?: number;
          ai_token_limit?: number;
          ai_tokens_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      channels: {
        Row: {
          id: string;
          workspace_id: string;
          type: ChannelType;
          name: string;
          status: ChannelStatus;
          ai_auto_reply: boolean;
          handle: string | null;
          phone_number: string | null;
          credentials: Record<string, Json>;
          last_synced_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          type: ChannelType;
          name: string;
          status?: ChannelStatus;
          ai_auto_reply?: boolean;
          handle?: string | null;
          phone_number?: string | null;
          credentials?: Record<string, Json>;
          last_synced_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          type?: ChannelType;
          name?: string;
          status?: ChannelStatus;
          ai_auto_reply?: boolean;
          handle?: string | null;
          phone_number?: string | null;
          credentials?: Record<string, Json>;
          last_synced_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "channels_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          phone: string | null;
          email: string | null;
          channel_type: ChannelType;
          handle: string | null;
          avatar_url: string | null;
          total_owed: number;
          total_paid: number;
          payment_promise_date: string | null;
          payment_promise_amount: number | null;
          ai_memory: CustomerMemory;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          phone?: string | null;
          email?: string | null;
          channel_type: ChannelType;
          handle?: string | null;
          avatar_url?: string | null;
          total_owed?: number;
          total_paid?: number;
          payment_promise_date?: string | null;
          payment_promise_amount?: number | null;
          ai_memory?: CustomerMemory;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          name?: string;
          phone?: string | null;
          email?: string | null;
          channel_type?: ChannelType;
          handle?: string | null;
          avatar_url?: string | null;
          total_owed?: number;
          total_paid?: number;
          payment_promise_date?: string | null;
          payment_promise_amount?: number | null;
          ai_memory?: CustomerMemory;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customers_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          id: string;
          workspace_id: string;
          customer_id: string;
          channel_type: ChannelType;
          status: ConversationStatus;
          triage_tag: TriageTag;
          ai_context_summary: string | null;
          unread_count: number;
          is_ai_active: boolean;
          claimed_by: string | null;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          customer_id: string;
          channel_type: ChannelType;
          status?: ConversationStatus;
          triage_tag?: TriageTag;
          ai_context_summary?: string | null;
          unread_count?: number;
          is_ai_active?: boolean;
          claimed_by?: string | null;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          customer_id?: string;
          channel_type?: ChannelType;
          status?: ConversationStatus;
          triage_tag?: TriageTag;
          ai_context_summary?: string | null;
          unread_count?: number;
          is_ai_active?: boolean;
          claimed_by?: string | null;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversations_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          workspace_id: string;
          sender_type: MessageSender;
          sender_name: string;
          content: string;
          channel_type: ChannelType;
          metadata: Record<string, Json>;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          workspace_id: string;
          sender_type: MessageSender;
          sender_name: string;
          content: string;
          channel_type: ChannelType;
          metadata?: Record<string, Json>;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          workspace_id?: string;
          sender_type?: MessageSender;
          sender_name?: string;
          content?: string;
          channel_type?: ChannelType;
          metadata?: Record<string, Json>;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          workspace_id: string;
          customer_id: string;
          invoice_number: string;
          amount: number;
          amount_paid: number;
          due_date: string;
          status: InvoiceStatus;
          payment_link: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          customer_id: string;
          invoice_number: string;
          amount: number;
          amount_paid?: number;
          due_date: string;
          status?: InvoiceStatus;
          payment_link?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          customer_id?: string;
          invoice_number?: string;
          amount?: number;
          amount_paid?: number;
          due_date?: string;
          status?: InvoiceStatus;
          payment_link?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      system_logs: {
        Row: {
          id: string;
          workspace_id: string | null;
          event_type: string;
          channel_type: ChannelType | null;
          status: string;
          message: string;
          latency_ms: number;
          metadata: Record<string, Json>;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id?: string | null;
          event_type: string;
          channel_type?: ChannelType | null;
          status: string;
          message: string;
          latency_ms?: number;
          metadata?: Record<string, Json>;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          event_type?: string;
          channel_type?: ChannelType | null;
          status?: string;
          message?: string;
          latency_ms?: number;
          metadata?: Record<string, Json>;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_tenant_member: {
        Args: {
          target_tenant_id: string;
        };
        Returns: boolean;
      };
      is_tenant_admin: {
        Args: {
          target_tenant_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_user_role: AppUserRole;
      user_role: UserRole;
      workspace_status: WorkspaceStatus;
      channel_type: ChannelType;
      channel_status: ChannelStatus;
      conversation_status: ConversationStatus;
      triage_tag: TriageTag;
      message_sender: MessageSender;
      invoice_status: InvoiceStatus;
      contact_status: ContactStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TenantMember = Database["public"]["Tables"]["tenant_members"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Channel = Database["public"]["Tables"]["channels"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"] & {
  customers?: Customer | null;
};
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"] & {
  customers?: Customer | null;
};
export type SystemLog = Database["public"]["Tables"]["system_logs"]["Row"];
