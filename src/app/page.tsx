import { APP_NAME, APP_DESCRIPTION, ROUTES } from "@/lib/constants";
import Link from "next/link";

/**
 * Public landing page for OmniSales AI.
 * This is the entry point before authentication.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 px-4 text-white">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo / Brand */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            {APP_NAME}
          </h1>
          <p className="mt-4 text-lg text-slate-400">{APP_DESCRIPTION}</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.LOGIN}
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.SIGNUP}
            className="rounded-lg border border-slate-700 bg-slate-800 px-8 py-3 text-sm font-semibold text-slate-300 shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            Create Account
          </Link>
        </div>

        {/* Status badge */}
        <p className="mt-12 text-xs text-slate-600">
          Phase 0 — Project scaffolding complete. Authentication coming in Phase
          1.
        </p>
      </div>
    </main>
  );
}
