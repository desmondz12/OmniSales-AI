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
    <div className="relative w-full max-w-lg rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-modal animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border-secondary pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">
              Générer un Lien de Paiement
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Client : {customer.name} ({customer.channel_type.toUpperCase()})
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-text-tertiary hover:bg-background-secondary-default hover:text-text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Body */}
      <div className="mt-5 space-y-4">
        {/* Amount input */}
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Montant (FCFA / XAF)
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-border-button-default bg-background-secondary-default pl-4 pr-16 py-2 text-sm font-semibold text-text-primary focus:border-accent-600 focus:bg-background-primary-default focus:outline-none"
            />
            <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-text-tertiary">
              FCFA
            </span>
          </div>
        </div>

        {/* Description input */}
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Motif / Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border-button-default bg-background-secondary-default px-3.5 py-2 text-xs text-text-primary focus:border-accent-600 focus:bg-background-primary-default focus:outline-none"
          />
        </div>

        {/* Gateway Provider Selection */}
        <div>
          <label className="text-xs font-medium text-text-secondary">
            Moyen de Paiement Cameroun
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProvider("momo")}
              className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                provider === "momo"
                  ? "border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-border-button-default bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover"
              }`}
            >
              MTN MoMo
            </button>
            <button
              type="button"
              onClick={() => setProvider("orange")}
              className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                provider === "orange"
                  ? "border-orange-500 bg-orange-50/70 text-orange-900 ring-2 ring-orange-500/20 dark:bg-orange-950/40 dark:text-orange-200"
                  : "border-border-button-default bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover"
              }`}
            >
              Orange Money
            </button>
            <button
              type="button"
              onClick={() => setProvider("afriland")}
              className={`rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                provider === "afriland"
                  ? "border-accent-600 bg-accent-50 text-accent-700 ring-2 ring-accent-500/20 dark:bg-accent-950/40 dark:text-accent-300"
                  : "border-border-button-default bg-background-secondary-default text-text-secondary hover:bg-background-secondary-hover"
              }`}
            >
              Afriland / Virement
            </button>
          </div>
        </div>

        {/* Generated Link Preview */}
        <div className="rounded-2xl border border-border-button-default bg-background-secondary-default p-3">
          <span className="text-[11px] font-medium text-text-tertiary">
            Lien de Checkout généré
          </span>
          <div className="mt-1 flex items-center justify-between rounded-xl bg-background-primary-default border border-border-button-default px-3 py-1.5 text-xs text-text-primary">
            <span className="truncate font-mono text-[11px] text-accent-700 dark:text-accent-400 mr-2">
              {generatedLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
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
      <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-border-secondary pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs rounded-full border-border-button-default text-text-secondary hover:text-text-primary"
        >
          Annuler
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleInsert}
          className="rounded-full bg-accent-600 hover:bg-accent-700 text-white font-medium text-xs shadow-xs"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <PaymentLinkModalContent
        key={customer.id}
        customer={customer}
        onClose={onClose}
        onInsertIntoChat={onInsertIntoChat}
      />
    </div>
  );
}
