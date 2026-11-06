import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return handleMorningBrief(request);
}

export async function POST(request: NextRequest) {
  return handleMorningBrief(request);
}

async function handleMorningBrief(request: NextRequest) {
  try {
    // Optional CRON_SECRET verification for production security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In development or demo mode, allow bypass if header is not present
      const isLocal = request.headers.get("host")?.includes("localhost");
      if (!isLocal) {
        return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
      }
    }

    const todayStr = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const briefData = {
      workspaceId: "ws-fotso-douala",
      workspaceName: "Fotso & Sons Commerce Douala",
      ownerGreeting: "Bonjour M. Fotso",
      dateFormatted: todayStr,
      naturalLanguageSummary:
        "Trois personnes ont besoin de vous ce matin : Jean-Pierre Fotso est prêt à verser son acompte de 550 000 FCFA, Boris Atangana est contrarié par sa livraison à Bastos (Yaoundé), et Marie-Claire Ngo souhaite négocier un tarif de gros pour 50 pièces. 1 200 000 FCFA restent dus sur 4 clients, dont deux en retard. Danielle Ewane a réglé 300 000 FCFA hier par Orange Money et je l'ai réconcilié avec sa facture. J'ai géré 14 échanges cette nuit sur vos 5 canaux.",
      metrics: {
        totalOwedFCFA: 1200000,
        totalOwedCustomersCount: 4,
        overdueCount: 2,
        collectedYesterdayFCFA: 300000,
        collectedFrom: "Danielle Ewane (Orange Money)",
        conversationsOvernight: 8,
        channelsActiveCount: 5,
        aiHandledOvernight: 14,
        needsHumanCount: 3,
      },
      priorityEscalations: [
        {
          customer: "Jean-Pierre Fotso",
          channel: "whatsapp",
          reason: "Prêt à verser l'acompte de 550 000 FCFA",
          amount: 550000,
          status: "ready_to_pay",
        },
        {
          customer: "Boris Atangana",
          channel: "instagram",
          reason: "En colère pour retard de livraison Bastos (Yaoundé)",
          status: "upset",
        },
        {
          customer: "Marie-Claire Ngo",
          channel: "messenger",
          reason: "Demande un contact humain pour commande en gros (50 pièces)",
          status: "asked_for_person",
        },
      ],
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      cronJob: "morning_money_brief",
      brief: briefData,
    });
  } catch (error) {
    console.error("Cron morning brief error:", error);
    return NextResponse.json(
      { error: "Failed to generate morning brief", details: String(error) },
      { status: 500 }
    );
  }
}
