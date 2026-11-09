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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Recouvrement & Gestion des Créances
            </h1>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              {invoices.filter((i) => i.status === "overdue").length} En retard
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Suivi des factures impayées, relances automatiques par WhatsApp et réconciliation MoMo / OM.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            onClick={() => showToast("Export du grand livre de recouvrement généré (.CSV)")}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Exporter CSV
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
            onClick={() => {
              showToast("Campagne de relance IA lancée pour tous les clients en retard !");
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Relancer Tous les Retards (IA)
          </Button>
        </div>
      </div>

      {/* 4 KPI Summary Cards (Stageshow clean metrics) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Créances Dues Totales</span>
              <Wallet className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {totalReceivables.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Sur 4 clients actifs
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Montant en Retard</span>
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600">
              {overdueTotal.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-rose-700 font-medium">
              Nécessite relance immédiate
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Encaissé Récent (MoMo/OM)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">
              {paidThisWeek.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Validé par MTN & Orange Money
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Taux de Recouvrement</span>
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              78.4%
            </div>
            <p className="mt-1 text-[11px] text-indigo-700 font-medium">
              +12% grâce aux relances IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher par client ou n° de facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs border-slate-200 rounded-xl"
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
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Facture</th>
                <th className="px-5 py-3.5">Client & Contact</th>
                <th className="px-5 py-3.5">Montant (FCFA)</th>
                <th className="px-5 py-3.5">Échéance</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions de Recouvrement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    Aucune créance trouvée pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isOverdue = inv.status === "overdue";
                  const isPaid = inv.status === "paid";

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Invoice N° */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-800">
                        {inv.invoice_number}
                      </td>

                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {inv.customers?.name || "Client Inconnu"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {inv.customers?.phone || "+237 6xx xx xx xx"}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-slate-900">
                          {inv.amount.toLocaleString("fr-FR")} <span className="text-[10px] text-slate-600">FCFA</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-slate-600">
                        {new Date(inv.due_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            Soldé (MoMo)
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            En Retard (Échu)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
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
                              className="h-7 px-2.5 text-[11px] border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <MessageSquare className="mr-1 h-3 w-3" />
                              Relancer WhatsApp
                            </Button>
                          )}

                          {!isPaid ? (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(inv.id)}
                              className="h-7 px-2.5 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Marquer Payé
                            </Button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Relance Automatique WhatsApp MoMo
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Aperçu du message avant expédition
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForReminder(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 space-y-2 font-mono">
                <p className="font-bold text-slate-900 font-sans">
                  Destinataire : {selectedInvoiceForReminder.customers?.name} ({selectedInvoiceForReminder.customers?.phone})
                </p>
                <div className="rounded bg-white p-2.5 border border-slate-200 text-[11px] leading-relaxed">
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
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendReminder(selectedInvoiceForReminder)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
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
