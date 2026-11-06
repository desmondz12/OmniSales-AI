"use client";

import * as React from "react";
import {
  Bot,
  Building2,
  Check,
  CreditCard,
  DollarSign,
  Plus,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  salesNotes: string;
}

type ToneType = "consultative" | "professional" | "closer" | "friendly";

export function AgentTrainingClient() {
  // Agent Persona
  const [agentName, setAgentName] = React.useState("Nathalie (Conseillère Ventes Fotso)");
  const [tone, setTone] = React.useState<ToneType>("consultative");
  const [systemPrompt, setSystemPrompt] = React.useState(
    "Accueillir chaleureusement en français ou en anglais selon la langue du client. Confirmer la ville de livraison (Douala Akwa/Bonanjo, Yaoundé Bastos, Bafoussam, Limbe). Proposer des verres trempés et coques de protection assorties, et accorder jusqu'à 5% de remise pour toute commande de 3 unités ou plus. Paiements acceptés : MTN Mobile Money (MoMo), Orange Money (OM) et virement Afriland First Bank."
  );

  // Languages enabled in Cameroon
  const [languages, setLanguages] = React.useState({
    french: true,
    english: true,
    camfranglais: true,
    pidgin: true,
  });

  // Products Catalog (FCFA)
  const [products, setProducts] = React.useState<ProductItem[]>([
    {
      id: "prod-1",
      name: "iPhone 15 Pro (256 Go, Titane Noir)",
      category: "Smartphones",
      price: 550000,
      stock: 12,
      salesNotes: "Garantie Apple officielle 1 an ; expédition le jour même sur Douala/Yaoundé",
    },
    {
      id: "prod-2",
      name: "Montre Connectée Ultra Series 9 (Cellulaire)",
      category: "Accessoires",
      price: 180000,
      stock: 24,
      salesNotes: "Bracelet silicone supplémentaire offert ; étanche 50m",
    },
    {
      id: "prod-3",
      name: "Kit Créateur Micro Sans Fil & Ring Light Studio",
      category: "Accessoires",
      price: 80000,
      stock: 35,
      salesNotes: "Très populaire auprès des créateurs TikTok Douala ; réduction pack incluse",
    },
    {
      id: "prod-4",
      name: "Pagnes & Tissus Brodés Gros (Lot de 30 pièces)",
      category: "Textile & Mode",
      price: 320000,
      stock: 8,
      salesNotes: "Minimum de commande 30 pièces ; photos d'échantillons envoyées sur WhatsApp",
    },
  ]);

  // Payment Gateway Keys (Cameroon)
  const [momoMerchantKey, setMomoMerchantKey] = React.useState(
    "momo_cm_live_671234567_fotso"
  );
  const [orangeMoneyKey, setOrangeMoneyKey] = React.useState(
    "om_cm_partner_699887766_fotso"
  );
  const [bankAccount, setBankAccount] = React.useState({
    bankName: "Afriland First Bank Cameroun",
    accountName: "Fotso & Sons Commerce Général SARL",
    accountNumber: "10005 00012 34567890123 45",
  });

  // Handoff Rules
  const [handoffRules, setHandoffRules] = React.useState({
    highValuePayment: true, // > 250 000 FCFA
    distressedCustomer: true, // sentiment colère / urgence
    explicitHumanRequest: true, // "parler à un humain", "gérant"
    receiptScreenshot: true, // capture reçu MoMo/OM
    discountOver15: true, // remise > 15%
  });

  // Simulator / Playground State
  const [simulatorInput, setSimulatorInput] = React.useState("");
  const [simulatorMessages, setSimulatorMessages] = React.useState<
    { sender: "customer" | "ai"; text: string; tag?: string }[]
  >([
    {
      sender: "customer",
      text: "Bonjour ! Est-ce que l'iPhone 15 Pro est disponible et quel est votre meilleur prix pour 2 pièces ?",
    },
    {
      sender: "ai",
      text: "Bonjour et bienvenue chez Fotso & Sons Douala ! 😊 Oui, nous avons 12 unités de l'iPhone 15 Pro 256 Go Titane Noir en stock à 550 000 FCFA l'unité. Pour 2 unités (1 100 000 FCFA), nous vous offrons les verres trempés blindés et la livraison express gratuite sur Douala ou Yaoundé ! Dans quelle ville êtes-vous basé ?",
      tag: "ton_commercial_chaleureux",
    },
  ]);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Saved confirmation indicator
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSimulateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorInput.trim() || isSimulating) return;

    const userText = simulatorInput.trim();
    setSimulatorMessages((prev) => [...prev, { sender: "customer", text: userText }]);
    setSimulatorInput("");
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      let reply = "";
      let tag = "automated";

      const lower = userText.toLowerCase();
      if (lower.includes("remise") || lower.includes("discount") || lower.includes("20%")) {
        reply =
          "Je comprends votre souhait de bénéficier d'un tarif préférentiel ! Notre barème standard prévoit jusqu'à 5% pour les achats groupés. Pour une réduction supérieure à 15%, je transmets immédiatement votre demande à M. Fotso pour validation spéciale. Un instant !";
        tag = "escalade_remise";
      } else if (lower.includes("fâché") || lower.includes("retard") || lower.includes("où est ma commande") || lower.includes("angry")) {
        reply =
          "Toutes nos excuses pour ce contretemps. J'ai immédiatement suspendu les messages automatiques et transmis votre dossier en priorité au responsable des expéditions Douala-Yaoundé. Vous recevrez un appel d'ici quelques minutes.";
        tag = "escalade_urgence";
      } else if (lower.includes("payer") || lower.includes("momo") || lower.includes("orange") || lower.includes("lien") || lower.includes("compte")) {
        reply =
          "Parfait ! Vous pouvez régler en toute sécurité via MTN MoMo au 671 23 45 67, Orange Money au 699 88 77 66 ou virement Afriland First Bank (Fotso & Sons Commerce SARL). Dès validation, un reçu certifié vous est envoyé automatiquement !";
        tag = "pret_a_payer";
      } else {
        reply = `Merci pour votre message ! Tous nos appareils sont garantis d'origine avec expédition express sous 24h partout au Cameroun. Souhaitez-vous que je réserve votre article dès à présent ?`;
      }

      setSimulatorMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply, tag },
      ]);
    }, 850);
  };

  const handleAddProduct = () => {
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: "New Store Item / Service",
      category: "General",
      price: 50000,
      stock: 10,
      salesNotes: "New catalog item ready for AI sales pitching",
    };
    setProducts((prev) => [...prev, newProd]);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toneOptions: { id: ToneType; title: string; desc: string }[] = [
    {
      id: "consultative",
      title: "Warm & Consultative",
      desc: "Authentic African retailer style, welcoming and helpful",
    },
    {
      id: "professional",
      title: "Corporate Executive",
      desc: "Polite, structured, and formal commercial language",
    },
    {
      id: "closer",
      title: "Direct Sales Closer",
      desc: "Focuses on urgency, payment links, and instant reservations",
    },
    {
      id: "friendly",
      title: "Casual & Friendly",
      desc: "Approachable, conversational, and energetic",
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              AI Sales Agent Training
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-blue-600" />
              Gemini 2.5 Flash Engine
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure agent personality, sales negotiation rules, product pricing catalog, and human handoff thresholds
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            onClick={handleSaveSettings}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            {isSaved ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-white" />
                Saved & Synchronized!
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save AI Configuration
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Settings (7 Cols) + Right Interactive Simulator (5 Cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* ========================================================= */}
        {/* LEFT COLUMN: TRAINING SECTIONS (7 Cols)                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Agent Persona & Brand Voice */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Agent Persona & Brand Voice
                </h3>
                <p className="text-xs text-slate-500">
                  Defines greeting style, negotiation tone, and customer engagement persona
                </p>
              </div>
            </div>

            {/* Agent Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                AI Agent Name
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Brand Tone Preset
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
                {toneOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      tone === item.id
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-100/60"
                    }`}
                  >
                    <p className="font-bold text-xs">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Guidance Prompt */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Custom Sales Directives & Guardrails
              </label>
              <textarea
                rows={3}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Language Fluency Switches */}
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Langues reconnues (Bilinguisme Cameroun)
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { key: "french", label: "Français (Officiel)" },
                  { key: "english", label: "English (Official)" },
                  { key: "camfranglais", label: "Camfranglais (Douala/Yaoundé)" },
                  { key: "pidgin", label: "Pidgin English (Cameroun)" },
                ].map((lang) => {
                  const isChecked = languages[lang.key as keyof typeof languages];
                  return (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() =>
                        setLanguages((prev) => ({
                          ...prev,
                          [lang.key]: !prev[lang.key as keyof typeof languages],
                        }))
                      }
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isChecked
                          ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{lang.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Product & Pricing Catalog */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Catalog & Pricing Table
                  </h3>
                  <p className="text-xs text-slate-500">
                    AI quotes exact inventory prices and applies your custom sales notes
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/70"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="space-y-3">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                        {item.category} • {item.stock} in stock
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900">
                        {item.price.toLocaleString("fr-FR")} FCFA
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.id)}
                        className="ml-2 text-slate-400 hover:text-rose-600 p-1"
                        title="Remove product"
                      >
                        <Trash2 className="h-3.5 w-3.5 inline" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-white rounded-lg p-2 border border-slate-100">
                    <strong className="text-slate-700">AI Pitch Note:</strong> {item.salesNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Gateways & Mobile Money Credentials */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Passerelles Mobile Money & Comptes Bancaires (Cameroun)
                </h3>
                <p className="text-xs text-slate-500">
                  Coordonnées utilisées par l&apos;IA pour générer automatiquement les liens de paiement
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Clé Marchand MTN Mobile Money (MoMo)
                  </label>
                  <input
                    type="password"
                    value={momoMerchantKey}
                    onChange={(e) => setMomoMerchantKey(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Clé Partenaire Orange Money Cameroun
                  </label>
                  <input
                    type="password"
                    value={orangeMoneyKey}
                    onChange={(e) => setOrangeMoneyKey(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Compte Bancaire Professionnel (Virements Directs Cameroun)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold">Banque</label>
                    <input
                      type="text"
                      value={bankAccount.bankName}
                      onChange={(e) =>
                        setBankAccount((prev) => ({ ...prev, bankName: e.target.value }))
                      }
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold">Numéro de Compte / RIB</label>
                    <input
                      type="text"
                      value={bankAccount.accountNumber}
                      onChange={(e) =>
                        setBankAccount((prev) => ({ ...prev, accountNumber: e.target.value }))
                      }
                      className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold">Intitulé du Compte</label>
                  <input
                    type="text"
                    value={bankAccount.accountName}
                    onChange={(e) =>
                      setBankAccount((prev) => ({ ...prev, accountName: e.target.value }))
                    }
                    className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Human Handoff Escalation Rules */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Règles d&apos;Escalade et Relais Humain
                </h3>
                <p className="text-xs text-slate-500">
                  Quand ces critères sont remplis, l&apos;IA suspend ses réponses et alerte le gérant
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "highValuePayment",
                  label: "Intention de Paiement Élevée (> 250 000 FCFA)",
                  desc: "Pause et notification immédiate dès qu&apos;un client confirme un gros montant",
                },
                {
                  key: "distressedCustomer",
                  label: "Sentiment de Colère ou d&apos;Urgence",
                  desc: "Détecte les réclamations, plaintes de livraison ou menaces de réputation",
                },
                {
                  key: "explicitHumanRequest",
                  label: "Demande Explicite d'un Interlocuteur Humain",
                  desc: 'Déclenché sur des expressions comme "parler au gérant", "appelez-moi", "conseiller"',
                },
                {
                  key: "receiptScreenshot",
                  label: "Capture Reçu Mobile Money / Bordereau Bancaire",
                  desc: "Alerte le personnel pour vérifier le solde MoMo/OM avant expédition",
                },
                {
                  key: "discountOver15",
                  label: "Négociation de Remise Spéciale (> 15%)",
                  desc: "Empêche les rabais non autorisés sans validation préalable de la direction",
                },
              ].map((rule) => {
                const isChecked = handoffRules[rule.key as keyof typeof handoffRules];

                return (
                  <label
                    key={rule.key}
                    className="flex items-start space-x-3 rounded-2xl border border-slate-200/70 p-3 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        setHandoffRules((prev) => ({
                          ...prev,
                          [rule.key]: !prev[rule.key as keyof typeof handoffRules],
                        }))
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rule.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rule.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE SIMULATOR (5 Cols)             */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs sticky top-20 h-[calc(100vh-7rem)]">
          <div>
            {/* Simulator Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Agent Simulator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Test how your agent responds in real-time
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Active Sandbox
              </span>
            </div>

            {/* Messages Area */}
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1">
              {simulatorMessages.map((msg, idx) => {
                const isCustomer = msg.sender === "customer";

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      isCustomer ? "items-start" : "items-end"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {isCustomer ? "Customer Simulator" : agentName}
                    </span>
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                        isCustomer
                          ? "bg-slate-100 text-slate-900 rounded-tl-xs"
                          : "bg-blue-600 text-white rounded-tr-xs"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.tag && (
                      <span className="text-[9px] font-mono font-semibold text-slate-400 mt-1">
                        [{msg.tag}]
                      </span>
                    )}
                  </div>
                );
              })}

              {isSimulating && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Nathalie formule la réponse commerciale...</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Prompts & Simulator Input */}
          <div className="pt-4 border-t border-slate-100">
            {/* Quick Test Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 no-scrollbar">
              {[
                "Pouvez-vous faire 20% de remise sur 10 iPhones ?",
                "Où est ma montre commandée ? Livraison en retard !",
                "Envoyez le numéro MoMo pour payer les 550k",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSimulatorInput(chip)}
                  className="shrink-0 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSimulateSend} className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                placeholder="Type a test customer message..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!simulatorInput.trim() || isSimulating}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 font-semibold text-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
