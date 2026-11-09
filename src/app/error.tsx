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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 border border-rose-100">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Une erreur temporaire est survenue
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Le serveur OmniSales AI a rencontré un événement inattendu. Vos données et canaux restent protégés.
        </p>

        {error.message && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left font-mono text-xs text-slate-600 border border-slate-200 overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Réessayer (Reload)
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold",
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
