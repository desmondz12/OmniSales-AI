import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkspaceForm } from "./workspace-form";
import type { Tenant, TenantMember } from "@/types/database";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("omnisales_role")?.value;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !demoRole) {
    redirect("/login?redirectTo=/dashboard/settings");
  }

  let activeTenant: Tenant | null = null;
  let role: TenantMember["role"] = demoRole === "super_admin" ? "owner" : "admin";

  if (user) {
    try {
      const { data: membershipData } = await supabase
        .from("tenant_members")
        .select("role, tenants(*)")
        .eq("user_id", user.id);

      const activeRow = membershipData?.[0];
      if (activeRow?.tenants) {
        activeTenant = activeRow.tenants as unknown as Tenant;
      }
      if (activeRow?.role) {
        role = activeRow.role as TenantMember["role"];
      }
    } catch {
      // Fallback below
    }
  }

  if (!activeTenant) {
    activeTenant = {
      id: "demo-tenant-fotso",
      name: "Fotso Distribution Douala",
      slug: "fotso-distribution",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const canEdit = role === "owner" || role === "admin";

  return (
    <div className="space-y-6 font-sans">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border-button-default pb-3 space-x-6 text-sm">
        <span className="font-semibold text-accent-600 border-b-2 border-accent-600 pb-3 -mb-3.5">
          Paramètres Espace Client
        </span>
        <Link
          href="/dashboard/settings/profile"
          className="font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Profil Utilisateur
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Paramètres Espace Client (Workspace)
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gérez l&apos;identité commerciale de votre entreprise, vos canaux connectés et les permissions.
        </p>
      </div>

      <WorkspaceForm tenant={activeTenant} canEdit={canEdit} />
    </div>
  );
}