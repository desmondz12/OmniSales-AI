"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Filter,
  Plus,
  Power,
  Search,
  Sliders,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_TENANTS,
  type AdminTenant,
} from "@/lib/data/admin-seed-data";
import type { ChannelType } from "@/types/database";

export function TenantManagementClient() {
  const [tenants, setTenants] = React.useState<AdminTenant[]>(ADMIN_TENANTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [planFilter, setPlanFilter] = React.useState<string>("all");

  // Create Workspace Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newBizName, setNewBizName] = React.useState("");
  const [newOwnerName, setNewOwnerName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("+237 ");
  const [newCity, setNewCity] = React.useState("Douala (Akwa)");
  const [newPlan, setNewPlan] = React.useState<"Starter" | "Pro" | "Enterprise">("Pro");
  const [newTokenLimit, setNewTokenLimit] = React.useState(100000);

  // Token Limit Adjust Modal State
  const [editingTokenTenant, setEditingTokenTenant] = React.useState<AdminTenant | null>(null);
  const [customTokenLimit, setCustomTokenLimit] = React.useState(100000);

  // Status toggle handler
  const handleToggleStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === "active" ? "suspended" : "active";
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  // Create Business Submit
  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim() || !newOwnerName.trim()) return;

    const mrr = newPlan === "Starter" ? 45000 : newPlan === "Pro" ? 85000 : 175000;

    const newTenant: AdminTenant = {
      id: `ws-${Date.now()}`,
      name: newBizName.trim(),
      city: newCity,
      ownerName: newOwnerName.trim(),
      ownerEmail: newEmail.trim() || `${newBizName.toLowerCase().replace(/\s+/g, "")}@omnisales.cm`,
      ownerPhone: newPhone.trim() || "+237 671 00 00 00",
      connectedChannels: ["whatsapp", "instagram"],
      messagesToday: 0,
      messagesThisMonth: 0,
      tokenUsagePercent: 0,
      plan: newPlan,
      mrrFCFA: mrr,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Just created",
      aiAutoReplyRate: 98.0,
    };

    setTenants((prev) => [newTenant, ...prev]);
    setIsCreateModalOpen(false);

    // Reset fields
    setNewBizName("");
    setNewOwnerName("");
    setNewEmail("");
    setNewPhone("+237 ");
  };

  // Adjust token limit submit
  const handleSaveTokenLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTokenTenant) return;

    setTenants((prev) =>
      prev.map((t) =>
        t.id === editingTokenTenant.id
          ? {
              ...t,
              tokenUsagePercent: Math.min(
                100,
                Math.round((t.messagesThisMonth * 20) / (customTokenLimit || 1))
              ),
            }
          : t
      )
    );
    setEditingTokenTenant(null);
  };

  // Filtered List
  const filteredTenants = tenants.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (planFilter !== "all" && t.plan !== planFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCity = t.city.toLowerCase().includes(q);
      const matchOwner = t.ownerName.toLowerCase().includes(q);
      const matchPhone = t.ownerPhone.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchOwner && !matchPhone) return false;
    }

    return true;
  });

  const channelIcons: Record<ChannelType, { name: string; bg: string; text: string }> = {
    whatsapp: { name: "WA", bg: "bg-emerald-100", text: "text-emerald-800" },
    instagram: { name: "IG", bg: "bg-pink-100", text: "text-pink-800" },
    messenger: { name: "FB", bg: "bg-blue-100", text: "text-blue-800" },
    tiktok: { name: "TT", bg: "bg-slate-900", text: "text-white" },
    telegram: { name: "TG", bg: "bg-sky-100", text: "text-sky-800" },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Client Business Workspaces
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              {filteredTenants.length} of {tenants.length} Workspaces
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Control business onboarding, adjust AI token caps, toggle tenant access, and impersonate dashboards
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create New Business Workspace
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name, Douala/Yaoundé, owner, or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50/60 p-1 text-xs font-semibold">
            <span className="text-slate-400 px-2 flex items-center text-[11px]">
              <Filter className="mr-1 h-3 w-3" /> Status:
            </span>
            {["all", "active", "trial", "suspended"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 capitalize transition-colors ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Plan selector */}
          <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50/60 p-1 text-xs font-semibold">
            <span className="text-slate-400 px-2 text-[11px]">Plan:</span>
            {["all", "Starter", "Pro", "Enterprise"].map((pl) => (
              <button
                key={pl}
                type="button"
                onClick={() => setPlanFilter(pl)}
                className={`rounded-lg px-2.5 py-1 transition-colors ${
                  planFilter === pl
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Businesses Data Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-6">Business / Location</th>
                <th className="py-3.5">Owner & Contact</th>
                <th className="py-3.5">Channels</th>
                <th className="py-3.5">AI Usage (Mo.)</th>
                <th className="py-3.5">Token Cap</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5">Plan & MRR</th>
                <th className="py-3.5 text-right pr-6">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No businesses matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="group transition-colors hover:bg-slate-50/70"
                  >
                    {/* Business Name & City */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-100">
                          {tenant.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">
                            {tenant.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{tenant.city}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner Contact */}
                    <td className="py-4">
                      <p className="font-semibold text-slate-800">{tenant.ownerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{tenant.ownerPhone}</p>
                      <p className="text-[10px] text-slate-400">{tenant.ownerEmail}</p>
                    </td>

                    {/* Channels */}
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        {tenant.connectedChannels.map((ch) => {
                          const info = channelIcons[ch];
                          return (
                            <span
                              key={ch}
                              className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold ${info.bg} ${info.text}`}
                              title={ch.toUpperCase()}
                            >
                              {info.name}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {tenant.aiAutoReplyRate}% auto-replied
                      </span>
                    </td>

                    {/* AI Messages Usage */}
                    <td className="py-4">
                      <p className="font-mono font-bold text-slate-900">
                        {tenant.messagesThisMonth.toLocaleString("fr-FR")} msg
                      </p>
                      <span className="text-[10px] text-slate-400">
                        Today: {tenant.messagesToday} msg
                      </span>
                    </td>

                    {/* Token Cap Progress */}
                    <td className="py-4">
                      <div className="w-28 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-700">
                            {tenant.tokenUsagePercent}%
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTokenTenant(tenant);
                              setCustomTokenLimit(100000);
                            }}
                            className="text-blue-600 hover:underline"
                            title="Adjust token limit"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              tenant.tokenUsagePercent > 80
                                ? "bg-amber-500"
                                : "bg-blue-600"
                            }`}
                            style={{ width: `${tenant.tokenUsagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                          tenant.status === "active"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : tenant.status === "trial"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            tenant.status === "active"
                              ? "bg-emerald-500"
                              : tenant.status === "trial"
                              ? "bg-blue-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {tenant.status}
                      </span>
                    </td>

                    {/* Plan & MRR */}
                    <td className="py-4">
                      <span className="font-bold text-slate-900 block">
                        {tenant.mrrFCFA.toLocaleString("fr-FR")} FCFA
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                        {tenant.plan}
                      </span>
                    </td>

                    {/* Controls & Impersonate */}
                    <td className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Impersonate Button */}
                        <Link
                          href="/dashboard"
                          className="inline-flex items-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
                          title={`Impersonate ${tenant.name} dashboard`}
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          <span>Impersonate</span>
                        </Link>

                        {/* Suspend / Activate Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tenant.id)}
                          className={`rounded-xl p-1.5 text-xs transition-colors ${
                            tenant.status === "active"
                              ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={tenant.status === "active" ? "Suspend Access" : "Activate Access"}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE NEW BUSINESS WORKSPACE                    */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Onboard New Business Workspace
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provision a multi-channel AI sales tenant in Cameroon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="mt-5 space-y-4">
              {/* Business Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g., Douala Modern Electronics SARL"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* City Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    City / Region
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Douala (Akwa)">Douala (Akwa)</option>
                    <option value="Douala (Bonanjo)">Douala (Bonanjo)</option>
                    <option value="Douala (Bonabéri)">Douala (Bonabéri)</option>
                    <option value="Yaoundé (Bastos)">Yaoundé (Bastos)</option>
                    <option value="Yaoundé (Centre)">Yaoundé (Centre)</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Limbe">Limbe</option>
                    <option value="Garoua">Garoua</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Subscription Plan
                  </label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as "Starter" | "Pro" | "Enterprise")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Starter">Starter (45 000 FCFA/mo)</option>
                    <option value="Pro">Pro (85 000 FCFA/mo)</option>
                    <option value="Enterprise">Enterprise (175 000 FCFA/mo)</option>
                  </select>
                </div>
              </div>

              {/* Owner Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="e.g., Jean-Paul Kamga"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Phone (+237 Cameroon)
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 font-mono focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Owner Email */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Login & Notification Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="contact@business.cm"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Initial Token Cap */}
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Token Cap
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs font-bold">
                  {[50000, 100000, 250000].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setNewTokenLimit(cap)}
                      className={`rounded-xl border p-2 text-center text-xs transition-colors ${
                        newTokenLimit === cap
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {(cap / 1000).toFixed(0)}k Tokens
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Create & Activate Workspace
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADJUST TOKEN LIMIT                               */}
      {/* ========================================================= */}
      {editingTokenTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Set Monthly AI Token Limit
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For {editingTokenTenant.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTokenTenant(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTokenLimit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Monthly Token Threshold
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-bold">
                  {[50000, 100000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCustomTokenLimit(amt)}
                      className={`rounded-xl border p-2.5 transition-colors ${
                        customTokenLimit === amt
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {(amt / 1000).toFixed(0)}k Tokens
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">
                  Custom Value
                </label>
                <input
                  type="number"
                  value={customTokenLimit}
                  onChange={(e) => setCustomTokenLimit(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTokenTenant(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  Apply Token Limit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
