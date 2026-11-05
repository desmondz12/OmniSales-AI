import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceForm } from "./workspace-form";
import type { Tenant, TenantMember } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membershipData } = await supabase
    .from("tenant_members")
    .select("role, tenants(*)")
    .eq("user_id", user.id);

  const activeRow = membershipData?.[0];
  const activeTenant = activeRow?.tenants as unknown as Tenant | null;
  const role = (activeRow?.role as TenantMember["role"]) ?? "member";
  const canEdit = role === "owner" || role === "admin";

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-3 space-x-6 text-sm">
        <span className="font-semibold text-blue-400 border-b-2 border-blue-400 pb-3 -mb-3.5">
          Workspace Settings
        </span>
        <Link
          href="/dashboard/settings/profile"
          className="font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          My Profile
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Workspace Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your organization name and general settings.
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">General Information</CardTitle>
            <CardDescription>
              Your organization details visible to team members.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTenant ? (
              <WorkspaceForm tenant={activeTenant} canEdit={canEdit} />
            ) : (
              <p className="text-sm text-slate-400">
                No active workspace attached to this account.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
