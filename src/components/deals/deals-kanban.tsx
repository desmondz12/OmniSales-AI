"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  MapPin,
  Percent,
  Plus,
  Search,
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
        return (
          <span className="inline-flex items-center rounded-full bg-[#34C759]/10 px-2 py-0.5 text-[10px] font-semibold text-[#248A3D] border border-[#34C759]/20">
            WhatsApp
          </span>
        );
      case "instagram":
        return (
          <span className="inline-flex items-center rounded-full bg-[#FF2D55]/10 px-2 py-0.5 text-[10px] font-semibold text-[#D30F3B] border border-[#FF2D55]/20">
            Instagram
          </span>
        );
      case "messenger":
        return (
          <span className="inline-flex items-center rounded-full bg-[#0071E3]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0071E3] border border-[#0071E3]/20">
            Messenger
          </span>
        );
      case "tiktok":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
            TikTok
          </span>
        );
      case "telegram":
        return (
          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600 border border-sky-500/20">
            Telegram
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Apple Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl px-4 py-2.5 text-xs font-medium text-white shadow-2xl border border-white/10 transition-all duration-200">
          <CheckCircle2 className="h-4 w-4 text-[#34C759]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Metrics */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-slate-900">
              Pipeline des Ventes
            </h1>
            <span className="rounded-full bg-[#0071E3]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0071E3] border border-[#0071E3]/20">
              {filteredDeals.length} Deals
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
            Suivi visuel des opportunités omnicanales au Cameroun (WhatsApp, IG, MoMo, Orange Money).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white font-medium text-xs px-3.5 py-1.5 shadow-xs transition-colors"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouveau Deal
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Valeur totale</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0071E3]">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {totalPipelineFCFA.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Opportunités en cours d&apos;engagement
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Revenu pondéré</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Percent className="h-4 w-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {Math.round(weightedRevenueFCFA).toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Calculé sur la probabilité de clôture
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Acomptes reçus</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="h-4 w-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {depositPaidCount} <span className="text-xs font-normal text-slate-500">commandes</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-700 font-medium">
              Validés via MTN MoMo / Orange Money
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium text-slate-500">Deals gagnés</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {wonDealsCount} <span className="text-xs font-normal text-slate-500">finalisés</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Livrées et soldées ce mois-ci
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
            placeholder="Rechercher par client, produit ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs border-slate-200/80 rounded-2xl bg-white/80 focus:bg-white transition-colors"
          />
        </div>

        {/* Channel Filter Pills (Apple Segmented Style) */}
        <div className="flex items-center space-x-1 overflow-x-auto p-1 bg-slate-100/70 rounded-2xl no-scrollbar">
          {[
            { id: "all", label: "Tous" },
            { id: "whatsapp", label: "WhatsApp" },
            { id: "instagram", label: "Instagram" },
            { id: "messenger", label: "Messenger" },
            { id: "tiktok", label: "TikTok" },
            { id: "telegram", label: "Telegram" },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`apple-press rounded-xl px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedChannel === ch.id
                  ? "bg-white text-slate-900 shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map((column) => {
          const columnDeals = filteredDeals.filter((d) => d.stage === column.id);
          const columnTotal = columnDeals.reduce((sum, d) => sum + d.amount_fcfa, 0);

          return (
            <div
              key={column.id}
              className="flex flex-col rounded-3xl border border-slate-200/50 bg-slate-100/40 backdrop-blur-md p-3 min-w-[260px] h-full"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/50">
                <div className="flex items-center space-x-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      column.id === "won"
                        ? "bg-[#34C759]"
                        : column.id === "deposit_paid"
                        ? "bg-[#FF9500]"
                        : column.id === "lost"
                        ? "bg-[#FF3B30]"
                        : "bg-[#0071E3]"
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-800 line-clamp-1 tracking-tight">
                    {column.label}
                  </span>
                </div>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-500 border border-slate-200/60 shadow-2xs">
                  {columnDeals.length}
                </span>
              </div>

              {/* Column Total Amount */}
              <div className="text-[11px] font-medium text-slate-400 mb-2.5 px-0.5">
                {columnTotal.toLocaleString("fr-FR")} FCFA
              </div>

              {/* Deals Cards in this stage */}
              <div className="space-y-2.5 flex-1">
                {columnDeals.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                    Aucun deal
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="group relative rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all duration-200"
                    >
                      {/* Channel and Probability */}
                      <div className="flex items-center justify-between mb-2">
                        {getChannelBadge(deal.channel_type)}
                        <span className="text-[11px] font-semibold text-slate-400">
                          {deal.probability}%
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2 tracking-tight">
                        {deal.title}
                      </h4>

                      {/* Amount in FCFA */}
                      <div className="mt-1.5 text-sm font-bold text-[#0071E3] tracking-tight">
                        {deal.amount_fcfa.toLocaleString("fr-FR")}{" "}
                        <span className="text-[10px] font-normal text-slate-400">FCFA</span>
                      </div>

                      {/* Customer & Company Details */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                        <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{deal.customer_name}</span>
                        </div>
                        {deal.company_name && (
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="line-clamp-1 text-[10px]">{deal.company_name}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
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
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => moveDeal(deal.id, "prev")}
                          disabled={deal.stage === "lead" || deal.stage === "lost"}
                          className="apple-press rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-20 cursor-pointer transition-colors"
                          title="Étape précédente"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => markLost(deal.id)}
                          className="text-[10px] font-medium text-[#FF3B30] hover:text-[#D70015] cursor-pointer transition-colors"
                        >
                          {deal.stage === "lost" ? "Perdu" : "Abandonner"}
                        </button>

                        <button
                          type="button"
                          onClick={() => moveDeal(deal.id, "next")}
                          disabled={deal.stage === "won" || deal.stage === "lost"}
                          className="apple-press rounded-xl p-1 text-[#0071E3] hover:bg-[#0071E3]/10 disabled:opacity-20 cursor-pointer transition-colors"
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

      {/* Modal: Nouveau Deal (Rendered only when mounted to protect against hydration drift) */}
      {mounted && isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 transition-all">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/95 backdrop-blur-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3]">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900">
                    Nouveau Deal
                  </h3>
                  <p className="text-xs text-slate-500 font-normal">
                    Enregistrez une nouvelle opportunité de vente
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="apple-press rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Intitulé du Deal / Produit *
                </label>
                <Input
                  required
                  placeholder="Ex: Commande 200 sacs de Ciment CPJ"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs rounded-2xl border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Montant estimé (FCFA) *
                  </label>
                  <Input
                    required
                    type="number"
                    placeholder="Ex: 550000"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="h-9 text-xs rounded-2xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Étape Initiale
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as DealStage)}
                    className="w-full h-9 rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nom du Client *
                  </label>
                  <Input
                    required
                    placeholder="Ex: Jean-Pierre Fotso"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="h-9 text-xs rounded-2xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Entreprise / Établissement
                  </label>
                  <Input
                    placeholder="Ex: BTP du Wouri SARL"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="h-9 text-xs rounded-2xl border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ville de Livraison
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as typeof newCity)}
                    className="w-full h-9 rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Autre">Autre région</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Canal d&apos;Acquisition
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as ChannelType)}
                    className="w-full h-9 rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
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
                  className="apple-press rounded-2xl text-xs px-4"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4"
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
