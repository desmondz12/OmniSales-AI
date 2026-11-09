import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import type { Profile } from "@/types/database";

export default async function ProfileSettingsPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("omnisales_role")?.value;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !demoRole) {
    redirect("/login?redirectTo=/dashboard/settings/profile");
  }

  let profile: Profile | null = null;

  if (user) {
    try {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      profile = p;
    } catch {
      // Fallback below
    }
  }

  if (!profile) {
    profile = {
      id: "demo-user-fotso",
      email: demoRole === "super_admin" ? "admin@omnisales.cm" : "jeanluc@fotsotrading.cm",
      full_name: demoRole === "super_admin" ? "SaaS Super Admin" : "Jean-Luc Fotso",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 pb-3 space-x-6 text-sm">
        <Link
          href="/dashboard/settings"
          className="font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Paramètres Espace Client
        </Link>
        <span className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3.5">
          Profil Utilisateur
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Mon Profil
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gérez vos informations de compte, coordonnées et préférences de notification.
        </p>
      </div>

      <ProfileForm
        userEmail={profile.email}
        userId={profile.id}
        profile={profile}
      />
    </div>
  );
}
