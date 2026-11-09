"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-full px-4 text-center font-sans">
      <div className="mx-auto max-w-md rounded-3xl border border-border-button-default bg-background-primary-default p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 border border-rose-100 shadow-2xs">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          Une erreur temporaire est survenue
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Le serveur OmniSales AI a rencontré un événement inattendu. Vos données et canaux restent protégés.
        </p>

        {error.message && (
          <div className="mt-4 rounded-2xl bg-background-secondary-default p-3 text-left font-mono text-xs text-text-secondary border border-border-button-default overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Réessayer (Reload)
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full border-border-button-default text-text-primary hover:bg-background-secondary-default text-xs font-semibold shadow-2xs",
            })}
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}