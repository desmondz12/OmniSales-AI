"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  CreditCard,
  Inbox,
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
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Unified Inbox",
    href: "/dashboard/inbox",
    icon: Inbox,
    badge: "3",
    badgeColor: "bg-rose-500 text-white",
  },
  {
    title: "Connected Channels",
    href: "/dashboard/channels",
    icon: Radio,
    badge: "5",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "AI Sales Agent",
    href: "/dashboard/agent",
    icon: Bot,
  },
  {
    title: "Invoices & Money",
    href: "/dashboard/invoices",
    icon: CreditCard,
  },
  {
    title: "Customers & CRM",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    title: "Settings",
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
        "flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white shadow-2xs",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2.5 font-bold tracking-tight text-slate-900 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-black text-white shadow-sm shadow-blue-500/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base tracking-tight">{APP_NAME}</span>
        </Link>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
          PRO
        </span>
      </div>

      {/* Active Workspace Switcher Tag */}
      <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <span className="truncate text-xs font-semibold text-slate-800">
              {tenantName || "Musa Electronics & Fashion"}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100/80 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
            {role || "Owner"}
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-900"
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
      <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/40">
        {/* 5 Channels Live Indicators */}
        <div className="rounded-xl border border-slate-200/70 bg-white p-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
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
