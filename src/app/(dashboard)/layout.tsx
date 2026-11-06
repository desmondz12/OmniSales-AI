import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { Profile, Tenant, TenantMember } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("omnisales_role")?.value;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user || demoRole);

  if (!isAuthenticated) {
    redirect("/login?redirectTo=/dashboard");
  }

  // Fetch or mock profile & tenant
  let profile: Profile | null = null;
  let activeTenant: Tenant | null = null;
  let activeMembership: TenantMember | null = null;
  const email =
    user?.email ??
    (demoRole === "super_admin" ? "admin@omnisales.cm" : "jeanluc@fotsotrading.cm");

  if (user) {
    try {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = p;

      const { data: membershipData } = await supabase
        .from("tenant_members")
        .select(
          "id, tenant_id, user_id, role, created_at, updated_at, tenants(id, name, slug, created_at, updated_at)"
        )
        .eq("user_id", user.id);

      const activeMembershipRow = membershipData?.[0];
      activeTenant = activeMembershipRow?.tenants as unknown as Tenant | null;
      activeMembership = activeMembershipRow
        ? ({
            id: activeMembershipRow.id,
            tenant_id: activeMembershipRow.tenant_id,
            user_id: activeMembershipRow.user_id,
            role: activeMembershipRow.role,
            created_at: activeMembershipRow.created_at,
            updated_at: activeMembershipRow.updated_at,
          } as TenantMember)
        : null;
    } catch {
      // Graceful fallback to demo data if tables don't exist yet
    }
  }

  // Fallback demo workspace for instant testing and sandbox stability
  if (!profile && demoRole) {
    profile = {
      id: "demo-user-fotso",
      email,
      full_name: demoRole === "super_admin" ? "Super Admin" : "Jean-Luc Fotso",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    activeTenant = {
      id: "demo-tenant-fotso",
      name: "Fotso Distribution Douala",
      slug: "fotso-distribution",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    activeMembership = {
      id: "demo-membership-fotso",
      tenant_id: "demo-tenant-fotso",
      user_id: "demo-user-fotso",
      role: demoRole === "super_admin" ? "owner" : "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <DashboardShell
      userEmail={email}
      profile={profile}
      tenant={activeTenant}
      membership={activeMembership}
    >
      {children}
    </DashboardShell>
  );
}
