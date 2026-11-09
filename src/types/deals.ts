import type { ChannelType } from "@/types/database";

export type DealStage =
  | "lead"
  | "contacted"
  | "proposal"
  | "deposit_paid"
  | "won"
  | "lost";

export interface Deal {
  id: string;
  workspace_id: string;
  title: string;
  amount_fcfa: number;
  stage: DealStage;
  probability: number; // percentage 0 - 100
  customer_name: string;
  customer_phone?: string;
  customer_city: "Douala" | "Yaoundé" | "Bafoussam" | "Garoua" | "Autre";
  company_name?: string;
  channel_type: ChannelType;
  assigned_to: string; // e.g. "Nathalie (IA)" or "Jean-Luc Fotso"
  notes?: string;
  expected_close_date: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineColumn {
  id: DealStage;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
  borderColor: string;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    id: "lead",
    label: "Lead Identifié",
    description: "Nouveau contact entrant qualifié par l'IA",
    color: "text-slate-600",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    borderColor: "border-slate-300",
  },
  {
    id: "contacted",
    label: "En Discussion",
    description: "Conversation active & qualification des besoins",
    color: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    borderColor: "border-blue-400",
  },
  {
    id: "proposal",
    label: "Devis / Facture Proforma",
    description: "Offre tarifaire et devis FCFA transmis",
    color: "text-indigo-600",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    borderColor: "border-indigo-400",
  },
  {
    id: "deposit_paid",
    label: "Acompte Versé (MoMo/OM)",
    description: "Acompte 30-50% validé sur MTN ou Orange",
    color: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    borderColor: "border-amber-400",
  },
  {
    id: "won",
    label: "Clôturé Gagné",
    description: "Commande livrée et solde réglé en totalité",
    color: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    borderColor: "border-emerald-500",
  },
  {
    id: "lost",
    label: "Perdu / Annulé",
    description: "Sans suite ou rupture de stock",
    color: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    borderColor: "border-rose-400",
  },
];
