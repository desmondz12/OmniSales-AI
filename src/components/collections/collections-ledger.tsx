"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  Search,
  Send,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Invoice, InvoiceStatus } from "@/types/database";

interface CollectionsLedgerProps {
  initialInvoices: Invoice[];
}

export function CollectionsLedger({ initialInvoices }: CollectionsLedgerProps) {
  const [invoices, setInvoices] = React.useState<Invoice[]>(initialInvoices);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] =
    React.useState<Invoice | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mark invoice as paid / reconciled
  const handleMarkPaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: "paid" as InvoiceStatus, updated_at: new Date().toISOString() }
          : inv
      )
    );
    showToast("Facture marquée comme soldée et rapprochée avec le relevé MoMo !");
  };

  // Send WhatsApp automated dunning reminder
  const handleSendReminder = (inv: Invoice) => {
    setSelectedInvoiceForReminder(null);
    showToast(
      `Relance WhatsApp envoyée à ${inv.customers?.name || "Client"} avec lien MoMo/Orange Money !`
    );
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    const clientName = inv.customers?.name?.toLowerCase() || "";
    const invNum = inv.invoice_number?.toLowerCase() || "";
    const matchesSearch =
      searchQuery.trim() === "" ||
      clientName.includes(searchQuery.toLowerCase()) ||
      invNum.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Aging Metrics
  const totalReceivables = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");
  const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisWeek = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Recouvrement & Gestion des Créances
            </h1>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40">
              {invoices.filter((i) => i.status === "overdue").length} En retard
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Suivi des factures impayées, relances automatiques par WhatsApp et réconciliation MoMo / OM.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="rounded-full border-border-button-default text-text-secondary hover:text-text-primary hover:bg-background-secondary-default text-xs font-medium"
            onClick={() => showToast("Export du grand livre de recouvrement généré (.CSV)")}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exporter CSV
          </Button>
          <Button
            className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-medium text-xs shadow-xs"
            onClick={() => {
              showToast("Campagne de relance IA lancée pour tous les clients en retard !");
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Relancer Tous les Retards (IA)
          </Button>
        </div>
      </div>

      {/* 4 KPI Summary Cards (BoardUI metrics) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-text-tertiary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Créances Dues Totales</span>
              <Wallet className="h-4 w-4 text-accent-600" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-text-primary">
              {totalReceivables.toLocaleString("fr-FR")} <span className="text-xs font-medium text-text-tertiary">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-text-secondary">
              Sur 4 clients actifs
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-text-tertiary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Montant en Retard</span>
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-rose-600 dark:text-rose-400">
              {overdueTotal.toLocaleString("fr-FR")} <span className="text-xs font-medium text-text-tertiary">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-400 font-medium">
              Nécessite relance immédiate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-text-tertiary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Encaissé Récent (MoMo/OM)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
              {paidThisWeek.toLocaleString("fr-FR")} <span className="text-xs font-medium text-text-tertiary">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              Validé par MTN & Orange Money
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-text-tertiary mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Taux de Recouvrement</span>
              <Clock className="h-4 w-4 text-accent-600" />
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-text-primary">
              78.4%
            </div>
            <p className="mt-1 text-[11px] text-accent-700 dark:text-accent-400 font-medium">
              +12% grâce aux relances IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border-button-default bg-background-primary-default p-3.5 shadow-card">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary" />
          <Input
            type="text"
            placeholder="Rechercher par client ou n° de facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs border-border-button-default bg-background-secondary-default rounded-full text-text-primary"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Toutes les factures" },
            { id: "overdue", label: "En Retard" },
            { id: "pending", label: "En Attente" },
            { id: "paid", label: "Soldées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-accent-600 text-white shadow-xs"
                  : "bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover border border-border-button-default"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-secondary bg-background-secondary-default text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Facture</th>
                <th className="px-5 py-3.5">Client & Contact</th>
                <th className="px-5 py-3.5">Montant (FCFA)</th>
                <th className="px-5 py-3.5">Échéance</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions de Recouvrement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-secondary">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-tertiary">
                    Aucune créance trouvée pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isOverdue = inv.status === "overdue";
                  const isPaid = inv.status === "paid";

                  return (
                    <tr key={inv.id} className="hover:bg-background-secondary-default transition-colors">
                      {/* Invoice N° */}
                      <td className="px-5 py-4 font-mono font-semibold text-text-primary">
                        {inv.invoice_number}
                      </td>

                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-text-primary">
                          {inv.customers?.name || "Client Inconnu"}
                        </div>
                        <div className="text-[11px] text-text-tertiary">
                          {inv.customers?.phone || "+237 6xx xx xx xx"}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-text-primary">
                          {inv.amount.toLocaleString("fr-FR")} <span className="text-[10px] text-text-tertiary">FCFA</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-text-secondary">
                        {new Date(inv.due_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40">
                            Soldé (MoMo)
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-medium text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/40">
                            En Retard (Échu)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40">
                            En Attente
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!isPaid && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedInvoiceForReminder(inv)}
                              className="h-7 px-3 text-[11px] rounded-full border-border-button-default text-accent-700 hover:bg-accent-50"
                            >
                              <MessageSquare className="mr-1 h-3 w-3" />
                              Relancer WhatsApp
                            </Button>
                          )}

                          {!isPaid ? (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(inv.id)}
                              className="h-7 px-3 text-[11px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Marquer Payé
                            </Button>
                          ) : (
                            <span className="text-[11px] text-text-tertiary font-medium">
                              Rapproché le {new Date(inv.updated_at).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Modal */}
      {selectedInvoiceForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-modal">
            <div className="flex items-center justify-between pb-3 border-b border-border-secondary mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Relance Automatique WhatsApp MoMo
                  </h3>
                  <p className="text-[11px] text-text-tertiary">
                    Aperçu du message avant expédition
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForReminder(null)}
                className="rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-3 text-xs text-text-secondary space-y-2 font-mono">
                <p className="font-semibold text-text-primary font-sans">
                  Destinataire : {selectedInvoiceForReminder.customers?.name} ({selectedInvoiceForReminder.customers?.phone})
                </p>
                <div className="rounded-xl bg-background-primary-default p-3 border border-border-button-default text-[11px] leading-relaxed">
                  Bonjour {selectedInvoiceForReminder.customers?.name}, sauf erreur de notre part, votre facture #{selectedInvoiceForReminder.invoice_number} de {selectedInvoiceForReminder.amount.toLocaleString("fr-FR")} FCFA est arrivée à échéance.
                  <br /><br />
                  Vous pouvez régler en 1 clic par MTN Mobile Money (*126#) ou Orange Money (*150#) sur notre compte marchand Fotso & Fils.
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoiceForReminder(null)}
                  className="text-xs rounded-full border-border-button-default text-text-secondary hover:text-text-primary"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendReminder(selectedInvoiceForReminder)}
                  className="rounded-full bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Envoyer via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
