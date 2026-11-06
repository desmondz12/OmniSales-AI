"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Building2,
  ChevronDown,
  Inbox,
  Menu,
  Radio,
  Search,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { SignOutButton } from "@/components/shared/sign-out-button";
import type { Profile, Tenant, TenantMember } from "@/types/database";

interface HeaderProps {
  userEmail: string;
  profile?: Profile | null;
  tenant?: Tenant | null;
  membership?: TenantMember | null;
  onOpenMobileMenu?: () => void;
  onOpenInboxDrawer?: () => void;
}

export function Header({
  userEmail,
  profile,
  tenant,
  membership,
  onOpenMobileMenu,
  onOpenInboxDrawer,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const displayName =
    profile?.full_name || (userEmail.startsWith("musa") ? "Musa Danjuma" : userEmail.split("@")[0]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu + Workspace indicator */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Workspace pill */}
        <div className="hidden sm:flex items-center space-x-2 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-1.5">
          <Building2 className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-800">
            {tenant?.name || "Musa Electronics & Fashion"}
          </span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
            Active
          </span>
        </div>

        {/* Live AI Status Pill */}
        <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">AI Agent Active • Handling 5 Channels</span>
          <span className="sm:hidden">AI Active</span>
        </div>
      </div>

      {/* Middle: Search Bar (Donezo style) */}
      <div className="hidden lg:flex items-center w-72">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, invoice..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-12 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors"
          />
          <kbd className="absolute right-2.5 top-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Unified Inbox quick open + Notifications + User profile */}
      <div className="flex items-center space-x-2.5">
        {/* Quick Inbox Drawer Button */}
        {onOpenInboxDrawer ? (
          <button
            type="button"
            onClick={onOpenInboxDrawer}
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
            title="Open Live Chat Drawer"
          >
            <Inbox className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
        ) : (
          <Link
            href="/dashboard/inbox"
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
            title="Open Live Unified Inbox"
          >
            <Inbox className="h-4 w-4 text-blue-600" />
            <span className="hidden sm:inline">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </Link>
        )}

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200/80 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-xl border border-slate-200/80 bg-white p-1.5 text-left transition-colors hover:bg-slate-50 shadow-2xs"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-2xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs text-left pr-1">
              <p className="font-semibold text-slate-900 leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500">
                {membership?.role || "Owner"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <span className="mt-1 inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                  Business Owner
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Super Admin Portal</span>
                </Link>

                <Link
                  href="/dashboard/settings/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>

                <Link
                  href="/dashboard/channels"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Radio className="h-4 w-4 text-slate-400" />
                  <span>Connected Channels (5)</span>
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
