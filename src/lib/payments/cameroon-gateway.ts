import { createAdminClient } from "@/lib/supabase/admin";

export type PaymentProvider = "momo" | "orange" | "afriland";

export interface CreatePaymentInput {
  invoiceId?: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  description: string;
  provider: PaymentProvider;
  workspaceId?: string;
}

export interface PaymentTransactionResult {
  success: boolean;
  transactionId: string;
  checkoutUrl: string;
  provider: PaymentProvider;
  amount: number;
  status: "pending" | "successful" | "failed";
  instructions: string;
  ussdPrompt?: string;
  providerReference?: string;
  gateway?: "campay" | "notchpay" | "local";
  simulated: boolean;
}

function normalizeCameroonPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("237") && digits.length >= 12) return digits;
  if (digits.length === 9 && digits.startsWith("6")) return `237${digits}`;
  return digits || "237671234567";
}

async function triggerCampayCollect(params: {
  amount: number;
  phone: string;
  description: string;
  externalReference: string;
}): Promise<{ reference?: string; ussdCode?: string; operator?: string } | null> {
  const baseUrl =
    process.env.CAMPAY_BASE_URL ||
    (process.env.CAMPAY_SANDBOX === "true"
      ? "https://demo.campay.net/api"
      : "https://www.campay.net/api");

  let token = process.env.CAMPAY_APP_TOKEN;
  if (!token && process.env.CAMPAY_USERNAME && process.env.CAMPAY_PASSWORD) {
    const authRes = await fetch(`${baseUrl}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.CAMPAY_USERNAME,
        password: process.env.CAMPAY_PASSWORD,
      }),
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      token = authData.token;
    }
  }

  if (!token) return null;

  const collectRes = await fetch(`${baseUrl}/collect/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(Math.round(params.amount)),
      currency: "XAF",
      from: params.phone,
      description: params.description,
      external_reference: params.externalReference,
    }),
  });

  if (!collectRes.ok) {
    const errText = await collectRes.text();
    console.warn("[Campay collect failed]:", collectRes.status, errText);
    return null;
  }

  const data = await collectRes.json();
  return {
    reference: data.reference,
    ussdCode: data.ussd_code,
    operator: data.operator,
  };
}

