"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-sans">
      <div className="mx-auto max-w-lg rounded-3xl border border-border-button-default bg-background-primary-default p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-5 border border-amber-200/60 shadow-2xs">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          Interruption de l&apos;Espace de Travail
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Nous n&apos;avons pas pu charger cette vue en temps réel. Vos flux WhatsApp, Instagram et Mobile Money ne sont pas interrompus.
        </p>

        {error.message && (
          <div className="mt-4 rounded-2xl bg-background-secondary-default p-3 text-left font-mono text-xs text-text-secondary border border-border-button-default overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold text-xs shadow-xs"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Actualiser les données
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full border-border-button-default text-text-primary hover:bg-background-secondary-default text-xs font-semibold shadow-2xs",
            })}
          >
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Vue d&apos;ensemble
          </Link>
        </div>
      </div>
    </div>
  );
}