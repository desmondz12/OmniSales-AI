"use client";

import * as React from "react";
import {
  Copy,
  FileCode2,
  Pause,
  Play,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_GLOBAL_LOGS,
  type AdminGlobalLog,
} from "@/lib/data/admin-seed-data";

export function GlobalLogsClient() {
  const [logs, setLogs] = React.useState<AdminGlobalLog[]>(ADMIN_GLOBAL_LOGS);
  const [selectedLog, setSelectedLog] = React.useState<AdminGlobalLog | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");
  const [copied, setCopied] = React.useState(false);

  // Simulated live event emission when streaming is active
  React.useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const sampleEvents: AdminGlobalLog[] = [
        {
          id: `log-live-${Date.now()}`,
          timestamp: new Date().toISOString(),
          tenantName: "Fotso & Sons Commerce Douala",
          tenantId: "ws-fotso-douala",
          category: "webhook",
          channel: "whatsapp",
          severity: "info",
          event: "whatsapp_message_ingested",
          message: "Incoming WhatsApp query for iPhone 15 Pro stock. Handled by Gemini 2.5 Flash.",
          latencyMs: Math.floor(Math.random() * 80) + 70,
          payload: {
            channel: "whatsapp",
            customer_handle: "+237 671 22 33 44",
            intent: "product_stock_inquiry",
            status: "auto_replied",
          },
        },
        {
          id: `log-live-${Date.now() + 1}`,
          timestamp: new Date().toISOString(),
          tenantName: "Bastos Luxury Boutique",
          tenantId: "ws-bastos-yaounde",
          category: "payment",
          channel: "instagram",
          severity: "success",
          event: "orange_money_checkout_verified",
          message: "Orange Money payment link (85 000 FCFA) confirmed for client in Bastos.",
          latencyMs: Math.floor(Math.random() * 50) + 95,
          payload: {
            provider: "Orange Money Cameroun",
            amount: 85000,
            status: "PAID",
          },
        },
      ];

      const newLog = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]); // Keep latest 50
    }, 7000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Copy JSON helper
  const handleCopyPayload = (payload: Record<string, unknown>) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
    if (severityFilter !== "all" && log.severity !== severityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMsg = log.message.toLowerCase().includes(q);
      const matchTenant = log.tenantName.toLowerCase().includes(q);
      const matchEvent = log.event.toLowerCase().includes(q);
      if (!matchMsg && !matchTenant && !matchEvent) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              Global AI & Billing Logs
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Ingestion Stream
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-text-secondary">
            Real-time audit log of webhooks, Gemini triage decisions, failed tokens, and Mobile Money settlements
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className="rounded-full border-border-button-default bg-background-primary-default text-xs font-semibold shadow-2xs hover:bg-background-secondary-default"
          >
            {isLiveStreaming ? (
              <>
                <Pause className="mr-1.5 h-3.5 w-3.5 text-amber-600" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                Resume Stream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Latency & Metrics Bar */}
      <div id="metrics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
            Avg Meta Webhook Latency
          </span>
          <p className="text-xl font-black text-text-primary mt-1 font-mono">112 ms</p>
          <span className="text-[10px] text-emerald-600 font-semibold">99.98% delivery rate</span>
        </div>

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
            Gemini Flash Inferences
          </span>
          <p className="text-xl font-black text-accent-600 mt-1 font-mono">245 ms</p>
          <span className="text-[10px] text-text-tertiary">1.2M tokens today</span>
        </div>

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
            MoMo & OM Webhooks
          </span>
          <p className="text-xl font-black text-emerald-600 mt-1 font-mono">88 ms</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Zero drops in 72h</span>
        </div>

        <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
            Security Interceptions
          </span>
          <p className="text-xl font-black text-text-primary mt-1 font-mono">3 Caught</p>
          <span className="text-[10px] text-rose-600 font-semibold">Fake slips flagged</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log messages, event names, or tenants..."
            className="w-full rounded-full border border-border-button-default bg-background-secondary-default pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent-600 focus:bg-background-primary-default focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center space-x-1 rounded-full border border-border-button-default bg-background-secondary-default p-1 text-xs font-semibold">
            <span className="text-text-tertiary px-2.5 text-[11px]">Type:</span>
            {["all", "webhook", "ai_inference", "payment", "channel_auth", "security"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize transition-colors ${
                  categoryFilter === cat
                    ? "bg-background-primary-default text-text-primary shadow-2xs font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center space-x-1 rounded-full border border-border-button-default bg-background-secondary-default p-1 text-xs font-semibold">
            <span className="text-text-tertiary px-2.5 text-[11px]">Severity:</span>
            {["all", "info", "success", "warning"].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverityFilter(sev)}
                className={`rounded-full px-2.5 py-1 text-[11px] capitalize transition-colors ${
                  severityFilter === sev
                    ? "bg-background-primary-default text-text-primary shadow-2xs font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Logs Table */}
      <div className="overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-button-default bg-background-secondary-default/50 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                <th className="py-3.5 pl-6">Timestamp</th>
                <th className="py-3.5">Severity</th>
                <th className="py-3.5">Tenant Workspace</th>
                <th className="py-3.5">Category & Channel</th>
                <th className="py-3.5">Event Name</th>
                <th className="py-3.5">Summary Message</th>
                <th className="py-3.5 text-right pr-6">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-button-default font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-tertiary font-sans">
                    No log events match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="cursor-pointer transition-colors hover:bg-background-secondary-default/60"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 pl-6 whitespace-nowrap text-text-tertiary text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    {/* Severity */}
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          log.severity === "success"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.severity === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : log.severity === "error"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-accent-100 text-accent-800"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>

                    {/* Tenant */}
                    <td className="py-3.5 font-sans font-bold text-text-primary whitespace-nowrap">
                      {log.tenantName}
                    </td>

                    {/* Category & Channel */}
                    <td className="py-3.5">
                      <span className="rounded-full bg-background-secondary-default border border-border-button-default px-2.5 py-0.5 text-[10px] font-bold uppercase text-text-secondary">
                        {log.channel || log.category}
                      </span>
                    </td>

                    {/* Event Name */}
                    <td className="py-3.5 text-[11px] font-bold text-text-primary">
                      {log.event}
                    </td>

                    {/* Message */}
                    <td className="py-3.5 font-sans text-xs text-text-secondary max-w-md truncate">
                      {log.message}
                    </td>

                    {/* Latency */}
                    <td className="py-3.5 text-right pr-6 font-bold text-text-primary whitespace-nowrap">
                      {log.latencyMs} ms
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LOG INSPECTION SLIDE-OVER DRAWER / MODAL                  */}
      {/* ========================================================= */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative flex h-full w-full max-w-xl flex-col bg-background-primary-default p-6 shadow-modal animate-in slide-in-from-right duration-200 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border-button-default pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
                  <FileCode2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Log Event Inspector
                  </h3>
                  <p className="text-xs text-text-tertiary font-mono mt-0.5">
                    {selectedLog.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-full p-1.5 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Event Overview Badges */}
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-border-button-default bg-background-secondary-default/70 p-3">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Tenant</span>
                  <p className="font-bold text-text-primary mt-0.5">{selectedLog.tenantName}</p>
                </div>
                <div className="rounded-2xl border border-border-button-default bg-background-secondary-default/70 p-3">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Event Type</span>
                  <p className="font-mono font-bold text-text-primary mt-0.5">{selectedLog.event}</p>
                </div>
                <div className="rounded-2xl border border-border-button-default bg-background-secondary-default/70 p-3">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Timestamp</span>
                  <p className="text-text-secondary mt-0.5">{selectedLog.timestamp}</p>
                </div>
                <div className="rounded-2xl border border-border-button-default bg-background-secondary-default/70 p-3">
                  <span className="text-[10px] uppercase font-bold text-text-tertiary">Latency</span>
                  <p className="font-mono font-bold text-emerald-700 mt-0.5">{selectedLog.latencyMs} ms</p>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-text-primary">Audit Message</label>
                <p className="mt-1 rounded-2xl border border-border-button-default bg-background-secondary-default p-3 text-xs text-text-secondary leading-relaxed">
                  {selectedLog.message}
                </p>
              </div>

              {/* JSON Payload */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary">Event Ingestion Payload</label>
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(selectedLog.payload)}
                    className="inline-flex items-center text-xs font-semibold text-accent-700 hover:text-accent-800"
                  >
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    {copied ? "Copied!" : "Copy JSON"}
                  </button>
                </div>

                <pre className="mt-1.5 max-h-72 overflow-y-auto rounded-3xl border border-border-button-default bg-slate-950 p-4 font-mono text-[11px] text-emerald-400">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-8 border-t border-border-button-default pt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
                className="rounded-full text-xs"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}