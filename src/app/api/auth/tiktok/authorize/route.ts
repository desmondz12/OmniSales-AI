import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Initiates TikTok Login Kit for Business / TikTok OAuth 2.0 flow.
 * Requests direct_message.action, direct_message.read, and user.info.basic.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId") || "ws-fotso-douala";

  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.TIKTOK_APP_ID;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

  const scopes = [
    "user.info.basic",
    "direct_message.action",
    "direct_message.read",
  ];

  const state = Buffer.from(
    JSON.stringify({
      channel: "tiktok",
      workspaceId,
      timestamp: Date.now(),
    })
  ).toString("base64url");

  // If live TikTok API keys are not set, redirect to seamless in-app OAuth modal
  if (!clientKey) {
    const fallbackUrl = new URL("/dashboard/channels", appUrl);
    fallbackUrl.searchParams.set("seamless_connect", "tiktok");
    fallbackUrl.searchParams.set("source", "tiktok_login");
    return NextResponse.redirect(fallbackUrl.toString());
  }

  const tiktokOAuthUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  tiktokOAuthUrl.searchParams.set("client_key", clientKey);
  tiktokOAuthUrl.searchParams.set("scope", scopes.join(","));
  tiktokOAuthUrl.searchParams.set("response_type", "code");
  tiktokOAuthUrl.searchParams.set("redirect_uri", redirectUri);
  tiktokOAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(tiktokOAuthUrl.toString());
}
