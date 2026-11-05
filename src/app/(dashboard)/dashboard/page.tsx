import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ShieldCheck, User } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Validate session securely
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

  // Fetch tenant memberships
  const { data: memberships } = await supabase
    .from("tenant_members")
    .select("role, tenants(id, name, slug)")
    .eq("user_id", user.id);

  const activeMembership = memberships?.[0];
  const activeTenant = activeMembership?.tenants as
    | { id: string; name: string; slug: string }
    | undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold tracking-tight text-white">
              {APP_NAME}
            </span>
            {activeTenant && (
              <span className="rounded-full bg-blue-950/80 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-800/50">
                {activeTenant.name}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome, {profile?.full_name || user.email?.split("@")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Phase 1 is complete! Real Supabase authentication and multi-tenancy are working.
          </p>
        </div>

        {/* Tenant & Profile Information Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Workspace / Tenant
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">
                {activeTenant?.name ?? "No Tenant Attached"}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Slug: {activeTenant?.slug ?? "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Your Role
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold capitalize text-white">
                {activeMembership?.role ?? "Member"}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Role Level Security enforced
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Auth Status
              </CardTitle>
              <User className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">Verified</div>
              <p className="text-xs text-slate-400 mt-1 truncate">
                UID: {user.id.slice(0, 12)}...
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Next Phase Notice */}
        <Card className="border-slate-800 bg-slate-900/30">
          <CardHeader>
            <CardTitle className="text-lg">What&apos;s next?</CardTitle>
            <CardDescription>
              In <strong>Phase 2</strong>, we will implement the full Dashboard shell, sidebar navigation, tenant switching, user profile settings, and theme customization.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
