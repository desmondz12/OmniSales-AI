import { NextResponse, type NextRequest } from "next/server";
import { confirmCameroonPayment } from "@/lib/payments/cameroon-gateway";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support standard webhook payloads from MTN MoMo, Orange Money, or Campay
    const transactionId =
      body.transactionId || body.reference || body.order_id || body.external_reference;
    const amount = Number(body.amount || body.value || 0);
    const status =
      body.status === "SUCCESSFUL" || body.status === "SUCCESS" || body.status === "paid"
        ? "paid"
        : "failed";
    const providerReference = body.financialTransactionId || body.operator_id || body.pay_token;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing transaction reference in callback payload" },
        { status: 400 }
      );
    }

    const result = await confirmCameroonPayment({
      transactionId,
      amount,
      status,
      providerReference,
    });

    return NextResponse.json({
      received: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Payment webhook callback error:", err);
    return NextResponse.json(
      { error: "Callback processing failed", details: String(err) },
      { status: 500 }
    );
  }
}
