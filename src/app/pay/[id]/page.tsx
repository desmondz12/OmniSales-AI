"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Phone,
  ShieldCheck,
  Building2,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string) || "txn_momo_001";

  const isMoMo = rawId.includes("momo");
  const isOrange = rawId.includes("orange");
  const isAfriland = rawId.includes("afriland");

  const [paid, setPaid] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState("+237 671 23 45 67");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [copiedRib, setCopiedRib] = React.useState(false);

  const rib = "10005 00012 01234567890 44";

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      await fetch("/api/payments/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: rawId,
          amount: 550000,
          status: "SUCCESSFUL",
          operator_id: `OP_${Date.now()}`,
        }),
      });
      setTimeout(() => {
        setIsProcessing(false);
        setPaid(true);
      }, 1500);
    } catch {
      setIsProcessing(false);
      setPaid(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-slate-100 p-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Paiement Sécurisé OmniSales AI</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Nissi Exploits Cameroun</h1>
          <p className="text-xs text-slate-500 mt-1">Facture / Acompte commande Akwa Douala</p>

          <div className="mt-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Montant à régler</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">550 000 FCFA</span>
          </div>
        </div>

        {/* Payment Body */}
        <div className="p-6">
          {paid ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Paiement Validé avec Succès !</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Votre transaction de 550 000 FCFA a été confirmée. Votre reçu officiel a été transmis à l'équipe commerciale.
              </p>
              <div className="mt-6">
                <a
                  href="/inbox"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Retourner à l'Inbox
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-medium text-slate-700">Moyen de paiement sélectionné</div>

              {isMoMo && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    MoMo
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-amber-950">MTN Mobile Money Cameroun</h3>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Prompt automatique USSD direct sur votre téléphone (*126#).
                    </p>
                  </div>
                </div>
              )}

              {isOrange && (
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    OM
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-orange-950">Orange Money Cameroun</h3>
                    <p className="text-[11px] text-orange-800 mt-0.5">
                      Composez #150*50# sur votre téléphone pour générer votre code OTP à 4 chiffres.
                    </p>
                  </div>
                </div>
              )}

              {isAfriland && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-950">Afriland First Bank</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-100 text-[11px] font-mono text-slate-700">
                    <span>{rib}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(rib);
                        setCopiedRib(true);
                        setTimeout(() => setCopiedRib(false), 2000);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {copiedRib ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {!isAfriland && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Numéro de téléphone payeur
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                      placeholder="+237 6..."
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>
                  {isProcessing
                    ? "Validation en cours avec l'opérateur..."
                    : `Confirmer le paiement (550 000 FCFA)`}
                </span>
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  Réf: {rawId}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
