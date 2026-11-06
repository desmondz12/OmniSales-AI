"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  ChevronDown,
  Menu,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import { SignOutButton } from "@/components/shared/sign-out-button";

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu + Status */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global System Health Pill */}
        <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">
            All Systems Operational • 99.98% Uptime (CEMAC)
          </span>
          <span className="sm:hidden">99.98% Uptime</span>
        </div>

        {/* Real-time Latency Pill */}
        <div className="hidden lg:flex items-center space-x-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          <Activity className="h-3 w-3 text-blue-600" />
          <span>Avg Latency: 94ms</span>
        </div>
      </div>

      {/* Middle: Universal Admin Search Bar */}
      <div className="hidden md:flex items-center w-72 lg:w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tenant, webhook, phone number..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-12 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:bg-white focus:outline-none transition-colors"
          />
          <kbd className="absolute right-2.5 top-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Jump to Client + Notifications + Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Jump to Client Workspace Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 transition-colors shadow-2xs"
          title="Switch to Client Workspace Dashboard"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span className="hidden sm:inline">Client View</span>
          <ArrowRight className="h-3 w-3 text-blue-600" />
        </Link>

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        {/* Super Admin User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-xl border border-slate-200/80 bg-white p-1.5 text-left transition-colors hover:bg-slate-50 shadow-2xs"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-2xs">
              <Shield className="h-4 w-4 text-blue-400" />
            </div>
            <div className="hidden sm:block text-xs text-left pr-1">
              <p className="font-semibold text-slate-900 leading-tight">
                Super Admin
              </p>
              <p className="text-[10px] text-slate-500">
                SaaS Owner
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900">Platform Administrator</p>
                <p className="text-[11px] text-slate-500 truncate">admin@omnisales.ai</p>
                <span className="mt-1 inline-block rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  Super Admin
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/businesses"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>Manage 18 Businesses</span>
                </Link>

                <Link
                  href="/admin/logs"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span>Global Webhook Logs</span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <span>Impersonate Client View</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
