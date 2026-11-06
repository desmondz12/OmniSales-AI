"use client";

import * as React from "react";
import {
  CheckCircle2,
  Code2,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChannelType } from "@/types/database";

interface WebhookTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel?: ChannelType;
}

type ScenarioType = "ready_to_pay" | "angry_customer" | "wholesale_person" | "general_inquiry";

function createScenarioPayload(channel: ChannelType, scenario: ScenarioType) {
  switch (scenario) {
    case "ready_to_pay":
      return {
        object: channel === "telegram" ? "telegram_update" : "whatsapp_business_account",
        entry: [
          {
            id: "wh_entry_9921",
            channel: channel,
            customer: {
              name: "Jean-Pierre Fotso",
              phone: "+237 671 23 45 67",
              channel_type: channel,
            },
            message: {
              id: "msg_sim_01",
              text: "Bonjour, je suis prêt à verser l'acompte de 550 000 FCFA par MTN MoMo maintenant. Envoyez le lien svp.",
              timestamp: 1730880000,
            },
          },
        ],
      };
    case "angry_customer":
      return {
        object: "instagram_direct_message",
        entry: [
          {
            id: "wh_entry_9922",
            channel: channel,
            customer: {
              name: "Boris Atangana",
              handle: "@boris_atangana",
              channel_type: channel,
            },
            message: {
              id: "msg_sim_02",
              text: "Où est ma montre connectée achetée hier à 180 000 FCFA ?? Vous aviez promis livraison à Bastos (Yaoundé) ce matin !",
              timestamp: 1730880000,
            },
          },
        ],
      };
    case "wholesale_person":
      return {
        object: "messaging_webhook",
        entry: [
          {
            id: "wh_entry_9923",
            channel: channel,
            customer: {
              name: "Marie-Claire Ngo",
              phone: "+237 699 88 77 66",
              channel_type: channel,
            },
            message: {
              id: "msg_sim_03",
              text: "Je souhaite commander 50 pièces de pagnes brodés en gros. Puis-je parler au gérant directement ?",
              timestamp: 1730880000,
            },
          },
        ],
      };
    default:
      return {
        object: "messaging_webhook",
        entry: [
          {
            id: "wh_entry_9924",
            channel: channel,
            customer: {
              name: "Fadimatou Bello",
              handle: "@fadimatou_bello",
              channel_type: channel,
            },
            message: {
              id: "msg_sim_04",
              text: "Quel est le prix du pack studio créateur micro et livrez-vous à Garoua / Maroua ?",
              timestamp: 1730880000,
            },
          },
        ],
      };
  }
}

export function WebhookTestModal({
  isOpen,
  onClose,
  defaultChannel = "whatsapp",
}: WebhookTestModalProps) {
  const [channel, setChannel] = React.useState<ChannelType>(defaultChannel);
  const [scenario, setScenario] = React.useState<ScenarioType>("ready_to_pay");

  const [isSending, setIsSending] = React.useState(false);
  const [result, setResult] = React.useState<{
    status: number;
    latencyMs: number;
    triageTag: string;
    aiResponse: string;
    handoffTriggered: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const payload = createScenarioPayload(channel, scenario);

  const handleSendTestWebhook = () => {
    setIsSending(true);
    setResult(null);

    setTimeout(() => {
      setIsSending(false);
      if (scenario === "ready_to_pay") {
        setResult({
          status: 200,
          latencyMs: 142,
          triageTag: "ready_to_pay",
          aiResponse:
            "Lien de paiement sécurisé MoMo/OM généré pour 550 000 FCFA. Alerte de relais envoyée au gérant pour transaction à forte valeur.",
          handoffTriggered: true,
        });
      } else if (scenario === "angry_customer") {
        setResult({
          status: 200,
          latencyMs: 165,
          triageTag: "upset",
          aiResponse:
            "Détection de détresse / réclamation client. Réponses auto suspendues. Escalade urgente transmise au service logistique Douala-Yaoundé.",
          handoffTriggered: true,
        });
      } else if (scenario === "wholesale_person") {
        setResult({
          status: 200,
          latencyMs: 128,
          triageTag: "asked_for_person",
          aiResponse:
            "Demande d'échange avec le gérant pour commande en gros de 50 pièces. Ticket routé vers la file 'Besoins Humains'.",
          handoffTriggered: true,
        });
      } else {
        setResult({
          status: 200,
          latencyMs: 110,
          triageTag: "none",
          aiResponse:
            "Prix catalogue (80 000 FCFA) communiqué avec confirmation de livraison sous 24-48h à Garoua. Géré par l'IA sans intervention humaine.",
          handoffTriggered: false,
        });
      }
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Channel Webhook Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate inbound messaging payloads to test real-time AI triage
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

        {/* Channel & Scenario Selectors */}
        <div className="mt-5 space-y-4">
          {/* Channel buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Select Destination Channel
            </label>
            <div className="mt-1.5 grid grid-cols-5 gap-1.5">
              {(["whatsapp", "instagram", "messenger", "tiktok", "telegram"] as ChannelType[]).map(
                (ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`rounded-xl border py-2 text-center text-xs font-semibold capitalize transition-all ${
                      channel === ch
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {ch === "whatsapp" ? "WhatsApp" : ch}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Scenario buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Select Inbound Message Scenario
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setScenario("ready_to_pay")}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  scenario === "ready_to_pay"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold">Ready to Pay (₦550k Deposit)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">High intent payment triggers link</p>
              </button>

              <button
                type="button"
                onClick={() => setScenario("angry_customer")}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  scenario === "angry_customer"
                    ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold">Angry Customer (Delivery Delay)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Triggers human handoff escalation</p>
              </button>

              <button
                type="button"
                onClick={() => setScenario("wholesale_person")}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  scenario === "wholesale_person"
                    ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold">Wholesale / Human Request</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Wants personal owner consultation</p>
              </button>

              <button
                type="button"
                onClick={() => setScenario("general_inquiry")}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  scenario === "general_inquiry"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <p className="font-bold">General Price Inquiry</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Handled 100% automatically by AI</p>
              </button>
            </div>
          </div>

          {/* JSON Payload Preview */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Payload JSON (Sent to /api/webhooks/{channel})
            </label>
            <pre className="mt-1 max-h-36 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-900 p-3 font-mono text-[11px] text-emerald-400">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          {/* Live Result Output */}
          {result && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Webhook Processed (HTTP {result.status} OK)</span>
                </div>
                <span className="text-[11px] text-emerald-700">{result.latencyMs}ms response time</span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p>
                  <strong>Triage Classification:</strong>{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 font-bold text-blue-700">
                    {result.triageTag}
                  </code>
                </p>
                <p>
                  <strong>Handoff Escalation:</strong>{" "}
                  {result.handoffTriggered ? (
                    <span className="font-bold text-rose-700">Yes (Priority Queue Alerted)</span>
                  ) : (
                    <span className="font-bold text-emerald-700">No (Autonomous AI Handling)</span>
                  )}
                </p>
                <p className="pt-1 text-slate-800 leading-relaxed">
                  <strong>AI Response Action:</strong> {result.aiResponse}
                </p>
              </div>
            </div>
          )}
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
            Close
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={isSending}
            onClick={handleSendTestWebhook}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Dispatching...
              </>
            ) : (
              <>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Dispatch Webhook Payload
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
