import { NextResponse, type NextRequest } from "next/server";
import { processCustomerMessage } from "@/lib/ai/process-message-service";
import { checkRateLimit, safeEqual } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting (60 requests/minute per IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "ai-pipeline";
    const rateLimit = checkRateLimit(`ai:${clientIp}`, 60, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many AI processing requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    // 2. Authentication & Authorization Check
    const authHeader = request.headers.get("authorization");
    const internalSecret = process.env.INTERNAL_API_SECRET || process.env.CRON_SECRET;
    const cookieRole = request.cookies.get("omnisales_role")?.value;

    const hasValidBearer =
      internalSecret && authHeader?.startsWith("Bearer ")
        ? safeEqual(authHeader.replace("Bearer ", ""), internalSecret)
        : false;

    const hasValidSession = Boolean(cookieRole);

    // In production, require either valid session or internal secret
    if (process.env.NODE_ENV === "production" && !hasValidBearer && !hasValidSession) {
      return NextResponse.json(
        { error: "Authentication required to access AI processing engine." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await processCustomerMessage(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI pipeline processing error:", error);
    return NextResponse.json(
      { error: "Failed to process customer message through AI pipeline", details: String(error) },
      { status: 500 }
    );
  }
}