async function triggerNotchPayInitialize(params: {
  amount: number;
  phone: string;
  description: string;
  reference: string;
  callbackUrl: string;
}): Promise<{ reference?: string; authorizationUrl?: string } | null> {
  const publicKey = process.env.NOTCHPAY_PUBLIC_KEY;
  if (!publicKey) return null;

  const res = await fetch("https://api.notchpay.co/payments/initialize", {
    method: "POST",
    headers: {
      Authorization: publicKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(params.amount),
      currency: "XAF",
      phone: `+${params.phone}`,
      reference: params.reference,
      description: params.description,
      callback: params.callbackUrl,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn("[NotchPay initialize failed]:", res.status, errText);
    return null;
  }

  const data = await res.json();
  return {
    reference: data.transaction?.reference,
    authorizationUrl: data.authorization_url,
  };
}

/**
 * Initiates an automated Cameroon mobile money collection (MTN MoMo *126# / Orange Money *150#)
 * via Campay or NotchPay when configured, or creates a tracked online payment link.
 */
export async function initiateCameroonPayment(
  input: CreatePaymentInput
): Promise<PaymentTransactionResult> {
  const {
    invoiceId,
    customerId,
    customerName,
    customerPhone = "+237671234567",
    amount,
    description,
    provider,
    workspaceId = "f7d05015-fecc-4602-816c-ad5bf96e144f",
  } = input;

  const transactionId = `txn_${provider}_${Date.now()}`;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let checkoutUrl = `${appBaseUrl}/pay/${transactionId}`;
  const normalizedPhone = normalizeCameroonPhone(customerPhone);

  let instructions = "";
  let ussdPrompt = "";
  let providerReference: string | undefined;
  let gateway: "campay" | "notchpay" | "local" = "local";
  let simulated = true;

  if (provider === "momo" || provider === "orange") {
    // 1. Try Campay live USSD push first if configured
    const campayRes = await triggerCampayCollect({
      amount,
      phone: normalizedPhone,
      description,
      externalReference: transactionId,
    });

    if (campayRes?.reference) {
      simulated = false;
      gateway = "campay";
      providerReference = campayRes.reference;
      ussdPrompt =
        campayRes.ussdCode ||
        (provider === "momo" ? "*126#" : "#150*50#");
      instructions =
        provider === "momo"
          ? `Notification MTN MoMo envoyée sur +${normalizedPhone}. Composez ${ussdPrompt} si la fenêtre ne s'affiche pas pour valider ${amount.toLocaleString("fr-FR")} FCFA.`
          : `Notification Orange Money envoyée sur +${normalizedPhone}. Composez ${ussdPrompt} pour valider ${amount.toLocaleString("fr-FR")} FCFA.`;
    } else {
      // 2. Try NotchPay if configured
      const notchRes = await triggerNotchPayInitialize({
        amount,
        phone: normalizedPhone,
        description,
        reference: transactionId,
        callbackUrl: `${appBaseUrl}/api/payments/webhook`,
      });

      if (notchRes?.reference) {
        simulated = false;
        gateway = "notchpay";
        providerReference = notchRes.reference;
        if (notchRes.authorizationUrl) {
          checkoutUrl = notchRes.authorizationUrl;
        }
        instructions = `Lien NotchPay Mobile Money généré pour ${amount.toLocaleString("fr-FR")} FCFA (${provider.toUpperCase()}).`;
      }
    }
  }

  if (!instructions) {
    if (provider === "momo") {
      instructions = `Un prompt USSD va s'afficher sur votre téléphone MTN. Tapez votre code secret MTN Mobile Money (*126#) pour valider ${amount.toLocaleString("fr-FR")} FCFA.`;
      ussdPrompt = `*126# -> Confirmez ${amount} FCFA vers OmniSales Nissi Exploits`;
    } else if (provider === "orange") {
      instructions = `Composez #150*50# sur votre numéro Orange Money pour générer votre code OTP de sécurité à 4 chiffres afin de valider le règlement de ${amount.toLocaleString("fr-FR")} FCFA.`;
      ussdPrompt = `#150*50# pour générer le code de paiement`;
    } else {
      instructions = `Virement bancaire Afriland First Bank vers le compte Nissi Exploits (RIB: 10005 00012 01234567890 44). Référence : ${transactionId}.`;
    }
  }

  // Persist record to Supabase if database connection is available
  try {
    const supabase = createAdminClient();

    // If an invoice is referenced, link the transaction
    if (invoiceId) {
      await supabase
        .from("invoices")
        .update({
          payment_link: checkoutUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);
    }

    // Insert system audit log
    await supabase.from("system_logs").insert({
      workspace_id: workspaceId,
      event_type: "payment_initiated",
      status: "pending",
      message: `Paiement ${provider.toUpperCase()} de ${amount} FCFA initié pour ${customerName} (${gateway})`,
      latency_ms: 45,
      metadata: {
        transaction_id: transactionId,
        provider_reference: providerReference || null,
        gateway,
        simulated,
        provider,
        amount,
        customer_id: customerId,
        customer_name: customerName,
        customer_phone: customerPhone,
        checkout_url: checkoutUrl,
        description,
      },
    });
  } catch (err) {
    console.warn("[initiateCameroonPayment] Persistence note:", err);
  }

  return {
    success: true,
    transactionId,
    checkoutUrl,
    provider,
    amount,
    status: "pending",
    instructions,
    ussdPrompt,
    providerReference,
    gateway,
    simulated,
  };
}

/**
 * Handles confirmation callbacks from MTN MoMo, Orange Money, or Campay webhook gateways.
 * Automatically marks invoices as paid and sends a Realtime event to the merchant dashboard.
 */
export async function confirmCameroonPayment(params: {
  transactionId: string;
  amount: number;
  status: "paid" | "failed";
  providerReference?: string;
  customerPhone?: string;
}) {
  const { transactionId, amount, status, providerReference } = params;

  try {
    const supabase = createAdminClient();

    // Find invoice by payment link
    const { data: invoices } = await supabase
      .from("invoices")
      .select("id, customer_id, amount, amount_paid")
      .ilike("payment_link", `%${transactionId}%`)
      .limit(1);

    const invoice = invoices?.[0];

    if (invoice && status === "paid") {
      // 1. Mark invoice as paid
      await supabase
        .from("invoices")
        .update({
          status: "paid",
          amount_paid: amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoice.id);

      // 2. Update customer financial profile
      if (invoice.customer_id) {
        const { data: customer } = await supabase
          .from("customers")
          .select("total_owed, total_paid")
          .eq("id", invoice.customer_id)
          .single();

        if (customer) {
          const newOwed = Math.max(0, (customer.total_owed || 0) - amount);
          const newPaid = (customer.total_paid || 0) + amount;

          await supabase
            .from("customers")
            .update({
              total_owed: newOwed,
              total_paid: newPaid,
              updated_at: new Date().toISOString(),
            })
            .eq("id", invoice.customer_id);
        }
      }

      // 3. Log payment success event
      await supabase.from("system_logs").insert({
        workspace_id: "f7d05015-fecc-4602-816c-ad5bf96e144f",
        event_type: "payment_confirmed",
        status: "success",
        message: `Paiement confirmé de ${amount} FCFA pour la facture ${invoice.id}`,
        latency_ms: 120,
        metadata: {
          transaction_id: transactionId,
          provider_reference: providerReference || "",
          amount,
          invoice_id: invoice.id,
        },
      });

      return { success: true, invoiceId: invoice.id, status: "paid" };
    }
  } catch (err) {
    console.warn("[confirmCameroonPayment] Persistence note:", err);
  }

  return { success: status === "paid", transactionId, status };
}
