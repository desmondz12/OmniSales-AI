"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  CreditCard,
  Inbox,
  Layers,
  LayoutDashboard,
  LucideIcon,
  Radio,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Boîte Unifiée (5 Canaux)",
    href: "/dashboard/inbox",
    icon: Inbox,
    badge: "3",
    badgeColor: "bg-[#FF3B30] text-white",
  },
  {
    title: "Pipeline des Deals",
    href: "/dashboard/deals",
    icon: Layers,
    badge: "8",
    badgeColor: "bg-blue-50 text-[#0071E3] border border-blue-200/60",
  },
  {
    title: "Recouvrement & MoMo",
    href: "/dashboard/collections",
    icon: CreditCard,
    badge: "2",
    badgeColor: "bg-amber-50 text-[#FF9500] border border-amber-200/60",
  },
  {
    title: "Canaux Connectés",
    href: "/dashboard/channels",
    icon: Radio,
    badge: "5",
    badgeColor: "bg-emerald-50 text-[#34C759] border border-emerald-200/60",
  },
  {
    title: "Agente IA (Nathalie)",
    href: "/dashboard/agent",
    icon: Bot,
  },
  {
    title: "Clients & CRM",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Paramètres Espace",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  tenantName?: string;
  role?: string;
  className?: string;
}

export function Sidebar({ tenantName, role, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-2xl shadow-[1px_0_12px_rgba(0,0,0,0.02)] select-none",
        className
      )}
    >
      {/* Brand Header — Apple Minimal Monolith */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/50 px-5">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 tracking-tight text-slate-900 active:scale-[0.98] transition-all"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0071E3] via-[#0077ED] to-[#5856D6] text-white shadow-xs shadow-blue-500/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">{APP_NAME}</span>
        </Link>
        <span className="rounded-full bg-blue-50/80 px-2 py-0.5 text-[10px] font-bold text-[#0071E3] border border-blue-200/50">
          PRO
        </span>
      </div>

      {/* Active Workspace — Apple Card Material */}
      <div className="p-3 border-b border-slate-200/40">
        <div className="flex items-center justify-between rounded-xl bg-slate-100/70 backdrop-blur-md border border-slate-200/50 p-2.5">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white shadow-2xs border border-slate-200/60 text-slate-600">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="truncate text-xs font-semibold text-slate-900 tracking-tight">
              {tenantName || "Fotso Distribution Douala"}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-[#34C759] border border-emerald-200/60">
            {role || "Admin"}
          </span>
        </div>
      </div>

      {/* Navigation Links with Apple Fluid Selection */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Principal
        </p>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-120 ease-out active:scale-[0.98]",
                isActive
                  ? "bg-[#0071E3] text-white shadow-xs shadow-blue-500/25"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  )}
                />
                <span className="tracking-tight">{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white backdrop-blur-xs"
                      : item.badgeColor || "bg-slate-100 text-slate-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Section: 5 Channels Live Status & Super Admin Switch */}
      <div className="border-t border-slate-200/50 p-3 space-y-2.5 bg-slate-50/50 backdrop-blur-md">
        {/* 5 Channels Live Indicators */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
            <span className="tracking-tight">Passerelles Actives</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse" />
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] font-bold">
            <span className="rounded-lg bg-emerald-50 py-0.5 text-[#34C759] border border-emerald-100">
              WA
            </span>
            <span className="rounded-lg bg-pink-50 py-0.5 text-pink-600 border border-pink-100">
              IG
            </span>
            <span className="rounded-lg bg-blue-50 py-0.5 text-[#0071E3] border border-blue-100">
              FB
            </span>
            <span className="rounded-lg bg-slate-100 py-0.5 text-slate-900 border border-slate-200">
              TT
            </span>
            <span className="rounded-lg bg-sky-50 py-0.5 text-sky-600 border border-sky-100">
              TG
            </span>
          </div>
        </div>

        {/* Quick Switch to Super Admin Portal */}
        <Link
          href="/admin"
          className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0071E3] transition-all active:scale-[0.98] shadow-2xs"
        >
          <Shield className="h-3.5 w-3.5 text-[#0071E3]" />
          <span className="tracking-tight">Super Admin Portal</span>
        </Link>
      </div>
    </aside>
  );
}
