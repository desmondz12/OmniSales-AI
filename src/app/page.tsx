import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Headphones,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-full text-text-primary font-sans antialiased selection:bg-accent-100 selection:text-accent-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border-button-default bg-background-primary-default/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-600 font-bold text-white shadow-2xs">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary">
              {APP_NAME}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-full text-text-secondary hover:text-text-primary",
              })}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold shadow-xs",
              })}
            >
              Launch Demo
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-accent-200 bg-accent-50 px-3.5 py-1 text-xs font-semibold text-accent-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Sales & Collections Platform • 5 Connected Channels</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-6xl sm:leading-[1.1]">
            Turn customer conversations into{" "}
            <span className="bg-gradient-to-r from-accent-600 to-indigo-600 bg-clip-text text-transparent">
              collected revenue.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Autonomous AI sales and payment recovery agent that operates across{" "}
            <strong>WhatsApp, Instagram, Messenger, TikTok, and Telegram</strong>.
            Triage hot leads, escalate angry buyers, and recover overdue invoices around the clock in Cameroon & the CEMAC region.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto rounded-full bg-accent-600 hover:bg-accent-700 text-white font-semibold shadow-sm text-sm h-11 px-8",
              })}
            >
              Open Instant Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full sm:w-auto rounded-full border-border-button-default bg-background-primary-default text-text-primary text-sm h-11 px-6 shadow-2xs hover:bg-background-secondary-default",
              })}
            >
              Login as Super Admin
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
              Role Switcher Included
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
              Real PostgreSQL + RLS
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
              BoardUI Design System
            </span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 mb-4 shadow-2xs">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              The Morning &quot;Money Brief&quot;
            </h3>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              Every morning your executive AI agent synthesizes overnight conversations, calculates total receivables, and narrates a 30-second audio summary with Web Speech TTS.
            </p>
          </div>

          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4 shadow-2xs">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Unified 5-Channel Inbox
            </h3>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              Consolidate DMs from WhatsApp, Instagram, Messenger, TikTok, and Telegram into one real-time 3-pane inbox with human handoff queues and instant payment links.
            </p>
          </div>

          <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-2xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary">
              Super Admin Command Center
            </h3>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed">
              SaaS owners can monitor API uptime, track MRR, adjust token limits, view live webhook latency, and jump directly into any business client dashboard via Impersonation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-button-default bg-background-primary-default py-8 text-center text-xs text-text-tertiary">
        OmniSales AI • Next.js 16 + TypeScript + Tailwind CSS + BoardUI + Supabase
      </footer>
    </div>
  );
}