import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";

export const metadata: Metadata = {
  title: "OmniSales AI — Ventes & Recouvrement IA Omnicanal",
  description: "Plateforme IA de vente, CRM et recouvrement omnicanal (WhatsApp, Instagram, Messenger, TikTok, Telegram) pour le Cameroun et l'Afrique Centrale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-50 text-slate-900 antialiased"
        suppressHydrationWarning
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
