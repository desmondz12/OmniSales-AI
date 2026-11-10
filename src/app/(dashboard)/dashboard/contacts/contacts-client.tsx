"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import type { Company, Contact, ContactStatus } from "@/types/database";

interface ContactWithCompany extends Contact {
  companies?: Company | null;
}

interface ContactsClientProps {
  tenantId: string;
  initialContacts: ContactWithCompany[];
  initialCompanies: Company[];
}

export function ContactsClient({
  tenantId,
  initialContacts,
  initialCompanies,
}: ContactsClientProps) {
  const router = useRouter();

  // State
  const [contacts, setContacts] = React.useState<ContactWithCompany[]>(initialContacts);
  const [companies, setCompanies] = React.useState<Company[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Modals state
  const [isAddContactOpen, setIsAddContactOpen] = React.useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<ContactWithCompany | null>(null);
  const [deletingContact, setDeletingContact] = React.useState<ContactWithCompany | null>(null);

  // Form states
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Form values for Contact (New or Edit)
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [status, setStatus] = React.useState<ContactStatus>("lead");
  const [companyId, setCompanyId] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");

  // Form values for Company
  const [companyName, setCompanyName] = React.useState("");
  const [companyDomain, setCompanyDomain] = React.useState("");
  const [companyIndustry, setCompanyIndustry] = React.useState("");

  const resetContactForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setJobTitle("");
    setStatus("lead");
    setCompanyId("");
    setNotes("");
    setErrorMessage(null);
  };

  const openEditModal = (contact: ContactWithCompany) => {
    setEditingContact(contact);
    setFirstName(contact.first_name);
    setLastName(contact.last_name);
    setEmail(contact.email);
    setPhone(contact.phone || "");
    setJobTitle(contact.job_title || "");
    setStatus(contact.status);
    setCompanyId(contact.company_id || "");
    setNotes(contact.notes || "");
    setErrorMessage(null);
  };

  // Filtered contacts
  const filteredContacts = React.useMemo(() => {
    return contacts.filter((c) => {
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      const contactEmail = c.email.toLowerCase();
      const compName = c.companies?.name.toLowerCase() || "";
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        contactEmail.includes(searchQuery.toLowerCase()) ||
        compName.includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || c.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, selectedStatus]);

  // Handle Create Contact
  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage("First name, last name, and email are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          tenant_id: tenantId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          job_title: jobTitle.trim() || null,
          status,
          company_id: companyId || null,
          notes: notes.trim() || null,
        })
        .select("*, companies(*)")
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setContacts((prev) => [data as ContactWithCompany, ...prev]);
      setIsAddContactOpen(false);
      resetContactForm();
      router.refresh();
    } catch {
      setErrorMessage("Failed to create contact. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit Contact
  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage("First name, last name, and email are required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          job_title: jobTitle.trim() || null,
          status,
          company_id: companyId || null,
          notes: notes.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingContact.id)
        .select("*, companies(*)")
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? (data as ContactWithCompany) : c))
      );
      setEditingContact(null);
      resetContactForm();
      router.refresh();
    } catch {
      setErrorMessage("Failed to update contact.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Contact
  const handleDeleteContact = async () => {
    if (!deletingContact) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", deletingContact.id);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
      setDeletingContact(null);
      router.refresh();
    } catch {
      setErrorMessage("Failed to delete contact.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Create Company
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setErrorMessage("Company name is required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("companies")
        .insert({
          tenant_id: tenantId,
          name: companyName.trim(),
          domain: companyDomain.trim() || null,
          industry: companyIndustry.trim() || null,
        })
        .select("*")
        .single();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setCompanies((prev) => [...prev, data as Company]);
      setCompanyId(data.id); // Auto-select new company
      setIsAddCompanyOpen(false);
      setCompanyName("");
      setCompanyDomain("");
      setCompanyIndustry("");
    } catch {
      setErrorMessage("Failed to create company.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
            Contacts & Entreprises
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            {contacts.length} {contacts.length === 1 ? "contact enregistré" : "contacts enregistrés"} dans votre espace client
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setErrorMessage(null);
              setIsAddCompanyOpen(true);
            }}
            className="apple-press rounded-2xl border-slate-200/80 bg-white/80 hover:bg-slate-100/70 text-xs font-medium"
          >
            <Building2 className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            Nouvelle Entreprise
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetContactForm();
              setIsAddContactOpen(true);
            }}
            className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-3.5"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Ajouter un Contact
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar: Apple Segmented Glass Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white/80 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
          />
        </div>

        {/* Status Filters (Apple Segmented Style) */}
        <div className="flex items-center space-x-1 overflow-x-auto p-1 bg-slate-100/70 rounded-2xl no-scrollbar">
          {[
            { label: "Tous", value: "all" },
            { label: "Leads", value: "lead" },
            { label: "Prospects", value: "prospect" },
            { label: "Clients", value: "customer" },
            { label: "Inactifs", value: "churned" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSelectedStatus(item.value)}
              className={`apple-press rounded-xl px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === item.value
                  ? "bg-white text-slate-900 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List / Table */}
      {filteredContacts.length === 0 ? (
        <Card className="apple-glass-card rounded-3xl border border-slate-200/60 p-12 text-center">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0071E3]/10 text-[#0071E3] mb-3">
              <Users className="h-6 w-6" />
            </div>
            {contacts.length === 0 ? (
              <>
                <p className="text-base font-semibold tracking-tight text-slate-900">
                  Aucun contact pour l&apos;instant
                </p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Commencez à structurer votre portefeuille en créant votre premier contact.
                </p>
                <Button
                  size="sm"
                  className="apple-press mt-4 rounded-2xl bg-[#0071E3] text-white text-xs font-medium"
                  onClick={() => {
                    resetContactForm();
                    setIsAddContactOpen(true);
                  }}
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Ajouter un Contact
                </Button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold tracking-tight text-slate-900">
                  Aucun contact trouvé
                </p>
                <p className="mt-1 text-xs text-slate-500 max-w-sm">
                  Aucun contact ne correspond à votre recherche ou filtre actuel.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="apple-press mt-4 rounded-2xl text-xs font-medium"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Entreprise
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Téléphone
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0071E3]/10 font-semibold text-xs text-[#0071E3] border border-[#0071E3]/20">
                          {contact.first_name.charAt(0)}
                          {contact.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900 tracking-tight">
                            {contact.first_name} {contact.last_name}
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="flex items-center">
                              <Mail className="mr-1 h-3 w-3" />
                              {contact.email}
                            </span>
                            {contact.job_title && (
                              <>
                                <span>•</span>
                                <span>{contact.job_title}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {contact.companies?.name ? (
                        <div className="flex items-center space-x-1.5 text-slate-800">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">
                            {contact.companies.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={contact.status} className="capitalize rounded-full text-[10px] font-semibold px-2 py-0.5">
                        {contact.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {contact.phone ? (
                        <span className="flex items-center">
                          <Phone className="mr-1.5 h-3 w-3 text-slate-400" />
                          {contact.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(contact)}
                          className="apple-press rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                          aria-label={`Modifier ${contact.first_name}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingContact(contact)}
                          className="apple-press rounded-xl p-1.5 text-slate-400 hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] transition-colors cursor-pointer"
                          aria-label={`Supprimer ${contact.first_name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE CONTACT DIALOG */}
      <Dialog
        isOpen={isAddContactOpen}
        onClose={() => {
          if (!isLoading) setIsAddContactOpen(false);
        }}
        title="Ajouter un Contact"
        description="Renseignez les coordonnées du prospect ou client pour l'ajouter à votre CRM."
      >
        <form onSubmit={handleCreateContact} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Prénom"
              type="text"
              placeholder="Ex: Sarah"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Nom"
              type="text"
              placeholder="Ex: Connor"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              placeholder="sarah@example.cm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Téléphone / WhatsApp"
              type="tel"
              placeholder="+237 6XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Poste / Fonction"
              type="text"
              placeholder="Directrice des Achats"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading}
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              >
                <option value="lead">Lead (Contact initial)</option>
                <option value="prospect">Prospect qualifié</option>
                <option value="customer">Client actif</option>
                <option value="churned">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Entreprise associée
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            >
              <option value="">Aucune entreprise associée</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Notes & Commentaires
            </label>
            <textarea
              rows={3}
              placeholder="Notes sur les préférences d'achat ou le canal de contact préféré..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddContactOpen(false)}
              disabled={isLoading}
              className="apple-press rounded-2xl text-xs font-medium"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Dialog>

      {/* EDIT CONTACT DIALOG */}
      <Dialog
        isOpen={Boolean(editingContact)}
        onClose={() => {
          if (!isLoading) setEditingContact(null);
        }}
        title="Modifier le Contact"
        description="Mettez à jour les coordonnées et les préférences de votre client."
      >
        <form onSubmit={handleUpdateContact} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Prénom"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Nom"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Poste"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading}
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Client</option>
                <option value="churned">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Entreprise
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            >
              <option value="">Aucune entreprise</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingContact(null)}
              disabled={isLoading}
              className="apple-press rounded-2xl text-xs font-medium"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4"
            >
              Mettre à jour
            </Button>
          </div>
        </form>
      </Dialog>

      {/* CREATE COMPANY DIALOG */}
      <Dialog
        isOpen={isAddCompanyOpen}
        onClose={() => {
          if (!isLoading) setIsAddCompanyOpen(false);
        }}
        title="Créer une Entreprise"
        description="Ajoutez un compte d'entreprise pour le rattacher à vos contacts."
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Input
            label="Nom de l'entreprise"
            type="text"
            placeholder="Ex: Société Camerounaise de Distribution SARL"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            label="Site Web / Domaine"
            type="text"
            placeholder="ex: distribution.cm"
            value={companyDomain}
            onChange={(e) => setCompanyDomain(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Secteur d'activité"
            type="text"
            placeholder="Ex: Commerce de gros / BTP / Agroalimentaire"
            value={companyIndustry}
            onChange={(e) => setCompanyIndustry(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCompanyOpen(false)}
              disabled={isLoading}
              className="apple-press rounded-2xl text-xs font-medium"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4"
            >
              Créer l&apos;Entreprise
            </Button>
          </div>
        </form>
      </Dialog>

      {/* DELETE CONTACT CONFIRMATION DIALOG */}
      <Dialog
        isOpen={Boolean(deletingContact)}
        onClose={() => {
          if (!isLoading) setDeletingContact(null);
        }}
        title="Supprimer le Contact"
        description={`Êtes-vous sûr de vouloir supprimer ${deletingContact?.first_name} ${deletingContact?.last_name} ? Cette action est irréversible.`}
      >
        <div className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingContact(null)}
              disabled={isLoading}
              className="apple-press rounded-2xl text-xs font-medium"
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteContact}
              isLoading={isLoading}
              disabled={isLoading}
              className="apple-press rounded-2xl bg-[#FF3B30] hover:bg-[#D70015] text-white text-xs font-medium px-4"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
