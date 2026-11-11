import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Headphones,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600/10 selection:text-blue-700">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0071E3] font-bold text-white shadow-xs">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              {APP_NAME}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900",
              })}
            >
              Se Connecter
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-medium px-3.5 shadow-xs",
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
          <div className="inline-flex items-center space-x-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Commerce omnicanal • WhatsApp, Instagram, Messenger, TikTok & Telegram</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.1]">
            Transformez vos conversations en recettes encaissées
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Agent commercial autonome opérant 24/7 au Cameroun et en zone CEMAC.
            Qualifie vos prospects, génère les liens de paiement MTN MoMo et Orange Money,
            et relance les impayés avec traçabilité comptable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full sm:w-auto font-medium text-xs sm:text-sm h-11 px-7 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-xs",
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
                className: "w-full sm:w-auto text-xs sm:text-sm h-11 px-6 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-medium text-slate-700 shadow-2xs",
              })}
            >
              Espace Super Admin
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0071E3] mb-4">
              <Headphones className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Brief Vocal Matinal
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Chaque matin à 07h, votre synthèse exécutive passe en revue les conversations nocturnes, calcule les créances dues et vous dicte un point audio synthétique de 30 secondes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Boîte de Réception 5 Canaux
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Centralisez les messages WhatsApp, Instagram, Messenger, TikTok et Telegram dans une vue unifiée avec détection des intentions d&apos;achat et relais humain immédiat.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              Supervision & Sécurité Multi-tenant
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
              Supervisez la disponibilité des passerelles API, les quotas de jetons IA, la télémétrie des webhooks et basculez instantanément entre vos boutiques et filiales.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-normal">
        OmniSales AI • Plateforme de vente et de recouvrement omnicanal (Douala &amp; Yaoundé, Cameroun)
      </footer>
    </div>
  );
}
