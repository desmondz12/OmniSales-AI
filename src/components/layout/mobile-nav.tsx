"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  tenantName?: string;
  role?: string;
}

export function MobileNav({
  isOpen,
  onClose,
  tenantName,
  role,
}: MobileNavProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-background-primary-default border-r border-border-button-default shadow-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors focus:outline-none"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <Sidebar tenantName={tenantName} role={role} className="w-full h-full border-r-0" />
      </div>
    </div>
  );
}
