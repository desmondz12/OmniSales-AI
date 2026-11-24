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
    title: "Connect Accounts",
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
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-200/80 px-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 tracking-tight text-slate-900"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0071E3] text-white shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-slate-900">{APP_NAME}</span>
        </Link>
      </div>

      {/* Active Workspace */}
      <div className="p-3 border-b border-slate-200/60">
        <div className="flex items-center justify-between rounded-lg bg-slate-100/80 border border-slate-200/60 p-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white shadow-2xs border border-slate-200/60 text-slate-600">
              <Building2 className="h-3 w-3" />
            </div>
            <span className="truncate text-xs font-medium text-slate-900">
              {tenantName || "Fotso Distribution Douala"}
            </span>
          </div>
          <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-200/60">
            {role || "Admin"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        <p className="px-2 pb-1.5 text-[10px] font-semibold text-slate-400">
          Menu principal
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
                "group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-[#0071E3] text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeColor || "bg-slate-100 text-slate-600"
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
      <div className="border-t border-slate-200/80 p-3 space-y-2 bg-slate-50/70">
        {/* 5 Channels Live Indicators */}
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 mb-1.5">
            <span>Passerelles actives</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[9px] font-medium">
            <span className="rounded bg-emerald-50 py-0.5 text-emerald-700 border border-emerald-100">
              WA
            </span>
            <span className="rounded bg-pink-50 py-0.5 text-pink-700 border border-pink-100">
              IG
            </span>
            <span className="rounded bg-blue-50 py-0.5 text-blue-700 border border-blue-100">
              FB
            </span>
            <span className="rounded bg-slate-100 py-0.5 text-slate-800 border border-slate-200">
              TT
            </span>
            <span className="rounded bg-sky-50 py-0.5 text-sky-700 border border-sky-100">
              TG
            </span>
          </div>
        </div>

        {/* Quick Switch to Super Admin Portal */}
        <Link
          href="/admin"
          className="flex items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <Shield className="h-3.5 w-3.5 text-slate-500" />
          <span>Super Admin</span>
        </Link>
      </div>
    </aside>
  );
}
