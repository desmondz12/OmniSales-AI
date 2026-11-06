"use client";

import * as React from "react";
import {
  Check,
  Copy,
  CreditCard,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/database";

interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onInsertIntoChat: (linkMessage: string) => void;
}

function PaymentLinkModalContent({
  customer,
  onClose,
  onInsertIntoChat,
}: {
  customer: Customer;
  onClose: () => void;
  onInsertIntoChat: (linkMessage: string) => void;
}) {
  const [amount, setAmount] = React.useState<number>(customer.total_owed || 550000);
  const [description, setDescription] = React.useState<string>("Acompte réservation de commande");
  const [provider, setProvider] = React.useState<"momo" | "orange" | "afriland">("momo");
  const [isCopied, setIsCopied] = React.useState(false);

  const generatedLink = `https://pay.omnisales.ai/fotso/${
    provider === "momo" ? "mtn_momo" : provider === "orange" ? "orange_money" : "afriland_bank"
  }_inv_${customer.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInsert = () => {
    const providerName =
      provider === "momo"
        ? "MTN Mobile Money"
        : provider === "orange"
        ? "Orange Money Cameroun"
        : "Afriland First Bank / Virement";
    const message = `Voici votre lien de paiement sécurisé pour ${amount.toLocaleString("fr-FR")} FCFA via ${providerName} : ${generatedLink} — Reçu instantané généré automatiquement dès confirmation !`;
    onInsertIntoChat(message);
    onClose();
  };

  return (
    <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Générer un Lien de Paiement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Client : {customer.name} ({customer.channel_type.toUpperCase()})
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Body */}
      <div className="mt-5 space-y-4">
        {/* Amount input */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Montant (FCFA / XAF)
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-4 pr-16 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
              FCFA
            </span>
          </div>
        </div>

        {/* Description input */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Motif / Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Gateway Provider Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Moyen de Paiement Cameroun
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProvider("momo")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "momo"
                  ? "border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              MTN MoMo
            </button>
            <button
              type="button"
              onClick={() => setProvider("orange")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "orange"
                  ? "border-orange-500 bg-orange-50/70 text-orange-900 ring-2 ring-orange-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Orange Money
            </button>
            <button
              type="button"
              onClick={() => setProvider("afriland")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "afriland"
                  ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Afriland / Virement
            </button>
          </div>
        </div>

        {/* Generated Link Preview */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
          <span className="text-[11px] font-semibold text-slate-500">
            Lien de Checkout généré
          </span>
          <div className="mt-1 flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-700">
            <span className="truncate font-mono text-[11px] text-blue-600 mr-2">
              {generatedLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-slate-500 hover:text-slate-800 transition-colors"
              title="Copier le lien"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs rounded-xl"
        >
          Annuler
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleInsert}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Insérer dans la discussion
        </Button>
      </div>
    </div>
  );
}

export function PaymentLinkModal({
  isOpen,
  onClose,
  customer,
  onInsertIntoChat,
}: PaymentLinkModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <PaymentLinkModalContent
        key={customer.id}
        customer={customer}
        onClose={onClose}
        onInsertIntoChat={onInsertIntoChat}
      />
    </div>
  );
}
