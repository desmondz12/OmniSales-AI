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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
      {/* Navigation Header: Apple Translucent Glass Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#0071E3] font-bold text-white shadow-sm shadow-[#0071E3]/25">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-[-0.025em] text-slate-900">
              {APP_NAME}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "apple-press rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900",
              })}
            >
              Se Connecter
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "apple-press rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-4 shadow-xs",
              })}
            >
              Lancer la Démo
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-purple-500/20 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 px-3.5 py-1 text-xs font-semibold text-purple-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
            <span>Apple Design • IA Commerciale & Recouvrement 5 Canaux</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-6xl sm:leading-[1.08]">
            Transformez vos conversations en{" "}
            <span className="bg-linear-to-r from-[#0071E3] via-[#5856D6] to-[#0077ED] bg-clip-text text-transparent">
              recettes encaissées.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
            Agent commercial autonome opérant 24/7 sur{" "}
            <strong className="text-slate-800 font-semibold">WhatsApp, Instagram, Messenger, TikTok et Telegram</strong>.
            Qualifie vos leads, encaisse les acomptes via MTN MoMo / Orange Money et recouvre les impayés.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "apple-press w-full sm:w-auto font-medium text-xs sm:text-sm h-11 px-7 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-xs",
              })}
            >
              Ouvrir la Démo Instantanée
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "apple-press w-full sm:w-auto text-xs sm:text-sm h-11 px-6 rounded-2xl border-slate-200/80 bg-white/80 hover:bg-slate-100/70 font-medium",
              })}
            >
              Espace Super Admin
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 font-normal">
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#34C759]" />
              Connexion Démo 1 Clic
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#34C759]" />
              PostgreSQL + RLS Multi-tenant
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#34C759]" />
              Bilingue FCFA + MoMo / OM
            </span>
          </div>
        </div>

        {/* Feature Grid: Apple Translucent Glass Cards */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="apple-glass-card rounded-3xl border border-slate-200/60 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[#0071E3] mb-4">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Le Money Brief Vocal Matinal
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Chaque matin à 07h, votre conseiller exécutif IA analyse les conversations nocturnes, calcule les créances dues et vous dicte un brief audio de 30 secondes.
            </p>
          </div>

          <div className="apple-glass-card rounded-3xl border border-slate-200/60 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#34C759]/10 text-[#34C759] mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Boîte de Réception 5 Canaux
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Centralisez les messages WhatsApp, Instagram, Messenger, TikTok et Telegram dans une vue unique avec détection des leads chauds et relais humain instantané.
            </p>
          </div>

          <div className="apple-glass-card rounded-3xl border border-slate-200/60 p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5856D6]/10 text-[#5856D6] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Command Center Super Admin
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Supervisez la disponibilité des passerelles API, les quotas de tokens d&apos;IA, la télémétrie des webhooks et basculez instantanément dans n&apos;importe quelle entreprise.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-md py-8 text-center text-xs text-slate-400 font-normal">
        OmniSales AI • Conçu avec le Design System Apple pour les commerçants du Cameroun
      </footer>
    </div>
  );
}
