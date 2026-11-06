import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContactsClient } from "./contacts-client";
import type { Company, Contact } from "@/types/database";

interface ContactWithCompany extends Contact {
  companies?: Company | null;
}

const DEMO_CONTACTS: ContactWithCompany[] = [
  {
    id: "contact-1",
    tenant_id: "demo-tenant-fotso",
    first_name: "Jean-Pierre",
    last_name: "Fotso",
    email: "jp.fotso@chantier-douala.cm",
    phone: "+237 671 23 45 67",
    job_title: "Directeur des Achats",
    status: "customer",
    company_id: "comp-1",
    notes: "Prêt pour commande de ciment 550 000 FCFA",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: {
      id: "comp-1",
      tenant_id: "demo-tenant-fotso",
      name: "Chantiers & BTP du Wouri SARL",
      domain: "chantier-douala.cm",
      industry: "Construction & BTP",
      phone: "+237 233 42 10 20",
      address: "Zone Industrielle Bassa, Douala",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "contact-2",
    tenant_id: "demo-tenant-fotso",
    first_name: "Boris",
    last_name: "Atangana",
    email: "boris.atangana@yaounde-log.cm",
    phone: "+237 699 87 65 43",
    job_title: "Gérant",
    status: "customer",
    company_id: "comp-2",
    notes: "Réclamation sur livraison Bastos",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    companies: {
      id: "comp-2",
      tenant_id: "demo-tenant-fotso",
      name: "Atangana Logistique Yaoundé",
      domain: "yaounde-log.cm",
      industry: "Transport & Logistique",
      phone: "+237 222 21 00 11",
      address: "Bastos, Yaoundé",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

const DEMO_COMPANIES: Company[] = [
  {
    id: "comp-1",
    tenant_id: "demo-tenant-fotso",
    name: "Chantiers & BTP du Wouri SARL",
    domain: "chantier-douala.cm",
    industry: "Construction & BTP",
    phone: "+237 233 42 10 20",
    address: "Zone Industrielle Bassa, Douala",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "comp-2",
    tenant_id: "demo-tenant-fotso",
    name: "Atangana Logistique Yaoundé",
    domain: "yaounde-log.cm",
    industry: "Transport & Logistique",
    phone: "+237 222 21 00 11",
    address: "Bastos, Yaoundé",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function ContactsPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get("omnisales_role")?.value;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !demoRole) {
    redirect("/login?redirectTo=/dashboard/contacts");
  }

  let tenantId = "demo-tenant-fotso";
  let contacts: ContactWithCompany[] = DEMO_CONTACTS;
  let companies: Company[] = DEMO_COMPANIES;

  if (user) {
    try {
      const { data: membership } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (membership?.tenant_id) {
        tenantId = membership.tenant_id;

        const { data: liveContacts } = await supabase
          .from("contacts")
          .select("*, companies(*)")
          .eq("tenant_id", tenantId)
          .order("created_at", { ascending: false });

        if (liveContacts && liveContacts.length > 0) {
          contacts = liveContacts as unknown as ContactWithCompany[];
        }

        const { data: liveCompanies } = await supabase
          .from("companies")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("name", { ascending: true });

        if (liveCompanies && liveCompanies.length > 0) {
          companies = liveCompanies as Company[];
        }
      }
    } catch {
      // Fallback to demo data
    }
  }

  return (
    <ContactsClient
      key={`${tenantId}-${contacts?.length ?? 0}`}
      tenantId={tenantId}
      initialContacts={contacts}
      initialCompanies={companies}
    />
  );
}
