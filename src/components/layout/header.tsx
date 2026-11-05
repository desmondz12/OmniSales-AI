"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  Menu,
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
}

export function Header({
  userEmail,
  profile,
  tenant,
  membership,
  onOpenMobileMenu,
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
    profile?.full_name || userEmail.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Button + Active Workspace indicator */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {tenant && (
          <div className="flex items-center space-x-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 shadow-sm">
            <Building2 className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-slate-200">
              {tenant.name}
            </span>
            {membership && (
              <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400 border border-blue-900/50">
                {membership.role}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: User Menu */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-3 rounded-lg p-1.5 text-left transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm ring-2 ring-slate-800">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs text-left">
              <p className="font-semibold text-slate-200 leading-tight">
                {displayName}
              </p>
              <p className="text-slate-400 truncate max-w-[150px]">
                {userEmail}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-200 shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95">
              <div className="border-b border-slate-800 px-3 py-2 text-xs">
                <p className="font-semibold text-white">{displayName}</p>
                <p className="text-slate-400 truncate">{userEmail}</p>
                {membership && (
                  <p className="mt-1 flex items-center text-[11px] text-blue-400 font-medium">
                    <Shield className="mr-1 h-3 w-3" /> Role:{" "}
                    <span className="ml-1 capitalize">{membership.role}</span>
                  </p>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/settings/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                  Profile Settings
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Building2 className="mr-2 h-4 w-4 text-slate-400" />
                  Workspace Settings
                </Link>
              </div>

              <div className="border-t border-slate-800 pt-1">
                <div className="px-2 py-1">
                  <SignOutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
