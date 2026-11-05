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
import { ProfileForm } from "./profile-form";
import type { Profile } from "@/types/database";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-3 space-x-6 text-sm">
        <Link
          href="/dashboard/settings"
          className="font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          Workspace Settings
        </Link>
        <span className="font-semibold text-blue-400 border-b-2 border-blue-400 pb-3 -mb-3.5">
          My Profile
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your personal account profile details.
        </p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg">Personal Details</CardTitle>
            <CardDescription>
              Your personal information visible to colleagues in your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm
              userEmail={user.email ?? ""}
              userId={user.id}
              profile={profile as Profile | null}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
