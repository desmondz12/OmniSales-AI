"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-3xl border border-border-button-default bg-background-primary-default p-6 text-text-primary shadow-modal transition-all animate-in zoom-in-95",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/20"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 mb-5">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">{title}</h2>
          {description && (
            <p className="text-xs text-text-secondary">{description}</p>
          )}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
