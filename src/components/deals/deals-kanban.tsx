"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  MapPin,
  Percent,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PIPELINE_COLUMNS, type Deal, type DealStage } from "@/types/deals";
import type { ChannelType } from "@/types/database";

interface DealsKanbanProps {
  initialDeals: Deal[];
}

export function DealsKanban({ initialDeals }: DealsKanbanProps) {
  const [deals, setDeals] = React.useState<Deal[]>(initialDeals);
  const [selectedChannel, setSelectedChannel] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // New Deal Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newCustomer, setNewCustomer] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");
  const [newCity, setNewCity] = React.useState<"Douala" | "Yaoundé" | "Bafoussam" | "Garoua" | "Autre">("Douala");
  const [newChannel, setNewChannel] = React.useState<ChannelType>("whatsapp");
  const [newStage, setNewStage] = React.useState<DealStage>("lead");

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Move deal to next or previous stage
  const moveDeal = (dealId: string, direction: "next" | "prev") => {
    const stageOrder: DealStage[] = ["lead", "contacted", "proposal", "deposit_paid", "won"];
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== dealId) return d;
        const currentIndex = stageOrder.indexOf(d.stage);
        if (currentIndex === -1) return d; // e.g. lost

        let nextIndex = currentIndex;
        if (direction === "next" && currentIndex < stageOrder.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === "prev" && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }

        const newSt = stageOrder[nextIndex];
        const nextProb =
          newSt === "won"
            ? 100
            : newSt === "deposit_paid"
            ? 85
            : newSt === "proposal"
            ? 60
            : newSt === "contacted"
            ? 40
            : 20;

        showToast(`Deal déplacé vers "${PIPELINE_COLUMNS.find((c) => c.id === newSt)?.label}"`);
        return {
          ...d,
          stage: newSt,
          probability: nextProb,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  // Mark as Lost
  const markLost = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, stage: "lost", probability: 0, updated_at: new Date().toISOString() }
          : d
      )
    );
    showToast("Opportunité marquée comme Perdue / Annulée");
  };

  // Handle Add Deal
  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || !newCustomer.trim()) return;

    const amountNum = parseInt(newAmount.replace(/\D/g, ""), 10) || 100000;
    const newDealObj: Deal = {
      id: `deal-${Date.now()}`,
      workspace_id: "ws-fotso-douala",
      title: newTitle.trim(),
      amount_fcfa: amountNum,
      stage: newStage,
      probability: newStage === "won" ? 100 : newStage === "deposit_paid" ? 85 : 30,
      customer_name: newCustomer.trim(),
      customer_city: newCity,
      company_name: newCompany.trim() || undefined,
      channel_type: newChannel,
      assigned_to: "Jean-Luc Fotso",
      expected_close_date: "Fin de mois",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setDeals([newDealObj, ...deals]);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewAmount("");
    setNewCustomer("");
    setNewCompany("");
    showToast("Nouveau deal créé avec succès dans le pipeline !");
  };

  // Filtered Deals
  const filteredDeals = deals.filter((d) => {
    const matchesChannel =
      selectedChannel === "all" || d.channel_type === selectedChannel;
    const matchesSearch =
      searchQuery.trim() === "" ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.company_name && d.company_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  // Calculate Pipeline Metrics
  const totalPipelineFCFA = filteredDeals
    .filter((d) => d.stage !== "lost")
    .reduce((acc, curr) => acc + curr.amount_fcfa, 0);

  const weightedRevenueFCFA = filteredDeals
    .filter((d) => d.stage !== "lost")
    .reduce((acc, curr) => acc + (curr.amount_fcfa * curr.probability) / 100, 0);

  const wonDealsCount = filteredDeals.filter((d) => d.stage === "won").length;
  const depositPaidCount = filteredDeals.filter((d) => d.stage === "deposit_paid").length;

  const getChannelBadge = (ch: ChannelType) => {
    switch (ch) {
      case "whatsapp":
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">WhatsApp</span>;
      case "instagram":
        return <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">Instagram</span>;
      case "messenger":
        return <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">Messenger</span>;
      case "tiktok":
        return <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">TikTok</span>;
      case "telegram":
        return <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">Telegram</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl transition-all">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Pipeline des Ventes & Opportunités
            </h1>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              {filteredDeals.length} Deals
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Suivi visuel Kanban des opportunités commerciales omnicanales (WhatsApp, IG, MoMo).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouveau Deal
          </Button>
        </div>
      </div>

      {/* 4 Top KPI Cards (Linear / Donezo Style) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Valeur Totale Pipeline</span>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {totalPipelineFCFA.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Sur l&apos;ensemble des opportunités actives
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Revenu Pondéré Estimé</span>
              <Percent className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {Math.round(weightedRevenueFCFA).toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">
              Calculé selon la probabilité de clôture
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Acomptes Encaissés</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {depositPaidCount} <span className="text-xs font-medium text-slate-500">commandes</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-700 font-medium">
              Validés via MTN MoMo / Orange Money
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Deals Clôturés Gagnés</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {wonDealsCount} <span className="text-xs font-medium text-slate-500">finalisés</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Livrées et soldées ce mois-ci
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
            placeholder="Rechercher par client, produit ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs border-slate-200 rounded-xl"
          />
        </div>

        {/* Channel Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Tous les canaux" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "instagram", label: "Instagram" },
            { id: "messenger", label: "Messenger" },
            { id: "tiktok", label: "TikTok" },
            { id: "telegram", label: "Telegram" },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedChannel === ch.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((column) => {
          const columnDeals = filteredDeals.filter((d) => d.stage === column.id);
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.amount_fcfa, 0);

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/50 p-3 min-w-[260px] h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
                <div className="flex items-center space-x-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.id === "won" ? "bg-emerald-500" : column.id === "deposit_paid" ? "bg-amber-500" : column.id === "lost" ? "bg-rose-500" : "bg-blue-500"}`} />
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {column.label}
                  </span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200 shadow-2xs">
                  {columnDeals.length}
                </span>
              </div>

              {/* Column Total Amount */}
              <div className="text-[11px] font-semibold text-slate-500 mb-3">
                {columnTotal.toLocaleString("fr-FR")} FCFA
              </div>

              {/* Deals Cards in this stage */}
              <div className="space-y-3 flex-1">
                {columnDeals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300/80 p-6 text-center text-xs text-slate-400">
                    Aucun deal
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="group relative rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      {/* Channel and Probability */}
                      <div className="flex items-center justify-between mb-2">
                        {getChannelBadge(deal.channel_type)}
                        <span className="text-[11px] font-bold text-slate-500">
                          {deal.probability}%
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                        {deal.title}
                      </h4>

                      {/* Amount in FCFA */}
                      <div className="mt-2 text-sm font-extrabold text-blue-700">
                        {deal.amount_fcfa.toLocaleString("fr-FR")} <span className="text-[10px] font-semibold text-slate-600">FCFA</span>
                      </div>

                      {/* Customer & Company Details */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{deal.customer_name}</span>
                        </div>
                        {deal.company_name && (
                          <div className="flex items-center space-x-1.5 text-slate-500">
                            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="line-clamp-1 text-[10px]">{deal.company_name}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-2.5 w-2.5 text-slate-400" />
                            <span>{deal.customer_city}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-2.5 w-2.5 text-slate-400" />
                            <span>{deal.expected_close_date}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action Bar to Move Stage */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveDeal(deal.id, "prev")}
                          disabled={deal.stage === "lead" || deal.stage === "lost"}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                          title="Étape précédente"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => markLost(deal.id)}
                          className="text-[10px] font-medium text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                        >
                          {deal.stage === "lost" ? "Perdu" : "Abandonner"}
                        </button>

                        <button
                          type="button"
                          onClick={() => moveDeal(deal.id, "next")}
                          disabled={deal.stage === "won" || deal.stage === "lost"}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 disabled:opacity-30 cursor-pointer"
                          title="Étape suivante"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nouveau Deal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ajouter une opportunité de vente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enregistrez un nouveau deal dans le pipeline OmniSales.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Intitulé du Deal / Produit *
                </label>
                <Input
                  required
                  placeholder="Ex: Commande 200 sacs de Ciment CPJ"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Montant estimé (FCFA) *
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="Ex: 550000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Étape Initiale
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PIPELINE_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du Client *
                  </label>
                  <Input
                    required
                    placeholder="Ex: Jean-Pierre Fotso"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entreprise / Établissement
                  </label>
                  <Input
                    placeholder="Ex: BTP du Wouri SARL"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ville de Livraison
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as typeof newCity)}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Autre">Autre région</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Canal d&apos;Acquisition
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as ChannelType)}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="whatsapp">WhatsApp Business</option>
                    <option value="instagram">Instagram DMs</option>
                    <option value="messenger">Facebook Messenger</option>
                    <option value="tiktok">TikTok Direct</option>
                    <option value="telegram">Telegram Bot</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Créer l&apos;Opportunité
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
