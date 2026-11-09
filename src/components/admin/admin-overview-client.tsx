"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Cpu,
  DollarSign,
  ExternalLink,
  MessageSquare,
  Radio,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_TENANTS,
  ADMIN_SYSTEM_HEALTH,
  ADMIN_GLOBAL_LOGS,
  type AdminTenant,
} from "@/lib/data/admin-seed-data";

export function AdminOverviewClient() {
  const [tenants] = React.useState<AdminTenant[]>(ADMIN_TENANTS);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = React.useState("Just now");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 600);
  };

  const totalMRR = tenants.reduce(
    (acc, t) => (t.status !== "suspended" ? acc + t.mrrFCFA : acc),
    0
  );
  const totalMessagesToday = tenants.reduce((acc, t) => acc + t.messagesToday, 0);
  const activeTenantsCount = tenants.filter((t) => t.status === "active").length;

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              SaaS Control Center
            </h1>
            <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-0.5 text-xs font-semibold text-white">
              Super Admin
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Platform monitoring, client tenant onboardings, webhook health & Cameroon infrastructure
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center space-x-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-background-secondary-default transition-colors shadow-2xs"
            title="Refresh system metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-text-secondary ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
            <span className="text-[10px] text-text-tertiary">({lastRefreshedTime})</span>
          </button>

          <Link href="/admin/businesses">
            <Button
              size="sm"
              className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
            >
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Manage 18 Businesses
            </Button>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. 4 TOP KPI CARDS (BoardUI Executive Style)              */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Active Businesses */}
        <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Active Businesses
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
              <Building2 className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight text-text-primary">
                {activeTenantsCount} / 20
              </span>
              <p className="text-xs text-text-tertiary mt-1 font-medium">Target Q4 2026</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% MoM
            </span>
          </div>

          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-background-secondary-default overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-600"
                style={{ width: `${(activeTenantsCount / 20) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-text-tertiary mt-1.5 inline-block">
              90% of capacity reached
            </span>
          </div>
        </div>

        {/* KPI 2: Monthly Recurring Revenue (MRR in FCFA) */}
        <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Platform MRR (FCFA)
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                {(totalMRR || 14850000).toLocaleString("fr-FR")}
              </span>
              <p className="text-xs text-text-secondary mt-1 font-medium">FCFA / mois</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.4%
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-text-secondary border-t border-border-button-default pt-2.5">
            <span>Pro (85k) • Enterprise (175k)</span>
            <span className="font-bold text-emerald-600">100% Collected</span>
          </div>
        </div>

        {/* KPI 3: AI Messages Processed Today */}
        <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              AI Messages Today
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageSquare className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight text-text-primary">
                {(totalMessagesToday * 18).toLocaleString("fr-FR")}
              </span>
              <p className="text-xs text-text-secondary mt-1 font-medium">Across 5 Channels</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-bold text-accent-700">
              <Zap className="mr-1 h-3 w-3 text-accent-600" />
              97.4% Auto
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-text-secondary border-t border-border-button-default pt-2.5">
            <span>Gemini 2.5 Flash Engine</span>
            <span className="font-semibold text-text-primary">Avg 240ms reply</span>
          </div>
        </div>

        {/* KPI 4: Webhook & SLA Uptime */}
        <div className="relative overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              System SLA Uptime
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight text-emerald-600">
                99.98%
              </span>
              <p className="text-xs text-text-secondary mt-1 font-medium">Rolling 90-Day SLA</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              Optimal
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-text-secondary border-t border-border-button-default pt-2.5">
            <span>SSL Webhooks Verified</span>
            <span className="font-mono text-text-primary">0 errors (24h)</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. REAL-TIME SYSTEM HEALTH MONITOR                        */}
      {/* ========================================================= */}
      <div id="health" className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border-button-default pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-2xs">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                System & Channel Gateways Health Monitor
              </h2>
              <p className="text-xs text-text-secondary">
                Live heartbeat checks for Meta Graph API, TikTok, Telegram, Gemini AI & Mobile Money
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
              All 6 Gateways Operational
            </span>
          </div>
        </div>

        {/* 6 Gateway Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_SYSTEM_HEALTH.map((gw) => (
            <div
              key={gw.service}
              className="rounded-2xl border border-border-button-default bg-background-secondary-default/60 p-4 transition-all hover:bg-background-primary-default hover:border-accent-300 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{gw.service}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{gw.provider}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800 capitalize">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {gw.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-border-button-default pt-3">
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase font-semibold">Latency</span>
                  <p className="font-mono font-bold text-text-primary mt-0.5">{gw.latencyMs} ms</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary uppercase font-semibold">90D SLA</span>
                  <p className="font-bold text-emerald-700 mt-0.5">{gw.uptime90d}</p>
                </div>
              </div>

              <p className="text-[10px] text-text-tertiary mt-2 truncate">
                {gw.lastIncident}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BUSINESS WORKSPACES SNAPSHOT & IMPERSONATION JUMP     */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-border-button-default pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Registered Client Workspaces (Cameroon)
              </h3>
              <p className="text-xs text-text-secondary">
                Instant impersonation, active channel links, and monthly token utilization
              </p>
            </div>
          </div>

          <Link
            href="/admin/businesses"
            className="inline-flex items-center text-xs font-semibold text-accent-700 hover:text-accent-800"
          >
            <span>View All 18 Workspaces</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Tenant Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-button-default text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                <th className="pb-3 pl-2">Business Workspace</th>
                <th className="pb-3">Owner Contact</th>
                <th className="pb-3 text-center">Channels</th>
                <th className="pb-3 text-right">Messages Today</th>
                <th className="pb-3">Token Usage</th>
                <th className="pb-3">Plan / MRR</th>
                <th className="pb-3 text-right pr-2">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-button-default">
              {tenants.slice(0, 5).map((tenant) => (
                <tr
                  key={tenant.id}
                  className="group transition-colors hover:bg-background-secondary-default/60"
                >
                  <td className="py-3.5 pl-2">
                    <div>
                      <p className="font-bold text-text-primary">{tenant.name}</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">{tenant.city}</p>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <p className="font-semibold text-text-primary">{tenant.ownerName}</p>
                    <p className="text-[11px] text-text-secondary">{tenant.ownerPhone}</p>
                  </td>

                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center space-x-1 rounded-full bg-background-secondary-default px-2.5 py-0.5 text-[11px] font-bold text-text-primary border border-border-button-default">
                      <Radio className="h-3 w-3 text-accent-600 mr-0.5" />
                      <span>{tenant.connectedChannels.length} Active</span>
                    </div>
                  </td>

                  <td className="py-3.5 text-right font-mono font-bold text-text-primary">
                    {tenant.messagesToday.toLocaleString("fr-FR")}
                  </td>

                  <td className="py-3.5">
                    <div className="w-28 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-text-secondary">
                          {tenant.tokenUsagePercent}%
                        </span>
                        <span className="text-text-tertiary">100k cap</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-background-secondary-default overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            tenant.tokenUsagePercent > 80
                              ? "bg-amber-500"
                              : "bg-accent-600"
                          }`}
                          style={{ width: `${tenant.tokenUsagePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-text-primary">
                      {tenant.mrrFCFA.toLocaleString("fr-FR")} FCFA
                    </span>
                    <span className="ml-1.5 rounded-full bg-accent-50 px-2 py-0.5 text-[9px] font-bold text-accent-700">
                      {tenant.plan}
                    </span>
                  </td>

                  <td className="py-3.5 text-right pr-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center rounded-full bg-background-secondary-default hover:bg-accent-600 hover:text-white px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors border border-border-button-default shadow-2xs"
                      title="Impersonate and view this business owner dashboard"
                    >
                      <span>Impersonate</span>
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. RECENT GLOBAL LOGS STREAM PREVIEW                      */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border-button-default pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Live Webhook & Gemini Triage Feed
              </h3>
              <p className="text-xs text-text-secondary">
                Real-time stream of incoming messages, AI decisions, and Mobile Money payments
              </p>
            </div>
          </div>

          <Link
            href="/admin/logs"
            className="inline-flex items-center text-xs font-semibold text-accent-700 hover:text-accent-800"
          >
            <span>Open Global Logs</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {ADMIN_GLOBAL_LOGS.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border-button-default bg-background-secondary-default/50 p-3.5 text-xs gap-2 transition-colors hover:bg-background-secondary-default"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`flex h-2 w-2 rounded-full shrink-0 ${
                    log.severity === "success"
                      ? "bg-emerald-500"
                      : log.severity === "warning"
                      ? "bg-amber-500"
                      : "bg-accent-500"
                  }`}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-text-primary">{log.tenantName}</span>
                    <span className="rounded-full bg-background-primary-default border border-border-button-default px-2 py-0.5 text-[9px] font-mono uppercase text-text-secondary">
                      {log.channel || log.category}
                    </span>
                    <span className="text-[10px] text-text-tertiary">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-0.5">{log.message}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="font-mono text-[11px] text-text-secondary font-semibold">
                  {log.latencyMs} ms
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    log.severity === "success"
                      ? "bg-emerald-50 text-emerald-800"
                      : log.severity === "warning"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-accent-50 text-accent-800"
                  }`}
                >
                  {log.event}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}