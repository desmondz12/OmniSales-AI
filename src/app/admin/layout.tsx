import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("omnisales_role")?.value;

  // Check Supabase session
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user || demoRole);

  if (!isAuthenticated) {
    redirect("/login?redirectTo=/admin");
  }

  // If a business client tries to access super admin, route them back to client dashboard
  if (demoRole === "business_client" && !user) {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}
