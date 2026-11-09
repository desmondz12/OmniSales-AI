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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm shadow-blue-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              {APP_NAME}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-slate-600 hover:text-slate-900",
              })}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "font-semibold shadow-xs",
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
          <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Sales & Collections Platform • 5 Connected Channels</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.1]">
            Turn customer conversations into{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              collected revenue.
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Autonomous AI sales and payment recovery agent that operates across{" "}
            <strong>WhatsApp, Instagram, Messenger, TikTok, and Telegram</strong>.
            Triage hot leads, escalate angry buyers, and recover overdue invoices around the clock.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto font-semibold shadow-sm text-base h-11 px-8",
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
                className: "w-full sm:w-auto text-base h-11 px-6",
              })}
            >
              Login as Super Admin
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center space-x-6 text-xs text-slate-500">
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
              Linear / Stripe Light Aesthetic
            </span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4 border border-blue-100">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              The Morning &quot;Money Brief&quot;
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Every morning your executive AI agent synthesizes overnight conversations, calculates total receivables, and narrates a 30-second audio summary with Web Speech TTS.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Unified 5-Channel Inbox
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Consolidate DMs from WhatsApp, Instagram, Messenger, TikTok, and Telegram into one real-time 3-pane inbox with human handoff queues and instant payment links.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-4 border border-purple-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Super Admin Command Center
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              SaaS owners can monitor API uptime, track MRR, adjust token limits, view live webhook latency, and jump directly into any business client dashboard via Impersonation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        OmniSales AI • Next.js 16 + TypeScript + Tailwind CSS + Supabase
      </footer>
    </div>
  );
}
