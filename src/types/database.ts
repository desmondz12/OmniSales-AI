export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "admin" | "member" | "viewer";
export type ContactStatus = "lead" | "prospect" | "customer" | "churned";

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
      user_role: UserRole;
      contact_status: ContactStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TenantMember = Database["public"]["Tables"]["tenant_members"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
