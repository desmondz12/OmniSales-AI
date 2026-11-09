"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  Building2,
  FileCode2,
  LayoutDashboard,
  LucideIcon,
  Radio,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

const navItems: AdminNavItem[] = [
  {
    title: "System Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Businesses & Tenants",
    href: "/admin/businesses",
    icon: Building2,
    badge: "18",
    badgeColor: "bg-accent-100 text-accent-800",
  },
  {
    title: "Global Webhook & AI Logs",
    href: "/admin/logs",
    icon: FileCode2,
    badge: "Live",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Channels Gateway Health",
    href: "/admin#health",
    icon: Radio,
  },
  {
    title: "API Latency & Metrics",
    href: "/admin/logs#metrics",
    icon: Activity,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-border-button-default bg-background-primary-default shadow-card",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border-button-default px-6">
        <Link
          href="/admin"
          className="flex items-center space-x-2.5 font-bold tracking-tight text-text-primary hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-accent-900 font-black text-white shadow-2xs">
            <Shield className="h-4 w-4 text-accent-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base tracking-tight leading-tight">{APP_NAME}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
              Super Admin
            </span>
          </div>
        </Link>
        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
          Owner
        </span>
      </div>

      {/* Super Admin Status Tag */}
      <div className="border-b border-border-button-default px-5 py-3 bg-background-secondary-default/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="truncate text-xs font-bold text-text-primary">
              SaaS Control Center
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            CEMAC Cluster
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
          Admin Command
        </p>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-text-secondary hover:bg-background-secondary-default hover:text-text-primary"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-accent-400"
                      : "text-text-tertiary group-hover:text-text-primary"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    item.badgeColor || "bg-background-secondary-default text-text-secondary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Switcher: Quick Jump to Client Workspace */}
      <div className="border-t border-border-button-default p-4 bg-background-secondary-default/40">
        <Link
          href="/dashboard"
          className="group flex items-center justify-between rounded-3xl border border-accent-200/80 bg-accent-50/70 p-3.5 text-xs font-semibold text-accent-950 transition-all hover:bg-accent-100 hover:border-accent-300 shadow-card"
        >
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent-600 text-white shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-accent-950">Client Dashboard</p>
              <p className="text-[10px] text-accent-700">Jump into Workspace View</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </aside>
  );
}