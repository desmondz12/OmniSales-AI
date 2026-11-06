import type { TriageTag } from "@/types/database";

export interface ProcessMessageInput {
  messageText: string;
  customerName?: string;
  customerHandle?: string;
  customerPhone?: string;
  channel?: string;
  workspaceId?: string;
  pastFacts?: string[];
  pastObjections?: string[];
}

export interface ProcessMessageResult {
  replyText: string;
  triageTag: TriageTag;
  handoffTriggered: boolean;
  handoffReason: string | null;
  newExtractedFacts: string[];
  suggestedAction: string;
  sentiment: "positive" | "neutral" | "urgent" | "angry";
  processingEngine: "gemini_2_5_flash" | "local_rules_engine";
  latencyMs: number;
}

export async function processCustomerMessage(
  input: ProcessMessageInput
): Promise<ProcessMessageResult> {
  const startTime = Date.now();
  const {
    messageText = "",
    customerName = "Client",
    channel = "whatsapp",
    pastFacts = [],
  } = input;

  const lowerText = messageText.toLowerCase();

  // 1. Triage Classification & Sentiment Detection
  let triageTag: TriageTag = "none";
  let handoffTriggered = false;
  let handoffReason: string | null = null;
  let sentiment: "positive" | "neutral" | "urgent" | "angry" = "neutral";

  const isReadyToPay =
    lowerText.includes("prêt à payer") ||
    lowerText.includes("pret a payer") ||
    lowerText.includes("ready to pay") ||
    lowerText.includes("acompte") ||
    lowerText.includes("deposit") ||
    lowerText.includes("momo") ||
    lowerText.includes("orange money") ||
    lowerText.includes("lien de paiement") ||
    lowerText.includes("payment link") ||
    lowerText.includes("numéro de compte") ||
    lowerText.includes("numero de compte") ||
    lowerText.includes("account number");

  const isAngry =
    lowerText.includes("retard") ||
    lowerText.includes("delayed") ||
    lowerText.includes("en colère") ||
    lowerText.includes("fâché") ||
    lowerText.includes("fache") ||
    lowerText.includes("angry") ||
    lowerText.includes("où est ma commande") ||
    lowerText.includes("ou est ma commande") ||
    lowerText.includes("where is my order") ||
    lowerText.includes("plainte") ||
    lowerText.includes("escroc") ||
    lowerText.includes("scam");

  const isAskingForHuman =
    lowerText.includes("parler à une personne") ||
    lowerText.includes("parler a une personne") ||
    lowerText.includes("talk to a person") ||
    lowerText.includes("gérant") ||
    lowerText.includes("gerant") ||
    lowerText.includes("manager") ||
    lowerText.includes("propriétaire") ||
    lowerText.includes("proprietaire") ||
    lowerText.includes("owner") ||
    lowerText.includes("appelez-moi") ||
    lowerText.includes("appelez moi") ||
    lowerText.includes("call me");

  const isPromise =
    lowerText.includes("promets") ||
    lowerText.includes("promise") ||
    lowerText.includes("d'ici 16h") ||
    lowerText.includes("vendredi") ||
    lowerText.includes("demain") ||
    lowerText.includes("tomorrow");

  if (isReadyToPay) {
    triageTag = "ready_to_pay";
    handoffTriggered = true;
    handoffReason = "Intention de paiement confirmée (haute valeur)";
    sentiment = "positive";
  } else if (isAngry) {
    triageTag = "upset";
    handoffTriggered = true;
    handoffReason = "Sentiment d'insatisfaction / réclamation client détecté";
    sentiment = "angry";
  } else if (isAskingForHuman) {
    triageTag = "asked_for_person";
    handoffTriggered = true;
    handoffReason = "Demande explicite d'interlocuteur humain";
    sentiment = "urgent";
  } else if (isPromise) {
    triageTag = "promise_due";
    sentiment = "positive";
  }

  // 2. Fact Extraction
  const newExtractedFacts: string[] = [];

  if (
    lowerText.includes("douala") ||
    lowerText.includes("akwa") ||
    lowerText.includes("bonanjo") ||
    lowerText.includes("makepe") ||
    lowerText.includes("bonamoussadi")
  ) {
    newExtractedFacts.push("Localisation de livraison : Douala");
  } else if (
    lowerText.includes("yaoundé") ||
    lowerText.includes("yaounde") ||
    lowerText.includes("bastos")
  ) {
    newExtractedFacts.push("Localisation de livraison : Yaoundé");
  }

  if (lowerText.includes("50 pièces") || lowerText.includes("gros") || lowerText.includes("wholesale")) {
    newExtractedFacts.push("Intérêt pour volume de gros (50+ pièces)");
  }

  if (lowerText.includes("mtn") || lowerText.includes("momo")) {
    newExtractedFacts.push("Moyen de paiement favori : MTN Mobile Money");
  } else if (lowerText.includes("orange") || lowerText.includes("om")) {
    newExtractedFacts.push("Moyen de paiement favori : Orange Money Cameroun");
  }

  // 3. Response Generation (Direct Gemini REST API with fallback)
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let replyText = "";
  let processingEngine: "gemini_2_5_flash" | "local_rules_engine" = "local_rules_engine";

  if (geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
      const systemInstruction = `Tu es Nathalie, conseillère commerciale et agente IA d'élite pour les entreprises camerounaises sur OmniSales AI (Boutique de référence à Douala/Yaoundé).
Ton ton est courtois, chaleureux, professionnel, adapté au commerce au Cameroun (bilingue français et anglais).
Tu gères les prix en Francs CFA (FCFA) et les paiements via MTN Mobile Money (*126#) et Orange Money (*150#).
Si le client est contrarié ou prêt à payer un montant élevé, rassure-le poliment et informe-le qu'un conseiller prend le relais.
Réponds de manière concise (2 à 4 phrases maximum).`;

      const promptText = `Canal: ${channel}
Nom du client: ${customerName}
Faits connus: ${pastFacts.join(", ") || "Nouveau client"}
Message reçu: "${messageText}"

Génère une réponse commerciale persuasive et adaptée :`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 250,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          replyText = candidateText.trim();
          processingEngine = "gemini_2_5_flash";
        }
      }
    } catch (err) {
      console.warn("Gemini REST API call failed, falling back to local rule engine:", err);
    }
  }

  // Fallback Rule Engine
  if (!replyText) {
    if (isReadyToPay) {
      replyText = `Bonjour ${customerName} ! Parfait, nous validons votre commande dès réception. Vous pouvez régler immédiatement par MTN Mobile Money ou Orange Money sur nos numéros marchands officiels, ou demander un lien sécurisé. Notre gérant confirme votre réservation !`;
    } else if (isAngry) {
      replyText = `Bonjour ${customerName}, nous sommes sincèrement navrés pour ce contretemps. Votre satisfaction est notre priorité absolue. J'escalade immédiatement votre dossier au responsable logistique pour régulariser votre livraison dans l'heure.`;
    } else if (isAskingForHuman) {
      replyText = `Bonjour ${customerName}, bien reçu ! J'ai alerté M. Fotso et notre équipe commerciale. Un conseiller dédié va prendre la conversation en direct avec vous ici même d'ici quelques instants.`;
    } else if (isPromise) {
      replyText = `Merci ${customerName} pour votre confirmation. Votre dossier est bien mis à jour et nous attendons votre versement selon votre promesse. À très bientôt !`;
    } else {
      replyText = `Bonjour ${customerName} ! Merci pour votre message. C'est un réel plaisir de vous renseigner. Que souhaitez-vous commander ou vérifier aujourd'hui sur nos collections ?`;
    }
  }

  const suggestedAction = handoffTriggered
    ? "Ouvrir le tiroir de discussion et prendre le relais humain"
    : "Laisser l'agente IA poursuivre la qualification";

  return {
    replyText,
    triageTag,
    handoffTriggered,
    handoffReason,
    newExtractedFacts,
    suggestedAction,
    sentiment,
    processingEngine,
    latencyMs: Date.now() - startTime,
  };
}
