import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  Plus,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .single();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here is what&apos;s happening in your sales pipeline today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/contacts"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "font-semibold shadow-md",
            })}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Contact
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards with Real Zero States (No Fake Mock Data per Rule 10) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Total Contacts
            </CardTitle>
            <div className="rounded-md bg-blue-950/60 p-2 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="mt-1 text-xs text-slate-500">
              No contacts created yet • Coming in Phase 3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Active Pipeline Value
            </CardTitle>
            <div className="rounded-md bg-emerald-950/60 p-2 text-emerald-400">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0.00</div>
            <p className="mt-1 text-xs text-slate-500">
              0 active deals • Coming in Phase 4
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              Pending Collections
            </CardTitle>
            <div className="rounded-md bg-amber-950/60 p-2 text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$0.00</div>
            <p className="mt-1 text-xs text-slate-500">
              0 outstanding invoices • Coming in Phase 5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Checklist & Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Onboarding Checklist (2 Cols) */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Workspace Setup Guide</CardTitle>
                <CardDescription>
                  Follow these steps to complete setting up your sales organization
                </CardDescription>
              </div>
              <span className="rounded-full bg-blue-950 px-2.5 py-1 text-xs font-semibold text-blue-400 border border-blue-800">
                1 of 3 Complete
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 rounded-lg border border-slate-800 bg-slate-900/40 p-3.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white line-through opacity-75">
                  1. Create Account & Workspace
                </p>
                <p className="text-xs text-slate-400">
                  Authentication and workspace isolation configured via Supabase.
                </p>
              </div>
            </div>

            <div className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-3.5">
              <div className="flex items-start space-x-3">
                <Circle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">
                    2. Customize Workspace Profile
                  </p>
                  <p className="text-xs text-slate-400">
                    Set up your team profile and organization details in settings.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/settings"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "shrink-0 ml-2 text-xs",
                })}
              >
                Configure
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex items-start justify-between rounded-lg border border-slate-800/60 bg-slate-950/40 p-3.5 opacity-70">
              <div className="flex items-start space-x-3">
                <Circle className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    3. Add Your First Contact
                  </p>
                  <p className="text-xs text-slate-500">
                    Import or create leads and customer accounts (Phase 3).
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Phase 3
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Feed Empty State (1 Col) */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Real-time audit log of team actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/80 text-slate-500 mb-3">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No activity yet</p>
            <p className="mt-1 text-xs text-slate-500 max-w-[200px]">
              When you or your team create contacts, log notes, or advance deals, events will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
