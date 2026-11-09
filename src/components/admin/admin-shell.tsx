"use client";

import * as React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { X } from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background-full text-text-primary font-sans antialiased">
      {/* Desktop Admin Sidebar */}
      <AdminSidebar className="hidden md:flex shrink-0 sticky top-0" />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background-primary-default shadow-modal">
            <div className="absolute right-3 top-3 z-10">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminSidebar className="w-full border-none shadow-none" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
