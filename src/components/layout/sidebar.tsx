"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  DollarSign,
  LayoutDashboard,
  LucideIcon,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
    badge: "Phase 3",
  },
  {
    title: "Pipeline",
    href: "/dashboard/deals",
    icon: BarChart3,
    badge: "Phase 4",
  },
  {
    title: "Collections",
    href: "/dashboard/collections",
    icon: DollarSign,
    badge: "Phase 5",
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
        "flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-md",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-black text-white shadow-md">
            O
          </div>
          <span className="text-lg">{APP_NAME}</span>
        </Link>
      </div>

      {/* Tenant Indicator */}
      {tenantName && (
        <div className="border-b border-slate-800/80 px-6 py-3 bg-slate-950/40">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Building2 className="h-3.5 w-3.5 text-blue-400" />
            <span className="truncate font-medium text-slate-200">
              {tenantName}
            </span>
          </div>
          {role && (
            <div className="mt-1 flex items-center">
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {role}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
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
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    isActive
                      ? "bg-blue-700/80 text-blue-100"
                      : "bg-slate-800 text-slate-500"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-slate-800 p-4 text-xs text-slate-500 text-center">
        OmniSales AI v0.1.0 • Phase 2
      </div>
    </aside>
  );
}
