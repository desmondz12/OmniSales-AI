"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Shield } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Super Admin error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-sans">
      <div className="mx-auto max-w-lg rounded-3xl border border-border-button-default bg-background-primary-default p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 border border-rose-200/60 shadow-2xs">
          <AlertOctagon className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          Super Admin Console Error
        </h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          An error occurred while inspecting global platform logs or tenant states. System telemetry remains intact.
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
            Reload Admin Console
          </Button>
          <Link
            href="/admin"
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full border-border-button-default text-text-primary hover:bg-background-secondary-default text-xs font-semibold shadow-2xs",
            })}
          >
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Admin Overview
          </Link>
        </div>
      </div>
    </div>
  );
}