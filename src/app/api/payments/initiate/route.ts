import { NextResponse, type NextRequest } from "next/server";
import { initiateCameroonPayment, type PaymentProvider } from "@/lib/payments/cameroon-gateway";
import { checkRateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "payment-client";
    const rateLimit = checkRateLimit(`payment-init:${clientIp}`, 30, 60);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetInSeconds) } }
      );
    }

    const body = await request.json();
    const {
      customerId,
      customerName,
      customerPhone,
      amount,
      description = "Paiement commande OmniSales AI",
      provider = "momo",
      invoiceId,
    } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    const validProviders: PaymentProvider[] = ["momo", "orange", "afriland"];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Provider must be one of: ${validProviders.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await initiateCameroonPayment({
      customerId: customerId || "cust_demo",
      customerName: customerName || "Client Cameroun",
      customerPhone,
      amount: Number(amount),
      description,
      provider,
      invoiceId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Payment initiation error:", err);
    return NextResponse.json(
      { error: "Failed to initiate payment", details: String(err) },
      { status: 500 }
    );
  }
}
