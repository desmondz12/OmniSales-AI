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
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Contacts & Accounts
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {contacts.length} {contacts.length === 1 ? "contact" : "contacts"} recorded in your workspace
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setErrorMessage(null);
              setIsAddCompanyOpen(true);
            }}
          >
            <Building2 className="mr-1.5 h-4 w-4" />
            New Company
          </Button>
          <Button
            size="sm"
            onClick={() => {
              resetContactForm();
              setIsAddContactOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "All", value: "all" },
            { label: "Leads", value: "lead" },
            { label: "Prospects", value: "prospect" },
            { label: "Customers", value: "customer" },
            { label: "Churned", value: "churned" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSelectedStatus(item.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedStatus === item.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List / Table */}
      {filteredContacts.length === 0 ? (
        <Card className="border-slate-800 bg-slate-900/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-500 mb-3">
              <Users className="h-7 w-7" />
            </div>
            {contacts.length === 0 ? (
              <>
                <p className="text-base font-semibold text-white">
                  No contacts in your workspace
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  Start building your sales network by adding your first lead or customer contact.
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    resetContactForm();
                    setIsAddContactOpen(true);
                  }}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add First Contact
                </Button>
              </>
            ) : (
              <>
                <p className="text-base font-semibold text-white">
                  No contacts found
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  No contacts match your current search or status filter. Try resetting your filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-950 font-bold text-blue-400 border border-blue-900/60">
                          {contact.first_name.charAt(0)}
                          {contact.last_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {contact.first_name} {contact.last_name}
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
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
                        <div className="flex items-center space-x-1.5 text-slate-200">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">
                            {contact.companies.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={contact.status} className="capitalize">
                        {contact.status}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {contact.phone ? (
                        <span className="flex items-center">
                          <Phone className="mr-1.5 h-3 w-3 text-slate-500" />
                          {contact.phone}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(contact)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          aria-label={`Edit ${contact.first_name}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingContact(contact)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-950/50 hover:text-red-400 transition-colors"
                          aria-label={`Delete ${contact.first_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
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
        title="Add New Contact"
        description="Enter the lead or customer details to add them to your CRM."
      >
        <form onSubmit={handleCreateContact} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="First Name"
              type="text"
              placeholder="Sarah"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Last Name"
              type="text"
              placeholder="Connor"
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
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Job Title"
              type="text"
              placeholder="VP of Sales"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading}
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Company / Account
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Company Assigned</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Key notes, context, or meeting summaries..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddContactOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Save Contact
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
        title="Edit Contact"
        description="Update contact information and details."
      >
        <form onSubmit={handleUpdateContact} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
            <Input
              label="Last Name"
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
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Job Title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isLoading}
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContactStatus)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
                <option value="churned">Churned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Company / Account
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Company Assigned</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingContact(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Update Contact
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
        title="Create New Company"
        description="Add a company account to associate with your contacts."
      >
        <form onSubmit={handleCreateCompany} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Input
            label="Company Name"
            type="text"
            placeholder="Acme Technologies Ltd"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isLoading}
            required
          />

          <Input
            label="Domain / Website"
            type="text"
            placeholder="acme.com"
            value={companyDomain}
            onChange={(e) => setCompanyDomain(e.target.value)}
            disabled={isLoading}
          />

          <Input
            label="Industry"
            type="text"
            placeholder="SaaS / Fintech / Healthcare"
            value={companyIndustry}
            onChange={(e) => setCompanyIndustry(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddCompanyOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Create Company
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
        title="Delete Contact"
        description={`Are you sure you want to delete ${deletingContact?.first_name} ${deletingContact?.last_name}? This action cannot be undone.`}
      >
        <div className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Delete Failed</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingContact(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteContact}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Delete Contact
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
