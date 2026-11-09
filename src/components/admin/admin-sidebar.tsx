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
    badgeColor: "bg-blue-100 text-blue-800",
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
        "flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white shadow-2xs",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <Link
          href="/admin"
          className="flex items-center space-x-2.5 font-bold tracking-tight text-slate-900 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 font-black text-white shadow-sm shadow-slate-900/25">
            <Shield className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base tracking-tight leading-tight">{APP_NAME}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Super Admin
            </span>
          </div>
        </Link>
        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
          Owner
        </span>
      </div>

      {/* Super Admin Status Tag */}
      <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="truncate text-xs font-bold text-slate-800">
              SaaS Control Center
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
            CEMAC Cluster
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-900"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    item.badgeColor || "bg-slate-100 text-slate-700"
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
      <div className="border-t border-slate-100 p-4 bg-slate-50/40">
        <Link
          href="/dashboard"
          className="group flex items-center justify-between rounded-2xl border border-blue-200/80 bg-blue-50/60 p-3 text-xs font-semibold text-blue-900 transition-all hover:bg-blue-100/80 hover:border-blue-300"
        >
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="font-bold text-xs text-blue-950">Client Dashboard</p>
              <p className="text-[10px] text-blue-700">Jump into Workspace View</p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </aside>
  );
}
