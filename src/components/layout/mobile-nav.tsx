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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <Sidebar tenantName={tenantName} role={role} className="w-full h-full border-r-0" />
      </div>
    </div>
  );
}
