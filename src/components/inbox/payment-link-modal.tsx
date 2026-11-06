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
  const [description, setDescription] = React.useState<string>("Deposit & Order Reservation");
  const [provider, setProvider] = React.useState<"paystack" | "flutterwave" | "bank">("paystack");
  const [isCopied, setIsCopied] = React.useState(false);

  const generatedLink = `https://pay.omnisales.ai/musa/${
    provider === "paystack" ? "pstk" : provider === "flutterwave" ? "flw" : "direct"
  }_inv_${customer.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInsert = () => {
    const message = `Here is your verified secure payment link for ₦${amount.toLocaleString()} via ${
      provider === "paystack"
        ? "Paystack"
        : provider === "flutterwave"
        ? "Flutterwave"
        : "Bank Transfer"
    }: ${generatedLink} — Instant receipt generated once completed!`;
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
              Generate Instant Payment Link
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For {customer.name} ({customer.channel_type.toUpperCase()})
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
            Amount (₦ NGN)
          </label>
          <div className="relative mt-1">
            <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
              ₦
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-4 py-2 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Description input */}
        <div>
          <label className="text-xs font-semibold text-slate-700">
            Invoice Description
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
            Payment Gateway
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProvider("paystack")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "paystack"
                  ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Paystack
            </button>
            <button
              type="button"
              onClick={() => setProvider("flutterwave")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "flutterwave"
                  ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Flutterwave
            </button>
            <button
              type="button"
              onClick={() => setProvider("bank")}
              className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition-all ${
                provider === "bank"
                  ? "border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20"
                  : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Virtual Bank
            </button>
          </div>
        </div>

        {/* Generated Link Preview */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
          <span className="text-[11px] font-semibold text-slate-500">
            Generated Checkout URL
          </span>
          <div className="mt-1 flex items-center justify-between rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-700">
            <span className="truncate font-mono text-[11px] text-blue-600 mr-2">
              {generatedLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-slate-500 hover:text-slate-800 transition-colors"
              title="Copy link"
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
          Cancel
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={handleInsert}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
        >
          <Send className="mr-1.5 h-3.5 w-3.5" />
          Insert Link into Chat
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
