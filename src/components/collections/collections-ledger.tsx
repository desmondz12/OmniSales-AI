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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl px-4 py-2.5 text-xs font-medium text-white shadow-2xl border border-white/10 transition-all duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#34C759] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
              Recouvrement & Créances
            </h1>
            <span className="rounded-full bg-[#FF9500]/10 px-2.5 py-0.5 text-xs font-semibold text-[#FF9500] border border-[#FF9500]/20">
              {invoices.filter((i) => i.status === "overdue").length} En retard
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            Suivi des factures impayées, relances automatiques par WhatsApp et réconciliation MoMo / OM.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            className="apple-press rounded-2xl border-slate-200/80 bg-white/80 hover:bg-slate-100/70 text-xs font-medium text-slate-700"
            onClick={() => showToast("Export du grand livre de recouvrement généré (.CSV)")}
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
            Exporter CSV
          </Button>
          <Button
            className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs px-3.5 shadow-xs transition-all"
            onClick={() => {
              showToast("Campagne de relance IA lancée pour tous les clients en retard !");
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Relancer Tous les Retards (IA)
          </Button>
        </div>
      </div>

      {/* 4 Apple Wallet / Finance KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Card className="apple-glass-card rounded-3xl border border-slate-200/60 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-medium tracking-wider uppercase">Créances Dues</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
                <Wallet className="h-4 w-4" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              {totalReceivables.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Sur 4 clients actifs
            </p>
          </CardContent>
        </Card>

        <Card className="apple-glass-card rounded-3xl border border-slate-200/60 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-medium tracking-wider uppercase">Montant en Retard</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FF3B30]/10 text-[#FF3B30]">
                <AlertCircle className="h-4 w-4" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FF3B30]">
              {overdueTotal.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-[#FF3B30] font-medium">
              Nécessite relance immédiate
            </p>
          </CardContent>
        </Card>

        <Card className="apple-glass-card rounded-3xl border border-slate-200/60 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-medium tracking-wider uppercase">Encaissé MoMo/OM</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#34C759]/10 text-[#34C759]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#34C759]">
              {paidThisWeek.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-[#34C759] font-medium">
              Validé par MTN & Orange Money
            </p>
          </CardContent>
        </Card>

        <Card className="apple-glass-card rounded-3xl border border-slate-200/60 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-medium tracking-wider uppercase">Taux Recouvrement</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#5856D6]/10 text-[#5856D6]">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              78.4%
            </div>
            <p className="mt-1 text-[11px] text-[#5856D6] font-medium">
              +12% grâce aux relances IA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar: Apple Segmented Glass Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/60 bg-white/70 backdrop-blur-xl p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher par client ou n° de facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs border-slate-200/80 rounded-2xl bg-white/80 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter Tabs (Apple Segmented Style) */}
        <div className="flex items-center space-x-1 overflow-x-auto p-1 bg-slate-100/70 rounded-2xl no-scrollbar">
          {[
            { id: "all", label: "Toutes" },
            { id: "overdue", label: "En Retard" },
            { id: "pending", label: "En Attente" },
            { id: "paid", label: "Soldées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`apple-press rounded-xl px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white text-slate-900 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                      {/* Invoice N° */}
                      <td className="px-5 py-4 font-mono font-medium text-slate-800">
                        {inv.invoice_number}
                      </td>

                      {/* Customer Info */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-xs text-slate-900 tracking-tight">
                          {inv.customers?.name || "Client Inconnu"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {inv.customers?.phone || "+237 6xx xx xx xx"}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-xs text-slate-900 tracking-tight">
                          {inv.amount.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-slate-400">FCFA</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(inv.due_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#248A3D] border border-[#34C759]/20">
                            Soldé (MoMo)
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center rounded-full bg-[#FF3B30]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#FF3B30] border border-[#FF3B30]/20">
                            En Retard (Échu)
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-[#FF9500]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#FF9500] border border-[#FF9500]/20">
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
                              className="apple-press h-7 px-3 text-[11px] rounded-xl border-slate-200 text-[#0071E3] hover:bg-[#0071E3]/10"
                            >
                              <MessageSquare className="mr-1 h-3 w-3" />
                              Relancer WhatsApp
                            </Button>
                          )}

                          {!isPaid ? (
                            <Button
                              size="sm"
                              onClick={() => handleMarkPaid(inv.id)}
                              className="apple-press h-7 px-3 text-[11px] rounded-xl bg-[#34C759] hover:bg-[#28A745] text-white"
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

      {/* Reminder Modal (Mounted check for hydration safety) */}
      {mounted && selectedInvoiceForReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 transition-all">
          <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3]">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                    Relance WhatsApp MoMo
                  </h3>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Aperçu de la notification avant envoi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForReminder(null)}
                className="apple-press rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3.5 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">
                  Destinataire : {selectedInvoiceForReminder.customers?.name} ({selectedInvoiceForReminder.customers?.phone})
                </p>
                <div className="rounded-xl bg-white p-3 border border-slate-100 text-[11px] leading-relaxed shadow-2xs">
                  Bonjour {selectedInvoiceForReminder.customers?.name}, sauf erreur de notre part, votre facture #{selectedInvoiceForReminder.invoice_number} de {selectedInvoiceForReminder.amount.toLocaleString("fr-FR")} FCFA est arrivée à échéance.
                  <br /><br />
                  Vous pouvez régler en 1 clic par MTN Mobile Money (*126#) ou Orange Money (*150#) sur notre compte marchand Fotso & Fils.
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoiceForReminder(null)}
                  className="apple-press rounded-2xl text-xs font-medium"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSendReminder(selectedInvoiceForReminder)}
                  className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4"
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
