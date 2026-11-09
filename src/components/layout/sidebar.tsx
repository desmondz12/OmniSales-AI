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
    badgeColor: "bg-rose-500 text-white",
  },
  {
    title: "Pipeline des Deals",
    href: "/dashboard/deals",
    icon: Layers,
    badge: "8",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    title: "Recouvrement & MoMo",
    href: "/dashboard/collections",
    icon: CreditCard,
    badge: "2",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    title: "Canaux Connectés",
    href: "/dashboard/channels",
    icon: Radio,
    badge: "5",
    badgeColor: "bg-emerald-100 text-emerald-800",
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
        "flex h-screen w-64 flex-col border-r border-border-button-default bg-background-primary-default shadow-2xs",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-separator-border px-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-600 font-black text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base tracking-tight font-sans font-bold">{APP_NAME}</span>
        </Link>
        <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold text-accent-700 border border-accent-200">
          PRO
        </span>
      </div>

      {/* Active Workspace Switcher Tag */}
      <div className="border-b border-separator-border px-5 py-3 bg-background-secondary-default/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-background-primary-default border border-border-button-default text-text-secondary">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="truncate text-xs font-semibold text-text-primary">
              {tenantName || "Fotso & Sons Commerce Douala"}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100/80 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
            {role || "Owner"}
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-text-placeholder">
          Workspace
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
                "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-accent-600 text-white shadow-2xs font-semibold"
                  : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-text-tertiary group-hover:text-text-primary"
                  )}
                />
                <span>{item.title}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeColor || "bg-background-secondary-default text-text-secondary"
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
      <div className="border-t border-separator-border p-4 space-y-3 bg-background-secondary-default/40">
        {/* 5 Channels Live Indicators */}
        <div className="rounded-xl border border-border-button-default bg-background-primary-default p-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary mb-1.5">
            <span>5 Channels Connected</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-5 gap-1 text-center">
            <span className="rounded bg-emerald-50 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
              WA
            </span>
            <span className="rounded bg-pink-50 py-0.5 text-[10px] font-bold text-pink-700 border border-pink-100">
              IG
            </span>
            <span className="rounded bg-blue-50 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
              FB
            </span>
            <span className="rounded bg-slate-100 py-0.5 text-[10px] font-bold text-slate-900 border border-slate-200">
              TT
            </span>
            <span className="rounded bg-sky-50 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
              TG
            </span>
          </div>
        </div>

        {/* Quick Switch to Super Admin Portal */}
        <Link
          href="/admin"
          className="flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors shadow-2xs"
        >
          <Shield className="h-3.5 w-3.5 text-blue-600" />
          <span>Super Admin Portal</span>
        </Link>
      </div>
    </aside>
  );
}
