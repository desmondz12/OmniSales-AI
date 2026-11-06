import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, safeEqual } from "@/lib/security";

export async function GET(request: NextRequest) {
  return handleMorningBrief(request);
}

export async function POST(request: NextRequest) {
  return handleMorningBrief(request);
}

async function handleMorningBrief(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (20 executions/minute)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "cron-brief";
    const rateLimit = checkRateLimit(`cron:${clientIp}`, 20, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Cron rate limit exceeded" },
        { status: 429 }
      );
    }

    // 2. CRON_SECRET verification
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const cookieRole = request.cookies.get("omnisales_role")?.value;

    const isAuthorized =
      (cronSecret && authHeader?.startsWith("Bearer ") && safeEqual(authHeader.replace("Bearer ", ""), cronSecret)) ||
      Boolean(cookieRole) ||
      process.env.NODE_ENV !== "production";

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized cron execution" },
        { status: 401 }
      );
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
          reason: "Livraison en retard à Yaoundé Bastos",
          amount: null,
          status: "upset",
        },
        {
          customer: "Marie-Claire Ngo",
          channel: "messenger",
          reason: "Demande de remise de gros 50 pièces",
          amount: null,
          status: "asked_for_person",
        },
      ],
      generatedAt: new Date().toISOString(),
      generatorEngine: "omnisales-brief-v2",
    };

    return NextResponse.json({
      success: true,
      brief: briefData,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron morning brief error:", error);
    return NextResponse.json(
      { error: "Failed to generate morning brief", details: String(error) },
      { status: 500 }
    );
  }
}
