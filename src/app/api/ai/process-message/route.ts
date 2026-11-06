import { NextResponse, type NextRequest } from "next/server";
import type { TriageTag } from "@/types/database";

interface ProcessMessageRequest {
  messageText: string;
  customerName?: string;
  customerHandle?: string;
  customerPhone?: string;
  channel?: string;
  workspaceId?: string;
  pastFacts?: string[];
  pastObjections?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body: ProcessMessageRequest = await request.json();

    const {
      messageText = "",
      customerName = "Client",
      customerHandle = "@client",
      customerPhone,
      channel = "whatsapp",
      workspaceId = "ws-fotso-douala",
      pastFacts = [],
    } = body;

    const lowerText = messageText.toLowerCase();

    // 1. Triage Classification & Sentiment Detection
    let triageTag: TriageTag = "none";
    let handoffTriggered = false;
    let handoffReason: string | null = null;

    const isReadyToPay =
      lowerText.includes("prêt à payer") ||
      lowerText.includes("ready to pay") ||
      lowerText.includes("acompte") ||
      lowerText.includes("deposit") ||
      lowerText.includes("momo") ||
      lowerText.includes("orange money") ||
      lowerText.includes("lien de paiement") ||
      lowerText.includes("payment link") ||
      lowerText.includes("numéro de compte") ||
      lowerText.includes("account number");

    const isAngry =
      lowerText.includes("retard") ||
      lowerText.includes("delayed") ||
      lowerText.includes("en colère") ||
      lowerText.includes("fâché") ||
      lowerText.includes("angry") ||
      lowerText.includes("où est ma commande") ||
      lowerText.includes("where is my order") ||
      lowerText.includes("plainte") ||
      lowerText.includes("escroc") ||
      lowerText.includes("scam");

    const isAskingForHuman =
      lowerText.includes("parler à une personne") ||
      lowerText.includes("talk to a person") ||
      lowerText.includes("gérant") ||
      lowerText.includes("manager") ||
      lowerText.includes("propriétaire") ||
      lowerText.includes("owner") ||
      lowerText.includes("appelez-moi") ||
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
    } else if (isAngry) {
      triageTag = "upset";
      handoffTriggered = true;
      handoffReason = "Sentiment de détresse / réclamation client détecté";
    } else if (isAskingForHuman) {
      triageTag = "asked_for_person";
      handoffTriggered = true;
      handoffReason = "Demande explicite d'interlocuteur humain";
    } else if (isPromise) {
      triageTag = "promise_due";
    }

    // 2. Fact Extraction
    const newExtractedFacts: string[] = [];

    if (lowerText.includes("douala") || lowerText.includes("akwa") || lowerText.includes("bonanjo")) {
      newExtractedFacts.push("Localisation de livraison : Douala");
    } else if (lowerText.includes("yaoundé") || lowerText.includes("yaounde") || lowerText.includes("bastos")) {
      newExtractedFacts.push("Localisation de livraison : Yaoundé (Bastos)");
    } else if (lowerText.includes("bafoussam")) {
      newExtractedFacts.push("Localisation de livraison : Bafoussam");
    } else if (lowerText.includes("limbe")) {
      newExtractedFacts.push("Localisation de livraison : Limbe");
    }

    if (lowerText.includes("iphone") || lowerText.includes("15 pro")) {
      newExtractedFacts.push("Intérêt produit principal : iPhone 15 Pro");
    } else if (lowerText.includes("montre") || lowerText.includes("watch")) {
      newExtractedFacts.push("Intérêt produit : Montre connectée");
    } else if (lowerText.includes("gros") || lowerText.includes("wholesale") || lowerText.includes("50")) {
      newExtractedFacts.push("Profil d'achat : Client grossiste (lots volumineux)");
    }

    // 3. Gemini AI / Fallback Sales Formulation
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    let replyText = "";
    let aiModelUsed = "OmniSales-Flash-Rules";

    if (geminiApiKey) {
      try {
        const prompt = `You are Nathalie, a friendly, professional, top-tier AI sales executive for "Fotso & Sons Commerce Douala" (a reputable electronics, wearables & fashion retailer in Cameroon).
The customer reached out via ${channel}:
Customer Name: ${customerName}
Customer Message: "${messageText}"
Past Facts: ${JSON.stringify(pastFacts)}

System Instructions:
1. Respond in French (or English if the customer writes in English). Use a polite, consultative Cameroonian commercial tone.
2. Prices must always be in FCFA (Central African CFA franc / XAF).
3. Accepted payment options: MTN Mobile Money (MoMo), Orange Money (OM), and direct bank transfer via Afriland First Bank Cameroun.
4. If they want to pay or asked for a payment link, provide this link: https://pay.omnisales.ai/fotso/checkout.
5. If they are angry or have an urgent delivery issue, apologize warmly, reassure them, and let them know the manager is notified.
6. Keep the response concise, punchy, and suitable for mobile chat.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 350,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            replyText = candidateText.trim();
            aiModelUsed = "gemini-2.5-flash";
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local sales engine:", err);
      }
    }

    // If Gemini was not configured or call timed out, formulate realistic response
    if (!replyText) {
      if (triageTag === "ready_to_pay") {
        replyText = `Bonjour ${customerName} ! Ravi de votre confiance. Voici votre lien de paiement sécurisé MoMo / Orange Money : https://pay.omnisales.ai/fotso/checkout. Vous pouvez aussi régler directement au 671 23 45 67 (MTN MoMo). Dès validation, votre commande est priorisée pour l'expédition !`;
      } else if (triageTag === "upset") {
        replyText = `Toutes nos excuses pour ce désagrément, ${customerName}. J'ai suspendu mes messages automatiques et transmis en priorité absolue votre dossier à notre responsable expéditions Douala-Yaoundé. Un conseiller va vous contacter directement d'ici quelques minutes.`;
      } else if (triageTag === "asked_for_person") {
        replyText = `Bonjour ${customerName} ! C'est bien noté. J'alerte notre gérant, M. Fotso, qui va prendre directement le relais avec vous pour répondre à vos questions particulières.`;
      } else if (lowerText.includes("prix") || lowerText.includes("combien") || lowerText.includes("price")) {
        replyText = `Bonjour ${customerName} ! Tous nos articles sont certifiés avec garantie d'origine. iPhone 15 Pro 256 Go à 550 000 FCFA, montre Ultra à 180 000 FCFA, pack micro studio à 80 000 FCFA. Nous livrons sous 24h partout au Cameroun (Douala, Yaoundé, Bafoussam, Limbe). Souhaitez-vous réserver ?`;
      } else {
        replyText = `Bonjour ${customerName} et bienvenue chez Fotso & Sons Douala ! Comment puis-je vous aider aujourd'hui dans vos achats ?`;
      }
    }

    const estimatedLatencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      workspaceId,
      channel,
      customerName,
      customerHandle,
      customerPhone,
      triageTag,
      handoffTriggered,
      handoffReason,
      replyText,
      extractedFacts: newExtractedFacts,
      aiModel: aiModelUsed,
      estimatedLatencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Message processing error:", error);
    return NextResponse.json(
      { error: "Failed to process message through AI pipeline", details: String(error) },
      { status: 500 }
    );
  }
}
