"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Inbox,
  Menu,
  Radio,
  Search,
  Shield,
  Sparkles,
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
    tenant?.name ||
    userEmail.split("@")[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-button-default bg-background-primary-default/90 px-4 sm:px-6 backdrop-blur-md font-sans">
      {/* Left: Mobile Menu Trigger + Live Status Pill */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary md:hidden transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Live Channel Status Pill */}
        <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">
            5 Channels Connected • Agent Active (Douala)
          </span>
          <span className="sm:hidden">5 Channels Active</span>
        </div>

        {/* Active Workspace Pill for Mobile */}
        <div className="sm:hidden text-xs font-bold text-text-primary truncate max-w-[120px]">
          {tenant?.name || "OmniSales"}
        </div>
      </div>

      {/* Middle: Universal Search Bar (BoardUI style) */}
      <div className="hidden lg:flex items-center w-72">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Rechercher clients, factures..."
            className="w-full rounded-full border border-border-button-default bg-background-secondary-default py-1.5 pl-9 pr-10 text-xs text-text-primary placeholder:text-text-tertiary focus:bg-background-primary-default focus:border-accent-600 focus:outline-none transition-all"
          />
          <kbd className="absolute right-3 top-2 rounded-md bg-background-primary-default px-1.5 py-0.5 text-[10px] font-bold text-text-tertiary border border-border-button-default shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls: Language Selector + Unified Inbox quick open + Notifications + User profile */}
      <div className="flex items-center space-x-2.5">
        {/* Bilingual Cameroon Language Switcher */}
        <button
          type="button"
          onClick={() => setLang((prev) => (prev === "FR" ? "EN" : "FR"))}
          className="inline-flex items-center space-x-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-background-secondary-default transition-colors shadow-2xs"
          title="Basculer la langue / Switch language (Cameroon Bilingual)"
        >
          <span className="text-sm">🇨🇲</span>
          <span className="text-[11px] font-bold text-text-primary">
            {lang === "FR" ? "FR" : "EN"}
          </span>
          <span className="text-[9px] text-text-tertiary">| {lang === "FR" ? "EN" : "FR"}</span>
        </button>

        {/* Quick Inbox Drawer Button */}
        {onOpenInboxDrawer ? (
          <button
            type="button"
            onClick={onOpenInboxDrawer}
            className="relative flex items-center space-x-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-background-secondary-default hover:text-accent-600 transition-colors shadow-2xs"
            title="Open Live Chat Drawer"
          >
            <Inbox className="h-4 w-4 text-accent-600" />
            <span className="hidden sm:inline">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>
        ) : (
          <Link
            href="/dashboard/inbox"
            className="relative flex items-center space-x-1.5 rounded-full border border-border-button-default bg-background-primary-default px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-background-secondary-default hover:text-accent-600 transition-colors shadow-2xs"
            title="Open Live Unified Inbox"
          >
            <Inbox className="h-4 w-4 text-accent-600" />
            <span className="hidden sm:inline">Inbox</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              3
            </span>
          </Link>
        )}

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative rounded-full border border-border-button-default bg-background-primary-default p-2 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary transition-colors shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-600 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 rounded-full border border-border-button-default bg-background-primary-default p-1.5 pr-2.5 text-left transition-colors hover:bg-background-secondary-default shadow-2xs"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-accent-600 to-indigo-600 text-xs font-bold text-white shadow-2xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs text-left pr-1">
              <p className="font-semibold text-text-primary leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-text-tertiary">
                {membership?.role || "Owner"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-border-button-default bg-background-primary-default p-2 shadow-modal animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="border-b border-border-button-default px-3 py-2">
                <p className="text-xs font-semibold text-text-primary">{displayName}</p>
                <p className="text-[11px] text-text-tertiary truncate">{userEmail}</p>
                <span className="mt-1 inline-block rounded-full bg-accent-50 px-2 py-0.5 text-[9px] font-bold text-accent-700">
                  Business Owner
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-2xl px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-accent-50 hover:text-accent-700 transition-colors"
                >
                  <Shield className="h-4 w-4 text-accent-600" />
                  <span>Super Admin Portal</span>
                </Link>

                <Link
                  href="/dashboard/settings/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-2xl px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-text-tertiary" />
                  <span>Profile Settings</span>
                </Link>

                <Link
                  href="/dashboard/channels"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center space-x-2 rounded-2xl px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
                >
                  <Radio className="h-4 w-4 text-text-tertiary" />
                  <span>Connected Channels (5)</span>
                </Link>
              </div>

              <div className="border-t border-border-button-default pt-1">
                <SignOutButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}