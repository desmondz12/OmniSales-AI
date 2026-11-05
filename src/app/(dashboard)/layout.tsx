import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { Profile, Tenant, TenantMember } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch tenant memberships with joined tenant details
  const { data: membershipData } = await supabase
    .from("tenant_members")
    .select("id, tenant_id, user_id, role, created_at, updated_at, tenants(id, name, slug, created_at, updated_at)")
    .eq("user_id", user.id);

  const activeMembershipRow = membershipData?.[0];
  const activeTenant = activeMembershipRow?.tenants as unknown as Tenant | null;
  const activeMembership = activeMembershipRow
    ? ({
        id: activeMembershipRow.id,
        tenant_id: activeMembershipRow.tenant_id,
        user_id: activeMembershipRow.user_id,
        role: activeMembershipRow.role,
        created_at: activeMembershipRow.created_at,
        updated_at: activeMembershipRow.updated_at,
      } as TenantMember)
    : null;

  return (
    <DashboardShell
      userEmail={user.email ?? ""}
      profile={profile as Profile | null}
      tenant={activeTenant}
      membership={activeMembership}
    >
      {children}
    </DashboardShell>
  );
}
