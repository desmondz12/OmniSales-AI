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
  const [lang, setLang] = React.useState<"FR" | "EN">("FR");
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
    profile?.full_name ||
    (userEmail.startsWith("fotso") || userEmail.startsWith("musa") || userEmail.startsWith("business")
      ? "Jean-Luc Fotso"
      : userEmail.split("@")[0]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/75 px-4 sm:px-6 backdrop-blur-2xl select-none">
      {/* Left: Mobile Menu + Workspace indicator */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden active:scale-95 transition-all"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Workspace pill */}
        <div className="hidden sm:flex items-center space-x-2 rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-md px-3 py-1.5 shadow-2xs">
          <Building2 className="h-3.5 w-3.5 text-[#0071E3]" />
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            {tenant?.name || "Fotso & Sons Commerce Douala"}
          </span>
          <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-[#34C759] border border-emerald-200/50">
            Actif
          </span>
        </div>

        {/* Live AI Status Pill */}
        <div className="inline-flex items-center rounded-full bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-xs">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
          </span>
          <span className="hidden sm:inline tracking-tight">Agente IA Active • 5 Canaux Connectés</span>
          <span className="sm:hidden tracking-tight">IA Active</span>
        </div>
      </div>

      {/* Middle: Apple Spotlight Search Bar */}
      <div className="hidden lg:flex items-center w-72">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher client, commande, deal..."
            className="w-full rounded-xl border border-slate-200/70 bg-slate-100/60 backdrop-blur-md pl-8 pr-11 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0071E3] focus:bg-white focus:outline-none transition-all shadow-2xs"
          />
          <kbd className="absolute right-2 top-1.5 rounded-lg bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-400 border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Bilingual Switcher + Quick Inbox + Notifications + User profile */}
      <div className="flex items-center space-x-2">
        {/* Bilingual Cameroon Language Switcher */}
        <button
          type="button"
          onClick={() => setLang((prev) => (prev === "FR" ? "EN" : "FR"))}
          className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-[0.97] shadow-2xs"
          title="Basculer la langue / Switch language (Cameroon Bilingual)"
        >
          <span className="text-sm">🇨🇲</span>
          <span className="text-[11px] font-bold text-slate-900">
            {lang === "FR" ? "FR" : "EN"}
          </span>
          <span className="text-[9px] text-slate-400">| {lang === "FR" ? "EN" : "FR"}</span>
        </button>

        {/* Quick Inbox Drawer Button */}
        {onOpenInboxDrawer ? (
          <button
            type="button"
            onClick={onOpenInboxDrawer}
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0071E3] transition-all active:scale-[0.97] shadow-2xs"
            title="Open Live Chat Drawer"
          >
            <Inbox className="h-4 w-4 text-[#0071E3]" />
            <span className="hidden sm:inline tracking-tight">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-xs">
              3
            </span>
          </button>
        ) : (
          <Link
            href="/dashboard/inbox"
            className="relative flex items-center space-x-1.5 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0071E3] transition-all active:scale-[0.97] shadow-2xs"
            title="Open Live Unified Inbox"
          >
            <Inbox className="h-4 w-4 text-[#0071E3]" />
            <span className="hidden sm:inline tracking-tight">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white shadow-xs">
              3
            </span>
          </Link>
        )}

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.97] shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#0071E3] ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-1.5 text-left transition-all hover:bg-slate-50 active:scale-[0.98] shadow-2xs"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0071E3] to-[#5856D6] text-xs font-bold text-white shadow-2xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs text-left pr-1">
              <p className="font-semibold text-slate-900 leading-tight tracking-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500">
                {membership?.role || "Gérant"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-2xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.1)] ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-900 tracking-tight">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <span className="mt-1 inline-block rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#0071E3]">
                  Propriétaire Espace
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#0071E3] transition-colors"
                >
                  <Shield className="h-4 w-4 text-[#0071E3]" />
                  <span>Super Admin Portal</span>
                </Link>

                <Link
                  href="/dashboard/settings/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Paramètres Profil</span>
                </Link>

                <Link
                  href="/dashboard/channels"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Radio className="h-4 w-4 text-slate-400" />
                  <span>Passerelles Canaux (5)</span>
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
