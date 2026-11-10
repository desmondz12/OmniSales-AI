"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import type { Profile, Tenant, TenantMember } from "@/types/database";

interface DashboardShellProps {
  userEmail: string;
  profile?: Profile | null;
  tenant?: Tenant | null;
  membership?: TenantMember | null;
  children: React.ReactNode;
}

export function DashboardShell({
  userEmail,
  profile,
  tenant,
  membership,
  children,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const isInbox = pathname === "/dashboard/inbox";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar
        tenantName={tenant?.name}
        role={membership?.role}
        className="hidden md:flex shrink-0 sticky top-0"
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        tenantName={tenant?.name}
        role={membership?.role}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden h-screen">
        <Header
          userEmail={userEmail}
          profile={profile}
          tenant={tenant}
          membership={membership}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        {isInbox ? (
          <main className="flex-1 h-[calc(100vh-4rem)] overflow-hidden flex flex-col p-0">
            {children}
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        )}
      </div>
    </div>
  );
}
