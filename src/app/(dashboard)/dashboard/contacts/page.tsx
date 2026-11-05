import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactsClient } from "./contacts-client";
import type { Company, Contact } from "@/types/database";

interface ContactWithCompany extends Contact {
  companies?: Company | null;
}

export default async function ContactsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get active tenant membership
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership?.tenant_id) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active tenant workspace found for your account.
      </div>
    );
  }

  const tenantId = membership.tenant_id;

  // Fetch contacts belonging to this tenant with company relations
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*, companies(*)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  // Fetch companies belonging to this tenant
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("name", { ascending: true });

  return (
    <ContactsClient
      key={`${tenantId}-${contacts?.length ?? 0}`}
      tenantId={tenantId}
      initialContacts={(contacts as unknown as ContactWithCompany[]) || []}
      initialCompanies={(companies as Company[]) || []}
    />
  );
}
