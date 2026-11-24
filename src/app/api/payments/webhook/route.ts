import { NextResponse, type NextRequest } from "next/server";
import { confirmCameroonPayment } from "@/lib/payments/cameroon-gateway";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support standard webhook payloads from Campay, NotchPay, MTN MoMo, and Orange Money
    const notchData = body?.data && typeof body.data === "object" ? body.data : null;
    const transactionId =
      body.external_reference ||
      notchData?.merchant_reference ||
      body.transactionId ||
      body.reference ||
      body.order_id;
    const amount = Number(notchData?.amount || body.amount || body.value || 0);
    const rawStatus = String(
      notchData?.status || body.status || ""
    ).toUpperCase();
    const status =
      rawStatus === "SUCCESSFUL" ||
      rawStatus === "SUCCESS" ||
      rawStatus === "COMPLETE" ||
      rawStatus === "PAID"
        ? "paid"
        : "failed";
    const providerReference =
      body.operator_tx_id ||
      notchData?.reference ||
      body.financialTransactionId ||
      body.operator_id ||
      body.pay_token;

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
